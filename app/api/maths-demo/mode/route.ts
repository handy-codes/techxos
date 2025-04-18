import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";

export async function GET() {
  try {
    const mode = await prisma.classMode.findFirst();
    return NextResponse.json({ mode: mode?.mode || "paid" });
  } catch (error) {
    console.error("Error fetching class mode:", error);
    return NextResponse.json(
      { error: "Failed to fetch class mode" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { success, user, response } = await requireAdmin();
    if (!success) {
      return response;
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Convert string IDs to numbers for comparison
    const userId = parseInt(user.id);
    const adminId = parseInt(process.env.ADMIN_USER_ID || "0");

    if (userId !== adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { mode } = await request.json();
    if (!mode || !["paid", "demo"].includes(mode)) {
      return NextResponse.json(
        { error: "Invalid mode. Must be 'paid' or 'demo'" },
        { status: 400 }
      );
    }

    const updatedMode = await prisma.classMode.upsert({
      where: { id: 1 },
      update: { mode },
      create: { id: 1, mode },
    });

    return NextResponse.json({ mode: updatedMode.mode });
  } catch (error) {
    console.error("Error updating class mode:", error);
    return NextResponse.json(
      { error: "Failed to update class mode" },
      { status: 500 }
    );
  }
} 