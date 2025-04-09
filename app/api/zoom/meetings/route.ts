import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { 
  createZoomMeeting, 
  formatDateForZoom,
  CreateZoomMeetingParams
} from "@/lib/zoom-api";
import { ZoomMeetingStatus } from "@prisma/client";

// Function to check if user has admin privileges
const isAdminOrLecturer = async (clerkUserId: string, clerkUserEmail: string, liveClassId?: string) => {
  // Look for user by either clerkUserId or email
  const user = await db.liveClassUser.findFirst({
    where: {
      OR: [
        { clerkUserId: clerkUserId },
        { email: clerkUserEmail }
      ]
    }
  });

  console.log(`[isAdminOrLecturer] Checking user: ${JSON.stringify(user, null, 2)}`);

  if (!user) {
    console.log(`[isAdminOrLecturer] No user found for clerkId: ${clerkUserId} or email: ${clerkUserEmail}`);
    return false;
  }

  // Admins have access to all classes
  if (user.role === "HEAD_ADMIN" || user.role === "ADMIN") {
    console.log(`[isAdminOrLecturer] User is admin: ${user.role}`);
    return true;
  }

  // For lecturers, check if they are assigned to the specific class
  if (user.role === "LECTURER" && liveClassId) {
    console.log(`[isAdminOrLecturer] Checking if lecturer has access to class: ${liveClassId}`);
    const liveClass = await db.liveClass.findUnique({
      where: { 
        id: liveClassId,
        lecturerId: user.id // Use the user.id, not clerkUserId
      }
    });
    return !!liveClass;
  }

  console.log(`[isAdminOrLecturer] User does not have permissions: ${user.role}`);
  return false;
};

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the current Clerk user to access their email
    const clerkUser = await currentUser();
    
    if (!clerkUser?.emailAddresses?.[0]?.emailAddress) {
      console.error("[ZOOM_MEETINGS_POST] No email found for user");
      return new NextResponse("User email not found", { status: 401 });
    }

    const userEmail = clerkUser.emailAddresses[0].emailAddress;
    console.log(`[ZOOM_MEETINGS_POST] Processing request for: ${userEmail}`);

    const body = await req.json();
    console.log(`[ZOOM_MEETINGS_POST] Request body:`, body);
    
    const { 
      topic, 
      startTime, 
      duration, 
      agenda, 
      password,
      settings,
      liveClassId 
    } = body;

    // Validate required fields
    if (!topic || !startTime || !duration || !liveClassId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Check if user has permission to create meetings for this class
    const hasPermission = await isAdminOrLecturer(userId, userEmail, liveClassId);
    if (!hasPermission) {
      console.error(`[ZOOM_MEETINGS_POST] Unauthorized access attempt for class ${liveClassId} by ${userEmail}`);
      return new NextResponse("Unauthorized to create meetings for this class", { status: 403 });
    }

    // Get the live class to associate with this meeting
    const liveClass = await db.liveClass.findUnique({
      where: { id: liveClassId },
      include: { lecturer: true }
    });

    if (!liveClass) {
      return new NextResponse("Live class not found", { status: 404 });
    }

    // Create Zoom meeting params
    const meetingParams: CreateZoomMeetingParams = {
      topic,
      start_time: formatDateForZoom(new Date(startTime)),
      duration,
      agenda,
      password,
      settings: {
        host_video: true,
        participant_video: false,
        join_before_host: false,
        mute_upon_entry: true,
        waiting_room: true,
        auto_recording: "cloud",
        alternative_hosts: liveClass.lecturer.email
      }
    };

    // Create the Zoom meeting
    const zoomMeeting = await createZoomMeeting(meetingParams);

    // Save meeting in our database
    const meeting = await db.zoomMeeting.create({
      data: {
        zoomMeetingId: zoomMeeting.id.toString(),
        topic: zoomMeeting.topic,
        startTime: new Date(zoomMeeting.start_time),
        duration: zoomMeeting.duration,
        agenda: zoomMeeting.agenda,
        password: zoomMeeting.password,
        joinUrl: zoomMeeting.join_url,
        startUrl: zoomMeeting.start_url,
        hostEmail: liveClass.lecturer.email,
        liveClassId,
        status: ZoomMeetingStatus.SCHEDULED
      }
    });

    console.log(`[ZOOM_MEETINGS_POST] Created meeting with ID: ${meeting.id}`);
    return NextResponse.json(meeting);
  } catch (error: any) {
    console.error("[ZOOM_MEETINGS_POST]", error);
    return new NextResponse(error.message || "Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the current Clerk user to access their email
    const clerkUser = await currentUser();
    
    if (!clerkUser?.emailAddresses?.[0]?.emailAddress) {
      console.error("[ZOOM_MEETINGS_GET] No email found for user");
      return new NextResponse("User email not found", { status: 401 });
    }

    const userEmail = clerkUser.emailAddresses[0].emailAddress;
    console.log(`[ZOOM_MEETINGS_GET] Processing request for: ${userEmail}`);

    const { searchParams } = new URL(req.url);
    const liveClassId = searchParams.get("liveClassId");
    
    // Get user based on clerk ID or email
    const user = await db.liveClassUser.findFirst({
      where: {
        OR: [
          { clerkUserId: userId },
          { email: userEmail }
        ]
      }
    });

    if (!user) {
      console.error(`[ZOOM_MEETINGS_GET] User not found for clerk ID: ${userId} or email: ${userEmail}`);
      return new NextResponse("User not found", { status: 404 });
    }

    console.log(`[ZOOM_MEETINGS_GET] Found user: ${user.id}, role: ${user.role}`);

    // Build the query based on user role and filters
    const query: any = {};
    
    // If liveClassId is provided, filter by it
    if (liveClassId) {
      query.liveClassId = liveClassId;
      
      // For non-admin users, check if they have access to this class
      if (user.role !== "HEAD_ADMIN" && user.role !== "ADMIN") {
        // For lecturers, check if they are assigned to the class
        if (user.role === "LECTURER") {
          const liveClass = await db.liveClass.findUnique({
            where: { 
              id: liveClassId,
              lecturerId: user.id // Use user.id, not clerk ID
            }
          });
          
          if (!liveClass) {
            console.error(`[ZOOM_MEETINGS_GET] Lecturer ${user.id} not authorized for class ${liveClassId}`);
            return new NextResponse("Unauthorized to view meetings for this class", { status: 403 });
          }
        }
        
        // For learners, check if they have purchased the class
        if (user.role === "LEARNER") {
          const purchase = await db.liveClassPurchase.findFirst({
            where: {
              liveClassId,
              studentId: user.id, // Use user.id, not clerk ID
              isActive: true,
              endDate: {
                gt: new Date()
              }
            }
          });
          
          if (!purchase) {
            console.error(`[ZOOM_MEETINGS_GET] Learner ${user.id} not authorized for class ${liveClassId}`);
            return new NextResponse("Unauthorized to view meetings for this class", { status: 403 });
          }
        }
      }
    } else {
      // If no liveClassId is provided, show meetings based on role
      if (user.role === "LECTURER") {
        // For lecturers, show meetings for classes they teach
        const teachingClasses = await db.liveClass.findMany({
          where: { lecturerId: user.id }, // Use user.id, not clerk ID
          select: { id: true }
        });
        
        if (teachingClasses.length === 0) {
          console.log(`[ZOOM_MEETINGS_GET] Lecturer ${user.id} has no classes`);
          return NextResponse.json([]);
        }
        
        query.liveClassId = {
          in: teachingClasses.map(c => c.id)
        };
      } else if (user.role === "LEARNER") {
        // For learners, show meetings for classes they've purchased
        const purchases = await db.liveClassPurchase.findMany({
          where: {
            studentId: user.id, // Use user.id, not clerk ID
            isActive: true,
            endDate: {
              gt: new Date()
            }
          },
          select: { liveClassId: true }
        });
        
        if (purchases.length === 0) {
          console.log(`[ZOOM_MEETINGS_GET] Learner ${user.id} has no active purchases`);
          return NextResponse.json([]);
        }
        
        query.liveClassId = {
          in: purchases.map(p => p.liveClassId)
        };
      }
      // For admins, no additional filters needed - they see all meetings
    }

    // Get meetings with their associated classes
    const meetings = await db.zoomMeeting.findMany({
      where: query,
      include: {
        liveClass: {
          select: {
            title: true,
            lecturer: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    });

    console.log(`[ZOOM_MEETINGS_GET] Returning ${meetings.length} meetings`);
    return NextResponse.json(meetings);
  } catch (error) {
    console.error("[ZOOM_MEETINGS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 