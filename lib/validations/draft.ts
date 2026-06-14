import { z } from "zod";

export const createDraftSchema = z.object({
  to: z.string().email("Please enter a valid email address"),
  subject: z.string().optional().default(""),
  body: z.string().min(1, "Draft message body cannot be empty"),
  threadId: z.string().optional(),
});

export type CreateDraftInput = z.infer<typeof createDraftSchema>;
