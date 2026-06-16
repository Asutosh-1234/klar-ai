import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authProvider } from "@/lib/auth/config";
import { executeAiCommand } from "@/lib/services/ai.service";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authProvider);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { command } = await request.json();
    if (!command || !command.trim()) {
      return NextResponse.json({ error: "Command is required" }, { status: 400 });
    }

    const userId = session.user.id;
    const tenantId = `usr_${userId}`;

    const result = await executeAiCommand({
      userId,
      tenantId,
      command,
      userEmail: session.user.email || undefined,
      userName: session.user.name || undefined,
      userAvatar: session.user.image || undefined,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in POST /api/ai/command:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Check if error is plan limit exceeded
    if (errorMessage.includes("limit exceeded")) {
      return NextResponse.json({ error: errorMessage, limitExceeded: true }, { status: 403 });
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
