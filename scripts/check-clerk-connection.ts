/**
 * This script checks Clerk connection and lists all users
 * Run with: npx tsx scripts/check-clerk-connection.ts
 */

import { createClerkClient } from '@clerk/backend';
import dotenv from 'dotenv';

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
    
    // List all users
    console.log('Fetching users from Clerk...');
    const usersResponse = await clerk.users.getUserList();
    const users = usersResponse.data;
    
    console.log(`Found ${users.length} users in Clerk`);
    
    if (users.length > 0) {
      // Display the first few users
      console.log('\nFirst users:');
      users.forEach((user: User, index: number) => {
        const primaryEmail = user.emailAddresses.find(email => email.id === user.primaryEmailAddressId)?.emailAddress;
        console.log(`${index + 1}. ID: ${user.id} | Email: ${primaryEmail || 'No primary email'} | Name: ${user.firstName} ${user.lastName}`);
      });
      
      // Look for a specific email
      const targetEmail = process.env.HEAD_ADMIN_EMAIL || 'paxymekventures@gmail.com';
      console.log(`\nLooking for user with email: ${targetEmail}`);
      
      // Check all email addresses, not just primary
      const matchingUsers = users.filter((user: User) => 
        user.emailAddresses.some((email: EmailAddress) => 
          email.emailAddress.toLowerCase() === targetEmail.toLowerCase()
        )
      );
      
      if (matchingUsers.length > 0) {
        console.log(`Found ${matchingUsers.length} users with this email:`);
        matchingUsers.forEach((user: User, index: number) => {
          const emails = user.emailAddresses.map((e: EmailAddress) => 
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