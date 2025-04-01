import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: clerkUserId } = auth();

    if (!clerkUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is HEAD_ADMIN
    const user = await db.liveClassUser.findFirst({
      where: {
        id: clerkUserId,
        role: "HEAD_ADMIN",
      },
    });

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch user details
    const userDetails = await db.liveClassUser.findUnique({
      where: {
        id: params.userId,
      },
    });

    if (!userDetails) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(userDetails);
  } catch (error) {
    console.error("[USER_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: clerkUserId } = auth();

    if (!clerkUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is HEAD_ADMIN
    const user = await db.liveClassUser.findFirst({
      where: {
        id: clerkUserId,
        role: "HEAD_ADMIN",
      },
    });

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, role, isActive } = body;

    // Update user
    const updatedUser = await db.liveClassUser.update({
      where: {
        id: params.userId,
      },
      data: {
        name,
        role,
        isActive,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[USER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: clerkUserId } = auth();

    if (!clerkUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is HEAD_ADMIN
    const user = await db.liveClassUser.findFirst({
      where: {
        id: clerkUserId,
        role: "HEAD_ADMIN",
      },
    });

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Delete user
    await db.liveClassUser.delete({
      where: {
        id: params.userId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[USER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 