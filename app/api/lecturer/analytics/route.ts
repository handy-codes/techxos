import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { LiveClassUserRole, LiveClass, LiveClassPurchase, ZoomMeeting } from "@prisma/client";
import { addDays, startOfYear } from "date-fns";

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

    // Get current date for calculations
    const now = new Date();
    const startOfCurrentYear = startOfYear(now);
    const nextWeek = addDays(now, 7);

    // Get all classes for this lecturer
    const liveClasses = await db.liveClass.findMany({
      where: {
        lecturerId: user.id,
      },
      include: {
        purchases: true,
        zoomMeetings: true
      }
    });

    // Calculate total students (unique students who purchased any classes)
    const uniqueStudentIds = new Set<string>();
    liveClasses.forEach((liveClass: LiveClass & { 
      purchases: LiveClassPurchase[],
      zoomMeetings: ZoomMeeting[]
    }) => {
      liveClass.purchases.forEach((purchase: LiveClassPurchase) => {
        uniqueStudentIds.add(purchase.studentId);
      });
    });

    // Get all meetings
    const allMeetings = liveClasses.flatMap((liveClass: LiveClass & { 
      purchases: LiveClassPurchase[],
      zoomMeetings: ZoomMeeting[]
    }) => liveClass.zoomMeetings);
    
    // Calculate teaching hours by day
    interface DayHours {
      date: string;
      hours: number;
    }
    
    const teachingHoursByDay: DayHours[] = [];
    const meetingsByDay: Record<string, number> = {};

    allMeetings.forEach((meeting: ZoomMeeting) => {
      if (meeting.status === "ENDED") {
        const dateString = meeting.startTime.toISOString().split('T')[0];
        
        if (!meetingsByDay[dateString]) {
          meetingsByDay[dateString] = 0;
        }
        
        // Add duration in hours
        meetingsByDay[dateString] += meeting.duration / 60;
      }
    });

    // Convert to array format
    Object.keys(meetingsByDay).forEach(date => {
      teachingHoursByDay.push({
        date,
        hours: Math.round(meetingsByDay[date] * 10) / 10 // Round to 1 decimal
      });
    });

    // Calculate student attendance
    interface AttendanceData {
      meetingId: string;
      meetingTopic: string;
      attendeeCount: number;
      totalStudents: number;
    }
    
    const studentAttendance: AttendanceData[] = allMeetings
      .filter((meeting: ZoomMeeting) => meeting.status === "ENDED")
      .map((meeting: ZoomMeeting) => {
        const liveClass = liveClasses.find(lc => lc.id === meeting.liveClassId) as LiveClass & { 
          purchases: LiveClassPurchase[],
          zoomMeetings: ZoomMeeting[]
        };
        const totalStudents = liveClass ? liveClass.purchases.length : 0;
        // Since attendance is not in the schema, we'll use a default value
        const attendeeCount = 0; // This should be updated when attendance tracking is implemented

        return {
          meetingId: meeting.id,
          meetingTopic: meeting.topic,
          attendeeCount,
          totalStudents
        };
      });

    // Calculate class counts (students per class)
    interface ClassCount {
      title: string;
      count: number;
    }
    
    const classCounts: ClassCount[] = liveClasses.map((liveClass: LiveClass & { 
      purchases: LiveClassPurchase[],
      zoomMeetings: ZoomMeeting[]
    }) => ({
      title: liveClass.title,
      count: liveClass.purchases.length
    }));

    // Get upcoming meeting dates
    const upcomingMeetingDates = allMeetings
      .filter((meeting: ZoomMeeting) => {
        const meetingDate = new Date(meeting.startTime);
        return meetingDate > now && meetingDate < nextWeek && meeting.status === "SCHEDULED";
      })
      .map((meeting: ZoomMeeting) => meeting.startTime.toISOString())
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    // Calculate average attendance percentage
    let avgAttendance = 0;
    if (studentAttendance.length > 0) {
      const totalAttendancePercent = studentAttendance.reduce((sum, item) => {
        return sum + ((item.attendeeCount / item.totalStudents) * 100 || 0);
      }, 0);
      avgAttendance = Math.round(totalAttendancePercent / studentAttendance.length);
    }

    // Calculate total hours
    const totalHours = teachingHoursByDay.reduce((sum, day) => sum + day.hours, 0);

    // Return analytics data
    return NextResponse.json({
      teachingHoursByDay,
      studentAttendance,
      classCounts,
      upcomingMeetingDates,
      totalStats: {
        totalClasses: liveClasses.length,
        totalStudents: uniqueStudentIds.size,
        totalHours: Math.round(totalHours),
        avgAttendance
      }
    });
  } catch (error) {
    console.error("[LECTURER_ANALYTICS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 