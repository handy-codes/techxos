import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { LiveClassUserRole } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

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
    
    // Check if user already has a purchase for this course
    const existingPurchase = await db.liveClassPurchase.findFirst({
      where: {
        studentId: user.id,
        liveClassId: liveClass.id,
        isActive: true,
        endDate: {
          gt: new Date()
        }
      }
    });

    if (existingPurchase) {
      // If purchase exists and is active, return success with existing tx_ref
      return NextResponse.json({
        success: true,
        price: existingPurchase.amount,
        courseTitle: liveClass.title,
        studentId: user.id,
        studentEmail: userEmail,
        studentName: userName || "Student",
        tx_ref: existingPurchase.txRef,
        redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/project-mgt/success`,
        message: "You already have an active purchase for this course"
      });
    }
    
    // Debug the price value from the database
    console.log("Raw price from database:", liveClass.price, typeof liveClass.price);
    
    // Use the original price of 250000
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
    
    // Generate a unique transaction reference
    const tx_ref = `${liveClass.id}-${uuidv4()}`;
    
    try {
      // Create a pending purchase record
      await db.liveClassPurchase.create({
        data: {
          studentId: user.id,
          liveClassId: liveClass.id,
          amount: price,
          status: "PENDING",
          txRef: tx_ref,
          isActive: false,
          startDate: new Date(),
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
          courseName: liveClass.title,
          studentEmail: userEmail,
          studentName: userName || "Student",
        },
      });
    } catch (createError: any) {
      // Handle unique constraint error
      if (createError.code === 'P2002') {
        console.log("Purchase record already exists, proceeding with checkout");
        // Continue with the checkout process
      } else {
        console.error("Failed to create purchase record:", createError);
        return new NextResponse("Could not create purchase record", { status: 500 });
      }
    }
    
    // Construct the correct redirect URL - using a relative path
    const redirectUrl = "/project-mgt/success";
    
    console.log("Payment checkout data:", {
      price, 
      courseTitle: liveClass.title,
      studentId: user.id,
      studentEmail: userEmail,
      studentName: userName,
      tx_ref,
      redirect_url: redirectUrl
    });
    
    // Return the checkout information
    return NextResponse.json({
      success: true,
      price, // Return clean numeric price
      courseTitle: liveClass.title,
      studentId: user.id,
      studentEmail: userEmail,
      studentName: userName || "Student",
      tx_ref,
      redirect_url: redirectUrl
    });
  } catch (error) {
    console.error("[CHECKOUT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}