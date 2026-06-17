import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authProvider } from "@/lib/auth/config";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import ENV from "@/lib/config/ENV";
import {
  syncEmailsForUser,
  syncEventsForUser,
  searchEmailsVector,
  searchEventsVector
} from "@/lib/services/agent-chat.service";

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

    const { specialistId, message } = await request.json();
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

    // 2. Query Vector DB depending on specialist type
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
    let specialistName = "Aether AI Lead";
    let systemPrompt = "";

    if (specialistId === "mail") {
      specialistName = "Mail Analyst";
      systemPrompt = `You are Aether's Mail Analyst. You have access to the user's emails via semantic search.
Your role is to help the user query, summarize, search, and navigate their emails. 
Be concise, professional, and elegant. 
Always refer to details in the emails when answering.`;
    } else if (specialistId === "calendar") {
      specialistName = "Scheduling Assistant";
      systemPrompt = `You are Aether's Scheduling Assistant. You have access to the user's calendar events via semantic search.
Your role is to help the user look up, structure, and check their schedules or resolve conflicts.
Be concise, professional, and precise.`;
    } else {
      specialistName = "Strategy Lead";
      systemPrompt = `You are Aether's Strategy Lead. You coordinate information from both emails and calendar events.
Help the user answer comprehensive questions about their schedules, messages, and upcoming planning.
Be executive, strategic, concise, and professional.`;
    }

    // If context was found, append it to system prompt
    if (context) {
      systemPrompt += `\n\nUse the following relevant context from the user's database to answer the user's request:\n${context}`;
    } else {
      systemPrompt += `\n\nNo matching documents found in the database. Prompt the user that they can ask to sync their Gmail or Calendar if they want more info.`;
    }

    // 4. Generate Text Response
    const response = await generateText({
      model: openrouter("google/gemini-2.5-flash"),
      maxOutputTokens: 1000,
      system: systemPrompt,
      prompt: message,
    });

    // We can also extract proposed next steps from the AI output or construct them dynamically
    let proposedStep = null;
    if (specialistId === "calendar" && message.toLowerCase().includes("schedule")) {
      proposedStep = {
        title: "Create Calendar Event",
        description: "Schedule a regional expansion briefing with regional directors.",
        primaryAction: "Create Event",
        secondaryAction: "Edit Time"
      };
    } else if (specialistId === "mail" && message.toLowerCase().includes("find")) {
      proposedStep = {
        title: "Draft Reply",
        description: "Draft a follow-up response addressing regional entry strategy.",
        primaryAction: "Draft Response",
        secondaryAction: "Ignore"
      };
    } else {
      proposedStep = {
        title: "Strategy Review",
        description: "Add Singapore logistics summary to strategic goals folder.",
        primaryAction: "Execute Strategy Plan",
        secondaryAction: "Dismiss"
      };
    }

    return NextResponse.json({
      text: response.text,
      specialistName,
      proposedStep
    });

  } catch (error: any) {
    console.error("Error in POST /api/agents/chat:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
