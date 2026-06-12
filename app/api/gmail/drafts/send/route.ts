import { NextResponse, NextRequest } from "next/server";
import { getSessionTenantId } from "@/app/lib/auth/session";
import { corsair } from "@/corsair";

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

    const client = corsair.withTenant(tenantId);
    const result = await client.gmail.api.drafts.send({
      id: draftId
    });

    return NextResponse.json({ success: true, result });
  } catch (error: unknown) {
    console.error("Error in POST /api/gmail/drafts/send:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
