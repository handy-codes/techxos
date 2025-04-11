import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { syncUserRole } from "@/lib/user-sync";

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    // Use the syncUserRole utility to get or create the user
    const user = await syncUserRole(userId);
    
    if (!user) {
      console.error("Failed to sync user role");
      return new NextResponse("User not found", { status: 404 });
    }
    
    // Check if user exists and has admin role
    const isAdmin = user && (user.role === "HEAD_ADMIN" || user.role === "ADMIN");
    
    console.log("Admin check result:", {
      userId,
      userExists: !!user,
      userRole: user?.role || "undefined",
      isAdmin
    });
    
    if (!isAdmin) {
      console.log("User does not have admin role");
      return new NextResponse("Forbidden", { status: 403 });
    }
    
    // User is admin, return success
    console.log("Admin access granted");
    return NextResponse.json({ success: true, role: user.role });
    
  } catch (error) {
    console.error("Error checking admin access:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 