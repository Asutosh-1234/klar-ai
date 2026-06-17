import { generateText, tool, stepCountIs } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import { prisma } from "@/lib/config/prisma";
import ENV from "@/lib/config/ENV";
import { inngest } from "@/lib/inngest/client";
import { getAllMails, getMessageDetails, createDraft, sendDraft } from "./gmail.service";
import { getAllEvents, createEvent, deleteEvent } from "./calendar.service";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: ENV.AI_API_KEY,
});

function getSystemPrompt() {
  return `You are Aether AI, the intelligent coordinator of Aether OS.
You have access to tools for Gmail and Google Calendar. You must coordinate user requests regarding messages and schedules.

CRITICAL RULES & OPERATING PROCEDURES:
1. EMAIL DELETION RESTRICTION (MANDATORY):
   - You are strictly FORBIDDEN from deleting emails directly.
   - If a user asks to delete, trash, remove, or clean up an email, you must:
     a. First search for the email using the 'listEmails' tool to obtain its details (id, subject, sender).
     b. Call the 'requestEmailDeletion' tool with the correct 'emailId', 'subject', and 'sender'.
     c. Present the confirmation details to the user and ask them to confirm the deletion.
   - Never call any other tool or attempt to bypass this confirmation step for email deletion.

2. GMAIL COMMUNICATIONS:
   - To find emails, use 'listEmails' with appropriate search queries (e.g. 'from:Netflix').
   - To send an email, use 'sendEmail' with the recipient's email ('to'), a clear 'subject', and HTML or plain text 'body'.

3. GOOGLE CALENDAR MANAGEMENT:
   - To list events, call 'listCalendarEvents' using start ('timeMin') and end ('timeMax') date-time values in ISO format (e.g. 'YYYY-MM-DDT00:00:00Z').
   - To create events, call 'createCalendarEvent' with the event's summary, description, startDateTime, and endDateTime in ISO format.
   - To delete events, call 'deleteCalendarEvent' with the specific 'eventId'.

4. IDENTITY & SECURITY:
   - You do NOT have direct access to the application database. Never refer to or attempt to query databases directly.
   - Do not make up IDs (like emailId or eventId). You must retrieve them first using the search/list tools.

5. TONE & RESPONSE FORMAT:
   - Keep your responses concise, polite, professional, and aligned with the high-end Aether OS aesthetic.
   - Do not expose the names of the tools or technical details of your execution to the user. Speak as an executive coordinator.

6. AUTONOMOUS THINKING & DRAFTING (MANDATORY):
   - You MUST work autonomously using your own reasoning and thinking power.
   - When asked to perform actions (such as sending an email or setting up/creating calendar events), if the user has not specified a title, summary, email subject, or email body, do NOT ask the user for these details.
   - Instead, autonomously draft/generate appropriate, professional, and formal values for them:
     - For email subjects and bodies: Write a complete, polite, and professionally formatted email maintaining all standard business/formal correspondence rules (greetings, sign-off, clear paragraphs, polite tone).
     - For calendar events: Create an appropriate summary/title (e.g. "Meeting with [Name]" or "Discussion on [Topic]" or "Strategic Session") and set a logical duration (e.g. 1 hour starting at the requested time).
   - If the user provides a request containing multiple actions (e.g., "set an event at 6 pm today and send an email..."), you must call ALL relevant tools in succession during the same turn to fulfill the complete request. Do not ask for confirmation or extra information before executing.

Current Date and Time: ${new Date().toString()} (ISO: ${new Date().toISOString()})`;
}

export async function checkAiLimit(
  userId: string,
  userEmail?: string,
  userName?: string,
  userAvatar?: string
) {
  const activePlan = await prisma.userPlan.findFirst({
    where: {
      userId,
      startDate: { lte: new Date() },
      endDate: { gte: new Date() },
    },
  });

  let limit = 5; // Default free limit
  let planName = "Free / Basic";

  if (activePlan) {
    planName = activePlan.planName;
    if (planName === "Executive") {
      limit = 100;
    } else if (planName === "Professional") {
      limit = 20;
    }
  }

  let user = await prisma.user.findUnique({
    where: { id: userId },
    select: { aiUsageCount: true },
  });

  if (!user) {
    try {
      user = await prisma.user.create({
        data: {
          id: userId,
          email: userEmail || `user_${userId}@aether.os`,
          name: userName || "Aether User",
          avatar: userAvatar || `https://avatar.vercel.sh/${userId}`,
          aiUsageCount: 0,
        },
        select: { aiUsageCount: true },
      });
      console.log(`[Auto-Create User] Created missing user record for userId: ${userId}`);
    } catch (createError) {
      console.error("[Auto-Create User] Failed to create missing user record:", createError);
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: { aiUsageCount: true },
      }) || { aiUsageCount: 0 };
    }
  }

  const usageCount = user?.aiUsageCount || 0;

  if (usageCount >= limit) {
    throw new Error(`AI command limit exceeded for your "${planName}" plan (${usageCount}/${limit} used). Please upgrade to a higher tier plan.`);
  }

  return { planName, limit, usageCount };
}

export const executeAiCommand = async ({
  userId,
  tenantId,
  command,
  userEmail,
  userName,
  userAvatar,
}: {
  userId: string;
  tenantId: string;
  command: string;
  userEmail?: string;
  userName?: string;
  userAvatar?: string;
}) => {
  // 1. Check AI usage limits
  const { planName, limit, usageCount } = await checkAiLimit(userId, userEmail, userName, userAvatar);

  // 2. Execute Vercel AI SDK generateText with tools
  let pendingDeleteInfo: any = null;

  const response = await generateText({
    model: openrouter.chat("google/gemini-2.5-flash"),
    maxOutputTokens: 1000,
    system: getSystemPrompt(),
    prompt: command,
    stopWhen: [stepCountIs(3)], // Support multi-turn tool calling
    tools: {
      listEmails: tool({
        description: "Search or list Gmail messages matching a query.",
        parameters: z.object({
          q: z.string().optional().describe("Gmail search query (e.g. 'from:Netflix')"),
          maxResults: z.number().optional().default(10),
        }),
        execute: async ({ q, maxResults }: { q?: string; maxResults?: number }) => {
          try {
            const messages = await getAllMails({
              userId: "me",
              tenentId: tenantId,
              q,
              maxResults,
              includeSpamTrash: true,
              labelIds: ["INBOX"],
            });
            const enriched = await Promise.all(
              messages.slice(0, 5).map(async (msg: any) => {
                if (!msg.id) return null;
                try {
                  const details = await getMessageDetails(tenantId, msg.id);
                  return {
                    id: details.id,
                    subject: details.payload?.headers?.find((h: any) => h.name === "Subject")?.value || "No Subject",
                    sender: details.payload?.headers?.find((h: any) => h.name === "From")?.value || "Unknown",
                    snippet: details.snippet,
                  };
                } catch {
                  return null;
                }
              })
            );
            return { emails: enriched.filter(Boolean) };
          } catch (e: any) {
            return { error: e.message };
          }
        },
      } as any),
      sendEmail: tool({
        description: "Compose and send a new email.",
        parameters: z.object({
          to: z.string().describe("Recipient email address"),
          subject: z.string().describe("Email subject line"),
          body: z.string().describe("Email body content (HTML or plain text)"),
        }),
        execute: async ({ to, subject, body }: { to: string; subject: string; body: string }) => {
          console.log("[AGENT TOOL] sendEmail invoked:", { to, subject, body });
          try {
            const mimeMessage = [
              `To: ${to}`,
              `Subject: =?utf-8?B?${Buffer.from(subject).toString("base64")}?=`,
              'Content-Type: text/html; charset="UTF-8"',
              'MIME-Version: 1.0',
              '',
              body
            ].join('\r\n');
            const rawMime = Buffer.from(mimeMessage)
              .toString("base64")
              .replace(/\+/g, "-")
              .replace(/\//g, "_")
              .replace(/=+$/, "");

            const draft = await createDraft(tenantId, rawMime);
            if (!draft.id) {
              throw new Error("Failed to create draft");
            }
            await sendDraft(tenantId, draft.id);
            return { success: true, message: `Email sent to ${to}.` };
          } catch (e: any) {
            return { error: e.message };
          }
        },
      } as any),
      requestEmailDeletion: tool({
        description: "Request confirmation from the user to delete a specific email. DO NOT delete directly.",
        parameters: z.object({
          emailId: z.string().describe("The unique ID of the email to delete"),
          subject: z.string().describe("The subject line of the email"),
          sender: z.string().describe("The sender of the email"),
        }),
        execute: async ({ emailId, subject, sender }: { emailId: string; subject: string; sender: string }) => {
          pendingDeleteInfo = { emailId, subject, sender };
          return {
            pendingDelete: pendingDeleteInfo,
            message: "Deletion confirmation requested. Awaiting user action.",
          };
        },
      } as any),
      listCalendarEvents: tool({
        description: "List calendar events.",
        parameters: z.object({
          timeMin: z.string().optional().describe("ISO start time"),
          timeMax: z.string().optional().describe("ISO end time"),
        }),
        execute: async ({ timeMin, timeMax }: { timeMin?: string; timeMax?: string }) => {
          try {
            const events = await getAllEvents(tenantId, timeMin, timeMax);
            return {
              events: events.map((e: any) => ({
                id: e.id,
                summary: e.summary,
                description: e.description,
                start: e.start,
                end: e.end,
              })),
            };
          } catch (e: any) {
            return { error: e.message };
          }
        },
      } as any),
      createCalendarEvent: tool({
        description: "Create a new event in the calendar.",
        parameters: z.object({
          summary: z.string().optional().describe("Title of the event. Defaults to 'Meeting' if not specified."),
          description: z.string().optional().describe("Optional description"),
          startDateTime: z.string().optional().describe(
            "The start date-time for the event in ISO 8601 format (e.g., '2026-06-17T18:00:00+05:30'). " +
            "You MUST compute the exact date and time based on the current local time context provided in the system prompt. " +
            "For example, if the current time is Wed Jun 17 2026 18:20:14 GMT+0530, and the user asks for '6 pm today', " +
            "calculate the date '2026-06-17' and time '18:00:00', and format it with the offset: '2026-06-17T18:00:00+05:30'."
          ),
          endDateTime: z.string().optional().describe(
            "The end date-time for the event in ISO 8601 format (e.g., '2026-06-17T19:00:00+05:30'). " +
            "Must be after startDateTime. If no duration is specified, assume a 1-hour duration."
          ),
        }),
        execute: async ({ summary, description, startDateTime, endDateTime }: { summary?: string; description?: string; startDateTime?: string; endDateTime?: string }) => {
          console.log("[AGENT TOOL] createCalendarEvent invoked:", { summary, description, startDateTime, endDateTime });
          try {
            const formatISO = (dt?: string) => {
              if (!dt) return new Date().toISOString();
              try {
                const parsed = new Date(dt);
                return isNaN(parsed.getTime()) ? dt : parsed.toISOString();
              } catch {
                return dt;
              }
            };
            const formatISOEnd = (dt?: string, startDt?: string) => {
              if (!dt) {
                const baseDate = startDt ? new Date(startDt) : new Date();
                const end = new Date(baseDate.getTime() + 60 * 60 * 1000);
                return end.toISOString();
              }
              try {
                const parsed = new Date(dt);
                return isNaN(parsed.getTime()) ? dt : parsed.toISOString();
              } catch {
                return dt;
              }
            };

            const computedStart = formatISO(startDateTime);
            const computedEnd = formatISOEnd(endDateTime, computedStart);

            const created = await createEvent(tenantId, {
              summary: summary || "Meeting",
              ...(description ? { description } : {}),
              start: { dateTime: computedStart },
              end: { dateTime: computedEnd },
            });
            return { success: true, event: created };
          } catch (e: any) {
            return { error: e.message };
          }
        },
      } as any),
      deleteCalendarEvent: tool({
        description: "Delete an event from the calendar.",
        parameters: z.object({
          eventId: z.string().describe("The ID of the event to delete"),
        }),
        execute: async ({ eventId }: { eventId: string }) => {
          try {
            await deleteEvent(tenantId, eventId);
            return { success: true, message: "Calendar event deleted." };
          } catch (e: any) {
            return { error: e.message };
          }
        },
      } as any),
    },
  });

  // 3. Increment usage limit directly in the database
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        aiUsageCount: {
          increment: 1,
        },
      },
    });
  } catch (dbError) {
    console.error("[Limit Update] Failed to update user AI usage in database:", dbError);
  }

  // 4. Trigger Inngest event in the background (fire-and-forget, non-awaited)
  inngest.send({
    name: "ai/command-executed",
    data: {
      userId,
      command,
    },
  }).catch((error) => {
    console.warn("[Inngest] Failed to send background event:", error.message || error);
  });

  return {
    text: response.text,
    pendingDelete: pendingDeleteInfo,
    limitInfo: {
      planName,
      limit,
      used: usageCount + 1,
    },
  };
};

// Deprecated in favor of executeAiCommand, kept for backwards compatibility
export const aiService = async ({ prompt }: { prompt: string }) => {
  const response = await generateText({
    model: openrouter.chat("google/gemini-2.5-flash"),
    maxOutputTokens: 1000,
    prompt,
  });
  return response.text;
};