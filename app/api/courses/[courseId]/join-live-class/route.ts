import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { LiveClassUserRole } from "@prisma/client";

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

    // Find the course
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

    // Check if the course has an active zoom meeting
    if (!course.zoomMeetings || course.zoomMeetings.length === 0) {
      return new NextResponse("No active live class found for this course", { status: 404 });
    }

    // Find user in our database
    let user = await db.liveClassUser.findUnique({
      where: { clerkUserId: userId },
    });

    // If user doesn't exist in our database but is authenticated with Clerk, check if email exists
    if (!user) {
      const existingUserByEmail = await db.liveClassUser.findUnique({
        where: { email: userEmail }
      });
      
      if (existingUserByEmail) {
        // Update the existing user with the Clerk ID
        user = await db.liveClassUser.update({
          where: { id: existingUserByEmail.id },
          data: { clerkUserId: userId }
        });
      } else {
        // Create a new user
        user = await db.liveClassUser.create({
          data: {
            clerkUserId: userId,
            email: userEmail,
            name: userName,
            role: "LEARNER"
          }
        });
      }
    }

    // Check if the user is an admin or lecturer
    const isAdminOrLecturer = user.role === LiveClassUserRole.ADMIN || 
                             user.role === LiveClassUserRole.HEAD_ADMIN || 
                             user.role === LiveClassUserRole.LECTURER;

    // Check if the user has purchased the course in the regular purchase table
    const purchase = await db.purchase.findFirst({
      where: {
        customerId: userId,
        courseId: courseId,
      }
    });

    // Check if the user has purchased the course in the liveClassPurchase table
    // For Project Management course, we need to find the liveClass first
    let liveClassPurchase = null;
    
    if (courseId === "project-mgt") {
      // Find the Project Management live class
      const liveClass = await db.liveClass.findFirst({
        where: {
          title: "Project Management",
          isActive: true,
        }
      });
      
      if (liveClass) {
        liveClassPurchase = await db.liveClassPurchase.findFirst({
          where: {
            studentId: user.id,
            liveClassId: liveClass.id,
            isActive: true,
            endDate: { gt: new Date() }
          }
        });
      }
    }

    // Grant access if user is admin/lecturer or has purchased the course
    if (!isAdminOrLecturer && !purchase && !liveClassPurchase) {
      return new NextResponse("You need to purchase this course to join the live class", { status: 403 });
    }

    // Get the active zoom meeting
    const activeZoomMeeting = course.zoomMeetings[0];

    // Log the attendance
    await db.liveClassAttendance.create({
      data: {
        userId: user.id,
        liveClassId: courseId, // Using courseId as liveClassId for simplicity
        status: "PRESENT",
        joinTime: new Date(),
      }
    });

    // Return the zoom link
    return NextResponse.json({
      zoomLink: activeZoomMeeting.zoomLink,
      message: "Successfully joined the live class"
    });
  } catch (error) {
    console.error("[JOIN_LIVE_CLASS] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 