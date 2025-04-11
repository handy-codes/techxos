import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { syncUserRole } from "./user-sync";

export async function requireAdmin() {
  const { userId } = auth();
  
  if (!userId) {
    return {
      success: false,
      response: new NextResponse("Unauthorized", { status: 401 })
    };
  }
  
  try {
    // First try to sync the user role
    const syncedUser = await syncUserRole();
    
    // If sync failed, try direct database lookup
    const user = syncedUser || await db.liveClassUser.findUnique({
      where: { clerkUserId: userId }
    });
    
    if (!user || (user.role !== "HEAD_ADMIN" && user.role !== "ADMIN")) {
      return {
        success: false,
        response: new NextResponse("Unauthorized: Admin access required", { status: 403 })
      };
    }
    
    return {
      success: true,
      user
    };
  } catch (error) {
    console.error("Error checking admin access:", error);
    return {
      success: false,
      response: new NextResponse("Internal Server Error", { status: 500 })
    };
  }
} 