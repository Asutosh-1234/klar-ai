import 'dotenv/config';
import { createCorsair } from 'corsair';
import { gmail } from '@corsair-dev/gmail';
import { googlecalendar } from '@corsair-dev/googlecalendar';
import { Pool } from 'pg';
import ENV from './app/lib/config/ENV';

const pool = new Pool({
	connectionString: ENV.DATABASE_URL,
});

export const corsair = createCorsair({
	multiTenancy: true,
	plugins: [gmail(), googlecalendar()],
	database: pool,
	kek: ENV.CORSAIR_KEK,
});