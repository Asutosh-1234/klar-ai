import { tool } from "ai";
import { z } from "zod";
import { listEmailsSchema, sendEmailSchema, requestEmailDeletionSchema } from "./schemas/gmail.schema";
import { executeListEmails, executeSendEmail, executeRequestEmailDeletion } from "./actions/gmail.action";

export function listEmailsTool(tenantId: string) {
  return tool({
    description: "Search or list Gmail messages matching a query.",
    parameters: listEmailsSchema,
    execute: (args: z.infer<typeof listEmailsSchema>) => executeListEmails(tenantId, args),
  } as any);
}

export function sendEmailTool(tenantId: string) {
  return tool({
    description: "Compose and send a new email.",
    parameters: sendEmailSchema,
    execute: (args: z.infer<typeof sendEmailSchema>) => executeSendEmail(tenantId, args),
  } as any);
}

export function requestEmailDeletionTool(
  onRequestEmailDeletion?: (info: { emailId: string; subject: string; sender: string }) => void
) {
  return tool({
    description: "Request confirmation from the user to delete a specific email. DO NOT delete directly.",
    parameters: requestEmailDeletionSchema,
    execute: (args: z.infer<typeof requestEmailDeletionSchema>) => executeRequestEmailDeletion(onRequestEmailDeletion, args),
  } as any);
}
