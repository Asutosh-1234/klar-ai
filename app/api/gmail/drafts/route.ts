import { NextResponse, NextRequest } from "next/server";
import { getSessionTenantId } from "@/app/lib/auth/session";
import { getAllDraftMails } from "@/app/lib/services/gmail.service";
import { corsair } from "@/corsair";
import { createDraftSchema } from "@/app/lib/validations/draft";

export async function GET(request: NextRequest) {
  try {
    const tenantId = await getSessionTenantId(request);
    if (!tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const drafts = await getAllDraftMails(tenantId);
    if (!drafts || drafts.length === 0) {
      return NextResponse.json({ drafts: [] });
    }

    // Enrich drafts by fetching full details for each
    const client = corsair.withTenant(tenantId);
    const enrichedDrafts = await Promise.all(
      drafts.map(async (draft: { id?: string | null }) => {
        if (!draft.id) return null;
        try {
          const fullDraft = await client.gmail.api.drafts.get({ id: draft.id });
          return fullDraft;
        } catch (err) {
          console.error(`Failed to get details for draft ${draft.id}:`, err);
          return draft;
        }
      })
    );

    return NextResponse.json({
      drafts: enrichedDrafts.filter(Boolean)
    });
  } catch (error: unknown) {
    console.error("Error in GET /api/gmail/drafts:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const tenantId = await getSessionTenantId(request);
    if (!tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bodyJson = await request.json();
    const result = createDraftSchema.safeParse(bodyJson);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { to, subject, body, threadId } = result.data;

    // Create raw MIME message
    const mimeMessage = [
      `To: ${to}`,
      `Subject: =?utf-8?B?${Buffer.from(subject).toString("base64")}?=`,
      'Content-Type: text/html; charset="UTF-8"',
      'MIME-Version: 1.0',
      '',
      body
    ].join('\r\n');

    // Convert to Base64Url
    const raw = Buffer.from(mimeMessage)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const client = corsair.withTenant(tenantId);
    const draft = await client.gmail.api.drafts.create({
      draft: {
        message: {
          raw,
          threadId: threadId || undefined
        }
      }
    });

    return NextResponse.json({ success: true, draft });
  } catch (error: unknown) {
    console.error("Error in POST /api/gmail/drafts:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
