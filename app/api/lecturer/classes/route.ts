import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { LiveClassUserRole } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { userId: clerkUserId } = auth();

    if (!clerkUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is a lecturer
    const user = await db.liveClassUser.findFirst({
      where: {
        clerkUserId: clerkUserId,
        role: LiveClassUserRole.LECTURER
      },
    });

    if (!user) {
      return new NextResponse("Unauthorized - Lecturer access only", { status: 401 });
    }

    // Get all live classes that this lecturer teaches
    const liveClasses = await db.liveClass.findMany({
      where: {
        lecturerId: user.id,
        isActive: true
      },
      include: {
        lecturer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        purchases: {
          select: {
            id: true,
            studentId: true
          }
        }
      },
      orderBy: {
        startTime: 'desc'
      }
    });

    return NextResponse.json(liveClasses);
  } catch (error) {
    console.error("[LECTURER_CLASSES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 