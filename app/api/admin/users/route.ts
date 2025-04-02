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

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const hasAccess = await checkAdminAccess(userId);
    if (!hasAccess) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get all users
    const users = await db.liveClassUser.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("[USERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
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
    const { email, name, role } = body;

    // Create new user
    const newUser = await db.liveClassUser.create({
      data: {
        id: email,
        email,
        name,
        role,
        isActive: true,
      },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error("[USERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 