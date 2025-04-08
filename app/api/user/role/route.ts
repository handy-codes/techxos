import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId: clerkUserId } = auth();

    if (!clerkUserId) {
      return NextResponse.json({ 
        role: null, 
        isSignedIn: false,
        message: "Not signed in" 
      }, { status: 401 });
    }

    // Log the clerk user ID for debugging
    console.log("[USER_ROLE] Fetching role for clerkUserId:", clerkUserId);

    // Check if there's a sync file with admin info
    let isAdminFromSync = false;
    let syncFileInfo = null;
    
    try {
      // This only works in browser requests, not in server-side
      // Just as a fallback mechanism
      const syncFilePath = process.cwd() + '/public/role-sync.json';
      const fs = require('fs');
      if (fs.existsSync(syncFilePath)) {
        const syncData = JSON.parse(fs.readFileSync(syncFilePath, 'utf8'));
        syncFileInfo = { 
          lastSync: syncData.lastSync,
          adminEmail: syncData.adminEmail
        };
      }
    } catch (fsError) {
      console.error("[USER_ROLE] Error reading sync file:", fsError);
    }

    // Find user in the database
    const user = await db.liveClassUser.findUnique({
      where: { clerkUserId },
      select: { 
        id: true,
        role: true,
        email: true,
        name: true,
        isActive: true
      }
    });

    if (!user) {
      // Check if any user exists at all (could be database connection issue)
      const anyUser = await db.liveClassUser.findFirst({
        select: { id: true }
      });
      
      return NextResponse.json({
        role: null,
        isSignedIn: true,
        clerkId: clerkUserId,
        userExists: false,
        anyUserExists: !!anyUser,
        syncFileInfo,
        message: "User not found in database"
      }, { status: 404 });
    }

    // Look for this user's purchases
    const purchases = await db.liveClassPurchase.findMany({
      where: {
        studentId: user.id,
        isActive: true,
        endDate: { gt: new Date() }
      },
      select: {
        id: true,
        liveClassId: true,
        endDate: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      role: user.role,
      isSignedIn: true,
      isActive: user.isActive,
      userId: user.id,
      email: user.email,
      name: user.name,
      syncFileInfo,
      hasPurchases: purchases.length > 0,
      purchaseCount: purchases.length,
      message: "User role retrieved successfully"
    });
  } catch (error) {
    console.error("[USER_ROLE] Error fetching user role:", error);
    return NextResponse.json({ 
      role: null, 
      isSignedIn: false,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Internal server error"
    }, { status: 500 });
  }
} 