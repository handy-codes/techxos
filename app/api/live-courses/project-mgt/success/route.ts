import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { transactionId, status } = await req.json();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
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
      return new NextResponse("Course not found", { status: 404 });
    }

    if (status === "successful") {
      // Calculate end date based on course duration
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + (liveClass.duration * 7));

      await db.liveClassPurchase.create({
        data: {
          studentId: userId,
          liveClassId: liveClass.id,
          status: "COMPLETED",
          amount: liveClass.price,
          transactionId,
          endDate,
          isActive: true
        }
      });
    }

    return NextResponse.json({ message: "Success" });
  } catch (error) {
    console.error("[PURCHASE_SUCCESS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 