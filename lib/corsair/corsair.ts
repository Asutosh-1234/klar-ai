import 'dotenv/config';
import { createCorsair } from 'corsair';
import { gmail } from '@corsair-dev/gmail';
import { googlecalendar } from '@corsair-dev/googlecalendar';
import { prisma } from "../config/prisma";

export const corsair = createCorsair({
    plugins: [gmail(),googlecalendar()],
    database: prisma,
    kek: process.env.CORSAIR_KEK!,
});