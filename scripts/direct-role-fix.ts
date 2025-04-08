/**
 * This script directly updates a user's role in the database without requiring Clerk
 * Run with: npx tsx scripts/direct-role-fix.ts
 */

import { PrismaClient, LiveClassUserRole } from "@prisma/client";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Starting direct role fix...");
    
    // 1. Find the HEAD_ADMIN by email or name
    const adminEmail = process.env.HEAD_ADMIN_EMAIL || "paxymekventures@gmail.com";
    console.log(`Looking for admin with email: ${adminEmail}`);
    
    let admin = await prisma.liveClassUser.findFirst({
      where: { 
        email: adminEmail
      }
    });
    
    if (!admin) {
      console.log(`No user found with email ${adminEmail}`);
      console.log("Let's check all users in the database:");
      
      const allUsers = await prisma.liveClassUser.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10
      });
      
      if (allUsers.length === 0) {
        console.log("No users found in the database.");
        
        // Create a default admin
        console.log("Creating a default HEAD_ADMIN user...");
        admin = await prisma.liveClassUser.create({
          data: {
            name: "Default Admin",
            email: adminEmail,
            role: LiveClassUserRole.HEAD_ADMIN,
            isActive: true,
            clerkUserId: "default_admin"
          }
        });
        console.log(`Created admin with ID: ${admin.id}`);
      } else {
        // Display all users
        console.log("\nExisting users:");
        allUsers.forEach((user, i) => {
          console.log(`${i + 1}. ID: ${user.id} | Email: ${user.email} | Name: ${user.name} | Role: ${user.role} | ClerkID: ${user.clerkUserId || 'None'}`);
        });
        
        // Prompt for admin selection
        console.log("\nSelect a user to upgrade to HEAD_ADMIN by entering their ID.");
        console.log("For example: npx tsx scripts/direct-role-fix.ts <user_id>");
        
        const userId = process.argv[2];
        if (!userId) {
          return;
        }
        
        // Find selected user
        admin = await prisma.liveClassUser.findUnique({
          where: { id: userId }
        });
        
        if (!admin) {
          console.error(`No user found with ID: ${userId}`);
          return;
        }
      }
    }
    
    // Update the user to HEAD_ADMIN
    console.log(`Updating user: ${admin.name} (${admin.email}) to HEAD_ADMIN role...`);
    
    const updatedAdmin = await prisma.liveClassUser.update({
      where: { id: admin.id },
      data: {
        role: LiveClassUserRole.HEAD_ADMIN,
        isActive: true
      }
    });
    
    console.log(`User successfully updated to HEAD_ADMIN role!`);
    console.log(`ID: ${updatedAdmin.id}`);
    console.log(`Name: ${updatedAdmin.name}`);
    console.log(`Email: ${updatedAdmin.email}`);
    console.log(`Role: ${updatedAdmin.role}`);
    console.log(`ClerkID: ${updatedAdmin.clerkUserId || 'None'}`);
    
    // Create a sync file that CourseActionButton can check
    const syncFile = path.join(process.cwd(), 'public', 'role-sync.json');
    
    // Create directory if it doesn't exist
    const dir = path.dirname(syncFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write sync info to file
    fs.writeFileSync(syncFile, JSON.stringify({
      lastSync: new Date().toISOString(),
      adminId: updatedAdmin.id,
      adminEmail: updatedAdmin.email
    }, null, 2));
    
    console.log(`\nSync file created at ${syncFile}`);
    console.log("Role fix complete. The HEAD_ADMIN user has been updated in the database.");
    console.log("Restart your application for changes to take effect.");
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 