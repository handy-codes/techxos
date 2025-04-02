import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export async function PUT(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { role } = await req.json();
    if (!role) {
      return new NextResponse("Role is required", { status: 400 });
    }

    // Update user role
    const updatedUser = await db.liveClassUser.update({
      where: { id: userId },
      data: { role }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[USER_ROLE_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 