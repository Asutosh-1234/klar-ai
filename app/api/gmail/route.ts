import { NextResponse, NextRequest } from "next/server";
import { getSessionTenantId } from "@/app/lib/auth/session";
import { getAllMails } from "@/app/lib/services/gmail.service";
import { corsair } from "@/corsair";

export async function GET(request: NextRequest) {
  try {
    const tenantId = await getSessionTenantId(request);
    if (!tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || undefined;
    const maxResults = searchParams.get("maxResults") ? parseInt(searchParams.get("maxResults")!) : 20;

    // Call service to get message list
    const messages = await getAllMails({ 
      tenentId: tenantId, 
      q, 
      maxResults 
    });

    if (!messages || messages.length === 0) {
      return NextResponse.json({ messages: [] });
    }

    // Enrich messages by fetching full detail for each message
    const client = corsair.withTenant(tenantId);
    const enrichedMessages = await Promise.all(
      messages.map(async (msg: { id?: string | null; threadId?: string | null }) => {
        if (!msg.id) return null;
        try {
          const fullMsg = await client.gmail.api.messages.get({ id: msg.id });
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
    console.error("Error in GET /api/gmail:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
