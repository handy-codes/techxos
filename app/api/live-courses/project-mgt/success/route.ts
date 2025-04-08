import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId: clerkUserId } = auth();
    
    if (!clerkUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the user by Clerk ID
    const user = await db.liveClassUser.findUnique({
      where: { clerkUserId }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Get payment data
    const { transactionId, status, flwRef, txRef } = await req.json();
    
    console.log("Payment success data:", { transactionId, status, flwRef, txRef, userId: user.id });

    if (!transactionId) {
      return new NextResponse("Transaction ID is required", { status: 400 });
    }

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

    let purchase;
    
    const purchaseData = {
        status: "COMPLETED",
      amount: liveClass.price,
      transactionId: transactionId.toString(),
      flwRef: flwRef?.toString() || null,
      txRef: txRef?.toString() || null,
        endDate,
        isActive: true
    };
    
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

    // Update user info from Clerk if needed
    try {
      const clerkUser = await clerkClient.users.getUser(clerkUserId);
      const userEmail = clerkUser.emailAddresses[0]?.emailAddress || "";
      const userName = clerkUser.firstName && clerkUser.lastName 
        ? `${clerkUser.firstName} ${clerkUser.lastName}`
        : clerkUser.firstName || "";
      
      // Only update name to avoid unique email constraint issues
      if (userName && user.name !== userName) {
        await db.liveClassUser.update({
          where: { id: user.id },
          data: { name: userName }
        });
      }
    } catch (clerkError) {
      console.error("Error updating user details:", clerkError);
    }

    return NextResponse.json({
      success: true,
      purchase,
      courseTitle: liveClass.title
    });
  } catch (error) {
    console.error("[PURCHASE_SUCCESS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 