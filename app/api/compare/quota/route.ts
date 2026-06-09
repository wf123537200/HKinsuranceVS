import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const quota = await prisma.compareQuota.findUnique({
      where: {
        userId_date: {
          userId: session.user.id,
          date: today,
        },
      },
    });

    const freeUsed = quota?.freeQuotaUsed ?? 0;
    const adRewardQuota = quota?.adRewardQuota ?? 0;
    const adRewardUsed = quota?.adRewardUsed ?? 0;

    return NextResponse.json({
      freeQuota: 3,
      freeUsed,
      freeRemaining: Math.max(0, 3 - freeUsed),
      adRewardQuota,
      adRewardUsed,
      adRewardRemaining: Math.max(0, adRewardQuota - adRewardUsed),
      totalRemaining: Math.max(0, 3 - freeUsed + adRewardQuota - adRewardUsed),
    });
  } catch (error) {
    console.error("Quota check error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
