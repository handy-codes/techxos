import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the current Clerk user to access their email
    const clerkUser = await currentUser();
    
    if (!clerkUser?.emailAddresses?.[0]?.emailAddress) {
      console.error("[MATHS_DEMO_UPDATE] No email found for user");
      return new NextResponse("User email not found", { status: 401 });
    }

    // Log the authentication attempt for debugging
    const userEmail = clerkUser.emailAddresses[0].emailAddress;
    console.log(`[MATHS_DEMO_UPDATE] Attempting auth for: ${userEmail}`);

    // More permissive check - look for any user that might be an admin
    const isAdmin = await db.liveClassUser.findFirst({
      where: {
        OR: [
          // Check by email
          { 
            email: userEmail,
            role: {
              in: ["HEAD_ADMIN", "ADMIN"]
            }
          },
          // Check by clerkUserId
          {
            clerkUserId: userId,
            role: {
              in: ["HEAD_ADMIN", "ADMIN"]
            }
          }
        ]
      }
    });

    if (!isAdmin) {
      console.error(`[MATHS_DEMO_UPDATE] User not authorized: ${userEmail}`);
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, class: className, topic, trainingDate, whatsappGroup } = body;

    if (!name || !className || !trainingDate) {
      return new NextResponse("Missing required fields", { status: 400 });
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

    const updatedRegistration = await db.mathsDemo.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        class: className,
        topic,
        trainingDate: parsedDate,
        whatsappGroup,
        startTime: new Date(),
        duration: 60
      },
    });

    return NextResponse.json(updatedRegistration);
  } catch (error) {
    console.error("[MATHS_DEMO_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the current Clerk user to access their email
    const clerkUser = await currentUser();
    
    if (!clerkUser?.emailAddresses?.[0]?.emailAddress) {
      console.error("[MATHS_DEMO_DELETE] No email found for user");
      return new NextResponse("User email not found", { status: 401 });
    }

    // Log the authentication attempt for debugging
    const userEmail = clerkUser.emailAddresses[0].emailAddress;
    console.log(`[MATHS_DEMO_DELETE] Attempting auth for: ${userEmail}`);

    // More permissive check - look for any user that might be an admin
    const isAdmin = await db.liveClassUser.findFirst({
      where: {
        OR: [
          // Check by email
          { 
            email: userEmail,
            role: {
              in: ["HEAD_ADMIN", "ADMIN"]
            }
          },
          // Check by clerkUserId
          {
            clerkUserId: userId,
            role: {
              in: ["HEAD_ADMIN", "ADMIN"]
            }
          }
        ]
      }
    });

    if (!isAdmin) {
      console.error(`[MATHS_DEMO_DELETE] User not authorized: ${userEmail}`);
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await db.mathsDemo.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[MATHS_DEMO_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 