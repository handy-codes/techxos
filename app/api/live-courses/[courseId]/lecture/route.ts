import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Simplified response for project management course
    if (params.courseId === 'project-mgt') {
      const zoomLink = process.env.ZOOM_PROJECT_MGT_MEETING_URL;
      
      if (!zoomLink) {
        return NextResponse.json({ 
          error: "Class link not configured" 
        }, { status: 500 });
      }

      // Return direct zoom link without database dependency for now
      return NextResponse.json({ 
        lecture: {
          id: 'project-mgt',
          zoomLink,
          lectures: []
        },
        hasAccess: true // We can implement purchase check later
      });
    }

    return NextResponse.json({ 
      error: "Course not found" 
    }, { status: 404 });

  } catch (error) {
    console.error("[LIVE_LECTURE_GET]", error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
} 