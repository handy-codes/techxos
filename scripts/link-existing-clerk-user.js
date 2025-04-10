// Script to link an existing Clerk user to the database with HEAD_ADMIN role
require('dotenv').config();
const { clerkClient } = require('@clerk/clerk-sdk-node');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function linkExistingClerkUser() {
  const email = process.argv[2];
  
  if (!email) {
    console.error("Usage: node scripts/link-existing-clerk-user.js email");
    console.error("Example: node scripts/link-existing-clerk-user.js admin@example.com");
    process.exit(1);
  }
  
  try {
    console.log(`Finding Clerk user with email ${email}...`);
    
    // Find the user in Clerk
    const usersResponse = await clerkClient.users.getUserList({
      emailAddress: [email],
    });
    
    if (usersResponse.data.length === 0) {
      console.error(`No Clerk user found with email ${email}`);
      process.exit(1);
    }
    
    const clerkUser = usersResponse.data[0];
    console.log(`Found Clerk user with ID: ${clerkUser.id}`);
    
    // Check if user already exists in database
    const existingDbUser = await db.liveClassUser.findUnique({
      where: { email },
    });
    
    if (existingDbUser) {
      // Update existing user with Clerk ID and HEAD_ADMIN role
      const updatedUser = await db.liveClassUser.update({
        where: { id: existingDbUser.id },
        data: { 
          clerkUserId: clerkUser.id,
          role: "HEAD_ADMIN",
          isActive: true
        },
      });
      
      console.log(`Updated existing user in database:`, updatedUser);
    } else {
      // Create new user in database
      const newUser = await db.liveClassUser.create({
        data: {
          clerkUserId: clerkUser.id,
          email,
          name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
          role: "HEAD_ADMIN",
          isActive: true,
        },
      });
      
      console.log(`Created new user in database:`, newUser);
    }
    
    // Update user metadata in Clerk if needed
    await clerkClient.users.updateUser(clerkUser.id, {
      publicMetadata: { 
        systemRole: "HEAD_ADMIN" 
      }
    });
    
    console.log(`Updated Clerk user metadata with systemRole: HEAD_ADMIN`);
    console.log(`\nSUCCESS: User ${email} is now linked as HEAD_ADMIN!`);
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await db.$disconnect();
  }
}

linkExistingClerkUser(); 