import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { syncUserFromClerk } from "@/lib/clerk-sync";

export async function GET() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    // Sync user from Clerk to database and update Clerk metadata
    const user = await syncUserFromClerk(userId);
    
    if (!user) {
      return new NextResponse("Failed to sync user", { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Error in sync route:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 