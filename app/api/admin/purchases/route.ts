import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the user's role
    const user = await prisma.liveClassUser.findUnique({
      where: { clerkUserId: userId },
      select: { role: true }
    });

    if (!user || !["HEAD_ADMIN", "ADMIN"].includes(user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch all purchases with related data
    const purchases = await prisma.liveClassPurchase.findMany({
      include: {
        liveClass: {
          select: {
            title: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get all student IDs from purchases
    const studentIds = purchases.map(purchase => purchase.studentId);
    
    // Fetch all students in one query
    const students = await prisma.liveClassUser.findMany({
      where: {
        id: {
          in: studentIds
        }
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    // Create a map of student IDs to student details
    const studentMap = new Map();
    students.forEach(student => {
      studentMap.set(student.id, student);
    });

    // Enhance purchases with student details
    const enhancedPurchases = purchases.map(purchase => {
      const student = studentMap.get(purchase.studentId) || { name: "Unknown", email: "Unknown" };
      return {
        ...purchase,
        student: {
          name: student.name || "Unknown",
          email: student.email || "Unknown"
        }
      };
    });

    return NextResponse.json(enhancedPurchases);
  } catch (error) {
    console.error("[ADMIN_PURCHASES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 