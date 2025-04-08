import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Get the headers
    const headerPayload = headers();
    const svixId = headerPayload.get("svix-id");
    const svixTimestamp = headerPayload.get("svix-timestamp");
    const svixSignature = headerPayload.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error("[WEBHOOK] Missing headers");
      return new NextResponse("Missing svix headers", { status: 400 });
    }

    // Get the body as text first, to avoid JSON parsing errors
    const text = await req.text();
    
    // Safe JSON parsing
    let payload;
    try {
      payload = JSON.parse(text);
    } catch (err) {
      console.error("[WEBHOOK] Invalid JSON", text.substring(0, 100));
      return new NextResponse("Invalid JSON payload", { status: 400 });
    }

    // Check for webhook secret - try multiple possible environment variable names
    const webhookSecret = 
      process.env.CLERK_WEBHOOK_SECRET || 
      process.env.WEBHOOK_SECRET;
    
    console.log("[WEBHOOK] Secret check:", {
      secret: webhookSecret ? "Found" : "Not found",
      envVars: {
        CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET ? "Set" : "Not set",
        WEBHOOK_SECRET: process.env.WEBHOOK_SECRET ? "Set" : "Not set"
      }
    });

    if (!webhookSecret) {
      console.error("[WEBHOOK] No webhook secret found in environment variables");
      return new NextResponse("Webhook secret not configured", { status: 500 });
    }

    const wh = new Webhook(webhookSecret);

    try {
      const evt = wh.verify(text, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as WebhookEvent;

      // Handle the webhook
      const eventType = evt.type;
      console.log(`[WEBHOOK] Processing ${eventType} event`);

      if (eventType === "user.created" || eventType === "user.updated") {
        const { id, email_addresses, first_name, last_name, public_metadata } = evt.data;
        const email = email_addresses[0]?.email_address;

        if (!email) {
          console.error("[WEBHOOK] No email found for user:", id);
          return new NextResponse("Missing email", { status: 400 });
        }

        // Get role from metadata or default to LEARNER
        const role = public_metadata?.systemRole || "LEARNER";

        await db.liveClassUser.upsert({
          where: { clerkUserId: id },
          update: {
            email,
            name: `${first_name || ""} ${last_name || ""}`.trim(),
            role,
            isActive: true
          },
          create: {
            clerkUserId: id,
            email,
            name: `${first_name || ""} ${last_name || ""}`.trim(),
            role,
            isActive: true
          }
        });

        console.log("[WEBHOOK] User processed:", { clerkUserId: id, email, role });
      }

      return new NextResponse(null, { status: 200 });
    } catch (err) {
      // Log detailed error information
      console.error("[WEBHOOK] Verification failed", {
        error: err instanceof Error ? err.message : "Unknown error",
        svixId,
        svixTimestamp,
        svixSignature: svixSignature ? "Present" : "Missing"
      });
      
      return new NextResponse("Invalid signature", { status: 400 });
    }
  } catch (error) {
    console.error("[WEBHOOK] Unhandled error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}





// import { Webhook } from "svix";
// import { headers } from "next/headers";
// import { WebhookEvent } from "@clerk/nextjs/server";
// import { db } from "@/lib/db";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   const debugInfo: any = {
//     timestamp: new Date().toISOString(),
//     received: true,
//   };

//   try {
//     // Get the headers
//     const headerPayload = headers();
//     const svix_id = headerPayload.get("svix-id");
//     const svix_timestamp = headerPayload.get("svix-timestamp");
//     const svix_signature = headerPayload.get("svix-signature");

//     debugInfo.headers = {
//       svix_id,
//       svix_timestamp,
//       svix_signature: svix_signature ? "present" : "missing",
//     };

//     console.log("[WEBHOOK] Received headers:", debugInfo.headers);

//     // If there are no headers, error out
//     if (!svix_id || !svix_timestamp || !svix_signature) {
//       debugInfo.error = "Missing svix headers";
//       debugInfo.missingHeaders = {
//         svix_id: !svix_id,
//         svix_timestamp: !svix_timestamp,
//         svix_signature: !svix_signature,
//       };
//       console.error("[WEBHOOK] Missing headers:", debugInfo.missingHeaders);
//       return NextResponse.json(debugInfo, { status: 400 });
//     }

//     // Get the body
//     const payload = await req.json();
//     debugInfo.payload = payload;
//     const body = JSON.stringify(payload);

//     // Create a new Svix instance with your secret.
//     const webhookSecret = process.env.WEBHOOK_SECRET;
//     if (!webhookSecret) {
//       debugInfo.error = "Webhook secret is not configured";
//       return NextResponse.json(debugInfo, { status: 500 });
//     }

//     const wh = new Webhook(webhookSecret);
//     debugInfo.webhookSecret = "configured";

//     let evt: WebhookEvent;

//     // Verify the payload with the headers
//     try {
//       evt = wh.verify(body, {
//         "svix-id": svix_id,
//         "svix-timestamp": svix_timestamp,
//         "svix-signature": svix_signature,
//       }) as WebhookEvent;
//       debugInfo.verification = "successful";
//     } catch (err: unknown) {
//       debugInfo.error = "Verification failed";
//       debugInfo.verificationError =
//         err instanceof Error ? err.message : "Unknown error";
//       return NextResponse.json(debugInfo, { status: 400 });
//     }

//     // Handle the webhook
//     const eventType = evt.type;
//     debugInfo.eventType = eventType;

//     if (eventType === "user.created") {
//       const { id, email_addresses, first_name, last_name } = evt.data;
//       debugInfo.userData = { id, email_addresses, first_name, last_name };

//       console.log("[WEBHOOK] Processing user.created event for userId:", id);

//       // Get the primary email
//       const primaryEmail = email_addresses?.[0]?.email_address;
//       if (!primaryEmail) {
//         debugInfo.error = "No primary email found";
//         console.error("[WEBHOOK] No primary email found for userId:", id);
//         return NextResponse.json(debugInfo, { status: 400 });
//       }

//       // Create user in database
//       try {
//         const existingUser = await db.liveClassUser.findUnique({
//           where: { id },
//         });

//         if (existingUser) {
//           debugInfo.status = "User already exists";
//           console.log(
//             "[WEBHOOK] User already exists in database for userId:",
//             id
//           );
//           return NextResponse.json(debugInfo, { status: 200 });
//         }

//         const newUser = await db.liveClassUser.create({
//           data: {
//             id,
//             email: primaryEmail,
//             name: `${first_name || ""} ${last_name || ""}`.trim(),
//             role: "LEARNER", // Default role
//             isActive: true,
//           },
//         });

//         debugInfo.status = "User created successfully";
//         debugInfo.newUser = newUser;
//         console.log("[WEBHOOK] User created successfully:", newUser);
//         return NextResponse.json(debugInfo, { status: 201 });
//       } catch (error: unknown) {
//         debugInfo.error = "Database error";
//         debugInfo.databaseError =
//           error instanceof Error ? error.message : "Unknown database error";
//         console.error(
//           "[WEBHOOK] Database error while creating user:",
//           debugInfo.databaseError
//         );
//         return NextResponse.json(debugInfo, { status: 500 });
//       }
//     }

//     debugInfo.status = "Webhook processed successfully";
//     return NextResponse.json(debugInfo, { status: 200 });
//   } catch (error: unknown) {
//     debugInfo.error = "Unhandled error";
//     debugInfo.errorDetails =
//       error instanceof Error ? error.message : "Unknown error";
//     console.error("[WEBHOOK] Unhandled error:", debugInfo.errorDetails);
//     return NextResponse.json(debugInfo, { status: 500 });
//   }

  
// }
