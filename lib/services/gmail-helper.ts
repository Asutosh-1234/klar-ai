import { createDraft, sendDraft } from "./gmail.service";

/**
 * Constructs a MIME email, creates a draft, and sends it.
 */
export const sendMimeEmail = async (tenantId: string, to: string, subject: string, body: string) => {
  const mimeMessage = [
    `To: ${to}`,
    `Subject: =?utf-8?B?${Buffer.from(subject).toString("base64")}?=`,
    'Content-Type: text/html; charset="UTF-8"',
    'MIME-Version: 1.0',
    '',
    body
  ].join('\r\n');
  const rawMime = Buffer.from(mimeMessage)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const draft = await createDraft(tenantId, rawMime);
  if (!draft.id) {
    throw new Error("Failed to create draft");
  }
  await sendDraft(tenantId, draft.id);
  return { success: true, message: `Email sent to ${to}.` };
};
