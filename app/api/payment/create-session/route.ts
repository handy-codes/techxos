import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

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

    // Create a payment session in the database
    const paymentSession = await db.paymentSession.create({
      data: {
        userId,
        amount,
        email,
        name,
        courseId,
        courseName,
        status: "PENDING",
      },
    });

    // In a real implementation, you would integrate with Flutterwave here
    // For now, we'll just return a mock payment URL
    const paymentUrl = `/payment/checkout?sessionId=${paymentSession.id}`;

    return NextResponse.json({
      paymentUrl,
      sessionId: paymentSession.id,
    });
  } catch (error) {
    console.error("[PAYMENT_CREATE_SESSION] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 