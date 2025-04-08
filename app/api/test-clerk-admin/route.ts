import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Try to list users - this requires admin permissions
    const users = await clerkClient.users.getUserList({
      limit: 1, // Just get one user to verify access
    });
    
    return NextResponse.json({
      success: true,
      message: "Clerk Admin API access confirmed!",
      userCount: users.data.length,
      firstUserId: users.data[0]?.id || null,
    });
  } catch (error: any) {
    console.error("Failed to access Clerk Admin API", error);
    
    return NextResponse.json({
      success: false,
      message: "Failed to access Clerk Admin API",
      error: error.message || "Unknown error",
    }, { status: 500 });
  }
} 