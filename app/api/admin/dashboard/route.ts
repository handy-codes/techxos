import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is HEAD_ADMIN
    const user = await db.liveClassUser.findFirst({
      where: {
        userId: userId,
        role: "HEAD_ADMIN",
      },
    });

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch dashboard statistics
    const [
      totalUsers,
      totalClasses,
      totalSchedules,
      totalRevenue,
    ] = await Promise.all([
      db.liveClassUser.count(),
      db.liveClass.count(),
      db.liveClassSchedule.count(),
      db.liveClassPurchase.aggregate({
        _sum: {
          amount: true,
        },
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      totalClasses,
      totalSchedules,
      totalRevenue: totalRevenue._sum.amount || 0,
    });
  } catch (error) {
    console.error("[DASHBOARD_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 