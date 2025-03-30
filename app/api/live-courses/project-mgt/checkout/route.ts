import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // For now, return hardcoded values
    return NextResponse.json({
      price: 250000, // Amount in NGN (250,000)
      studentEmail: "user@example.com", // This will be replaced with actual user email
      studentName: "Student Name", // This will be replaced with actual user name
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 