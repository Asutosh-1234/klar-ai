import { embed } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import ENV from "@/lib/config/ENV";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: ENV.AI_API_KEY,
});

export async function generate768Embedding(text: string): Promise<number[]> {
  try {
    const { embedding } = await embed({
      model: openrouter.embedding("openai/text-embedding-3-small"),
      value: text,
    });
    
    // Truncate to 768 and normalize
    const truncated = embedding.slice(0, 768);
    const norm = Math.sqrt(truncated.reduce((sum, val) => sum + val * val, 0));
    if (norm === 0) return new Array(768).fill(0);
    return truncated.map(val => val / norm);
  } catch (error) {
    console.error("Embedding generation failed:", error);
    throw error;
  }
}
