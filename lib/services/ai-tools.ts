import { tool } from "ai";
import { z } from "zod";
import { getAllMails, getMessageDetails } from "./gmail.service";
import { sendMimeEmail } from "./gmail-helper";
import { getAllEvents, createEvent, deleteEvent } from "./calendar.service";

export function listEmailsTool(tenantId: string) {
  return tool({
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
  } as any);
}

export function sendEmailTool(tenantId: string) {
  return tool({
    description: "Compose and send a new email.",
    parameters: z.object({
      to: z.string().describe("Recipient email address"),
      subject: z.string().describe("Email subject line"),
      body: z.string().describe("Email body content (HTML or plain text)"),
    }),
    execute: async ({ to, subject, body }: { to: string; subject: string; body: string }) => {
      console.log("[AGENT TOOL] sendEmail invoked:", { to, subject, body });
      try {
        return await sendMimeEmail(tenantId, to, subject, body);
      } catch (e: any) {
        return { error: e.message };
      }
    },
  } as any);
}

export function requestEmailDeletionTool(
  onRequestEmailDeletion?: (info: { emailId: string; subject: string; sender: string }) => void
) {
  return tool({
    description: "Request confirmation from the user to delete a specific email. DO NOT delete directly.",
    parameters: z.object({
      emailId: z.string().describe("The unique ID of the email to delete"),
      subject: z.string().describe("The subject line of the email"),
      sender: z.string().describe("The sender of the email"),
    }),
    execute: async ({ emailId, subject, sender }: { emailId: string; subject: string; sender: string }) => {
      if (onRequestEmailDeletion) {
        onRequestEmailDeletion({ emailId, subject, sender });
      }
      return {
        pendingDelete: { emailId, subject, sender },
        message: "Deletion confirmation requested. Awaiting user action.",
      };
    },
  } as any);
}

export function listCalendarEventsTool(tenantId: string) {
  return tool({
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
  } as any);
}

export function createCalendarEventTool(tenantId: string) {
  return tool({
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
  } as any);
}

export function deleteCalendarEventTool(tenantId: string) {
  return tool({
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
  } as any);
}

export function getAiTools({
  tenantId,
  onRequestEmailDeletion,
}: {
  tenantId: string;
  onRequestEmailDeletion?: (info: { emailId: string; subject: string; sender: string }) => void;
}) {
  return {
    listEmails: listEmailsTool(tenantId),
    sendEmail: sendEmailTool(tenantId),
    requestEmailDeletion: requestEmailDeletionTool(onRequestEmailDeletion),
    listCalendarEvents: listCalendarEventsTool(tenantId),
    createCalendarEvent: createCalendarEventTool(tenantId),
    deleteCalendarEvent: deleteCalendarEventTool(tenantId),
  };
}
