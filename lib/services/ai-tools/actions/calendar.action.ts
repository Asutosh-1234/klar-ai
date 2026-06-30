import { getAllEvents, createEvent, deleteEvent } from "../../calendar.service";

export async function executeListCalendarEvents(tenantId: string, { timeMin, timeMax }: { timeMin?: string; timeMax?: string }) {
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
}

export async function executeCreateCalendarEvent(
  tenantId: string,
  { summary, description, startDateTime, endDateTime }: { summary?: string; description?: string; startDateTime?: string; endDateTime?: string }
) {
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
}

export async function executeDeleteCalendarEvent(tenantId: string, { eventId }: { eventId: string }) {
  try {
    await deleteEvent(tenantId, eventId);
    return { success: true, message: "Calendar event deleted." };
  } catch (e: any) {
    return { error: e.message };
  }
}
