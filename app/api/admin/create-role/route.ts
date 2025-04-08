import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { LiveClassUserRole } from "@prisma/client";

export async function POST(req: Request) {
  try {
    // Verify the current user is an admin
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Find the current user to check if they're admin
    const currentUser = await db.liveClassUser.findFirst({
      where: { clerkUserId: userId }
    });
    
    // Check if user is admin
    const isAdmin = currentUser?.role === "HEAD_ADMIN" || 
                   currentUser?.role === "ADMIN" ||
                   // Hardcoded admin emails as fallback
                   currentUser?.email === "paxymekventures@gmail.com" || 
                   currentUser?.email === "admin@techxos.com" || 
                   currentUser?.email === "emeka@techxos.com";
                   
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    // Get the email and role from the request
    const { email, name, role } = await req.json();
    
    // Validate inputs
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }
    
    if (!role || !Object.values(LiveClassUserRole).includes(role as LiveClassUserRole)) {
      return NextResponse.json({ error: "Valid role is required" }, { status: 400 });
    }
    
    // Check if the user already exists
    const existingUser = await db.liveClassUser.findUnique({
      where: { email }
    });
    
    let user;
    
    if (existingUser) {
      // Update the existing user's role
      user = await db.liveClassUser.update({
        where: { id: existingUser.id },
        data: { 
          role: role as LiveClassUserRole,
          name: name || existingUser.name
        }
      });
      
      return NextResponse.json({
        success: true,
        message: "User role updated successfully",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name
        }
      });
    } else {
      // Create a new user with a placeholder clerkUserId
      // This is needed because clerkUserId is required in the schema
      const placeholderId = `pending_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      user = await db.liveClassUser.create({
        data: {
          email,
          name: name || email.split('@')[0],
          role: role as LiveClassUserRole,
          isActive: true,
          clerkUserId: placeholderId // Add this required field
        }
      });
      
      return NextResponse.json({
        success: true,
        message: "User created successfully",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name
        }
      });
    }
  } catch (error) {
    console.error("[CREATE_ROLE_POST]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 