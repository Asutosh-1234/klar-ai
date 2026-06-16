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

const systemPrompt = `You are Aether AI, the intelligent coordinator of Aether OS.
You have access to tools for Gmail and Google Calendar. You can search/view emails, send emails, search/view calendar events, create calendar events, delete calendar events, and request email deletion.

CRITICAL RULES:
1. DO NOT delete emails directly. If a user asks to delete an email, you MUST use the \`requestEmailDeletion\` tool to select the mail and ask the user for confirmation.
2. Always verify details (like date/time for calendar events, or email addresses) before calling tools.
3. Be concise, polite, and professional.

Few-Shot Examples:

User: "Send an email to boss@company.com saying I will be late."
AI: Calls tool sendEmail({ to: "boss@company.com", subject: "Running Late", body: "Hi, just letting you know I will be late today." })
Response: I have sent the email to boss@company.com.

User: "What meetings do I have tomorrow?"
AI: Calls tool listCalendarEvents({ timeMin: "2026-06-18T00:00:00Z", timeMax: "2026-06-18T23:59:59Z" })
Response: You have 2 meetings tomorrow: 1. Board Alignment at 10 AM, 2. Design Review at 3 PM.

User: "Delete the email from Netflix about subscription."
AI: Calls tool listEmails({ q: "from:Netflix subscription" })
(After receiving email list containing msg_123, subject "Your subscription update")
AI: Calls tool requestEmailDeletion({ emailId: "msg_123", subject: "Your subscription update", sender: "Netflix" })
Response: I found the email "Your subscription update" from Netflix. Please confirm if you want to delete it.
`;

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
    model: openrouter("google/gemini-2.5-flash"),
    maxOutputTokens: 1000,
    system: systemPrompt,
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
          try {
            const rawMime = Buffer.from(
              `To: ${to}\r\n` +
              `Subject: ${subject}\r\n` +
              `Content-Type: text/html; charset=utf-8\r\n\r\n` +
              `${body}`
            ).toString("base64url");
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
          summary: z.string().describe("Title of the event"),
          description: z.string().optional().describe("Optional description"),
          startDateTime: z.string().describe("ISO start date time"),
          endDateTime: z.string().describe("ISO end date time"),
        }),
        execute: async ({ summary, description, startDateTime, endDateTime }: { summary: string; description?: string; startDateTime: string; endDateTime: string }) => {
          try {
            const created = await createEvent(tenantId, {
              summary,
              description,
              start: { dateTime: startDateTime },
              end: { dateTime: endDateTime },
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

  // 3. Trigger Inngest event in the background to durably audit and increment limits
  try {
    await inngest.send({
      name: "ai/command-executed",
      data: {
        userId,
        command,
      },
    });
  } catch (error) {
    console.warn("[Inngest] Failed to send event to Inngest client, falling back to direct db update:", error);
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
      console.error("[Inngest Fallback] Failed to update user AI usage in database:", dbError);
    }
  }

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
    model: openrouter("google/gemini-2.5-flash"),
    maxOutputTokens: 1000,
    prompt,
  });
  return response.text;
};