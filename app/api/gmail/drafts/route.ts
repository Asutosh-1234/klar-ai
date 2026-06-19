import { NextResponse, NextRequest } from "next/server";
import { getSessionTenantId } from "@/lib/auth/session";
import { getAllDraftMails, getDraftDetails, createDraft, updateDraft } from "@/lib/services/gmail.service";
import { createDraftSchema } from "@/lib/validations/draft";

export async function GET(request: NextRequest) {
  try {
    const tenantId = await getSessionTenantId(request);
    if (!tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (id) {
      const draft = await getDraftDetails(tenantId, id, "full");
      return NextResponse.json(draft);
    }

    const drafts = await getAllDraftMails(tenantId);
    if (!drafts || drafts.length === 0) {
      return NextResponse.json({ drafts: [] });
    }

    // Enrich drafts by fetching metadata details for each
    const enrichedDrafts = await Promise.all(
      drafts.map(async (draft: { id?: string | null }) => {
        if (!draft.id) return null;
        try {
          const fullDraft = await getDraftDetails(tenantId, draft.id, "metadata");
          return fullDraft;
        } catch (err) {
          console.error(`Failed to get details for draft ${draft.id}:`, err);
          return draft;
        }
      })
    );

    const finalDrafts = enrichedDrafts.filter(Boolean);

    return NextResponse.json({
      drafts: finalDrafts.map((d: any) => ({
        id: d.id,
        message: {
          id: d.message?.id,
          threadId: d.message?.threadId,
          labelIds: d.message?.labelIds,
          snippet: d.message?.snippet,
          internalDate: d.message?.internalDate,
          payload: {
            headers: d.message?.payload?.headers || []
          }
        }
      }))
    });
  } catch (error: unknown) {
    console.error("Error in GET /api/gmail/drafts:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const tenantId = await getSessionTenantId(request);
    if (!tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bodyJson = await request.json();
    const { draftId, to, subject, body, attachments } = bodyJson;

    if (!draftId) {
      return NextResponse.json({ error: "Missing draftId" }, { status: 400 });
    }

    // Create raw MIME message
    let mimeMessage = "";
    if (attachments && attachments.length > 0) {
      const boundary = "----=_Part_" + Date.now().toString(16);
      const headers = [
        `To: ${to}`,
        `Subject: =?utf-8?B?${Buffer.from(subject).toString("base64")}?=`,
        `Content-Type: multipart/mixed; boundary="${boundary}"`,
        'MIME-Version: 1.0',
        ''
      ];

      const bodyPart = [
        `--${boundary}`,
        'Content-Type: text/html; charset="UTF-8"',
        'Content-Transfer-Encoding: 7bit',
        '',
        body,
        ''
      ];

      const attachmentParts = attachments.map((att: any) => {
        const wrappedContent = att.content.replace(/(.{76})/g, "$1\r\n");
        return [
          `--${boundary}`,
          `Content-Type: ${att.mimeType}; name="${att.filename}"`,
          `Content-Disposition: attachment; filename="${att.filename}"`,
          'Content-Transfer-Encoding: base64',
          '',
          wrappedContent,
          ''
        ].join('\r\n');
      });

      const footer = `--${boundary}--`;

      mimeMessage = [
        ...headers,
        ...bodyPart,
        ...attachmentParts,
        footer
      ].join('\r\n');
    } else {
      mimeMessage = [
        `To: ${to}`,
        `Subject: =?utf-8?B?${Buffer.from(subject).toString("base64")}?=`,
        'Content-Type: text/html; charset="UTF-8"',
        'MIME-Version: 1.0',
        '',
        body
      ].join('\r\n');
    }

    // Convert to Base64Url
    const raw = Buffer.from(mimeMessage)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const draft = await updateDraft(tenantId, draftId, raw);

    return NextResponse.json({ success: true, draft });
  } catch (error: unknown) {
    console.error("Error in PUT /api/gmail/drafts:", error);
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

    const { to, subject, body, threadId, attachments } = result.data;

    // Create raw MIME message
    let mimeMessage = "";
    if (attachments && attachments.length > 0) {
      const boundary = "----=_Part_" + Date.now().toString(16);
      const headers = [
        `To: ${to}`,
        `Subject: =?utf-8?B?${Buffer.from(subject).toString("base64")}?=`,
        `Content-Type: multipart/mixed; boundary="${boundary}"`,
        'MIME-Version: 1.0',
        ''
      ];

      const bodyPart = [
        `--${boundary}`,
        'Content-Type: text/html; charset="UTF-8"',
        'Content-Transfer-Encoding: 7bit',
        '',
        body,
        ''
      ];

      const attachmentParts = attachments.map((att) => {
        // Wrap base64 text at 76 characters per line (standard MIME specification)
        const wrappedContent = att.content.replace(/(.{76})/g, "$1\r\n");
        return [
          `--${boundary}`,
          `Content-Type: ${att.mimeType}; name="${att.filename}"`,
          `Content-Disposition: attachment; filename="${att.filename}"`,
          'Content-Transfer-Encoding: base64',
          '',
          wrappedContent,
          ''
        ].join('\r\n');
      });

      const footer = `--${boundary}--`;

      mimeMessage = [
        ...headers,
        ...bodyPart,
        ...attachmentParts,
        footer
      ].join('\r\n');
    } else {
      mimeMessage = [
        `To: ${to}`,
        `Subject: =?utf-8?B?${Buffer.from(subject).toString("base64")}?=`,
        'Content-Type: text/html; charset="UTF-8"',
        'MIME-Version: 1.0',
        '',
        body
      ].join('\r\n');
    }

    // Convert to Base64Url
    const raw = Buffer.from(mimeMessage)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const draft = await createDraft(tenantId, raw, threadId);

    return NextResponse.json({ success: true, draft });
  } catch (error: unknown) {
    console.error("Error in POST /api/gmail/drafts:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
