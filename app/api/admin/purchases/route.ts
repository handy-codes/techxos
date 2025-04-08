import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-utils";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const authCheck = await requireAdmin();
    if (!authCheck.success) {
      return authCheck.response;
    }

    // Get all purchases with related user and course details
    const purchases = await db.liveClassPurchase.findMany({
      include: {
        liveClass: {
          select: {
            id: true,
            title: true,
            price: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // Get all users to match with purchases
    const users = await db.liveClassUser.findMany({
      select: {
        id: true,
        clerkUserId: true,
        name: true,
        email: true
      }
    });

    // Create a map of user IDs to user details
    const userMap = new Map();
    users.forEach(user => {
      userMap.set(user.id, user);
      if (user.clerkUserId) {
        userMap.set(user.clerkUserId, user);
      }
    });

    // Enhance purchase records with user details
    const enhancedPurchases = await Promise.all(purchases.map(async (purchase) => {
      // Try to find user in our map
      let userDetails = userMap.get(purchase.studentId);
      
      // If no user found and studentId looks like a Clerk ID
      if (!userDetails && purchase.studentId.startsWith("user_")) {
        try {
          // Try to get user details from Clerk
          const clerkUser = await clerkClient.users.getUser(purchase.studentId);
          userDetails = {
            clerkUserId: purchase.studentId,
            name: clerkUser.firstName && clerkUser.lastName 
              ? `${clerkUser.firstName} ${clerkUser.lastName}`
              : clerkUser.firstName || "Unknown",
            email: clerkUser.emailAddresses[0]?.emailAddress || "No email"
          };
        } catch (error) {
          console.error("Error fetching Clerk user:", error);
          userDetails = { name: "Unknown User", email: "Unknown Email" };
        }
      }

      return {
        ...purchase,
        student: userDetails || { name: "Unknown User", email: "Unknown Email" }
      };
    }));

    return NextResponse.json(enhancedPurchases);
  } catch (error) {
    console.error("[PURCHASES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 