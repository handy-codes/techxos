import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if demo mode is enabled
    const classMode = await db.classMode.findFirst({
      where: {
        id: "1",
      },
    });

    const isDemoMode = classMode?.mode === "demo";

    if (!isDemoMode) {
      return NextResponse.json({ hasAccess: false, isDemoMode: false });
    }

    // Check if user has already registered for demo
    const demoRegistration = await db.mathsDemo.findFirst({
      where: {
        userId,
      },
    });

    return NextResponse.json({
      hasAccess: !!demoRegistration,
      isDemoMode: true,
    });
  } catch (error) {
    console.error("[CHECK_ACCESS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 