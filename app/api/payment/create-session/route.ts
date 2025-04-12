import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { amount, email, name, courseId, courseName } = body;

    if (!amount || !email || !name || !courseId || !courseName) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Generate a unique transaction reference
    const txRef = `${courseId}-${uuidv4()}`;
    
    // Calculate end date (90 days from now)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 90);

    // Create a pending purchase record
    const purchase = await db.liveClassPurchase.create({
      data: {
        studentId: userId,
        liveClassId: courseId,
        amount,
        status: "PENDING",
        txRef,
        isActive: false,
        startDate: new Date(),
        endDate,
        courseName,
        studentEmail: email,
        studentName: name,
      },
    });

    // In a real implementation, you would integrate with Flutterwave here
    // For now, we'll just return a mock payment URL
    const paymentUrl = `/payment/checkout?sessionId=${purchase.id}`;

    return NextResponse.json({
      paymentUrl,
      sessionId: purchase.id,
    });
  } catch (error) {
    console.error("[PAYMENT_CREATE_SESSION] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 