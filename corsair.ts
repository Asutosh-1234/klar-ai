import 'dotenv/config';
import { createCorsair } from 'corsair';
import { gmail } from '@corsair-dev/gmail';
import { googlecalendar } from '@corsair-dev/googlecalendar';
import { Pool } from 'pg';
import ENV from './lib/config/ENV';

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
	connectionString: ENV.DATABASE_URL,
	ssl: sslConfig,
});

export const corsair = createCorsair({
	multiTenancy: true,
	plugins: [gmail(), googlecalendar()],
	database: pool,
	kek: ENV.CORSAIR_KEK,
});