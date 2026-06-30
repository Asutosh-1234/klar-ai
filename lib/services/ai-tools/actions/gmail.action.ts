import { getAllMails, getMessageDetails, searchMailsFromDb } from "../../gmail.service";
import { sendMimeEmail } from "../../gmail-helper";

export async function executeListEmails(tenantId: string, { q, maxResults }: { q?: string; maxResults?: number }) {
  try {
    const messages = await getAllMails({
      userId: "me",
      tenentId: tenantId,
      q,
      maxResults,
      includeSpamTrash: true,
      labelIds: ["INBOX"],
    });

    const dbMails = await searchMailsFromDb(tenantId);
    const dbMailsMap = new Map<string, any>();
    for (const mail of dbMails) {
      if (mail.id) {
        dbMailsMap.set(mail.id, mail);
      }
    }

    const enriched = await Promise.all(
      messages.slice(0, 5).map(async (msg: any) => {
        if (!msg.id) return null;
        try {
          let details;
          if (dbMailsMap.has(msg.id)) {
            details = dbMailsMap.get(msg.id);
          } else {
            details = await getMessageDetails(tenantId, msg.id, "metadata");
          }
          return {
            id: details.id,
            subject: details.payload?.headers?.find((h: any) => h.name.toLowerCase() === "subject")?.value || "No Subject",
            sender: details.payload?.headers?.find((h: any) => h.name.toLowerCase() === "from")?.value || "Unknown",
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
}

export async function executeSendEmail(tenantId: string, { to, subject, body }: { to: string; subject: string; body: string }) {
  console.log("[AGENT TOOL] sendEmail invoked:", { to, subject, body });
  try {
    return await sendMimeEmail(tenantId, to, subject, body);
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function executeRequestEmailDeletion(
  onRequestEmailDeletion: ((info: { emailId: string; subject: string; sender: string }) => void) | undefined,
  { emailId, subject, sender }: { emailId: string; subject: string; sender: string }
) {
  if (onRequestEmailDeletion) {
    onRequestEmailDeletion({ emailId, subject, sender });
  }
  return {
    pendingDelete: { emailId, subject, sender },
    message: "Deletion confirmation requested. Awaiting user action.",
  };
}
