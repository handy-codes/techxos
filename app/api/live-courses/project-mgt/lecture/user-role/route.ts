import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get user from database
    const user = await db.liveClassUser.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    return NextResponse.json({
      success: true,
      role: user.role,
      firstName: user.name?.split(' ')[0] || 'User'
    });
  } catch (error) {
    console.error('Error getting user role:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 