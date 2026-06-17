import { prisma } from "@/lib/config/prisma";
import { generate768Embedding } from "./embeddings";
import { getAllMails, getMessageDetails } from "./gmail.service";
import { getAllEvents } from "./calendar.service";
import { getHeader } from "@/lib/utils/gmail";

export async function syncEmailsForUser(tenantId: string, userId: string) {
  try {
    const messages = await getAllMails({
      userId: "me",
      tenentId: tenantId,
      maxResults: 15,
      includeSpamTrash: false
    });

    for (const msg of messages) {
      if (!msg.id) continue;

      const existing = await prisma.email.findUnique({
        where: { gmailId: msg.id }
      });
      if (existing) continue;

      const details = await getMessageDetails(tenantId, msg.id);
      const subject = getHeader(details as any, "subject") || "(No Subject)";
      const sender = getHeader(details as any, "from") || "";
      const snippet = details.snippet || "";
      const body = details.snippet || "";

      const contentToEmbed = `Subject: ${subject}\nSender: ${sender}\nSnippet: ${snippet}`;
      const embedding = await generate768Embedding(contentToEmbed);
      const embeddingString = `[${embedding.join(",")}]`;

      await prisma.$executeRawUnsafe(
        `INSERT INTO "Email" ("id", "userId", "gmailId", "subject", "sender", "snippet", "body", "priority", "isRead", "isStarred", "receivedAt", "embedding") 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, now(), $11::vector)
         ON CONFLICT ("gmailId") DO NOTHING`,
        `em_${msg.id}`, userId, msg.id, subject, sender, snippet, body, "normal", false, false, embeddingString
      );
    }
  } catch (err) {
    console.error("syncEmailsForUser failed:", err);
  }
}

export async function syncEventsForUser(tenantId: string, userId: string) {
  try {
    const events = await getAllEvents(tenantId);
    for (const evt of events) {
      if (!evt.id) continue;

      const existing = await prisma.calendarEvent.findUnique({
        where: { eventId: evt.id }
      });
      if (existing) continue;

      const summary = evt.summary || "(No Title)";
      const description = evt.description || "";
      const location = evt.location || "";
      const start = evt.start?.dateTime || evt.start?.date ? new Date((evt.start.dateTime || evt.start.date) as string) : null;
      const end = evt.end?.dateTime || evt.end?.date ? new Date((evt.end.dateTime || evt.end.date) as string) : null;

      const contentToEmbed = `Summary: ${summary}\nDescription: ${description}\nLocation: ${location}`;
      const embedding = await generate768Embedding(contentToEmbed);
      const embeddingString = `[${embedding.join(",")}]`;

      await prisma.$executeRawUnsafe(
        `INSERT INTO "CalendarEvent" ("id", "userId", "eventId", "summary", "description", "location", "start", "end", "embedding") 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::vector)
         ON CONFLICT ("eventId") DO NOTHING`,
        `ev_${evt.id}`, userId, evt.id, summary, description, location, start, end, embeddingString
      );
    }
  } catch (err) {
    console.error("syncEventsForUser failed:", err);
  }
}

export async function searchEmailsVector(userId: string, queryText: string, limit = 5) {
  try {
    const embedding = await generate768Embedding(queryText);
    const embeddingString = `[${embedding.join(",")}]`;
    const results = await prisma.$queryRawUnsafe<any[]>(
      `SELECT id, "gmailId", subject, sender, snippet 
       FROM "Email" 
       WHERE "userId" = $1
       ORDER BY (embedding <=> $2::vector) ASC 
       LIMIT $3`,
      userId,
      embeddingString,
      limit
    );
    return results;
  } catch (err) {
    console.error("searchEmailsVector failed:", err);
    return [];
  }
}

export async function searchEventsVector(userId: string, queryText: string, limit = 5) {
  try {
    const embedding = await generate768Embedding(queryText);
    const embeddingString = `[${embedding.join(",")}]`;
    const results = await prisma.$queryRawUnsafe<any[]>(
      `SELECT id, "eventId", summary, description, location, start, "end" 
       FROM "CalendarEvent" 
       WHERE "userId" = $1
       ORDER BY (embedding <=> $2::vector) ASC 
       LIMIT $3`,
      userId,
      embeddingString,
      limit
    );
    return results;
  } catch (err) {
    console.error("searchEventsVector failed:", err);
    return [];
  }
}
