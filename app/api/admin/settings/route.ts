import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
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

// GET endpoint to retrieve settings
export async function GET() {
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

    // Get settings - create default if doesn't exist
    let settings = await db.systemSettings.findFirst();
    
    if (!settings) {
      // Create default settings if none exist
      settings = await db.systemSettings.create({
        data: {}  // Will use schema defaults
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("[SETTINGS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// PUT endpoint to update settings
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

    // Get request body
    const body = await req.json();
    
    // Get settings record
    let settings = await db.systemSettings.findFirst();
    
    if (!settings) {
      // Create settings if they don't exist
      settings = await db.systemSettings.create({
        data: {
          ...body
        }
      });
    } else {
      // Update existing settings
      settings = await db.systemSettings.update({
        where: { id: settings.id },
        data: {
          ...body
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("[SETTINGS_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 