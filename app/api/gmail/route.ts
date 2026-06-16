import { NextResponse, NextRequest } from "next/server";
import { getSessionTenantId } from "@/lib/auth/session";
import { getAllMails, getMessageDetails } from "@/lib/services/gmail.service";

export async function GET(request: NextRequest) {
  try {
    const tenantId = await getSessionTenantId(request);
    if (!tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || undefined;
    const maxResults = searchParams.get("maxResults") ? parseInt(searchParams.get("maxResults")!) : 20;

    const messages = await getAllMails({ 
      userId: "me",
      tenentId: tenantId, 
      q, 
      maxResults,
      includeSpamTrash: true,
      labelIds: ["INBOX"]
    });

    if (!messages || messages.length === 0) {
      return NextResponse.json({ messages: [] });
    }

    const enrichedMessages = await Promise.all(
      messages.map(async (msg: { id?: string | null; threadId?: string | null }) => {
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
      messages: enrichedMessages.filter(Boolean),
      connected: true
    });
  } catch (error: any) {
    const isAuthMissing =
      error?.name === "AuthMissingError" ||
      error?.message?.includes("auth-missing") ||
      error?.pluginId === "gmail" ||
      (typeof error === "object" && error !== null && "pluginId" in error);

    if (isAuthMissing) {
      return NextResponse.json({ messages: [], connected: false });
    }

    console.error("Error in GET /api/gmail:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
