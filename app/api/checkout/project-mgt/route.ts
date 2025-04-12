import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { email, name } = body;

    if (!email) {
      return new NextResponse("Email is required", { status: 400 });
    }

    // Get or create user in our database
    let user = await db.liveClassUser.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      user = await db.liveClassUser.create({
        data: {
          clerkUserId: userId,
          email: email,
          name: name || "Student",
          role: "LEARNER",
          isActive: true
        }
      });
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

    // Check if user already has an active purchase
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
      return new NextResponse("Already purchased", { status: 400 });
    }

    // Generate a unique transaction reference
    const tx_ref = `${liveClass.id}-${uuidv4()}`;

    // Create a pending purchase record
    await db.liveClassPurchase.create({
      data: {
        studentId: user.id,
        liveClassId: liveClass.id,
        amount: 250000, // Fixed price for Project Management
        status: "PENDING",
        txRef: tx_ref,
        isActive: false,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        courseName: "Project Management",
        studentEmail: email,
        studentName: name || "Student",
      },
    });

    // Return Flutterwave payment details
    return NextResponse.json({
      tx_ref,
      amount: 250000,
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/project-mgt/success`,
      userId: user.id
    });
  } catch (error) {
    console.error("[CHECKOUT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 