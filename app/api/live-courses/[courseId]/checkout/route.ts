import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from 'uuid';

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
    const body = await req.json();
    const { courseName, amount, email, name } = body;

    if (!courseId || !amount || !email || !name) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Ensure amount is a valid number
    const formattedAmount = Number(amount);
    if (isNaN(formattedAmount) || formattedAmount <= 0) {
      return new NextResponse("Invalid amount", { status: 400 });
    }

    // Check if user already purchased this course
    const existingPurchase = await db.liveClassPurchase.findFirst({
      where: {
        studentId: userId,
        liveClassId: courseId,
        isActive: true,
        endDate: { gt: new Date() }
      },
    });

    if (existingPurchase) {
      return new NextResponse("You have already purchased this course", { status: 400 });
    }

    // Generate a unique transaction reference
    const tx_ref = `${courseId}-${uuidv4()}`;

    // Create a pending purchase record
    await db.liveClassPurchase.create({
      data: {
        studentId: userId,
        liveClassId: courseId,
        amount: formattedAmount,
        status: "PENDING",
        txRef: tx_ref,
        isActive: false,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        courseName: courseName,
        studentEmail: email,
        studentName: name,
      },
    });

    // Return Flutterwave payment details
    return NextResponse.json({
      tx_ref,
      amount: formattedAmount,
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}/success`,
      userId: userId,
    });
  } catch (error) {
    console.error("[COURSE_CHECKOUT] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 