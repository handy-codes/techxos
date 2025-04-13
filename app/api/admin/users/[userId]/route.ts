import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { syncUserRole } from "@/lib/user-sync";
import { requireAdmin } from "@/lib/auth-utils";
import { createClerkClient } from "@clerk/backend";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // Validate admin access
    const adminCheck = await requireAdmin();
    if (!adminCheck.success) {
      return adminCheck.response;
    }

    const user = await db.liveClassUser.findUnique({
      where: { id: params.userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // Validate admin access
    const adminCheck = await requireAdmin();
    if (!adminCheck.success) {
      return adminCheck.response;
    }

    const { isActive, role, name, email } = await req.json();
    
    // Find the user first
    const existingUser = await db.liveClassUser.findUnique({
      where: { id: params.userId },
    });

    if (!existingUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    // If changing role, use the sync function to update both DB and Clerk
    if (role && role !== existingUser.role) {
      const updatedUser = await syncUserRole(existingUser.clerkUserId);
      
      // Update other fields if provided
      if (isActive !== undefined || name || email) {
        const updateData: any = {};
        if (isActive !== undefined) updateData.isActive = isActive;
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        
        await db.liveClassUser.update({
          where: { id: params.userId },
          data: updateData
        });
      }
      
      return NextResponse.json(updatedUser);
    } 
    // Regular update without role change
    else {
      const updateData: any = {};
      if (isActive !== undefined) updateData.isActive = isActive;
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      
      const updatedUser = await db.liveClassUser.update({
        where: { id: params.userId },
        data: updateData
      });
      
      return NextResponse.json(updatedUser);
    }
  } catch (error) {
    console.error("[USER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const authCheck = await requireAdmin();
    if (!authCheck.success) {
      return authCheck.response;
    }

    // Only HEAD_ADMIN can delete users
    if (authCheck.user && authCheck.user.role !== "HEAD_ADMIN") {
      return new NextResponse("Only HEAD_ADMIN can delete users", { status: 403 });
    }

    const { userId } = params;
    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    console.log(`[USER_DELETE] Deleting user: ${userId}`);

    // Get the user to be deleted
    const userToDelete = await db.liveClassUser.findUnique({
      where: { id: userId }
    });

    if (!userToDelete) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Delete purchases associated with this user
    await db.liveClassPurchase.deleteMany({
      where: { studentId: userId }
    });

    // Delete the user from our database
    await db.liveClassUser.delete({
      where: { id: userId }
    });

    // Attempt to deactivate the Clerk user if there's a clerkUserId
    if (userToDelete.clerkUserId) {
      try {
        const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });
        await clerk.users.updateUser(userToDelete.clerkUserId, {
          publicMetadata: { banned: true }
        });
        console.log(`[USER_DELETE] Banned Clerk user: ${userToDelete.clerkUserId}`);
      } catch (clerkError) {
        console.error("[USER_DELETE] Error deactivating Clerk user:", clerkError);
        // Continue with the deletion even if Clerk update fails
      }
    }

    console.log(`[USER_DELETE] Successfully deleted user: ${userId}`);
    return NextResponse.json({ 
      success: true, 
      message: "User deleted successfully",
      deletedUserId: userId
    });
  } catch (error) {
    console.error("[USER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 