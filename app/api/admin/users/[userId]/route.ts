import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { LiveClassUserRole } from "@prisma/client";
import { syncUserRole } from "@/lib/user-sync";
import { requireAdmin } from "@/lib/auth-utils";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // Validate admin access
    const adminCheck = await requireAdmin();
    if (!adminCheck.success) {
      return new NextResponse(adminCheck.message, { status: adminCheck.status });
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
      return new NextResponse(adminCheck.message, { status: adminCheck.status });
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
      const updatedUser = await syncUserRole(params.userId, role as LiveClassUserRole);
      
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
    // Validate admin access
    const adminCheck = await requireAdmin();
    if (!adminCheck.success) {
      return new NextResponse(adminCheck.message, { status: adminCheck.status });
    }

    const user = await db.liveClassUser.findUnique({
      where: { id: params.userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Consider soft-delete by setting isActive to false instead of actual deletion
    const deletedUser = await db.liveClassUser.update({
      where: { id: params.userId },
      data: { isActive: false }
    });

    return NextResponse.json(deletedUser);
  } catch (error) {
    console.error("[USER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 