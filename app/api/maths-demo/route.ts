import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs/server";
import { requireAdmin } from "@/lib/auth-utils";

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

    // Convert trainingDate string to DateTime
    let parsedDate: Date;
    
    if (trainingDate === "19th April 5:00pm") {
      parsedDate = new Date("2024-04-19T17:00:00.000Z");
    } else if (trainingDate === "20th April 5:00pm") {
      parsedDate = new Date("2024-04-20T17:00:00.000Z");
    } else if (trainingDate === "Both") {
      // Default to the first date if "Both" is selected
      parsedDate = new Date("2024-04-19T17:00:00.000Z");
    } else {
      // Try to parse as ISO string if it's in that format
      parsedDate = new Date(trainingDate);
      
      // Check if the date is valid
      if (isNaN(parsedDate.getTime())) {
        return new NextResponse("Invalid date format", { status: 400 });
      }
    }

    // Create new demo registration
    const mathsDemo = await db.mathsDemo.create({
      data: {
        userId,
        name,
        class: className,
        topic,
        trainingDate: parsedDate,
        whatsappGroup: whatsappGroup || false,
        startTime: new Date(),
        duration: 60
      },
    });

    return NextResponse.json(mathsDemo);
  } catch (error) {
    console.error("[MATHS_DEMO]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const authCheck = await requireAdmin();
    if (!authCheck.success) {
      return authCheck.response;
    }

    // Get all registrations
    const registrations = await db.mathsDemo.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get unique user IDs
    const userIds = [...new Set(registrations.map(r => r.userId))];
    
    // Fetch user data in batches to avoid timeouts
    const userDataMap = new Map();
    const batchSize = 10;
    
    for (let i = 0; i < userIds.length; i += batchSize) {
      const batch = userIds.slice(i, i + batchSize);
      await Promise.all(
        batch.map(async (userId) => {
          try {
            const user = await clerkClient.users.getUser(userId);
            userDataMap.set(userId, {
              email: user.emailAddresses[0]?.emailAddress,
              firstName: user.firstName,
              lastName: user.lastName,
            });
          } catch (error) {
            console.error(`Error fetching user ${userId}:`, error);
            // Don't set default values, just log the error
          }
        })
      );
    }

    // Combine registration data with user data
    const registrationsWithUserInfo = registrations.map(registration => {
      const userData = userDataMap.get(registration.userId);
      
      return {
        ...registration,
        userEmail: userData?.email || "",
        userFirstName: userData?.firstName || "",
        userLastName: userData?.lastName || "",
      };
    });

    return NextResponse.json(registrationsWithUserInfo);
  } catch (error) {
    console.error("[MATHS_DEMO_GET] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 