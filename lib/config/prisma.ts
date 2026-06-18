import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { Pool } from "pg";
import ENV from "./ENV";

const connectionString = ENV.DATABASE_URL;
const originalUrl = process.env.DATABASE_URL;
let sslConfig: any = undefined;

if (originalUrl) {
  try {
    const parsed = new URL(originalUrl);
    if (parsed.hostname.includes("neon.tech")) {
      sslConfig = {
        servername: parsed.hostname,
        rejectUnauthorized: true,
      };
    }
  } catch (e) {}
}

const pool = new Pool({
  connectionString,
  ssl: sslConfig,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export { prisma };