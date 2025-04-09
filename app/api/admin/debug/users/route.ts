import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // For debugging purposes, allow access with minimal checks
    const users = await db.liveClassUser.findMany({
      orderBy: [
        { role: 'asc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("[DEBUG_USERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 