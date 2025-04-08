import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { LiveClassUserRole } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { userId: clerkUserId } = auth();

    if (!clerkUserId) {
      console.error("[LECTURE_GET] Unauthorized access attempt");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find user using Clerk user ID
    let user = await db.liveClassUser.findUnique({
      where: { clerkUserId },
    });

    // If user doesn't exist in our database but is authenticated with Clerk, create it
    if (!user) {
      console.log("[LECTURE_GET] User not found, creating user record for:", clerkUserId);
      try {
        // Try to get user email from authentication
        const authInfo = auth();
        
        // Create a basic user record
        user = await db.liveClassUser.create({
          data: {
            clerkUserId,
            email: authInfo.sessionClaims?.email || "unknown@email.com",
            name: authInfo.sessionClaims?.name || "New User",
            role: LiveClassUserRole.LEARNER,
            isActive: true
          }
        });
        console.log("[LECTURE_GET] Created new user:", user.id);
      } catch (userCreateError) {
        console.error("[LECTURE_GET] Error creating user:", userCreateError);
        return new NextResponse("Could not create user record", { status: 500 });
      }
    }

    // Find the Project Management course
    let liveClass = await db.liveClass.findFirst({
      where: {
        title: "Project Management",
        isActive: true,
      },
      include: {
        lecturer: true,
      }
    });

    // If course doesn't exist, create it
    if (!liveClass) {
      console.log("[LECTURE_GET] Project Management course not found, creating it");
      try {
        // Create a default lecturer if needed
        let defaultLecturer = await db.liveClassUser.findFirst({
          where: { role: LiveClassUserRole.LECTURER }
        });
        
        if (!defaultLecturer) {
          // Get the current user as fallback lecturer
          defaultLecturer = user;
        }
        
        // Create the course
        liveClass = await db.liveClass.create({
          data: {
            title: "Project Management",
            description: "Lead the Charge to Success with Project Management! Master project planning, execution, and delivery.",
            startTime: new Date(),
            endTime: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
            zoomLink: "https://zoom.us/j/example",
            zoomMeetingId: "123456789",
            zoomPassword: "techxos",
            isActive: true,
            lecturerId: defaultLecturer.id,
            price: 250000
          },
          include: {
            lecturer: true
          }
        });
        console.log("[LECTURE_GET] Created Project Management course");
      } catch (courseCreateError) {
        console.error("[LECTURE_GET] Error creating course:", courseCreateError);
        return new NextResponse("Could not create course record", { status: 500 });
      }
    }

    // Check if user has purchased the course or is admin/lecturer
    const isPurchased = await db.liveClassPurchase.findFirst({
      where: {
        studentId: user.id,
        liveClassId: liveClass.id,
        isActive: true,
        endDate: { gt: new Date() }
      },
    });

    const hasAccess = 
      isPurchased || 
      user.role === LiveClassUserRole.LECTURER || 
      user.role === LiveClassUserRole.ADMIN || 
      user.role === LiveClassUserRole.HEAD_ADMIN;
    
    // Format the response to match what the page expects
    const lectures = [
      {
        id: "lecture-1",
        date: new Date(Date.now() + 86400000), // Tomorrow
        recordingUrl: null,
        title: "Introduction to Project Management",
        isRecorded: false
      },
      {
        id: "lecture-2",
        date: new Date(Date.now() + 86400000 * 3), // 3 days from now
        recordingUrl: null,
        title: "Project Planning Techniques",
        isRecorded: false
      }
    ];

    // Return course lecture details in the expected format
    const response = {
      lecture: {
        id: liveClass.id,
        zoomLink: liveClass.zoomLink,
        lectures: lectures
      },
      hasAccess: hasAccess,
      role: user.role,
      lecturer: {
        name: liveClass.lecturer?.name || "Instructor",
        email: liveClass.lecturer?.email || "",
      },
      courseDetails: {
        title: liveClass.title,
        description: liveClass.description,
        startTime: liveClass.startTime,
        endTime: liveClass.endTime,
        zoomMeetingId: liveClass.zoomMeetingId,
        zoomPassword: liveClass.zoomPassword
      },
      materials: [
        {
          title: "Getting Started with Project Management",
          url: "/materials/project-management-intro.pdf",
          type: "pdf"
        },
        {
          title: "Week 1: Project Initiation",
          url: "/materials/project-management-week1.pdf",
          type: "pdf"
        }
      ]
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[LECTURE_GET] Internal error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 