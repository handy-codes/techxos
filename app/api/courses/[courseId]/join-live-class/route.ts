import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { LiveClassUserRole } from "@prisma/client";

// Define host roles
const HOST_ROLES = ['ADMIN', 'HEAD_ADMIN', 'LECTURER'] as const;
type HostRole = typeof HOST_ROLES[number];

const isHost = (role: LiveClassUserRole): role is HostRole => {
  return HOST_ROLES.includes(role as HostRole);
};

export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId } = params;

    if (!courseId) {
      return new NextResponse("Course ID is required", { status: 400 });
    }

    // Get user details from Clerk
    let userEmail = "unknown@email.com";
    let userName = "New User";
    
    try {
      const clerkUser = await clerkClient.users.getUser(userId);
      userEmail = clerkUser.emailAddresses[0]?.emailAddress || userEmail;
      userName = clerkUser.firstName && clerkUser.lastName 
        ? `${clerkUser.firstName} ${clerkUser.lastName}`
        : clerkUser.firstName || userName;
    } catch (clerkError) {
      console.error("Error fetching Clerk user details:", clerkError);
    }

    // Find user in our database
    let user = await db.liveClassUser.findFirst({
      where: {
        OR: [
          { clerkUserId: userId },
          { email: userEmail }
        ]
      }
    });

    // If no user found, create one as LEARNER
    if (!user) {
      user = await db.liveClassUser.create({
        data: {
          clerkUserId: userId,
          email: userEmail,
          name: userName,
          role: "LEARNER"
        }
      });
    }

    // For Project Management course, use the environment variables
    if (courseId === "project-mgt") {
      const zoomMeetingId = process.env.ZOOM_PROJECT_MGT_MEETING_ID?.replace(/\s/g, '');
      const zoomPassword = process.env.NEXT_PUBLIC_ZOOM_PROJECT_MGT_MEETING_PASSWORD;

      if (!zoomMeetingId) {
        return new NextResponse("Zoom meeting details not configured", { status: 404 });
      }

      // Check if user has access
      const liveClass = await db.liveClass.findFirst({
        where: {
          title: "Project Management",
          isActive: true
        }
      });

      if (!liveClass) {
        return new NextResponse("No active class found", { status: 404 });
      }

      // Check if user is a host or has purchased the course
      const isUserHost = isHost(user.role);
      const hasPurchase = await db.liveClassPurchase.findFirst({
        where: {
          studentId: user.id,
          liveClassId: liveClass.id,
          isActive: true,
          endDate: { gt: new Date() }
        }
      });

      if (!isUserHost && !hasPurchase) {
        return new NextResponse("You need to purchase this course to join the live class", { status: 403 });
      }

      // Construct the appropriate Zoom URL based on role
      const baseUrl = isUserHost 
        ? `https://zoom.us/s/${zoomMeetingId}`
        : `https://zoom.us/j/${zoomMeetingId}`;
      
      const zoomLink = `${baseUrl}?pwd=${zoomPassword}`;

      // Log attendance
      await db.liveClassAttendance.create({
        data: {
          studentId: user.id,
          liveClassId: liveClass.id,
          status: "PRESENT",
          joinTime: new Date(),
        }
      });

      return NextResponse.json({
        zoomLink,
        zoomMeetingId,
        zoomPassword,
        isHost: isUserHost,
        message: `Successfully ${isUserHost ? 'started' : 'joined'} the live class`
      });
    }

    // For other courses, use the zoomMeetings table
    const course = await db.course.findUnique({
      where: { id: courseId },
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

    if (!course.zoomMeetings || course.zoomMeetings.length === 0) {
      return new NextResponse("No active live class found for this course", { status: 404 });
    }

    const activeZoomMeeting = course.zoomMeetings[0];

    // Check if user has purchased the course
    const purchase = await db.purchase.findFirst({
      where: {
        customerId: userId,
        courseId: courseId,
      }
    });

    // Check if user has demo access
    const demoAccess = await db.mathsDemo.findFirst({
      where: {
        userId: userId,
      }
    });

    if (!isHost(user.role) && !purchase && !demoAccess) {
      return new NextResponse("You need to purchase this course to join the live class", { status: 403 });
    }

    // Log attendance
    await db.liveClassAttendance.create({
      data: {
        studentId: user.id,
        liveClassId: courseId,
        status: "PRESENT",
        joinTime: new Date(),
      }
    });

    // Return the appropriate URL based on role
    const zoomLink = isHost(user.role) ? activeZoomMeeting.zoomLink : activeZoomMeeting.zoomLink;

    return NextResponse.json({
      zoomLink,
      zoomMeetingId: activeZoomMeeting.id,
      isHost: isHost(user.role),
      message: `Successfully ${isHost(user.role) ? 'started' : 'joined'} the live class`
    });

  } catch (error) {
    console.error("[JOIN_LIVE_CLASS] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 