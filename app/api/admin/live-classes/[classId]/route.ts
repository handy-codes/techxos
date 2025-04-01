import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { classId: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user || (user.role !== "ADMIN" && user.role !== "HEAD_ADMIN")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const liveClass = await db.liveClass.findUnique({
      where: { id: params.classId },
      include: {
        lecturer: true,
        purchases: {
          include: {
            student: true
          }
        },
        materials: true,
        schedules: true
      }
    });

    if (!liveClass) {
      return new NextResponse("Live class not found", { status: 404 });
    }

    return NextResponse.json(liveClass);
  } catch (error) {
    console.error("[LIVE_CLASS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { classId: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is admin
    const user = await db.liveClassUser.findFirst({
      where: {
        email: userId,
        role: {
          in: ["HEAD_ADMIN", "ADMIN"]
        }
      }
    });

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { isActive } = body;

    const liveClass = await db.liveClass.update({
      where: {
        id: params.classId
      },
      data: {
        isActive
      }
    });

    return NextResponse.json(liveClass);
  } catch (error) {
    console.error("[LIVE_CLASS_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { classId: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is admin
    const user = await db.liveClassUser.findFirst({
      where: {
        email: userId,
        role: {
          in: ["HEAD_ADMIN", "ADMIN"]
        }
      }
    });

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await db.liveClass.delete({
      where: {
        id: params.classId
      }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[LIVE_CLASS_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 