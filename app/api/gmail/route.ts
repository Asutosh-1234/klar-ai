import { NextResponse, NextRequest } from "next/server";
import { getSessionTenantId } from "@/lib/auth/session";
import { getAllMails, getMessageDetails, searchMailsFromDb } from "@/lib/services/gmail.service";

export async function GET(request: NextRequest) {
  try {
    const tenantId = await getSessionTenantId(request);
    if (!tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || undefined;
    const maxResults = searchParams.get("maxResults") ? parseInt(searchParams.get("maxResults")!) : 20;

    let labelIds: string[] | undefined = ["INBOX"];
    if (q && (q.includes("label:SENT") || q.includes("in:sent") || q.includes("is:starred") || q.includes("label:TRASH") || q.includes("label:SPAM"))) {
      labelIds = undefined;
    }

    const explicitDb = searchParams.get("db");

    // Read the last active status cookie
    const cookieVal = request.cookies.get("last_active_status")?.value;
    let useDb = false;
    let shouldUpdateCookie = false;

    if (cookieVal) {
      const lastActiveTime = parseInt(cookieVal, 10);
      if (!isNaN(lastActiveTime) && Date.now() - lastActiveTime < 5 * 60 * 1000) {
        useDb = true;
      } else {
        useDb = false;
        shouldUpdateCookie = true;
      }
    } else {
      useDb = false;
      shouldUpdateCookie = true;
    }

    // Allow explicit override if query params specify db
    if (explicitDb !== null) {
      useDb = explicitDb === "true";
    }

    let finalMessages: any[];

    if (useDb) {
      finalMessages = await searchMailsFromDb(tenantId, q);
    } else {
      const messages = await getAllMails({ 
        userId: "me",
        tenentId: tenantId, 
        q, 
        maxResults,
        includeSpamTrash: true,
        labelIds
      });

      if (!messages || messages.length === 0) {      
        finalMessages = [];
      } else {
        // Load existing messages from the database to map and avoid redundant network requests
        const dbMails = await searchMailsFromDb(tenantId);
        const dbMailsMap = new Map<string, any>();
        for (const mail of dbMails) {
          if (mail.id) {
            dbMailsMap.set(mail.id, mail);
          }
        }

        const enrichedMessages = await Promise.all(
          messages.map(async (msg: { id?: string | null; threadId?: string | null }) => {
            if (!msg.id) return null;
            try {
              // Retrieve from DB cache if metadata (headers) exists
              if (dbMailsMap.has(msg.id)) {
                const dbMsg = dbMailsMap.get(msg.id);
                if (dbMsg.labelIds && dbMsg.payload?.headers) {
                  const isTrash = dbMsg.labelIds.includes("TRASH");
                  const isSpam = dbMsg.labelIds.includes("SPAM");
                  const isTrashQuery = q && (q.includes("label:TRASH") || q.includes("in:trash"));
                  const isSpamQuery = q && (q.includes("label:SPAM") || q.includes("in:spam"));

                  if (isTrash && !isTrashQuery) return null;
                  if (isSpam && !isSpamQuery) return null;
                  return dbMsg;
                }
              }

              const fullMsg = await getMessageDetails(tenantId, msg.id, "metadata");
              if (fullMsg && fullMsg.labelIds) {
                const isTrash = fullMsg.labelIds.includes("TRASH");
                const isSpam = fullMsg.labelIds.includes("SPAM");
                const isTrashQuery = q && (q.includes("label:TRASH") || q.includes("in:trash"));
                const isSpamQuery = q && (q.includes("label:SPAM") || q.includes("in:spam"));

                if (isTrash && !isTrashQuery) return null;
                if (isSpam && !isSpamQuery) return null;
              }
              return fullMsg;
            } catch (err) {
              console.error(`Failed to get details for message ${msg.id}:`, err);
              return msg;
            }
          })
        );
        finalMessages = enrichedMessages.filter(Boolean);
      }
    }

    const response = NextResponse.json({
      messages: finalMessages.map((msg: any) => ({
        id: msg.id,
        threadId: msg.threadId,
        labelIds: msg.labelIds,
        snippet: msg.snippet,
        internalDate: msg.internalDate,
        payload: {
          headers: msg.payload?.headers || []
        }
      })),
      connected: true
    });

    if (shouldUpdateCookie || !cookieVal) {
      response.cookies.set("last_active_status", Date.now().toString(), {
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
        sameSite: "lax",
      });
    }

    return response;
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
