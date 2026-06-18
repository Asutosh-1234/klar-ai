import 'dotenv/config';
import { Pool } from 'pg';
import dns from 'dns';

import ENV from '../lib/config/ENV';

async function testConnection() {
  const dbUrl = ENV.DATABASE_URL;
  const originalHostname = "ep-red-sun-aqfj08i6-pooler.c-8.us-east-1.aws.neon.tech";
  console.log("Testing pg connection to ENV.DATABASE_URL:", dbUrl);
  
  const pool = new Pool({
    connectionString: dbUrl,
    ssl: {
      servername: originalHostname,
      rejectUnauthorized: true
    },
    connectionTimeoutMillis: 15000
  });

  try {
    const client = await pool.connect();
    console.log("SUCCESS: Connected to database!");
    const res = await client.query("SELECT NOW()");
    console.log("Query result:", res.rows[0]);
    client.release();
  } catch (err: any) {
    console.error("ERROR connecting to database:", err.message || err);
  } finally {
    await pool.end();
  }
}

testConnection();
