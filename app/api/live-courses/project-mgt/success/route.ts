import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { liveCourseId } = await req.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create enrollment record
    await db.enrollment.create({
      data: {
        userId,
        liveCourseId,
        status: 'ACTIVE',
        paymentStatus: 'PAID'
      }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Success endpoint error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 