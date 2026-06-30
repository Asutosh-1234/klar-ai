import { z } from "zod";

export const listEmailsSchema = z.object({
  q: z.string().optional().describe("Gmail search query (e.g. 'from:Netflix')"),
  maxResults: z.number().optional().default(10),
});

export const sendEmailSchema = z.object({
  to: z.string().describe("Recipient email address"),
  subject: z.string().describe("Email subject line"),
  body: z.string().describe("Email body content (HTML or plain text)"),
});

export const requestEmailDeletionSchema = z.object({
  emailId: z.string().describe("The unique ID of the email to delete"),
  subject: z.string().describe("The subject line of the email"),
  sender: z.string().describe("The sender of the email"),
});
