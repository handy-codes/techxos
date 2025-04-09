import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { generateZoomSignature } from "@/lib/zoom-signature";
import { LiveClassUserRole } from "@prisma/client";

// Function to check if user can join the meeting
const canJoinMeeting = async (userId: string, meetingId: string) => {
  // Get the meeting with its class info
  const meeting = await db.zoomMeeting.findUnique({
    where: { id: meetingId },
    include: {
      liveClass: {
        select: {
          id: true,
          lecturerId: true
        }
      }
    }
  });

  if (!meeting) return { canJoin: false };

  // Get user role
  const user = await db.liveClassUser.findUnique({
    where: { id: userId }
  });

  if (!user) return { canJoin: false };

  // HEAD_ADMIN, ADMIN can join any meeting
  if (user.role === "HEAD_ADMIN" || user.role === "ADMIN") {
    // These users join as hosts (role 1)
    return { canJoin: true, meeting, zoomRole: 1, user };
  }

  // Assigned LECTURER joins as host
  if (user.role === "LECTURER" && meeting.liveClass.lecturerId === userId) {
    return { canJoin: true, meeting, zoomRole: 1, user };
  }
  
  // Other LECTURERs join as participants
  if (user.role === "LECTURER") {
    return { canJoin: true, meeting, zoomRole: 0, user };
  }

  // LEARNERs need to have purchased the class
  if (user.role === "LEARNER") {
    const purchase = await db.liveClassPurchase.findFirst({
      where: {
        liveClassId: meeting.liveClass.id,
        studentId: userId,
        isActive: true,
        endDate: {
          gt: new Date()
        }
      }
    });
    
    if (purchase) {
      return { canJoin: true, meeting, zoomRole: 0, user }; // Join as participant
    }
  }

  return { canJoin: false };
};

// Create attendance record
const recordAttendance = async (
  meetingId: string, 
  userId: string, 
  userName: string, 
  userEmail: string, 
  userRole: LiveClassUserRole
) => {
  try {
    return await db.zoomAttendance.create({
      data: {
        meetingId,
        userId,
        userName,
        userEmail,
        userRole,
        joinTime: new Date()
      }
    });
  } catch (error) {
    console.error("Error recording attendance:", error);
    // Don't throw - this shouldn't block the user from joining
    return null;
  }
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

    // Check if user can join this meeting
    const { canJoin, meeting, zoomRole, user } = await canJoinMeeting(userId, meetingId) as any;
    
    if (!canJoin || !meeting || !user) {
      return new NextResponse("You don't have permission to join this meeting", { status: 403 });
    }

    // Generate signature for Zoom SDK
    const signature = generateZoomSignature(
      meeting.zoomMeetingId!,
      zoomRole
    );

    // Record the attendance
    await recordAttendance(
      meetingId,
      userId,
      user.name || user.email,
      user.email,
      user.role
    );

    // Return meeting details and signature
    return NextResponse.json({
      signature,
      meetingNumber: meeting.zoomMeetingId,
      userName: user.name || user.email,
      userEmail: user.email,
      password: meeting.password,
      role: zoomRole,
      // For direct join via URL
      joinUrl: meeting.joinUrl, 
      // For host to start the meeting
      startUrl: zoomRole === 1 ? meeting.startUrl : undefined 
    });
  } catch (error) {
    console.error("[ZOOM_MEETING_JOIN]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 