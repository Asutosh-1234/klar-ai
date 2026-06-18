# Klar AI

Klar AI is an intelligent workspace built on Next.js and Prisma that connects to Gmail and Google Calendar via secure OAuth. It acts as a productivity operating system for email and schedule management, with AI-driven agent commands, keyboard-first navigation, real-time sync, and embedded semantic search.

## What this project does

Klar AI is designed to reduce inbox noise and simplify scheduling by bringing:

- Secure Gmail and Google Calendar integration via `corsair` and OAuth 2.0
- AI assistant workflows for summarizing messages, drafting replies, and executing commands
- Keyboard-driven workspace navigation and fast mail actions
- Unified inbox + calendar workspace with contextual scheduling and email content
- Embedded semantics using OpenRouter embeddings + PostgreSQL `pgvector`
- Inngest background audit events and usage tracking
- Resend-powered welcome email delivery

## Key Features

- Gmail inbox browsing with message list, detail reader, and attachment preview
- Gmail draft creation, save, edit, and send from the app UI
- Archive, delete, mark read/unread, star, and search email threads
- Google Calendar sync and event creation, update, and deletion
- OAuth-based Gmail/Calendar connection flow with tenant-scoped integration records
- AI command execution via `/api/ai/command` using Gemini-2.5 Flash and tool-based Gmail/Calendar actions
- AI usage limits and plan tiers managed with Prisma and Inngest
- Secure credential storage using double-key encryption semantics in `corsair`
- Welcome email sending via Resend

## User Flow

### 1. Sign in and connect services

1. Open the Klar AI landing page and sign in with Google.
2. Visit the secure connect page and authorize access for Gmail and Google Calendar.
3. Klar uses `corsair` to create tenant-scoped integration records and store OAuth credentials safely.
4. The UI indicates connection status for both Gmail and Calendar, and a welcome email is sent via Resend after activation.

### 2. Set up the workspace

1. After connection, the app redirects to the inbox workspace.
2. Klar loads your Gmail inbox threads and label state from Google.
3. It simultaneously fetches calendar events and renders a weekly schedule view.
4. If any service is not connected, the workspace prompts you to reconnect and shows which platform is missing.

### 3. Manage email efficiently

1. Browse your inbox with compact email cards, sender details, read/unread indicators, and snippet previews.
2. Open a message to read full content, view attachments, and inspect conversation metadata.
3. Compose new emails, save drafts, update existing drafts, and send messages directly from Klar.
4. Perform quick actions to archive, delete, star, or mark messages as read/unread.
5. Search messages using text queries and Gmail-style operators from the top search bar.

### 4. Manage calendar events

1. Use the calendar panel to view schedule blocks and meeting summaries.
2. Create new events with title, description, start time, and end time.
3. Delete or update events and see changes synced to Google Calendar.
4. The system gracefully handles expired calendar access by prompting for reconnection.

### 5. Use AI for smarter workflows

1. Open the AI command center to ask Klar to summarize email threads, draft replies, or schedule meetings.
2. Klar translates natural language requests into secure tool actions for Gmail and Calendar.
3. Supported AI tools include message search, email send, draft generation, event creation, and event deletion requests.
4. If an AI action is sensitive—like deleting an email—it requests confirmation first instead of executing immediately.
5. AI usage is tracked in Prisma and enforced with plan-based limits, with tiered usage counts for free and paid users.

### 6. Navigate with keyboard-first controls

1. Use keyboard shortcuts to move across folders, open messages, start composing, search, and show help.
2. The app supports both single-key actions and sequential key commands for fast, low-distraction navigation.

### 7. Sync state and recover connections

1. Changes made in Klar sync back to Gmail and Google Calendar in near real time.
2. If authentication expires, the app detects the issue and prompts you to reconnect.
3. Background webhook handling keeps credential and integration state accurate.

### 8. Privacy and security guarantees

1. OAuth tokens are never stored in plain text and are isolated per tenant.
2. The app does not store Google passwords, only revocable OAuth access credentials.
3. Users can revoke access by disconnecting services or deleting their account.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma 7 with PostgreSQL and `vector` extension
- `corsair` for Gmail / Google Calendar plugin integrations
- `next-auth` with Google Provider for OAuth sign-in
- `@ai-sdk/openai` + `ai` SDK for embedding and chat generation
- `resend` for transactional email delivery
- `inngest` for background event processing
- `pgvector` for semantic vector storage

## Architecture Overview

- `app/` contains landing pages, connect flow, inbox workspace, and privacy pages
- `components/` contains UI primitives, Gmail workspace, calendar views, and agent panels
- `lib/` contains shared services, auth config, hooks, Prisma config, and API helpers
- `corsair.ts` initializes the multi-tenant `corsair` runtime with Gmail and Google Calendar plugins
- `prisma/schema.prisma` models users, email/calendar embeddings, Corsair integration records, plans, payments, and audit events
- `app/api/` exposes endpoints for OAuth connect, Gmail actions, calendar actions, AI commands, and webhooks

## Environment Variables

The app requires the following environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `CORSAIR_KEK` - primary encryption key for `corsair`
- `GOOGLE_OAUTH_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_OAUTH_CLIENT_SECRET` - Google OAuth client secret
- `GOOGLE_REDIRECT_URI` - OAuth redirect URI
- `RESEND_API_KEY` - Resend API key for transactional email
- `SENDER_EMAIL` - sender email address used by Resend
- `NEXTAUTH_URL` - application URL for NextAuth callbacks
- `NEXTAUTH_SECRET` - secret for NextAuth session signing
- `AI_API_KEY` - AI provider key used by OpenRouter
- `AI_GATEWAY_API_KEY` - Vercel AI gateway / OpenAI gateway API key
- `INNGEST_EVENT_KEY` - Inngest event key (optional, defaults to noop locally)

## Local Setup

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file with the required environment variables

3. Initialize the database

```bash
npm run db:generate
npm run db:migrate
```

4. Run the development server

```bash
npm run dev
```

5. Open `http://localhost:3000`

## Database and Prisma

This project uses Prisma with PostgreSQL and the `vector` extension for semantic embeddings.

Important Prisma commands:

- `npm run db:migrate` — apply migrations
- `npm run db:push` — push schema to database
- `npm run db:generate` — generate Prisma client
- `npm run db:studio` — open Prisma Studio
- `npm run db:reset` — reset the database and reapply migrations

## Google Integration Flow

- Users sign in with Google via `next-auth`
- `corsair` stores tenant-specific Gmail and Calendar credentials in PostgreSQL
- `app/api/connect` generates OAuth URLs for Gmail and Calendar plugins
- `app/api/auth` handles the OAuth callback and persists credentials
- The workspace uses `corsair.withTenant(tenantId)` to make Gmail/Calendar API calls

## AI and Semantic Search

- The AI service uses OpenRouter with the `google/gemini-2.5-flash` chat model
- Agent tools support:
  - `listEmails`
  - `sendEmail`
  - `requestEmailDeletion`
  - `listCalendarEvents`
  - `createCalendarEvent`
  - `deleteCalendarEvent`
- Embeddings are generated via OpenRouter and stored as `vector(768)` fields on emails and calendar events
- AI usage limits are enforced using Prisma plan records and `aiUsageCount`

## API Endpoints

- `GET /api/connect?plugin=gmail` — start Gmail OAuth connect flow
- `GET /api/connect?plugin=googlecalendar` — start Calendar OAuth connect flow
- `GET /api/gmail` — fetch Gmail messages
- `POST /api/ai/command` — execute natural language AI commands
- `GET/POST/PATCH/DELETE /api/calendar` — calendar event sync and management
- `POST /api/send` — send welcome email via Resend
- `POST /api/webhooks` — handle incoming webhooks via `corsair`
- `POST /api/ingest` — Inngest event receiver

## Developer Notes

- The home page redirects authenticated users to the connect/dashboard experience
- The connect page shows Gmail and Calendar connection cards
- The workspace supports split-view email inbox, draft compose modal, and calendar event view
- Keyboard shortcuts are defined in `lib/config/shortcuts.ts` and enabled in `InboxContainer`
- Security disclosures and privacy details are built into the connect and privacy pages

## Deploying

Deploy the app with a modern Node.js host or Vercel. Ensure all required environment variables are configured and that PostgreSQL is reachable.

When deploying, enable HTTPS for `NEXTAUTH_URL`, and use a secure `NEXTAUTH_SECRET`.

## License

This repository does not include a license file. Add one if you want to publish or share the project formally.
