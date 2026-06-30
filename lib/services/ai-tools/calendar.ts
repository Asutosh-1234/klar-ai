import { tool } from "ai";
import { z } from "zod";
import { listCalendarEventsSchema, createCalendarEventSchema, deleteCalendarEventSchema } from "./schemas/calendar.schema";
import { executeListCalendarEvents, executeCreateCalendarEvent, executeDeleteCalendarEvent } from "./actions/calendar.action";

export function listCalendarEventsTool(tenantId: string) {
  return tool({
    description: "List calendar events.",
    parameters: listCalendarEventsSchema,
    execute: (args: z.infer<typeof listCalendarEventsSchema>) => executeListCalendarEvents(tenantId, args),
  } as any);
}

export function createCalendarEventTool(tenantId: string) {
  return tool({
    description: "Create a new event in the calendar.",
    parameters: createCalendarEventSchema,
    execute: (args: z.infer<typeof createCalendarEventSchema>) => executeCreateCalendarEvent(tenantId, args),
  } as any);
}

export function deleteCalendarEventTool(tenantId: string) {
  return tool({
    description: "Delete an event from the calendar.",
    parameters: deleteCalendarEventSchema,
    execute: (args: z.infer<typeof deleteCalendarEventSchema>) => executeDeleteCalendarEvent(tenantId, args),
  } as any);
}
