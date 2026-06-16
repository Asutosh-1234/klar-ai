import { NextResponse, NextRequest } from "next/server";
import { getSessionTenantId } from "@/lib/auth/session";
import { getArchivedMails, getMessageDetails, removeFromArchive } from "@/lib/services/gmail.service";

export async function GET(request: NextRequest) {
  try {
    const tenantId = await getSessionTenantId(request);
    if (!tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || undefined;
    const maxResults = searchParams.get("maxResults") ? parseInt(searchParams.get("maxResults")!) : 20;

    // Call service to get archived message list
    const messages = await getArchivedMails({ 
      tenentId: tenantId, 
      q, 
      maxResults 
    });

    if (!messages || messages.length === 0) {
      return NextResponse.json({ messages: [] });
    }

    // Enrich messages by fetching full detail for each message
    const enrichedMessages = await Promise.all(
      messages.map(async (msg: { id?: string | null }) => {
        if (!msg.id) return null;
        try {
          const fullMsg = await getMessageDetails(tenantId, msg.id);
          return fullMsg;
        } catch (err) {
          console.error(`Failed to get details for message ${msg.id}:`, err);
          return msg;
        }
      })
    );

    return NextResponse.json({
      messages: enrichedMessages.filter(Boolean)
    });
  } catch (error: unknown) {
    console.error("Error in GET /api/gmail/archive:", error);
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

    const body = await request.json();
    const { messageIds } = body;

    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      return NextResponse.json({ error: "Missing or invalid messageIds" }, { status: 400 });
    }

    await removeFromArchive(tenantId, messageIds);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error in POST /api/gmail/archive:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
