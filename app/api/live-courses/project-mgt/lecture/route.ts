import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // First check if user is an admin
    const user = await db.liveClassUser.findUnique({
      where: { id: userId }
    });

    // If user is HEAD_ADMIN or ADMIN, they have access
    if (user?.role === "HEAD_ADMIN" || user?.role === "ADMIN") {
      return NextResponse.json({
        lecture: null,
        hasAccess: true,
        role: user.role
      });
    }

    // For regular users, check if they have an active purchase
    const liveClass = await db.liveClass.findFirst({
      where: { 
        title: "Project Management",
        isActive: true,
        endTime: {
          gt: new Date()
        }
      },
      include: {
        materials: true,
        schedules: true
      }
    });

    if (!liveClass) {
      return new NextResponse("No active class found", { status: 404 });
    }

    const hasPurchase = await db.liveClassPurchase.findFirst({
      where: {
        studentId: userId,
        liveClassId: liveClass.id,
        isActive: true,
        endDate: {
          gt: new Date()
        }
      }
    });

    return NextResponse.json({
      lecture: liveClass,
      hasAccess: !!hasPurchase,
      role: user?.role || "LEARNER"
    });
  } catch (error) {
    console.error("[LECTURE_GET]", error);
    // Return a more graceful error response
    return NextResponse.json({
      lecture: null,
      hasAccess: false,
      error: "Failed to fetch lecture details"
    }, { status: 500 });
  }
} 