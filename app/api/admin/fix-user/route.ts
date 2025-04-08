import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-utils";
import { LiveClassUserRole } from "@prisma/client";

export async function POST(req: Request) {
  try {
    // Only allow admins to use this endpoint
    const authCheck = await requireAdmin();
    if (!authCheck.success) {
      return authCheck.response;
    }

    // Get request body
    const { email, clerkUserId, role } = await req.json();
    
    // Validate inputs
    if (!email || !clerkUserId) {
      return NextResponse.json({ error: "Email and clerkUserId are required" }, { status: 400 });
    }
    
    // Find the user by email
    const existingUser = await db.liveClassUser.findUnique({
      where: { email }
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found with this email" }, { status: 404 });
    }

    // Update the user with the correct Clerk ID and role
    const updatedUser = await db.liveClassUser.update({
      where: { id: existingUser.id },
      data: {
        clerkUserId,
        role: role ? role as LiveClassUserRole : existingUser.role
      }
    });

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        clerkUserId: updatedUser.clerkUserId
      }
    });
  } catch (error) {
    console.error("[FIX_USER_POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 