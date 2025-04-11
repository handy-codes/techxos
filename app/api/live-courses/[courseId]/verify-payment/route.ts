import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import axios from "axios";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId } = params;
    const body = await req.json();
    const { tx_ref, transaction_id } = body;

    if (!tx_ref || !transaction_id) {
      return new NextResponse("Missing transaction details", { status: 400 });
    }

    // Verify with Flutterwave
    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        },
      }
    );

    const { status, data } = response.data;

    if (status !== "success" || data.status !== "successful") {
      return new NextResponse("Payment verification failed", { status: 400 });
    }

    // Update the purchase record
    const purchase = await db.liveClassPurchase.findFirst({
      where: {
        txRef: tx_ref,
        studentId: userId,
        liveClassId: courseId,
        status: "PENDING",
      },
    });

    if (!purchase) {
      return new NextResponse("Purchase record not found", { status: 404 });
    }

    // Update purchase status
    await db.liveClassPurchase.update({
      where: { id: purchase.id },
      data: {
        status: "COMPLETED",
        isActive: true,
        paymentDetails: {
          transactionId: transaction_id,
          paymentMethod: data.payment_type,
          paidAt: new Date(data.paid_at),
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PAYMENT_VERIFICATION] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 