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

    const body = await req.json();
    const { userId: targetUserId } = body;

    if (!targetUserId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    // Update user to be a lecturer
    const updatedUser = await db.liveClassUser.update({
      where: { id: targetUserId },
      data: {
        role: LiveClassUserRole.LECTURER,
        isActive: true
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[CONVERT_TO_LECTURER_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 