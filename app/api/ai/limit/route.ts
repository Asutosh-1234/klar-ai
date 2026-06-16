import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authProvider } from "@/lib/auth/config";
import { checkAiLimit } from "@/lib/services/ai.service";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authProvider);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const limitInfo = await checkAiLimit(
      userId,
      session.user.email || undefined,
      session.user.name || undefined,
      session.user.image || undefined
    );
    return NextResponse.json({
      planName: limitInfo.planName,
      limit: limitInfo.limit,
      used: limitInfo.usageCount,
    });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    try {
      const { prisma } = await import("@/lib/config/prisma");
      const activePlan = await prisma.userPlan.findFirst({
        where: {
          userId,
          startDate: { lte: new Date() },
          endDate: { gte: new Date() },
        },
      });
      let limit = 5;
      let planName = "Free / Basic";
      if (activePlan) {
        planName = activePlan.planName;
        if (planName === "Executive") {
          limit = 100;
        } else if (planName === "Professional") {
          limit = 20;
        }
      }
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { aiUsageCount: true },
      });
      return NextResponse.json({
        planName,
        limit,
        used: user?.aiUsageCount || 0,
      });
    } catch {
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
  }
}
