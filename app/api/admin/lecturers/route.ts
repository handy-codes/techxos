import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { LiveClassUserRole } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the current Clerk user to access their email
    const clerkUser = await currentUser();
    
    if (!clerkUser?.emailAddresses?.[0]?.emailAddress) {
      console.error("[LECTURERS_GET] No email found for user");
      return new NextResponse("User email not found", { status: 401 });
    }

    // Log the authentication attempt for debugging
    const userEmail = clerkUser.emailAddresses[0].emailAddress;
    console.log(`[LECTURERS_GET] Attempting auth for: ${userEmail}`);

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

    // Remove security bypass
    if (!isAdmin) {
      console.error(`[LECTURERS_GET] User not authorized: ${userEmail}`);
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch users that could be lecturers, using a more flexible query
    const lecturers = await db.liveClassUser.findMany({
      where: {
        OR: [
          // Standard query for lecturers
          { role: LiveClassUserRole.LECTURER },
          // Also include specific known lecturer emails
          { email: { in: ["paxymek@gmail.com", "jonadanarueya@gmail.com"] } }
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    console.log(`[LECTURERS_GET] Found ${lecturers.length} lecturers`);
    return NextResponse.json(lecturers);
  } catch (error) {
    console.error("[LECTURERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the current Clerk user to access their email
    const clerkUser = await currentUser();
    
    if (!clerkUser?.emailAddresses?.[0]?.emailAddress) {
      console.error("[LECTURERS_POST] No email found for user");
      return new NextResponse("User email not found", { status: 401 });
    }

    // More permissive check - look for any user that might be an admin
    const userEmail = clerkUser.emailAddresses[0].emailAddress;
    console.log(`[LECTURERS_POST] Attempting auth for: ${userEmail}`);

    // Check if user is admin
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
      console.error(`[LECTURERS_POST] User not authorized: ${userEmail}`);
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, email, clerkUserId } = body;

    // Validate required fields
    if (!email) {
      return new NextResponse("Email is required", { status: 400 });
    }

    // Check if lecturer with this email already exists
    const existingLecturer = await db.liveClassUser.findUnique({
      where: { email }
    });

    if (existingLecturer) {
      return new NextResponse("Lecturer with this email already exists", { status: 400 });
    }

    // Create new lecturer
    const lecturer = await db.liveClassUser.create({
      data: {
        name,
        email,
        clerkUserId: clerkUserId || email, // Use email as clerkUserId if not provided
        role: LiveClassUserRole.LECTURER,
        isActive: true
      }
    });

    return NextResponse.json(lecturer);
  } catch (error) {
    console.error("[LECTURERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 