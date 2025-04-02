import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const debugInfo: any = {
    timestamp: new Date().toISOString(),
    received: true
  };

  try {
    // Get the headers
    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    debugInfo.headers = {
      svix_id,
      svix_timestamp,
      svix_signature: svix_signature ? 'present' : 'missing'
    };

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      debugInfo.error = 'Missing svix headers';
      return NextResponse.json(debugInfo, { status: 400 });
    }

    // Get the body
    const payload = await req.json();
    debugInfo.payload = payload;
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(process.env.WEBHOOK_SECRET || '');
    debugInfo.webhookSecret = process.env.WEBHOOK_SECRET ? 'configured' : 'missing';

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
      debugInfo.verification = 'successful';
    } catch (err) {
      debugInfo.error = 'Verification failed';
      debugInfo.verificationError = err.message;
      return NextResponse.json(debugInfo, { status: 400 });
    }

    // Handle the webhook
    const eventType = evt.type;
    debugInfo.eventType = eventType;

    if (eventType === 'user.created') {
      const { id, email_addresses, first_name, last_name } = evt.data;
      debugInfo.userData = { id, email_addresses, first_name, last_name };

      // Get the primary email
      const primaryEmail = email_addresses.find(email => email.primary)?.email_address;
      if (!primaryEmail) {
        debugInfo.error = 'No primary email found';
        return NextResponse.json(debugInfo, { status: 400 });
      }

      // Create user in database
      try {
        const existingUser = await db.liveClassUser.findUnique({
          where: { id }
        });

        if (existingUser) {
          debugInfo.status = 'User already exists';
          return NextResponse.json(debugInfo, { status: 200 });
        }

        const newUser = await db.liveClassUser.create({
          data: {
            id,
            email: primaryEmail,
            name: `${first_name || ''} ${last_name || ''}`.trim(),
            role: "LEARNER", // Default role
            isActive: true
          }
        });

        debugInfo.status = 'User created successfully';
        debugInfo.newUser = newUser;
        return NextResponse.json(debugInfo, { status: 201 });
      } catch (error) {
        debugInfo.error = 'Database error';
        debugInfo.databaseError = error.message;
        return NextResponse.json(debugInfo, { status: 500 });
      }
    }

    debugInfo.status = 'Webhook processed successfully';
    return NextResponse.json(debugInfo, { status: 200 });
  } catch (error) {
    debugInfo.error = 'Unhandled error';
    debugInfo.errorDetails = error.message;
    return NextResponse.json(debugInfo, { status: 500 });
  }
} 