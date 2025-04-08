import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { LiveClassUserRole } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { userId: clerkUserId } = auth();

    if (!clerkUserId) {
      console.error("[LECTURE_GET] Unauthorized access attempt");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get more user details from Clerk
    let userEmail = "unknown@email.com";
    let userName = "New User";
    
    try {
      // Fetch user details from Clerk
      const clerkUser = await clerkClient.users.getUser(clerkUserId);
      
      // Extract email and name
      userEmail = clerkUser.emailAddresses[0]?.emailAddress || userEmail;
      userName = clerkUser.firstName && clerkUser.lastName 
        ? `${clerkUser.firstName} ${clerkUser.lastName}`
        : clerkUser.firstName || userName;
        
      console.log("Retrieved user details from Clerk:", { userEmail, userName });
    } catch (clerkError) {
      console.error("Error fetching Clerk user details:", clerkError);
    }

    // Find user using Clerk user ID
    let user = await db.liveClassUser.findUnique({
      where: { clerkUserId },
    });

    // If user doesn't exist in our database but is authenticated with Clerk, create it
    if (!user) {
      console.log("[LECTURE_GET] User not found, creating user record for:", clerkUserId);
      try {
        // Create a basic user record with proper Clerk info
        user = await db.liveClassUser.create({
          data: {
            clerkUserId,
            email: userEmail,
            name: userName,
            role: LiveClassUserRole.LEARNER,
            isActive: true
          }
        });
        console.log("[LECTURE_GET] Created new user:", user.id);
      } catch (userCreateError) {
        console.error("[LECTURE_GET] Error creating user:", userCreateError);
        return new NextResponse("Could not create user record", { status: 500 });
      }
    } else {
      // Update user details if they've changed in Clerk
      if (user.name !== userName) {
        // Only update the name, not the email to avoid unique constraint violations
        user = await db.liveClassUser.update({
          where: { id: user.id },
          data: {
            name: userName
          }
        });
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
        
        // Set current date for start and calculate end date
        const now = new Date();
        const endDate = new Date();
        endDate.setDate(now.getDate() + 90); // 90 days from now
        
        // Create the course with current dates and explicit price
        liveClass = await db.liveClass.create({
          data: {
            title: "Project Management",
            description: "Lead the Charge to Success with Project Management! Master project planning, execution, and delivery.",
            startTime: now,
            endTime: endDate,
            zoomLink: "https://zoom.us/j/example",
            zoomMeetingId: "123456789",
            zoomPassword: "techxos",
            isActive: true,
            lecturerId: defaultLecturer.id,
            price: 250000, // 250,000 NGN
            duration: 12,  // 12 weeks
            batchNumber: 1 // First batch
          },
          include: {
            lecturer: true
          }
        });
        console.log("[LECTURE_GET] Created Project Management course with price:", liveClass.price);
      } catch (courseCreateError) {
        console.error("[LECTURE_GET] Error creating course:", courseCreateError);
        return new NextResponse("Could not create course record", { status: 500 });
      }
    } else {
      // Update course price and dates if needed
      const now = new Date();
      const needsUpdate = liveClass.startTime < now || liveClass.price !== 250000;
      
      if (needsUpdate) {
        console.log("[LECTURE_GET] Updating course dates and price. Current price:", liveClass.price);
        const endDate = new Date();
        endDate.setDate(now.getDate() + 90); // 90 days from now
        
        liveClass = await db.liveClass.update({
          where: { id: liveClass.id },
          data: {
            startTime: liveClass.startTime < now ? now : liveClass.startTime,
            endTime: liveClass.endTime < now ? endDate : liveClass.endTime,
            price: 250000 // Ensure price is 250,000 NGN
          },
          include: {
            lecturer: true
          }
        });
        console.log("[LECTURE_GET] Updated course price to:", liveClass.price);
      } else {
        console.log("[LECTURE_GET] Found course with price:", liveClass.price);
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

    // Add an explicit check for admin/lecturer roles
    const isAdminOrHigher = user.role === LiveClassUserRole.LECTURER || 
      user.role === LiveClassUserRole.ADMIN || 
      user.role === LiveClassUserRole.HEAD_ADMIN;
    console.log(`User role: ${user.role}, isAdminOrHigher: ${isAdminOrHigher}`);

    const hasAccess = isPurchased || isAdminOrHigher;
    
    // Format the response to match what the page expects
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    
    const threeDaysLater = new Date();
    threeDaysLater.setDate(now.getDate() + 3);
    
    const lectures = [
      {
        id: "lecture-1",
        date: tomorrow, // Tomorrow
        recordingUrl: null,
        title: "Introduction to Project Management",
        isRecorded: false
      },
      {
        id: "lecture-2",
        date: threeDaysLater, // 3 days from now
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