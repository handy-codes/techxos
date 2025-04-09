import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId } = params;

    if (!courseId) {
      return new NextResponse("Course ID is required", { status: 400 });
    }

    const body = await req.json();
    const { transactionId, status, txRef } = body;

    if (!transactionId || !status) {
      return new NextResponse("Transaction details are required", { status: 400 });
    }

    // Find the course
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    // Check if user already purchased this course
    const existingPurchase = await db.purchase.findFirst({
      where: {
        customerId: userId,
        courseId: courseId,
      },
    });

    if (existingPurchase) {
      return new NextResponse("You have already purchased this course", { status: 400 });
    }

    // Create a new purchase record
    await db.purchase.create({
      data: {
        customerId: userId,
        courseId: courseId,
      },
    });

    // Log the transaction details
    console.log(`Payment successful for course ${courseId} by user ${userId}`);
    console.log(`Transaction ID: ${transactionId}, Status: ${status}, Reference: ${txRef}`);

    return NextResponse.json({
      success: true,
      message: "Course purchase recorded successfully",
    });
  } catch (error) {
    console.error("[PAYMENT_SUCCESS] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 