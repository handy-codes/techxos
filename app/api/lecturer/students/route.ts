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

    // Get all classes for this lecturer
    const liveClasses = await db.liveClass.findMany({
      where: {
        lecturerId: user.id,
      },
      select: {
        id: true,
        title: true,
        purchases: true,
        zoomMeetings: {
          select: {
            id: true,
            attendees: {
              select: {
                userId: true
              }
            }
          }
        }
      }
    });

    // Format student data
    const students = [];
    
    for (const liveClass of liveClasses) {
      // Skip classes with no purchases
      if (liveClass.purchases.length === 0) continue;
      
      // Calculate total meetings for this class
      const totalMeetings = liveClass.zoomMeetings.length;
      
      for (const purchase of liveClass.purchases) {
        // Count how many meetings this student attended
        let attendedMeetings = 0;
        
        if (totalMeetings > 0) {
          for (const meeting of liveClass.zoomMeetings) {
            const attended = meeting.attendees.some(
              (attendance: { userId: string }) => attendance.userId === purchase.studentId
            );
            
            if (attended) {
              attendedMeetings++;
            }
          }
        }
        
        // Calculate attendance rate (avoid division by zero)
        const attendanceRate = totalMeetings > 0 
          ? Math.round((attendedMeetings / totalMeetings) * 100) 
          : 100; // If no meetings yet, assume 100%
        
        // Get student details
        const student = await db.liveClassUser.findUnique({
          where: { id: purchase.studentId },
          select: {
            id: true,
            name: true,
            email: true
          }
        });
        
        if (!student) continue;
        
        students.push({
          id: student.id,
          name: student.name,
          email: student.email,
          classId: liveClass.id,
          className: liveClass.title,
          joinDate: purchase.createdAt,
          purchaseId: purchase.id,
          attendanceRate: attendanceRate,
          isActive: purchase.isActive
        });
      }
    }

    return NextResponse.json(students);
  } catch (error) {
    console.error("[LECTURER_STUDENTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 