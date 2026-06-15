import { NextResponse, NextRequest } from "next/server";
import { getSessionTenantId } from "@/lib/auth/session";
import { sendDraft } from "@/lib/services/gmail.service";

export async function POST(request: NextRequest) {
  try {
    const tenantId = await getSessionTenantId(request);
    if (!tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { draftId } = await request.json();
    if (!draftId) {
      return NextResponse.json({ error: "Missing draftId" }, { status: 400 });
    }

    const result = await sendDraft(tenantId, draftId);

    return NextResponse.json({ success: true, result });
  } catch (error: unknown) {
    console.error("Error in POST /api/gmail/drafts/send:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
