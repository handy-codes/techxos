import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId: clerkUserId } = auth();
    
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get payment data from request
    const { transactionId, status, flwRef, txRef } = await req.json();
    
    console.log("Payment success data:", { transactionId, status, flwRef, txRef, clerkUserId });

    if (!transactionId) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
    }

    // Find the user by Clerk ID
    let user = await db.liveClassUser.findUnique({
      where: { clerkUserId }
    });

    // Get user data from Clerk
    let clerkUserData;
    try {
      clerkUserData = await clerkClient.users.getUser(clerkUserId);
    } catch (clerkError) {
      console.error("Error fetching Clerk user data:", clerkError);
      return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
    }

    const userEmail = clerkUserData.emailAddresses[0]?.emailAddress || "";
    const userName = clerkUserData.firstName && clerkUserData.lastName 
      ? `${clerkUserData.firstName} ${clerkUserData.lastName}`
      : clerkUserData.firstName || "";

    // If user doesn't exist in database, create them as a LEARNER
    if (!user) {
      try {
        user = await db.liveClassUser.create({
          data: {
            clerkUserId,
            email: userEmail,
            name: userName,
            role: "LEARNER", // Direct to LEARNER role (no VISITOR first)
            isActive: true
          }
        });
        console.log("Created new LEARNER record for purchasing user:", user.id);
      } catch (createError) {
        console.error("Error creating user:", createError);
        return NextResponse.json({ error: "Failed to create user record" }, { status: 500 });
      }
    }

    // Find the active course
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
      return NextResponse.json({ error: "No active class found" }, { status: 404 });
    }

    // Calculate end date based on course duration (12 weeks)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (12 * 7));

    // Check if purchase already exists
    const existingPurchase = await db.liveClassPurchase.findFirst({
      where: {
        studentId: user.id,
        liveClassId: liveClass.id,
      }
    });

    // Prepare purchase data
    const purchaseData = {
      status: "COMPLETED",
      amount: liveClass.price,
      transactionId: transactionId.toString(),
      flwRef: flwRef?.toString() || null,
      txRef: txRef?.toString() || null,
      endDate,
      isActive: true
    };
    
    let purchase;
    
    if (existingPurchase) {
      // Update existing purchase
      purchase = await db.liveClassPurchase.update({
        where: { id: existingPurchase.id },
        data: purchaseData
      });
      
      console.log("Updated existing purchase:", purchase.id);
    } else {
      // Create new purchase record
      purchase = await db.liveClassPurchase.create({
        data: {
          studentId: user.id,
          liveClassId: liveClass.id,
          ...purchaseData
        }
      });
      
      console.log("Created new purchase:", purchase.id);
    }

    return NextResponse.json({
      success: true,
      purchase,
      courseTitle: liveClass.title
    });
  } catch (error) {
    console.error("[PURCHASE_SUCCESS_POST]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
} 