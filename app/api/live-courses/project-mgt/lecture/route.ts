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

    // If user doesn't exist in our database but is authenticated with Clerk, check if email exists
    if (!user) {
      console.log("[LECTURE_GET] User not found by Clerk ID, checking email:", userEmail);
      
      // Check if a user with this email already exists (for admins/lecturers set up manually)
      const existingUserByEmail = await db.liveClassUser.findUnique({
        where: { email: userEmail }
      });
      
      if (existingUserByEmail) {
        // Update the existing user with the Clerk ID
        console.log("[LECTURE_GET] Found existing user with matching email, updating with Clerk ID");
        user = await db.liveClassUser.update({
          where: { id: existingUserByEmail.id },
          data: {
            clerkUserId,
            name: userName || existingUserByEmail.name
          }
        });
        console.log("[LECTURE_GET] Updated existing user with Clerk ID:", user.id);
      } else {
        // Do NOT create a database entry for regular visitors
        // We'll just check admins by email
        console.log("[LECTURE_GET] No database entry for this user, checking admin email status");
        
        // List of admin emails to check
        const adminEmails = [
          "paxymekventures@gmail.com",
          "admin@techxos.com",
          "emeka@techxos.com"
        ];
        
        // If this is a known admin email, create a record
        if (adminEmails.includes(userEmail.toLowerCase())) {
          console.log("[LECTURE_GET] Creating admin record for known admin email:", userEmail);
          try {
            // First check if user already exists with this email
            const existingAdmin = await db.liveClassUser.findUnique({
              where: { email: userEmail.toLowerCase() }
            });

            if (existingAdmin) {
              // Update existing admin with new Clerk ID
              user = await db.liveClassUser.update({
                where: { id: existingAdmin.id },
                data: {
                  clerkUserId,
                  name: userName || existingAdmin.name,
                  role: LiveClassUserRole.HEAD_ADMIN,
                  isActive: true
                }
              });
              console.log("[LECTURE_GET] Updated existing admin user:", user.id);
            } else {
              // Create new admin user
              user = await db.liveClassUser.create({
                data: {
                  clerkUserId,
                  email: userEmail.toLowerCase(),
                  name: userName,
                  role: LiveClassUserRole.HEAD_ADMIN,
                  isActive: true
                }
              });
              console.log("[LECTURE_GET] Created new admin user:", user.id);
            }
          } catch (userCreateError) {
            console.error("[LECTURE_GET] Error creating/updating admin user:", userCreateError);
            return new NextResponse("Could not create/update user record", { status: 500 });
          }
        } else {
          // For regular visitors, we won't create a database entry
          console.log("[LECTURE_GET] Not creating database entry for visitor:", userEmail);
          // Set user to null so we know this is a visitor with no database record
          user = null;
        }
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

    // Check access for users without database records (regular visitors)
    let hasAccess = false;
    let userRole = null;

    if (user) {
      // For users with database records, check purchases and roles
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
      
      userRole = user.role;
      hasAccess = isPurchased || isAdminOrHigher;
      console.log(`User role: ${userRole}, isAdminOrHigher: ${isAdminOrHigher}, hasAccess: ${hasAccess}`);
    } else {
      // For visitors without database records, check if their email is a known admin
      const adminEmails = [
        "paxymekventures@gmail.com",
        "admin@techxos.com",
        "emeka@techxos.com"
      ];
      
      if (adminEmails.includes(userEmail.toLowerCase())) {
        hasAccess = true;
        userRole = LiveClassUserRole.HEAD_ADMIN;
        console.log(`Email admin detected: ${userEmail}, granting access`);
      } else {
        hasAccess = false;
        userRole = "VISITOR";
        console.log(`Visitor without database record: ${userEmail}, no access`);
      }
    }
    
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
      role: userRole,
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