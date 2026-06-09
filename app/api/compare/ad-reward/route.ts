import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let quota = await prisma.compareQuota.findUnique({
      where: {
        userId_date: {
          userId: session.user.id,
          date: today,
        },
      },
    });

    if (!quota) {
      quota = await prisma.compareQuota.create({
        data: {
          userId: session.user.id,
          date: today,
        },
      });
    }

    // Add 1 ad reward quota
    await prisma.compareQuota.update({
      where: { id: quota.id },
      data: {
        adRewardQuota: { increment: 1 },
      },
    });

    return NextResponse.json({
      success: true,
      message: "1 additional comparison added!",
      remaining: 3 - quota.freeQuotaUsed + (quota.adRewardQuota + 1) - quota.adRewardUsed,
    });
  } catch (error) {
    console.error("Ad reward error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
