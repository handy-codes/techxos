import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { LiveClassUserRole } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user role
    const user = await db.liveClassUser.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const userRole = user.role;
    const isHost = (role: LiveClassUserRole) => 
      role === LiveClassUserRole.HEAD_ADMIN || 
      role === LiveClassUserRole.ADMIN || 
      role === LiveClassUserRole.LECTURER;

    // Get course details
    const course = await db.course.findUnique({
      where: { id: "mathematics-jss" },
      include: {
        zoomMeetings: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    // Check if user has purchased the course
    const purchase = await db.purchase.findFirst({
      where: {
        customerId: userId,
        courseId: course.id,
      }
    });

    // Check if user has demo access
    const demoAccess = await db.mathsDemo.findFirst({
      where: {
        userId: userId,
      }
    });

    const hasAccess = isHost(userRole) || purchase || demoAccess;

    // Get active zoom meeting
    const activeZoomMeeting = course.zoomMeetings[0];

    // Return course lecture details in the expected format
    const formatDate = (date: Date | null) => {
      if (!date) return null;
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const response = {
      lecture: {
        id: course.id,
        zoomLink: activeZoomMeeting?.zoomLink || null,
        lectures: [
          {
            id: activeZoomMeeting?.id || "",
            title: "Mathematics JSS Live Class",
            date: formatDate(activeZoomMeeting?.createdAt),
            recordingUrl: null,
            isRecorded: false
          }
        ]
      },
      hasAccess,
      role: userRole,
      lecturer: {
        name: "Instructor",
        email: "",
      },
      courseDetails: {
        title: course.title,
        description: course.description,
        startTime: formatDate(activeZoomMeeting?.createdAt),
        endTime: formatDate(activeZoomMeeting?.createdAt ? new Date(new Date(activeZoomMeeting.createdAt).getTime() + 60 * 60000) : null),
        zoomMeetingId: activeZoomMeeting?.id,
        zoomPassword: ""
      },
      materials: [
        {
          title: "Getting Started with Mathematics",
          url: "/materials/mathematics-intro.pdf",
          type: "pdf"
        }
      ],
      studentEmail: user?.email,
      studentName: user?.name || "Student",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[LECTURE_GET] Internal error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 



