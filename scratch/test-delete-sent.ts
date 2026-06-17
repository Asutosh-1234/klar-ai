import { prisma } from "../lib/config/prisma";
import { getAllMails, getMessageDetails } from "../lib/services/gmail.service";

async function main() {
  const tenantId = "usr_100738087255653606617";
  const q = "label:SENT";
  
  console.log("Fetching sent emails...");
  const messages = await getAllMails({
    tenentId: tenantId,
    userId: "me",
    q,
    maxResults: 5,
    includeSpamTrash: true
  });
  
  console.log(`Found ${messages.length} raw sent emails.`);
  
  const enrichedMessages = await Promise.all(
    messages.map(async (msg: { id?: string | null }) => {
      if (!msg.id) return null;
      try {
        const fullMsg = await getMessageDetails(tenantId, msg.id);
        if (fullMsg && fullMsg.labelIds) {
          const isTrash = fullMsg.labelIds.includes("TRASH");
          const isSpam = fullMsg.labelIds.includes("SPAM");
          const isTrashQuery = q && (q.includes("label:TRASH") || q.includes("in:trash"));
          const isSpamQuery = q && (q.includes("label:SPAM") || q.includes("in:spam"));

          if (isTrash && !isTrashQuery) {
            console.log(`Filtering out trashed message: ${msg.id} (${fullMsg.payload?.headers?.find((h: any) => h.name === "Subject")?.value})`);
            return null;
          }
          if (isSpam && !isSpamQuery) return null;
        }
        return fullMsg;
      } catch (err) {
        return msg;
      }
    })
  );

  const activeMessages = enrichedMessages.filter((msg): msg is any => msg !== null);
  console.log(`Active (non-trashed) sent messages count: ${activeMessages.length}`);
  for (const msg of activeMessages) {
    if (msg) {
      const subject = msg.payload?.headers?.find((h: any) => h.name === "Subject")?.value;
      console.log(`- Subject: "${subject}", ID: ${msg.id}, LabelIds: ${JSON.stringify(msg.labelIds)}`);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
