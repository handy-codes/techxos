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
      },
      select: {
        id: true
      }
    });

    // Get all Zoom meetings for these classes
    const liveClassIds = liveClasses.map(lc => lc.id);
    
    const meetings = await db.zoomMeeting.findMany({
      where: {
        liveClassId: {
          in: liveClassIds
        }
      },
      include: {
        liveClass: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    });

    return NextResponse.json(meetings);
  } catch (error) {
    console.error("[LECTURER_ZOOM_MEETINGS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
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

    const body = await req.json();
    const {
      topic,
      agenda,
      startTime,
      duration,
      password,
      liveClassId
    } = body;

    // Verify this lecturer is assigned to this class
    const liveClass = await db.liveClass.findFirst({
      where: {
        id: liveClassId,
        lecturerId: user.id
      }
    });

    if (!liveClass) {
      return new NextResponse("You can only create meetings for your own classes", { status: 403 });
    }

    // Create meeting in database
    const meeting = await db.zoomMeeting.create({
      data: {
        topic,
        agenda,
        startTime: new Date(startTime),
        duration,
        password,
        status: "SCHEDULED",
        liveClassId
      }
    });

    // In a real implementation, we would also create the meeting in Zoom API
    // using the zoom-api.ts utility

    return NextResponse.json(meeting);
  } catch (error) {
    console.error("[LECTURER_ZOOM_MEETINGS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 