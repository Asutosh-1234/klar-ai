import { z } from "zod";

export const listCalendarEventsSchema = z.object({
  timeMin: z.string().optional().describe("ISO start time"),
  timeMax: z.string().optional().describe("ISO end time"),
});

export const createCalendarEventSchema = z.object({
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
});

export const deleteCalendarEventSchema = z.object({
  eventId: z.string().describe("The ID of the event to delete"),
});
