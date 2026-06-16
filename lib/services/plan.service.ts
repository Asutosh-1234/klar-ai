import { prisma } from "@/lib/config/prisma";

export interface AssignPlanInput {
  userId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  limits?: any;
  payment?: {
    amount: number;
    currency?: string;
    paymentMethod?: string;
    transactionId?: string;
    billingAddress?: string;
    cardBrand?: string;
    cardLast4?: string;
    receiptUrl?: string;
    metadata?: any;
  };
}

/**
 * Assigns a subscription plan to a user with validation that the new plan's starting time
 * is strictly after the ending time of the user's last plan.
 */
export async function assignUserPlan(input: AssignPlanInput) {
  const { userId, planId, startDate, endDate, limits, payment } = input;

  if (startDate >= endDate) {
    throw new Error("Plan starting time must be before ending time.");
  }

  return await prisma.$transaction(async (tx) => {
    // Verify user exists
    const user = await tx.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new Error(`User with ID "${userId}" does not exist.`);
    }

    // Verify plan template exists
    const planTemplate = await tx.plan.findUnique({
      where: { id: planId },
    });
    if (!planTemplate) {
      throw new Error(`Plan template with ID "${planId}" does not exist.`);
    }

    // Get the user's latest plan by endDate
    const latestUserPlan = await tx.userPlan.findFirst({
      where: { userId },
      orderBy: { endDate: "desc" },
    });

    // Enforce overlapping rule
    if (latestUserPlan) {
      if (startDate <= latestUserPlan.endDate) {
        throw new Error(
          `Overlapping plan detected: The starting time (${startDate.toISOString()}) of the new plan must be after the ending time (${latestUserPlan.endDate.toISOString()}) of the user's last plan.`
        );
      }
    }

    // Merge template limits with any custom overrides
    const mergedLimits = {
      ...(planTemplate.limits as Record<string, any> || {}),
      ...(limits || {}),
    };

    // Create the UserPlan record
    const userPlan = await tx.userPlan.create({
      data: {
        userId,
        planId,
        planName: planTemplate.name,
        startDate,
        endDate,
        limits: mergedLimits,
      },
    });

    // Record associated payment and details if provided
    let createdPayment = null;
    if (payment) {
      createdPayment = await tx.payment.create({
        data: {
          userPlanId: userPlan.id,
          amount: payment.amount,
          currency: payment.currency || "USD",
          status: "COMPLETED",
          paymentMethod: payment.paymentMethod,
          transactionId: payment.transactionId,
          paymentDetails: {
            create: {
              billingAddress: payment.billingAddress,
              cardBrand: payment.cardBrand,
              cardLast4: payment.cardLast4,
              receiptUrl: payment.receiptUrl,
              metadata: payment.metadata || {},
            },
          },
        },
        include: {
          paymentDetails: true,
        },
      });
    }

    return {
      userPlan,
      payment: createdPayment,
    };
  });
}
