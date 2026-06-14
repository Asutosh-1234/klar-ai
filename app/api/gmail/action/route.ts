import { NextResponse, NextRequest } from "next/server";
import { getSessionTenantId } from "@/lib/auth/session";
import { corsair } from "@/corsair";

export async function POST(request: NextRequest) {
  try {
    const tenantId = await getSessionTenantId(request);
    if (!tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { messageId, action } = body;

    if (!messageId || !action) {
      return NextResponse.json({ error: "Missing messageId or action" }, { status: 400 });
    }

    const client = corsair.withTenant(tenantId);

    if (action === "archive") {
      await client.gmail.api.messages.modify({
        id: messageId,
        removeLabelIds: ["INBOX"]
      });
    } else if (action === "delete") {
      await client.gmail.api.messages.trash({
        id: messageId
      });
    } else if (action === "markRead") {
      await client.gmail.api.messages.modify({
        id: messageId,
        removeLabelIds: ["UNREAD"]
      });
    } else if (action === "markUnread") {
      await client.gmail.api.messages.modify({
        id: messageId,
        addLabelIds: ["UNREAD"]
      });
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error in POST /api/gmail/action:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
