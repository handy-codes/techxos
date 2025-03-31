import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId } = auth();
    
    // Check if user is authenticated
    if (!userId) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }), 
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Add debug logging
    console.log("Searching for course with slug: project-mgt");
    
    // First, find the live course
    const liveCourse = await db.liveCourse.findUnique({
      where: {
        slug: "project-mgt",
      },
      include: {
        lectures: true,
      },
    }).catch(error => {
      console.error("Database error:", error);
      return null;
    });

    // Add debug logging
    console.log("Live course found:", liveCourse);

    if (!liveCourse) {
      return new NextResponse(
        JSON.stringify({ error: "Course not found" }), 
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if user has purchased/enrolled
    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_liveCourseId: {
          userId: userId,
          liveCourseId: liveCourse.id,
        },
      },
    }).catch(error => {
      console.error("Enrollment error:", error);
      return null;
    });

    // Return course data with access status
    return NextResponse.json({
      lecture: liveCourse,
      hasAccess: !!enrollment && enrollment.status === "ACTIVE",
    });

  } catch (error) {
    // Log the full error details with better context
    console.error("[LIVE_COURSE_GET] Detailed error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      type: error instanceof Error ? error.constructor.name : typeof error
    });
    
    // Return a properly formatted error response
    return new NextResponse(
      JSON.stringify({ 
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error occurred",
        type: error instanceof Error ? error.constructor.name : typeof error
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Your existing code
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
} 