// Plain JavaScript implementation for creating a HEAD_ADMIN
require('dotenv').config();
const { clerkClient } = require('@clerk/clerk-sdk-node');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createHeadAdmin() {
  const email = process.argv[2];
  const firstName = process.argv[3];
  const lastName = process.argv[4] || "";
  const role = "HEAD_ADMIN";
  
  if (!email || !firstName) {
    console.error("Usage: node scripts/create-head-admin.js email firstName [lastName]");
    console.error("Example: node scripts/create-head-admin.js admin@example.com John Doe");
    process.exit(1);
  }
  
  try {
    console.log(`Creating HEAD_ADMIN user ${email}...`);
    
    // Create user in Clerk
    const clerkUser = await clerkClient.users.createUser({
      emailAddress: [email],
      firstName,
      lastName,
      password: "Password123!",
      publicMetadata: {
        systemRole: role
      }
    });
    
    console.log(`Created Clerk user with ID: ${clerkUser.id}`);
    
    // Create user in database
    const dbUser = await db.liveClassUser.create({
      data: {
        clerkUserId: clerkUser.id,
        email,
        name: `${firstName} ${lastName}`.trim(),
        role: role,
        isActive: true,
      },
    });
    
    console.log(`Created database user:`, dbUser);
    console.log(`\nIMPORTANT: An email will be sent to ${email} to verify the account.`);
    console.log(`The default password is 'Password123!' - please change this after first login.`);
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await db.$disconnect();
  }
}

createHeadAdmin(); 