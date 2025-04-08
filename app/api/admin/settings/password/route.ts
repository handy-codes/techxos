import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

// Helper function to check if user is an admin
async function isAdmin(clerkUserId: string) {
  const user = await db.liveClassUser.findFirst({
    where: {
      clerkUserId,
      role: {
        in: ["HEAD_ADMIN", "ADMIN"]
      }
    },
  });
  
  return !!user;
}

// PUT endpoint to update user password
export async function PUT(req: Request) {
  try {
    const { userId: clerkUserId } = auth();

    if (!clerkUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is an admin
    const isAdminUser = await isAdmin(clerkUserId);
    if (!isAdminUser) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Get password from request body
    const { password } = await req.json();
    
    if (!password || password.length < 8) {
      return new NextResponse("Password must be at least 8 characters", { status: 400 });
    }

    // Update password using Clerk API
    try {
      await clerkClient.users.updateUser(clerkUserId, {
        password
      });
      
      return NextResponse.json({ success: true });
    } catch (clerkError) {
      console.error("Clerk password update error:", clerkError);
      return new NextResponse("Failed to update password", { status: 500 });
    }
  } catch (error) {
    console.error("[PASSWORD_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 