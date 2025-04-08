import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { transactionId, txRef } = await req.json();

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

    // Create the purchase record
    const purchase = await db.liveClassPurchase.create({
      data: {
        studentId: userId,
        liveClassId: liveClass.id,
        status: "COMPLETED",
        amount: 250000,
        transactionId: transactionId.toString(), // Convert to string
        endDate,
        isActive: true
      }
    });

    return NextResponse.json(purchase);
  } catch (error) {
    console.error("[PURCHASE_SUCCESS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 