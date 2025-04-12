import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { LiveClassUserRole } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is an admin
    const user = await db.liveClassUser.findUnique({
      where: { id: userId }
    });

    if (!user || (user.role !== LiveClassUserRole.ADMIN && user.role !== LiveClassUserRole.HEAD_ADMIN)) {
      return new NextResponse("Unauthorized - Admin access required", { status: 403 });
    }

    const body = await req.json();
    const { purchaseId, status, transactionId, txRef } = body;

    if (!purchaseId) {
      return new NextResponse("Purchase ID is required", { status: 400 });
    }

    // Find the purchase
    const purchase = await db.liveClassPurchase.findUnique({
      where: { id: purchaseId }
    });

    if (!purchase) {
      return new NextResponse("Purchase not found", { status: 404 });
    }

    // Update the purchase
    const updatedPurchase = await db.liveClassPurchase.update({
      where: { id: purchaseId },
      data: {
        status: status || purchase.status,
        transactionId: transactionId || purchase.transactionId,
        txRef: txRef || purchase.txRef,
        isActive: status === "COMPLETED" ? true : purchase.isActive,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      purchase: updatedPurchase
    });
  } catch (error) {
    console.error("[UPDATE_PAYMENT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 