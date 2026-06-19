import { generateText, stepCountIs } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { prisma } from "@/lib/config/prisma";
import ENV from "@/lib/config/ENV";
import { inngest } from "@/lib/inngest/client";
import { getAiTools } from "./ai-tools";

const google = createGoogleGenerativeAI({
  apiKey: ENV.GEMINI_API_KEY,
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
    model: google("gemini-2.5-flash"),
    maxOutputTokens: 800,
    system: getSystemPrompt(),
    prompt: command,
    stopWhen: [stepCountIs(3)],
    tools: getAiTools({
      tenantId,
      onRequestEmailDeletion: (info) => {
        pendingDeleteInfo = info;
      },
    }),
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
    model: google("gemini-2.5-flash"),
    maxOutputTokens: 500,
    prompt,
  });
  return response.text;
};