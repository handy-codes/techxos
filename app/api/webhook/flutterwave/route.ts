import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { status, tx_ref, transaction_id } = body;

    console.log("Flutterwave webhook received:", { status, tx_ref, transaction_id });

    // Validate required fields
    if (!status || !tx_ref || !transaction_id) {
      console.error("Missing required fields in webhook payload");
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Find the pending purchase by transaction reference
    const purchase = await db.liveClassPurchase.findFirst({
      where: {
        txRef: tx_ref,
        status: "PENDING",
      },
    });

    if (!purchase) {
      console.error(`No pending purchase found for tx_ref: ${tx_ref}`);
      return new NextResponse("Purchase not found", { status: 404 });
    }

    console.log("Found purchase to update:", purchase.id);

    // Update the purchase record
    const updatedPurchase = await db.liveClassPurchase.update({
      where: {
        id: purchase.id,
      },
      data: {
        status: "COMPLETED",
        isActive: true,
        transactionId: transaction_id,
        updatedAt: new Date(),
      },
    });

    console.log(`Payment processed successfully for tx_ref: ${tx_ref}, purchase ID: ${updatedPurchase.id}`);

    return NextResponse.json({
      success: true,
      message: "Payment processed successfully",
    });
  } catch (error) {
    console.error("[FLUTTERWAVE_WEBHOOK]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 