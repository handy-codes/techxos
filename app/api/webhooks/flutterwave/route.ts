import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    // Get the raw body for signature verification
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);
    
    // Verify the webhook signature
    const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;
    const signature = req.headers.get("x-flutterwave-signature");
    
    if (!secretHash || !signature) {
      return new NextResponse("Missing signature or secret hash", { status: 400 });
    }
    
    // Verify the signature
    const expectedSignature = crypto
      .createHmac("sha512", secretHash)
      .update(rawBody)
      .digest("hex");
    
    if (signature !== expectedSignature) {
      return new NextResponse("Invalid signature", { status: 400 });
    }
    
    // Extract payment details
    const { 
      tx_ref, 
      transaction_id, 
      status, 
      amount, 
      currency, 
      customer 
    } = body;
    
    // Check if this is a successful payment
    if (status !== "successful") {
      return new NextResponse("Payment not successful", { status: 200 });
    }
    
    // Extract course ID from tx_ref (format: courseId-uuid)
    const courseId = tx_ref.split("-")[0];
    
    // Find the pending purchase
    const purchase = await db.liveClassPurchase.findFirst({
      where: {
        txRef: tx_ref,
        status: "PENDING",
      },
    });
    
    if (!purchase) {
      return new NextResponse("Purchase not found", { status: 404 });
    }
    
    // Update the purchase record
    await db.liveClassPurchase.update({
      where: {
        id: purchase.id,
      },
      data: {
        status: "COMPLETED",
        isActive: true,
        transactionId: transaction_id,
      },
    });
    
    // Update user's access to the course
    if (purchase.studentId) {
      await db.liveClassUser.update({
        where: {
          id: purchase.studentId,
        },
        data: {
          isActive: true,
        },
      });
    }
    
    // Return success
    return new NextResponse("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("[FLUTTERWAVE_WEBHOOK] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 