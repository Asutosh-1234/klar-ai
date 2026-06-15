import { corsair } from "@/corsair";

export interface CalendarEventInput {
  summary: string;
  description?: string;
  location?: string;
  start: {
    date?: string;
    dateTime?: string;
    timeZone?: string;
  };
  end: {
    date?: string;
    dateTime?: string;
    timeZone?: string;
  };
  attendees?: {
    email: string;
    displayName?: string;
  }[];
}

/**
 * Fetches events directly from the Google Calendar API.
 */
export const getAllEvents = async (tenantId: string, timeMin?: string, timeMax?: string) => {
  const minTime = timeMin || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const maxTime = timeMax || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const response = await corsair.withTenant(tenantId).googlecalendar.api.events.getMany({
    calendarId: "primary",
    orderBy: "startTime",
    singleEvents: true,
    timeMin: minTime,
    timeMax: maxTime,
  });

  return response.items || [];
};

/**
 * Creates a new event on Google Calendar.
 */
export const createEvent = async (tenantId: string, eventInput: CalendarEventInput) => {
  return await corsair.withTenant(tenantId).googlecalendar.api.events.create({
    calendarId: "primary",
    event: eventInput,
  });
};

/**
 * Updates an existing event on Google Calendar.
 */
export const updateEvent = async (
  tenantId: string,
  eventId: string,
  eventInput: Partial<CalendarEventInput>
) => {
  return await corsair.withTenant(tenantId).googlecalendar.api.events.update({
    calendarId: "primary",
    id: eventId,
    event: eventInput,
  });
};

/**
 * Deletes an event from Google Calendar.
 */
export const deleteEvent = async (tenantId: string, eventId: string) => {
  return await corsair.withTenant(tenantId).googlecalendar.api.events.delete({
    calendarId: "primary",
    id: eventId,
  });
};

/**
 * Reads events from the local database synced by Corsair.
 * Used for high-frequency feeds, complying with the "Read feeds from db, refresh with api" pattern.
 */
export const searchEventsFromDb = async (tenantId: string, query?: string) => {
  const dataFilters: any = {};

  if (query) {
    dataFilters.summary = { contains: query };
  }

  const dbEvents = await corsair.withTenant(tenantId).googlecalendar.db.events.search({
    data: dataFilters,
  });

  return dbEvents.map((evt) => ({
    ...evt.data,
    id: evt.entity_id,
  }));
};