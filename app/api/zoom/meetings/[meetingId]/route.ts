import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { 
  getZoomMeeting,
  updateZoomMeeting,
  deleteZoomMeeting,
  startZoomMeeting,
  endZoomMeeting,
  formatDateForZoom
} from "@/lib/zoom-api";
import { ZoomMeetingStatus } from "@prisma/client";

// Function to check if user has admin privileges or is the lecturer for the class
const hasPermission = async (userId: string, meetingId: string) => {
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

  if (!meeting) return false;

  // Get user role
  const user = await db.liveClassUser.findUnique({
    where: { id: userId }
  });

  if (!user) return false;

  // Admins have access to all meetings
  if (user.role === "HEAD_ADMIN" || user.role === "ADMIN") {
    return { hasAccess: true, meeting };
  }

  // Lecturers have access to their own classes' meetings
  if (user.role === "LECTURER" && meeting.liveClass.lecturerId === userId) {
    return { hasAccess: true, meeting };
  }

  // For learners, check if they've purchased the class
  if (user.role === "LEARNER") {
    const purchase = await db.liveClassPurchase.findFirst({
      where: {
        liveClassId: meeting.liveClassId,
        studentId: userId,
        isActive: true,
        endDate: {
          gt: new Date()
        }
      }
    });
    
    // Learners can view but not modify meetings
    if (purchase) {
      return { hasAccess: true, meeting, readOnly: true };
    }
  }

  return { hasAccess: false };
};

// GET - Retrieve a specific meeting
export async function GET(
  req: Request,
  { params }: { params: { meetingId: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { meetingId } = params;

    // Check permission
    const { hasAccess, meeting } = await hasPermission(userId, meetingId) as any;
    
    if (!hasAccess || !meeting) {
      return new NextResponse("Unauthorized or meeting not found", { status: 403 });
    }

    // Get meeting with additional details
    const meetingDetails = await db.zoomMeeting.findUnique({
      where: { id: meetingId },
      include: {
        liveClass: {
          select: {
            title: true,
            lecturer: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(meetingDetails);
  } catch (error) {
    console.error("[ZOOM_MEETING_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// PATCH - Update a meeting
export async function PATCH(
  req: Request,
  { params }: { params: { meetingId: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { meetingId } = params;
    const body = await req.json();
    
    // Check permission
    const permissionResult = await hasPermission(userId, meetingId) as any;
    
    if (!permissionResult.hasAccess || !permissionResult.meeting) {
      return new NextResponse("Unauthorized or meeting not found", { status: 403 });
    }
    
    // Learners can't modify meetings
    if (permissionResult.readOnly) {
      return new NextResponse("You don't have permission to modify this meeting", { status: 403 });
    }

    const meeting = permissionResult.meeting;

    // Extract updatable fields
    const { 
      topic, 
      startTime, 
      duration, 
      agenda, 
      password 
    } = body;

    // Prepare update data for Zoom API
    const updateParams: any = {};
    
    if (topic) updateParams.topic = topic;
    if (startTime) updateParams.start_time = formatDateForZoom(new Date(startTime));
    if (duration) updateParams.duration = duration;
    if (agenda) updateParams.agenda = agenda;
    if (password) updateParams.password = password;

    // Only update if there are changes
    if (Object.keys(updateParams).length > 0) {
      // Update in Zoom
      await updateZoomMeeting(meeting.zoomMeetingId!, updateParams);
      
      // Prepare data for our database update
      const dbUpdateData: any = {};
      
      if (topic) dbUpdateData.topic = topic;
      if (startTime) dbUpdateData.startTime = new Date(startTime);
      if (duration) dbUpdateData.duration = duration;
      if (agenda) dbUpdateData.agenda = agenda;
      if (password) dbUpdateData.password = password;
      
      // Update in our database
      const updatedMeeting = await db.zoomMeeting.update({
        where: { id: meetingId },
        data: dbUpdateData
      });
      
      return NextResponse.json(updatedMeeting);
    }
    
    return NextResponse.json(meeting);
  } catch (error) {
    console.error("[ZOOM_MEETING_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// DELETE - Delete a meeting
export async function DELETE(
  req: Request,
  { params }: { params: { meetingId: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { meetingId } = params;
    
    // Check permission
    const permissionResult = await hasPermission(userId, meetingId) as any;
    
    if (!permissionResult.hasAccess || !permissionResult.meeting) {
      return new NextResponse("Unauthorized or meeting not found", { status: 403 });
    }
    
    // Learners can't delete meetings
    if (permissionResult.readOnly) {
      return new NextResponse("You don't have permission to delete this meeting", { status: 403 });
    }

    const meeting = permissionResult.meeting;

    // Delete from Zoom
    if (meeting.zoomMeetingId) {
      await deleteZoomMeeting(meeting.zoomMeetingId);
    }
    
    // Delete from our database
    await db.zoomMeeting.delete({
      where: { id: meetingId }
    });
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[ZOOM_MEETING_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 