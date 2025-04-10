import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // First check if user is an admin or lecturer
    const user = await db.liveClassUser.findUnique({
      where: { id: userId }
    });

    // Debug logging
    console.log("User details:", {
      userId,
      user,
      userRole: user?.role,
      userEmail: user?.email
    });

    // If user is HEAD_ADMIN, ADMIN, or LECTURER, they have access without purchase
    if (user?.role === "HEAD_ADMIN" || user?.role === "ADMIN" || user?.role === "LECTURER") {
      console.log("User has admin/lecturer access:", user.role);
      return NextResponse.json({
        lecture: {
          zoomLink: process.env.ZOOM_PROJECT_MGT_MEETING_URL,
          zoomMeetingId: process.env.ZOOM_PROJECT_MGT_MEETING_ID
        },
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
      lecture: {
        zoomLink: process.env.ZOOM_PROJECT_MGT_MEETING_URL,
        zoomMeetingId: process.env.ZOOM_PROJECT_MGT_MEETING_ID
      },
      hasAccess: !!hasPurchase,
      role: user?.role || "LEARNER"
    });
  } catch (error) {
    console.error("[LECTURE_GET]", error);
    return NextResponse.json({
      lecture: null,
      hasAccess: false,
      error: "Failed to fetch lecture details"
    }, { status: 500 });
  }
} 