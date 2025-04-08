import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { LiveClassUserRole } from "@prisma/client";

interface CheckoutResponse {
  price: number;
  studentId: string;
  studentEmail: string;
  studentName: string;
  endDate: Date;
  liveClassId: string;
  classTitle: string;
}

export async function POST(req: Request) {
  try {
    const { userId: clerkUserId } = auth();

    if (!clerkUserId) {
      console.error("[CHECKOUT_POST] Unauthorized access attempt");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log("[CHECKOUT_POST] Received clerkUserId:", clerkUserId);

    // Find user using Clerk user ID
    const user = await db.liveClassUser.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      console.error("[CHECKOUT_POST] User not found for clerkUserId:", clerkUserId);
      return new NextResponse("Complete your profile first", { status: 404 });
    }

    // Create a project management course if it doesn't exist
    let liveClass = await db.liveClass.findFirst({
      where: {
        title: "Project Management",
        isActive: true,
      },
    });

    if (!liveClass) {
      // Create a default project management course for testing
      console.log("[CHECKOUT_POST] Creating default Project Management course");
      
      // Find a lecturer
      let lecturer = await db.liveClassUser.findFirst({
        where: { role: LiveClassUserRole.LECTURER }
      });
      
      if (!lecturer) {
        console.log("[CHECKOUT_POST] No lecturer found, creating a default lecturer");
        
        lecturer = await db.liveClassUser.create({
          data: {
            name: "Default Instructor",
            email: "instructor@techxos.com",
            role: LiveClassUserRole.LECTURER,
            clerkUserId: "default_instructor",
            isActive: true,
          }
        });
        
        console.log("[CHECKOUT_POST] Created default lecturer:", lecturer.id);
      }
      
      const startTime = new Date();
      const endTime = new Date();
      endTime.setDate(endTime.getDate() + 30); // 30 days from now
      
      liveClass = await db.liveClass.create({
        data: {
          title: "Project Management",
          description: "Learn project management fundamentals",
          startTime,
          endTime,
          isActive: true,
          price: 49.99,
          duration: 4, // 4 weeks
          batchNumber: 1,
          lecturerId: lecturer.id,
          zoomLink: process.env.ZOOM_PROJECT_MGT_MEETING_URL || "https://zoom.us/j/example",
          zoomMeetingId: process.env.ZOOM_PROJECT_MGT_MEETING_ID || "123456789",
          zoomPassword: process.env.ZOOM_PROJECT_MGT_MEETING_PASSWORD || "password123"
        }
      });
      
      console.log("[CHECKOUT_POST] Created default course:", liveClass.id);
    }

    // Check if user is a lecturer or admin - they don't need to purchase
    if (user.role === LiveClassUserRole.LECTURER || 
        user.role === LiveClassUserRole.ADMIN || 
        user.role === LiveClassUserRole.HEAD_ADMIN) {

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + liveClass.duration * 7);

      const response: CheckoutResponse = {
        price: 0,
        studentId: user.id,
        studentEmail: user.email,
        studentName: user.name || "",
        endDate,
        liveClassId: liveClass.id,
        classTitle: liveClass.title,
      };

      console.log("[CHECKOUT_POST] Admin/Lecturer checkout response:", response);
      return NextResponse.json(response);
    }

    const existingPurchase = await db.liveClassPurchase.findFirst({
      where: {
        studentId: user.id,
        liveClassId: liveClass.id,
        isActive: true,
        endDate: { gt: new Date() }
      },
    });

    if (existingPurchase) {
      console.error("[CHECKOUT_POST] User already purchased the class");
      return new NextResponse("Already purchased", { status: 400 });
    }

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + liveClass.duration * 7);

    const response: CheckoutResponse = {
      price: liveClass.price,
      studentId: user.id,
      studentEmail: user.email,
      studentName: user.name || "",
      endDate,
      liveClassId: liveClass.id,
      classTitle: liveClass.title,
    };

    console.log("[CHECKOUT_POST] Checkout response:", response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("[CHECKOUT_POST] Internal error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}