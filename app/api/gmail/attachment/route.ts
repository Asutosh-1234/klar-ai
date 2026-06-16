import { NextResponse, NextRequest } from "next/server";
import { getSessionTenantId } from "@/lib/auth/session";
import { corsair } from "@/corsair";

async function getGmailAccessToken(tenantId: string): Promise<string> {
  const gmailCtx = corsair.withTenant(tenantId).gmail;
  const symbols = Object.getOwnPropertySymbols(corsair);
  const internalState = (corsair as any)[symbols[0]];
  const gmailPlugin = internalState.plugins.find((p: any) => p.id === "gmail");
  const keyBuilder = gmailPlugin.keyBuilder;

  const ctxMock = {
    authType: "oauth_2",
    keys: (gmailCtx as any).keys
  };

  return await keyBuilder(ctxMock);
}

export async function GET(request: NextRequest) {
  try {
    const tenantId = await getSessionTenantId(request);
    if (!tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get("messageId");
    const attachmentId = searchParams.get("attachmentId");
    const filename = searchParams.get("filename") || "attachment";

    if (!messageId || !attachmentId) {
      return NextResponse.json({ error: "Missing messageId or attachmentId" }, { status: 400 });
    }

    const accessToken = await getGmailAccessToken(tenantId);

    const apiRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/attachments/${attachmentId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!apiRes.ok) {
      const errorText = await apiRes.text();
      return NextResponse.json(
        { error: `Failed to fetch attachment from Gmail: ${errorText}` },
        { status: apiRes.status }
      );
    }

    const attachmentData = await apiRes.json();
    if (!attachmentData.data) {
      return NextResponse.json({ error: "Attachment data not found" }, { status: 404 });
    }

    // Convert web-safe base64 to standard base64 and decode to binary
    const base64 = attachmentData.data.replace(/-/g, "+").replace(/_/g, "/");
    const buffer = Buffer.from(base64, "base64");

    return new Response(buffer, {
      headers: {
        "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
        "Content-Type": "application/octet-stream",
      },
    });
  } catch (error: unknown) {
    console.error("Error in GET /api/gmail/attachment:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
