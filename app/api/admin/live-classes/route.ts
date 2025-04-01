import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is admin
    const user = await db.liveClassUser.findFirst({
      where: {
        email: userId,
        role: {
          in: ["HEAD_ADMIN", "ADMIN"]
        }
      }
    });

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const liveClasses = await db.liveClass.findMany({
      include: {
        lecturer: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(liveClasses);
  } catch (error) {
    console.error("[LIVE_CLASSES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is admin
    const user = await db.liveClassUser.findFirst({
      where: {
        email: userId,
        role: {
          in: ["HEAD_ADMIN", "ADMIN"]
        }
      }
    });

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      startTime,
      endTime,
      price,
      maxStudents,
      duration,
      batchNumber,
      lecturerId
    } = body;

    const liveClass = await db.liveClass.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        price,
        maxStudents,
        duration,
        batchNumber,
        lecturerId,
        isActive: true
      }
    });

    return NextResponse.json(liveClass);
  } catch (error) {
    console.error("[LIVE_CLASSES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 