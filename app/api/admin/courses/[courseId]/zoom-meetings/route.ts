import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

// GET all zoom meetings for a course
export async function GET(
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

    // Check if the course exists
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    // Get all zoom meetings for the course
    const zoomMeetings = await db.courseZoomMeeting.findMany({
      where: { courseId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(zoomMeetings);
  } catch (error) {
    console.error("[ZOOM_MEETINGS_GET] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// POST a new zoom meeting for a course
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
    const { zoomLink } = body;

    if (!zoomLink) {
      return new NextResponse("Zoom link is required", { status: 400 });
    }

    // Check if the course exists
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    // If this is the first zoom meeting, set it as active
    // Otherwise, set it as inactive by default
    const existingMeetings = await db.courseZoomMeeting.count({
      where: { courseId },
    });

    const isActive = existingMeetings === 0;

    // Create the new zoom meeting
    const newZoomMeeting = await db.courseZoomMeeting.create({
      data: {
        courseId,
        zoomLink,
        isActive,
      },
    });

    return NextResponse.json(newZoomMeeting);
  } catch (error) {
    console.error("[ZOOM_MEETINGS_POST] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 