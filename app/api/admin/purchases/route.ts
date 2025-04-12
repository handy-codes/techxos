import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { LiveClassUserRole } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is an admin
    const user = await db.liveClassUser.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user || (user.role !== LiveClassUserRole.ADMIN && user.role !== LiveClassUserRole.HEAD_ADMIN)) {
      return new NextResponse("Unauthorized - Admin access required", { status: 403 });
    }

    // Fetch all purchases with related data
    const purchases = await db.liveClassPurchase.findMany({
      include: {
        liveClass: {
          select: {
            title: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Map the purchases to include student data
    const purchasesWithStudentData = purchases.map(purchase => ({
      ...purchase,
      student: {
        name: purchase.studentName || "Unknown",
        email: purchase.studentEmail || "No email"
      }
    }));

    return NextResponse.json({
      success: true,
      purchases: purchasesWithStudentData
    });
  } catch (error) {
    console.error("[FETCH_PURCHASES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 