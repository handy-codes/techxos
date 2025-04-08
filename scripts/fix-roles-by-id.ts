/**
 * This script fixes role synchronization issues by using Clerk User IDs directly
 * Run with: npx tsx scripts/fix-roles-by-id.ts <clerkUserId>
 */

import { PrismaClient, LiveClassUserRole } from "@prisma/client";
import * as clerkSDK from '@clerk/clerk-sdk-node';
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  try {
    const clerkUserId = process.argv[2];
    const role = process.argv[3] || 'HEAD_ADMIN';
    
    if (!clerkUserId) {
      console.error('Please provide a Clerk User ID: npx tsx scripts/fix-roles-by-id.ts <clerkUserId> [role]');
      console.error('You can find Clerk User IDs by running: npx tsx scripts/check-clerk-connection.ts');
      return;
    }
    
    console.log(`Setting user ${clerkUserId} to ${role} role...`);
    
    // Get Clerk user info
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      console.error('CLERK_SECRET_KEY is not set in environment variables');
      return;
    }
    
    // Initialize Clerk client
    const clerk = clerkSDK.clerkClient;
    clerk.setKey(secretKey);
    
    // Get user from Clerk
    try {
      const clerkUser = await clerk.users.getUser(clerkUserId);
      console.log(`Found Clerk user: ${clerkUser.id}`);
      console.log(`Name: ${clerkUser.firstName} ${clerkUser.lastName}`);
      
      const primaryEmail = clerkUser.emailAddresses.find(
        email => email.id === clerkUser.primaryEmailAddressId
      )?.emailAddress;
      
      console.log(`Email: ${primaryEmail || 'No primary email'}`);
      
      // Find or create user in database
      let dbUser = await prisma.liveClassUser.findFirst({
        where: { clerkUserId }
      });
      
      if (dbUser) {
        console.log(`Found existing user in database: ${dbUser.id}`);
        console.log(`Current role: ${dbUser.role}`);
        
        // Update user role
        dbUser = await prisma.liveClassUser.update({
          where: { id: dbUser.id },
          data: { 
            role: role as LiveClassUserRole,
            isActive: true
          }
        });
        
        console.log(`Updated user role to ${role}`);
      } else {
        console.log(`Creating new user in database...`);
        
        // Create new user
        dbUser = await prisma.liveClassUser.create({
          data: {
            name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
            email: primaryEmail || `user-${clerkUser.id}@example.com`,
            clerkUserId,
            role: role as LiveClassUserRole,
            isActive: true
          }
        });
        
        console.log(`Created new user in database: ${dbUser.id}`);
      }
      
      // Update Clerk metadata
      console.log(`Updating Clerk user metadata...`);
      await clerk.users.updateUser(clerkUser.id, {
        publicMetadata: {
          ...clerkUser.publicMetadata,
          systemRole: role
        }
      });
      
      console.log(`Successfully updated Clerk metadata`);
      console.log(`\nUser ${clerkUserId} is now set as ${role} in both systems`);
      
    } catch (error) {
      console.error(`Error fetching Clerk user: ${clerkUserId}`, error);
    }
    
  } catch (error) {
    console.error("Error in script:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 