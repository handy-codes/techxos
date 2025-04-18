import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, class: className, topic, trainingDate, whatsappGroup } = body;

    if (!name || !className || !trainingDate) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Check if demo mode is enabled
    const classMode = await db.classMode.findFirst({
      where: {
        id: "1",
      },
    });

    if (classMode?.mode !== "demo") {
      return new NextResponse("Demo mode is not enabled", { status: 400 });
    }

    // Check if user has already registered
    const existingRegistration = await db.mathsDemo.findFirst({
      where: {
        userId,
      },
    });

    if (existingRegistration) {
      return new NextResponse("User has already registered for demo", { status: 400 });
    }

    // Create new demo registration
    const mathsDemo = await db.mathsDemo.create({
      data: {
        userId,
        name,
        class: className,
        topic,
        trainingDate,
        whatsappGroup: whatsappGroup || false
      },
    });

    return NextResponse.json(mathsDemo);
  } catch (error) {
    console.error("[MATHS_DEMO]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 