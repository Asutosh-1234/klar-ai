import { inngest } from "./client";
import { prisma } from "../config/prisma";

// Inngest background job to durably increment user's AI usage count and audit execution
export const handleAiCommandExecuted = inngest.createFunction(
  { id: "handle-ai-command-executed", triggers: [{ event: "ai/command-executed" }] },
  async ({ event, step }) => {
    const { userId, command } = event.data;

    await step.run("increment-usage-count", async () => {
      return await prisma.user.update({
        where: { id: userId },
        data: {
          aiUsageCount: {
            increment: 1,
          },
        },
        select: {
          id: true,
          aiUsageCount: true,
        },
      });
    });

    console.log(`[Inngest] Audited AI command execution for user ${userId}: "${command}"`);
    return { success: true };
  }
);
