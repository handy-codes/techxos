import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { LiveClassUserRole } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { userId: clerkUserId } = auth();

    if (!clerkUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user details directly from Clerk for more reliable data
    let userEmail = "";
    let userName = "";
    
    try {
      const clerkUser = await clerkClient.users.getUser(clerkUserId);
      userEmail = clerkUser.emailAddresses[0]?.emailAddress || "";
      userName = clerkUser.firstName && clerkUser.lastName 
        ? `${clerkUser.firstName} ${clerkUser.lastName}`
        : clerkUser.firstName || "";
        
      console.log("Clerk user data:", { userEmail, userName });
      
      // Validate email
      if (!userEmail || !userEmail.includes("@")) {
        return new NextResponse("Valid email required for payment", { status: 400 });
      }
    } catch (clerkError) {
      console.error("Failed to fetch user from Clerk:", clerkError);
      return new NextResponse("Could not retrieve user information", { status: 500 });
    }
    
    // Find the user in our database
    let user = await db.liveClassUser.findUnique({
      where: { clerkUserId }
    });

    // If user doesn't exist, check if there's a user with the same email
    if (!user) {
      // Check if user exists by email
      const existingUserByEmail = await db.liveClassUser.findUnique({
        where: { email: userEmail }
      });

      if (existingUserByEmail) {
        // Update existing user with clerk ID
        console.log("Found existing user by email, updating with Clerk ID");
        user = await db.liveClassUser.update({
          where: { id: existingUserByEmail.id },
          data: { 
            clerkUserId,
            name: userName || existingUserByEmail.name
          }
        });
      } else {
        // Create a new user record for this purchase
        console.log("Creating new user record for purchase");
        try {
          user = await db.liveClassUser.create({
            data: {
              clerkUserId,
              email: userEmail,
              name: userName || "New Student",
              role: LiveClassUserRole.LEARNER,
              isActive: true
            }
          });
          console.log("Created new user:", user.id);
        } catch (createError) {
          console.error("Failed to create user:", createError);
          return new NextResponse("Could not create user record", { status: 500 });
        }
      }
    }

    // Find the Project Management course
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
    
    // Debug the price value from the database
    console.log("Raw price from database:", liveClass.price, typeof liveClass.price);
    
    // Always ensure we have a fixed price of 250000 for Project Management
    const price = 250000;
    
    // Update the course price in database if needed
    if (liveClass.price !== price) {
      try {
        await db.liveClass.update({
          where: { id: liveClass.id },
          data: { price }
        });
        console.log("Updated price in database to:", price);
      } catch (updateError) {
        console.error("Failed to update price:", updateError);
      }
    }
    
    console.log("Payment checkout data:", {
      price, 
      courseTitle: liveClass.title,
      studentId: user.id,
      studentEmail: userEmail,
      studentName: userName
    });
    
    // Return the checkout information
    return NextResponse.json({
      success: true,
      price, // Return clean numeric price
      courseTitle: liveClass.title,
      studentId: user.id,
      studentEmail: userEmail,
      studentName: userName || "Student"
    });
  } catch (error) {
    console.error("[CHECKOUT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}