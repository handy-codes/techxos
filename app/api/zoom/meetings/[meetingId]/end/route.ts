import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { endZoomMeeting } from "@/lib/zoom-api";
import { ZoomMeetingStatus } from "@prisma/client";

// Function to check if user can end the meeting
const canEndMeeting = async (userId: string, meetingId: string) => {
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

  if (!meeting) return { canEnd: false };

  // Get user role
  const user = await db.liveClassUser.findUnique({
    where: { id: userId }
  });

  if (!user) return { canEnd: false };

  // Only HEAD_ADMIN, ADMIN, and the assigned LECTURER can end meetings
  if (user.role === "HEAD_ADMIN" || user.role === "ADMIN") {
    return { canEnd: true, meeting };
  }

  // Lecturer can only end their own classes
  if (user.role === "LECTURER" && meeting.liveClass.lecturerId === userId) {
    return { canEnd: true, meeting };
  }

  return { canEnd: false };
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

    // Check if user can end this meeting
    const { canEnd, meeting } = await canEndMeeting(userId, meetingId) as any;
    
    if (!canEnd || !meeting) {
      return new NextResponse("You don't have permission to end this meeting", { status: 403 });
    }

    // End the Zoom meeting
    await endZoomMeeting(meeting.zoomMeetingId!);

    // Update meeting status in our database
    const updatedMeeting = await db.zoomMeeting.update({
      where: { id: meetingId },
      data: {
        status: ZoomMeetingStatus.ENDED
      }
    });

    return NextResponse.json(updatedMeeting);
  } catch (error) {
    console.error("[ZOOM_MEETING_END]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 