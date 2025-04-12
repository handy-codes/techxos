import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { LiveClassUserRole } from "@prisma/client";

export async function GET(req: Request) {
  try {
    // Get the current user for security check
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    // Get the email from the query parameters
    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    
    if (!email) {
      return NextResponse.json({ error: "Email parameter is required" }, { status: 400 });
    }
    
    // Find all users with this email (case insensitive)
    const users = await db.liveClassUser.findMany({
      where: {
        email: email.toLowerCase()
      }
    });
    
    if (users.length === 0) {
      return NextResponse.json({ 
        message: "No users found with this email", 
        email,
        suggestion: "Create a user with this email first" 
      });
    }
    
    // Return the users found
    return NextResponse.json({
      message: `Found ${users.length} users with email ${email}`,
      users
    });
  } catch (error) {
    console.error("Debug user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Get the current user for security check
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    // Get the request body
    const { email, role, clerkUserId } = await req.json();
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    
    if (!role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }
    
    // Find user by email
    const user = await db.liveClassUser.findUnique({
      where: { email }
    });
    
    if (!user) {
      // Create a new user if not found
      const newUser = await db.liveClassUser.create({
        data: {
          email,
          name: email.split('@')[0],
          role: role as LiveClassUserRole,
          clerkUserId: clerkUserId || `pending_${Date.now()}`,
          isActive: true
        }
      });
      
      return NextResponse.json({
        success: true,
        message: "User created with specified role",
        user: newUser
      });
    } else {
      // Update existing user
      const updatedUser = await db.liveClassUser.update({
        where: { id: user.id },
        data: {
          role: role as LiveClassUserRole,
          clerkUserId: clerkUserId || user.clerkUserId
        }
      });
      
      return NextResponse.json({
        success: true,
        message: "User role updated",
        user: updatedUser
      });
    }
  } catch (error) {
    console.error("Debug user update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 