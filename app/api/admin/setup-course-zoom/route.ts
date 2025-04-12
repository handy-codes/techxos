import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { LiveClassUserRole } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is an admin
    const user = await db.liveClassUser.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user || (user.role !== LiveClassUserRole.ADMIN && user.role !== LiveClassUserRole.HEAD_ADMIN)) {
      return new NextResponse("Unauthorized - Admin access required", { status: 403 });
    }

    // Get request body
    const body = await req.json();
    const { courseId, courseTitle, zoomLink } = body;

    if (!courseId || !courseTitle || !zoomLink) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Check if course exists
    let course = await db.course.findUnique({
      where: { id: courseId }
    });

    // If course doesn't exist, create it
    if (!course) {
      // Create a default category and subcategory if needed
      let category = await db.category.findFirst({
        where: { name: "Professional Development" }
      });

      if (!category) {
        category = await db.category.create({
          data: {
            name: "Professional Development"
          }
        });
      }

      let subCategory = await db.subCategory.findFirst({
        where: { name: "Project Management" }
      });

      if (!subCategory) {
        subCategory = await db.subCategory.create({
          data: {
            name: "Project Management",
            categoryId: category.id
          }
        });
      }

      // Create the course
      course = await db.course.create({
        data: {
          id: courseId,
          instructorId: user.id, // Use the admin as the instructor
          title: courseTitle,
          description: "Lead the Charge to Success with Project Management!",
          imageUrl: "https://i.ibb.co/4nDmr2nb/Gemini-Generated-Image-72ww6w72ww6w72ww.jpg",
          price: 250000,
          isPublished: true,
          categoryId: category.id,
          subCategoryId: subCategory.id
        }
      });
    }

    // First check if a zoom meeting already exists for this course
    const existingZoomMeeting = await db.courseZoomMeeting.findFirst({
      where: { courseId: course.id }
    });

    let zoomMeeting;
    
    if (existingZoomMeeting) {
      // Update existing zoom meeting
      zoomMeeting = await db.courseZoomMeeting.update({
        where: { id: existingZoomMeeting.id },
        data: {
          zoomLink: zoomLink,
          isActive: true
        }
      });
    } else {
      // Create new zoom meeting
      zoomMeeting = await db.courseZoomMeeting.create({
        data: {
          courseId: course.id,
          zoomLink: zoomLink,
          isActive: true
        }
      });
    }

    return NextResponse.json({
      success: true,
      course,
      zoomMeeting
    });
  } catch (error) {
    console.error("[SETUP_COURSE_ZOOM]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 