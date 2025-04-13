/**
 * This script fixes user roles by ID
 * Run with: npx tsx scripts/fix-roles-by-id.ts
 */

import { createClerkClient } from '@clerk/backend';
import dotenv from 'dotenv';
import { db } from '../lib/db';
import { syncUserRole } from '../lib/user-sync';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config();

interface EmailAddress {
  id: string;
  emailAddress: string;
}

interface User {
  id: string;
  emailAddresses: EmailAddress[];
  primaryEmailAddressId: string | null;
  firstName: string | null;
  lastName: string | null;
}

async function main() {
  try {
    // Get the Clerk secret key
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      console.error('CLERK_SECRET_KEY is not set in environment variables');
      return;
    }
    
    console.log(`Using Clerk key: ${secretKey.substring(0, 7)}...`);
    
    // Create Clerk client
    const clerk = createClerkClient({ secretKey });
    
    // Get user IDs from command line arguments
    const userIds = process.argv.slice(2);
    if (userIds.length === 0) {
      console.error('Please provide at least one user ID as an argument');
      console.log('Usage: npx tsx scripts/fix-roles-by-id.ts <userId1> [userId2] ...');
      return;
    }
    
    console.log(`Processing ${userIds.length} user(s)...`);
    
    for (const userId of userIds) {
      try {
        console.log(`\nProcessing user ID: ${userId}`);
        
        // Get user from Clerk
        const clerkUser = await clerk.users.getUser(userId);
        if (!clerkUser) {
          console.error(`User not found in Clerk: ${userId}`);
          continue;
        }
        
        console.log(`Found user in Clerk: ${clerkUser.firstName} ${clerkUser.lastName}`);
        
        // Get primary email
        const primaryEmail = clerkUser.emailAddresses.find(
          (email: EmailAddress) => email.id === clerkUser.primaryEmailAddressId
        )?.emailAddress;
        
        if (!primaryEmail) {
          console.error(`No primary email found for user: ${userId}`);
          continue;
        }
        
        console.log(`Primary email: ${primaryEmail}`);
        
        // Sync user role
        const updatedUser = await syncUserRole(userId);
        if (!updatedUser) {
          console.error(`Failed to sync role for user: ${userId}`);
          continue;
        }
        console.log(`User role synced: ${updatedUser.role}`);
        
      } catch (error) {
        console.error(`Error processing user ${userId}:`, error);
      }
    }
    
    console.log('\nRole sync completed!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 