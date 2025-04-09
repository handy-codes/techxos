import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { LiveClassUserRole } from "@prisma/client";

export async function GET() {
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

    // Get current date for YTD calculations
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1); // January 1st of current year
    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + 7);

    // Get all classes for this lecturer
    const liveClasses = await db.liveClass.findMany({
      where: {
        lecturerId: user.id,
        isActive: true
      },
      include: {
        purchases: true,
        zoomMeetings: {
          include: {
            attendance: true
          }
        }
      }
    });

    // Calculate total students (unique students who purchased any of the lecturer's classes)
    const uniqueStudentIds = new Set();
    let totalEarnings = 0;

    liveClasses.forEach(liveClass => {
      liveClass.purchases.forEach(purchase => {
        uniqueStudentIds.add(purchase.studentId);
        totalEarnings += purchase.amount; // Sum up earnings
      });
    });

    // Calculate Zoom meeting stats
    const allMeetings = liveClasses.flatMap(liveClass => liveClass.zoomMeetings);
    
    // Upcoming meetings in the next 7 days
    const upcomingMeetings = allMeetings.filter(meeting => {
      const meetingDate = new Date(meeting.startTime);
      return meetingDate > now && meetingDate < nextWeek;
    }).length;
    
    // Completed meetings
    const completedMeetings = allMeetings.filter(meeting => 
      meeting.status === "ENDED" || meeting.status === "COMPLETED"
    ).length;
    
    // Calculate total teaching hours (from completed meetings)
    const totalHours = allMeetings.reduce((total, meeting) => {
      if (meeting.status === "ENDED" || meeting.status === "COMPLETED") {
        // Convert duration from minutes to hours
        return total + (meeting.duration / 60);
      }
      return total;
    }, 0);

    return NextResponse.json({
      totalStudents: uniqueStudentIds.size,
      totalClasses: liveClasses.length,
      totalHours: Math.round(totalHours), // Round to nearest hour
      totalEarnings: totalEarnings,
      upcomingMeetings: upcomingMeetings,
      completedMeetings: completedMeetings
    });
  } catch (error) {
    console.error("[LECTURER_DASHBOARD_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 