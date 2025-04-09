import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

// PATCH to update a zoom meeting
export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; meetingId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId, meetingId } = params;

    if (!courseId || !meetingId) {
      return new NextResponse("Course ID and Meeting ID are required", { status: 400 });
    }

    const body = await req.json();
    const { isActive, zoomLink } = body;

    // Check if the course exists
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    // Check if the meeting exists
    const meeting = await db.courseZoomMeeting.findUnique({
      where: { id: meetingId },
    });

    if (!meeting) {
      return new NextResponse("Meeting not found", { status: 404 });
    }

    // If setting this meeting as active, deactivate all other meetings
    if (isActive) {
      await db.courseZoomMeeting.updateMany({
        where: { 
          courseId,
          id: { not: meetingId }
        },
        data: { isActive: false },
      });
    }

    // Update the meeting
    const updatedMeeting = await db.courseZoomMeeting.update({
      where: { id: meetingId },
      data: {
        ...(typeof isActive === 'boolean' ? { isActive } : {}),
        ...(zoomLink ? { zoomLink } : {}),
      },
    });

    return NextResponse.json(updatedMeeting);
  } catch (error) {
    console.error("[ZOOM_MEETING_PATCH] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// DELETE to remove a zoom meeting
export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; meetingId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId, meetingId } = params;

    if (!courseId || !meetingId) {
      return new NextResponse("Course ID and Meeting ID are required", { status: 400 });
    }

    // Check if the course exists
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    // Check if the meeting exists
    const meeting = await db.courseZoomMeeting.findUnique({
      where: { id: meetingId },
    });

    if (!meeting) {
      return new NextResponse("Meeting not found", { status: 404 });
    }

    // Delete the meeting
    await db.courseZoomMeeting.delete({
      where: { id: meetingId },
    });

    // If this was the active meeting, activate another one if available
    if (meeting.isActive) {
      const nextMeeting = await db.courseZoomMeeting.findFirst({
        where: { courseId },
        orderBy: { createdAt: 'desc' },
      });

      if (nextMeeting) {
        await db.courseZoomMeeting.update({
          where: { id: nextMeeting.id },
          data: { isActive: true },
        });
      }
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[ZOOM_MEETING_DELETE] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 