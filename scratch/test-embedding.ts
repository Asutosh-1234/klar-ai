import { prisma } from "../lib/config/prisma";
import { embed } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import ENV from "../lib/config/ENV";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: ENV.AI_API_KEY,
});

async function main() {
  console.log("Testing embedding generation and DB insert...");
  try {
    const text = "Testing Aether AI Agent Search and Vector DB Integration.";
    const { embedding } = await embed({
      model: openrouter.embedding("openai/text-embedding-3-small"),
      value: text,
    });
    
    // Truncate to 768 and normalize
    const truncated = embedding.slice(0, 768);
    const norm = Math.sqrt(truncated.reduce((sum, val) => sum + val * val, 0));
    const normalized = truncated.map(val => val / norm);
    
    console.log("Normalized embedding length:", normalized.length);
    
    const userId = "100738087255653606617"; // Ashutosh Panda
    const gmailId = "test_gmail_id_" + Date.now();
    const id = "test_cuid_" + Date.now();
    
    const embeddingString = `[${normalized.join(",")}]`;
    
    console.log("Inserting into DB...");
    await prisma.$executeRawUnsafe(
      `INSERT INTO "Email" ("id", "userId", "gmailId", "subject", "sender", "snippet", "body", "priority", "isRead", "isStarred", "receivedAt", "embedding") 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, now(), $11::vector)`,
      id, userId, gmailId, "Test Subject", "sender@test.com", "Test Snippet", "Test Body", "high", false, false, embeddingString
    );
    console.log("Inserted successfully!");

    console.log("Querying using cosine distance...");
    const results = await prisma.$queryRawUnsafe<any[]>(
      `SELECT id, "gmailId", subject, sender, (embedding <=> $1::vector) as distance 
       FROM "Email" 
       WHERE "userId" = $2
       ORDER BY distance ASC 
       LIMIT 1`,
      embeddingString,
      userId
    );
    console.log("Query result:", results);

    // Clean up
    console.log("Cleaning up test record...");
    await prisma.$executeRawUnsafe(`DELETE FROM "Email" WHERE id = $1`, id);
    console.log("Cleaned up successfully!");
  } catch (e) {
    console.error("Failed:", e);
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
