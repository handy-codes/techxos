import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

async function checkAdminAccess(userId: string) {
  // Get user from Clerk to check email
  const clerkUser = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
    },
  }).then(res => res.json());

  // Check if user is HEAD_ADMIN by email
  if (clerkUser && clerkUser.email_addresses[0].email_address === "paxymekventures@gmail.com") {
    return true;
  }

  // If not HEAD_ADMIN, check database role
  const currentUser = await db.liveClassUser.findUnique({
    where: { id: userId }
  });

  return currentUser && ["HEAD_ADMIN", "ADMIN"].includes(currentUser.role);
}

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const hasAccess = await checkAdminAccess(userId);
    if (!hasAccess) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the target user by email (since userId is the email)
    const user = await db.liveClassUser.findUnique({
      where: { id: params.userId }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const hasAccess = await checkAdminAccess(userId);
    if (!hasAccess) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Prevent deleting yourself
    if (userId === params.userId) {
      return new NextResponse("Cannot delete your own account", { status: 400 });
    }

    // Delete the user by email
    await db.liveClassUser.delete({
      where: { id: params.userId }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[USER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const hasAccess = await checkAdminAccess(userId);
    if (!hasAccess) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, role, isActive } = body;

    // Update the user by email
    const updatedUser = await db.liveClassUser.update({
      where: { id: params.userId },
      data: { name, role, isActive }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[USER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 