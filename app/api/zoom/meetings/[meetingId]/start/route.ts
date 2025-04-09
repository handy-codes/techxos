import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { startZoomMeeting } from "@/lib/zoom-api";
import { ZoomMeetingStatus } from "@prisma/client";

// Function to check if user can start the meeting
const canStartMeeting = async (userId: string, meetingId: string) => {
  // Get the meeting with its class and lecturer info
  const meeting = await db.zoomMeeting.findUnique({
    where: { id: meetingId },
    include: {
      liveClass: {
        select: {
          lecturerId: true
        }
      }
    }
  });

  if (!meeting) return { canStart: false };

  // Get user role
  const user = await db.liveClassUser.findUnique({
    where: { id: userId }
  });

  if (!user) return { canStart: false };

  // Only HEAD_ADMIN, ADMIN, and the assigned LECTURER can start meetings
  if (user.role === "HEAD_ADMIN" || user.role === "ADMIN") {
    return { canStart: true, meeting };
  }

  // Lecturer can only start their own classes
  if (user.role === "LECTURER" && meeting.liveClass.lecturerId === userId) {
    return { canStart: true, meeting };
  }

  return { canStart: false };
};

export async function POST(
  req: Request,
  { params }: { params: { meetingId: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { meetingId } = params;

    // Check if user can start this meeting
    const { canStart, meeting } = await canStartMeeting(userId, meetingId) as any;
    
    if (!canStart || !meeting) {
      return new NextResponse("You don't have permission to start this meeting", { status: 403 });
    }

    // Start the Zoom meeting
    const startResult = await startZoomMeeting(meeting.zoomMeetingId!);

    // Update meeting status in our database
    const updatedMeeting = await db.zoomMeeting.update({
      where: { id: meetingId },
      data: {
        status: ZoomMeetingStatus.STARTED
      }
    });

    // Return the start URL for the host to join
    return NextResponse.json({
      ...updatedMeeting,
      startUrl: startResult.startUrl
    });
  } catch (error) {
    console.error("[ZOOM_MEETING_START]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 