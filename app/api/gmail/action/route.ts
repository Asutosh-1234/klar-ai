import { NextResponse, NextRequest } from "next/server";
import { getSessionTenantId } from "@/lib/auth/session";
import { modifyMessage, trashMessage } from "@/lib/services/gmail.service";

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

    if (action === "archive") {
      await modifyMessage(tenantId, messageId, {
        removeLabelIds: ["INBOX"]
      });
    } else if (action === "delete") {
      await trashMessage(tenantId, messageId);
    } else if (action === "markRead") {
      await modifyMessage(tenantId, messageId, {
        removeLabelIds: ["UNREAD"]
      });
    } else if (action === "markUnread") {
      await modifyMessage(tenantId, messageId, {
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
