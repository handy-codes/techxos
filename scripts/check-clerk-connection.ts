/**
 * This script checks Clerk connection and lists all users
 * Run with: npx tsx scripts/check-clerk-connection.ts
 */

import { clerkClient } from '@clerk/clerk-sdk-node';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config();

async function main() {
  try {
    // Get the Clerk secret key
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      console.error('CLERK_SECRET_KEY is not set in environment variables');
      return;
    }
    
    console.log(`Using Clerk key: ${secretKey.substring(0, 7)}...`);
    
    // Set the secret key for the clerkClient
    process.env.CLERK_SECRET_KEY = secretKey;
    
    // List all users
    console.log('Fetching users from Clerk...');
    const users = await clerkClient.users.getUserList({
      limit: 10,
    });
    
    console.log(`Found ${users.totalCount} users in Clerk`);
    
    if (users.data.length > 0) {
      // Display the first few users
      console.log('\nFirst users:');
      users.data.forEach((user, index) => {
        const primaryEmail = user.emailAddresses.find(email => email.id === user.primaryEmailAddressId)?.emailAddress;
        console.log(`${index + 1}. ID: ${user.id} | Email: ${primaryEmail || 'No primary email'} | Name: ${user.firstName} ${user.lastName}`);
      });
      
      // Look for a specific email
      const targetEmail = process.env.HEAD_ADMIN_EMAIL || 'paxymekventures@gmail.com';
      console.log(`\nLooking for user with email: ${targetEmail}`);
      
      // Check all email addresses, not just primary
      const matchingUsers = users.data.filter(user => 
        user.emailAddresses.some(email => 
          email.emailAddress.toLowerCase() === targetEmail.toLowerCase()
        )
      );
      
      if (matchingUsers.length > 0) {
        console.log(`Found ${matchingUsers.length} users with this email:`);
        matchingUsers.forEach((user, index) => {
          const emails = user.emailAddresses.map(e => 
            `${e.emailAddress}${e.id === user.primaryEmailAddressId ? ' (primary)' : ''}`
          ).join(', ');
          
          console.log(`${index + 1}. ID: ${user.id} | Emails: ${emails} | Name: ${user.firstName} ${user.lastName}`);
        });
      } else {
        console.log('No users found with this email address.');
      }
    } else {
      console.log('No users found in your Clerk instance.');
    }
    
  } catch (error) {
    console.error('Error connecting to Clerk:', error);
  }
}

main(); 