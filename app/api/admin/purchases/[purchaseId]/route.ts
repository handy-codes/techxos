import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { purchaseId: string } }
) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the user's role
    const user = await prisma.liveClassUser.findUnique({
      where: { clerkUserId: userId },
      select: { role: true }
    });

    if (!user || !["HEAD_ADMIN", "ADMIN"].includes(user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Delete the purchase
    const purchase = await prisma.liveClassPurchase.delete({
      where: {
        id: params.purchaseId,
      },
    });

    return NextResponse.json(purchase);
  } catch (error) {
    console.error("[ADMIN_PURCHASE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 