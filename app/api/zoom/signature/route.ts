import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { generateZoomSignature } from "@/lib/zoom-signature";

const ZOOM_API_KEY = process.env.ZOOM_API_KEY!;
const ZOOM_API_SECRET = process.env.ZOOM_API_SECRET!;

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { meetingNumber, role, userEmail, userName } = await req.json();

    // Get user role from database
    const user = await db.liveClassUser.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Verify user has permission to join as host
    if (role === 1 && !['HEAD_ADMIN', 'ADMIN', 'LECTURER'].includes(user.role)) {
      return new NextResponse('Unauthorized role', { status: 403 });
    }

    // Generate Zoom signature
    const signature = generateZoomSignature(meetingNumber, role);

    return NextResponse.json({ signature });
  } catch (error) {
    console.error('Error generating Zoom signature:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 