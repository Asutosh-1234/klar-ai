import { NextRequest, NextResponse } from "next/server";
import { handleWebhook } from "@/lib/config/webhook-handler";

export async function POST(request: NextRequest) {
  try {
    const responseBody = await handleWebhook(request);
    return NextResponse.json(responseBody || { success: true });
  } catch (error: any) {
    console.error("Webhook endpoint error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
