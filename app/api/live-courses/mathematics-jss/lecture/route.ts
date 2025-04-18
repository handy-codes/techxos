import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { LiveClassUserRole, Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    const clerkUser = await currentUser();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get or create user role
    let user = await db.liveClassUser.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user && clerkUser) {
      const userEmail = clerkUser.emailAddresses[0]?.emailAddress || "";
      const userName = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();
      
      try {
        // Try to create a new user
        user = await db.liveClassUser.create({
          data: {
            clerkUserId: userId,
            email: userEmail,
            name: userName,
            role: LiveClassUserRole.LEARNER,
            isActive: true
          }
        });
      } catch (error) {
        // Handle unique constraint violation (email already exists)
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          console.log("[LECTURE_GET] User with this email already exists, updating with Clerk ID");
          
          // Find the user by email and update with Clerk ID
          user = await db.liveClassUser.update({
            where: { email: userEmail },
            data: { 
              clerkUserId: userId,
              name: userName || undefined // Only update name if it's not empty
            }
          });
        } else {
          // Re-throw other errors
          throw error;
        }
      }
    }

    if (!user) {
      return new NextResponse("Failed to create user account", { status: 500 });
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
      console.error("[LECTURE_GET] Course not found: mathematics-jss");
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
            id: "lecture-1",
            date: formatDate(activeZoomMeeting?.startTime),
            recordingUrl: null,
            title: course.title,
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
        startTime: formatDate(activeZoomMeeting?.startTime),
        endTime: formatDate(activeZoomMeeting?.startTime ? new Date(new Date(activeZoomMeeting.startTime).getTime() + (activeZoomMeeting.duration || 60) * 60000) : null),
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
      studentEmail: clerkUser?.emailAddresses?.[0]?.emailAddress || user.email || "",
      studentName: clerkUser?.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim() : user.name || "Student",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[LECTURE_GET] Internal error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 



