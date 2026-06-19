import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authProvider } from "@/lib/auth/config";
import { streamText, stepCountIs } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import ENV from "@/lib/config/ENV";
import {
  syncEmailsForUser,
  syncEventsForUser,
  searchEmailsVector,
  searchEventsVector
} from "@/lib/services/agent-chat.service";
import { getAiTools } from "@/lib/services/ai-tools";


const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: ENV.AI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authProvider);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { specialistId, message, history } = await request.json();
    if (!specialistId || !message) {
      return NextResponse.json({ error: "Missing specialistId or message" }, { status: 400 });
    }

    const userId = session.user.id;
    const tenantId = `usr_${userId}`;

    // 1. Trigger sync in background (non-awaited to keep it fast)
    Promise.all([
      syncEmailsForUser(tenantId, userId),
      syncEventsForUser(tenantId, userId)
    ]).catch(err => console.error("Sync in chat route failed:", err));

    // 2. Query Vector DB depending on specialist type to obtain initial context
    let context = "";
    if (specialistId === "mail" || specialistId === "strategy") {
      const emailMatches = await searchEmailsVector(userId, message, 3);
      if (emailMatches.length > 0) {
        context += "\n--- RELEVANT EMAILS FOUND IN VECTOR DB ---\n";
        emailMatches.forEach((m, idx) => {
          context += `[Email ${idx + 1}]\nSender: ${m.sender}\nSubject: ${m.subject}\nSnippet: ${m.snippet}\n\n`;
        });
      }
    }

    if (specialistId === "calendar" || specialistId === "strategy") {
      const eventMatches = await searchEventsVector(userId, message, 3);
      if (eventMatches.length > 0) {
        context += "\n--- RELEVANT CALENDAR EVENTS FOUND IN VECTOR DB ---\n";
        eventMatches.forEach((m, idx) => {
          context += `[Event ${idx + 1}]\nTitle: ${m.summary}\nLocation: ${m.location}\nStart: ${m.start}\nEnd: ${m.end}\nDescription: ${m.description}\n\n`;
        });
      }
    }

    // 3. Build System Prompt
    let systemPrompt = "";

    const sharedInstructions = `

GENERAL OPERATING PROCEDURES & AUTONOMOUS THINKING:
- You MUST work autonomously using your own reasoning and thinking power.
- When asked to perform actions (such as sending an email or setting up/creating calendar events), if the user has not specified a title/summary, email subject, or email body, do NOT ask the user for these details.
- Instead, autonomously draft/generate appropriate, professional, and formal values for them:
  - For email subjects and bodies: Write a complete, polite, and professionally formatted email maintaining all standard business/formal correspondence rules (greetings, sign-off, clear paragraphs, polite tone).
  - For calendar events: Create an appropriate summary/title (e.g. "Meeting with [Name]" or "Discussion on [Topic]" or "Strategic Session") and set a logical duration (e.g. 1 hour starting at the requested time).
- If the user provides a request containing multiple actions (e.g., "set an event at 6 pm today and send an email..."), you must call ALL relevant tools in succession during the same turn to fulfill the complete request. Do not ask for confirmation or extra information before executing.
- Current local time context for relative date/time parsing (e.g., "today", "tomorrow"): ${new Date().toString()} (ISO: ${new Date().toISOString()})`;

    if (specialistId === "mail") {
      systemPrompt = `You are Klar's Mail Analyst. You have access to Gmail tools (listEmails, sendEmail).
Your role is to help the user query, summarize, search, and send emails.
CRITICAL: You MUST use your tools (like sendEmail) to perform requested actions immediately. Do not say you are unable to perform them. Speak and act as a capable executive agent.${sharedInstructions}`;
    } else if (specialistId === "calendar") {
      systemPrompt = `You are Klar's Scheduling Assistant. You have access to Google Calendar tools (listCalendarEvents, createCalendarEvent, deleteCalendarEvent).
Your role is to help the user list, create, and delete calendar events.
CRITICAL: You MUST use your tools (like createCalendarEvent or deleteCalendarEvent) to perform requested actions immediately. Do not say you are unable to perform them. When the user specifies a time like "today at 6 PM", parse this into the correct ISO start and end timestamps (e.g., today's date at 18:00 to 19:00) and call the create tool. Speak and act as a capable executive agent.${sharedInstructions}`;
    } else {
      systemPrompt = `You are Klar's Strategy Lead. You coordinate information from both emails and calendar events.
You have access to both Gmail and Google Calendar tools.
Your role is to help the user search, summarize, schedule, send emails, or manage calendar events.
CRITICAL: You MUST use your tools to perform requested actions immediately. Speak and act as a capable executive agent.${sharedInstructions}`;
    }

    if (context) {
      systemPrompt += `\n\nUse the following relevant context from the user's database to answer the user's request:\n${context}`;
    }

    // 4. Define Specialist Tools dynamically
    const tools: Record<string, any> = {};
    const allTools = getAiTools({ tenantId });

    if (specialistId === "mail" || specialistId === "strategy") {
      tools.listEmails = allTools.listEmails;
      tools.sendEmail = allTools.sendEmail;
    }

    if (specialistId === "calendar" || specialistId === "strategy") {
      tools.listCalendarEvents = allTools.listCalendarEvents;
      tools.createCalendarEvent = allTools.createCalendarEvent;
      tools.deleteCalendarEvent = allTools.deleteCalendarEvent;
    }

    // 5. Determine Dynamic Proposed Next Step
    let proposedStep = null;
    const lowerMessage = message.toLowerCase();
    if (specialistId === "mail" && (lowerMessage.includes("send") || lowerMessage.includes("mail") || lowerMessage.includes("email") || lowerMessage.includes("draft"))) {
      proposedStep = {
        title: "Verify Sent Mail",
        description: "Review if the email was delivered successfully and verify details in your Sent folder.",
        primaryAction: "Verify Delivery",
        secondaryAction: "Dismiss"
      };
    } else if (specialistId === "calendar" && (lowerMessage.includes("schedule") || lowerMessage.includes("event") || lowerMessage.includes("calendar") || lowerMessage.includes("meet"))) {
      proposedStep = {
        title: "Optimize Focus Block",
        description: "Review agenda conflicts and apply AI scheduling optimizations for optimal deep focus blocks.",
        primaryAction: "Apply Optimization",
        secondaryAction: "Dismiss"
      };
    } else {
      proposedStep = {
        title: "Strategy Review",
        description: "Verify APAC regional rollout details and check upcoming logistics summary briefings.",
        primaryAction: "Execute Strategy Plan",
        secondaryAction: "Dismiss"
      };
    }

    // 6. Stream text responses utilizing NDJSON streaming
    const result = streamText({
      model: openrouter.chat("cohere/north-mini-code:free"),
      maxOutputTokens: 1000,
      system: systemPrompt,
      messages: [
        ...(history || []),
        { role: "user", content: message }
      ],
      stopWhen: [stepCountIs(3)],
      tools,
    });

    const textStream = result.textStream;
    const encoder = new TextEncoder();

    const responseStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of textStream) {
            controller.enqueue(encoder.encode(JSON.stringify({ type: "text", content: chunk }) + "\n"));
          }
          // Enqueue proposed step at the very end of the text stream
          if (proposedStep) {
            controller.enqueue(encoder.encode(JSON.stringify({ type: "proposedStep", content: proposedStep }) + "\n"));
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(responseStream, {
      headers: {
        "Content-Type": "application/x-ndjson",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      }
    });

  } catch (error: any) {
    console.error("Error in POST /api/agents/chat:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
