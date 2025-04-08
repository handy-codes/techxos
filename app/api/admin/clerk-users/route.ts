import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { requireAdmin } from "@/lib/auth-utils";

export async function POST(req: Request) {
  try {
    const authCheck = await requireAdmin();
    if (!authCheck.success) {
      return authCheck.response;
    }

    const { userIds } = await req.json();
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: "No user IDs provided" }, { status: 400 });
    }

    console.log(`Fetching Clerk details for ${userIds.length} users`);
    
    // Limit to 50 users at a time to prevent abuse
    const limitedUserIds = userIds.slice(0, 50);
    
    // Fetch users from Clerk
    const clerkUsers = await Promise.all(
      limitedUserIds.map(async (userId) => {
        try {
          const user = await clerkClient.users.getUser(userId);
          return {
            id: userId,
            name: user.firstName && user.lastName 
              ? `${user.firstName} ${user.lastName}`
              : user.firstName || "Unknown",
            email: user.emailAddresses[0]?.emailAddress || "No email",
            imageUrl: user.imageUrl
          };
        } catch (error) {
          console.error(`Error fetching user ${userId}:`, error);
          return {
            id: userId,
            name: "Error fetching user",
            email: "Error"
          };
        }
      })
    );

    return NextResponse.json(clerkUsers);
  } catch (error) {
    console.error("[CLERK_USERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 