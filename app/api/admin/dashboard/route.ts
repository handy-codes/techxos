import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId: clerkUserId } = auth();

    if (!clerkUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is admin
    const user = await db.liveClassUser.findFirst({
      where: {
        clerkUserId: clerkUserId,
        role: {
          in: ["HEAD_ADMIN", "ADMIN", "LECTURER"]
        }
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
      db.liveClassSchedule.count({ where: { isRecurring: true } }),
      db.liveClassPurchase.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          status: "COMPLETED"
        }
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