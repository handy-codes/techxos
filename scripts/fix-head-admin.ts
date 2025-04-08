/**
 * This script fixes issues with Head Admin permissions by ensuring:
 * 1. The HEAD_ADMIN role is correctly set in both the database and Clerk
 * 2. Any missing entries in LiveClassUser table for Clerk users are created
 * 
 * Run this with: npx tsx scripts/fix-head-admin.ts
 */

import { PrismaClient, LiveClassUserRole } from "@prisma/client";
import { clerkClient } from "@clerk/nextjs/server";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config({ path: '.env.local' });
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Starting Head Admin fix script...");
    
    // 1. Get head admin email from environment or use default
    const headAdminEmail = process.env.HEAD_ADMIN_EMAIL || "paxymekventures@gmail.com";
    console.log(`Using ${headAdminEmail} as HEAD_ADMIN email`);
    
    // 2. Find the Clerk user with this email
    const clerkUsers = await clerkClient.users.getUserList({
      emailAddress: [headAdminEmail],
    });
    
    if (!clerkUsers.length) {
      console.error(`No Clerk user found with email: ${headAdminEmail}`);
      return;
    }
    
    const clerkUser = clerkUsers[0];
    console.log(`Found Clerk user: ${clerkUser.id} (${clerkUser.firstName} ${clerkUser.lastName})`);
    
    // 3. Check if they exist in our database
    let dbUser = await prisma.liveClassUser.findFirst({
      where: {
        OR: [
          { clerkUserId: clerkUser.id },
          { email: headAdminEmail }
        ]
      }
    });
    
    // 4. Create or update the user
    if (!dbUser) {
      console.log("Creating HEAD_ADMIN user in database...");
      dbUser = await prisma.liveClassUser.create({
        data: {
          name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
          email: headAdminEmail,
          clerkUserId: clerkUser.id,
          role: LiveClassUserRole.HEAD_ADMIN,
          isActive: true
        }
      });
      console.log("Created new HEAD_ADMIN user in database.");
    } else if (dbUser.role !== LiveClassUserRole.HEAD_ADMIN) {
      console.log(`Updating user role from ${dbUser.role} to HEAD_ADMIN...`);
      dbUser = await prisma.liveClassUser.update({
        where: { id: dbUser.id },
        data: { 
          role: LiveClassUserRole.HEAD_ADMIN,
          isActive: true,
          clerkUserId: clerkUser.id // ensure Clerk ID is set
        }
      });
      console.log("User role updated to HEAD_ADMIN.");
    } else if (!dbUser.clerkUserId) {
      console.log("Linking database user to Clerk user ID...");
      dbUser = await prisma.liveClassUser.update({
        where: { id: dbUser.id },
        data: { clerkUserId: clerkUser.id }
      });
      console.log("User linked to Clerk ID.");
    } else {
      console.log("Database user already correctly set as HEAD_ADMIN.");
    }
    
    // 5. Update Clerk public metadata
    const currentMetadata = clerkUser.publicMetadata;
    if (currentMetadata.systemRole !== "HEAD_ADMIN") {
      console.log("Updating Clerk user metadata with HEAD_ADMIN role...");
      await clerkClient.users.updateUser(clerkUser.id, {
        publicMetadata: {
          ...currentMetadata,
          systemRole: "HEAD_ADMIN"
        }
      });
      console.log("Clerk metadata updated.");
    } else {
      console.log("Clerk metadata already has correct systemRole.");
    }
    
    console.log("HEAD_ADMIN fix complete!");
  } catch (error) {
    console.error("Error fixing HEAD_ADMIN:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 