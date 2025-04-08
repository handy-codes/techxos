import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

async function main() {
  try {
    console.log("Starting Clerk user ID synchronization...");
    
    // Get all users from Clerk
    const clerkResponse = await clerkClient.users.getUserList({
      limit: 500,
    });
    
    const clerkUsers = clerkResponse.data;
    console.log(`Found ${clerkUsers.length} users in Clerk`);
    
    // Get all users from database
    const dbUsers = await db.liveClassUser.findMany();
    console.log(`Found ${dbUsers.length} users in database`);
    
    // Track updates
    let updatedCount = 0;
    let errorCount = 0;
    
    // Process each database user
    for (const dbUser of dbUsers) {
      try {
        // Skip if already has clerkUserId
        if (dbUser.clerkUserId) {
          console.log(`User ${dbUser.email} already has Clerk ID: ${dbUser.clerkUserId}`);
          continue;
        }
        
        // Find matching Clerk user by email
        const clerkUser = clerkUsers.find((user: any) => 
          user.emailAddresses.some((email: any) => email.emailAddress === dbUser.email)
        );
        
        if (clerkUser) {
          // Update the database user with Clerk ID
          await db.liveClassUser.update({
            where: { id: dbUser.id },
            data: { clerkUserId: clerkUser.id }
          });
          
          console.log(`Updated user ${dbUser.email} with Clerk ID: ${clerkUser.id}`);
          updatedCount++;
        } else {
          console.log(`No matching Clerk user found for ${dbUser.email}`);
          errorCount++;
        }
      } catch (error) {
        console.error(`Error processing user ${dbUser.email}:`, error);
        errorCount++;
      }
    }
    
    console.log("Synchronization complete!");
    console.log(`Updated ${updatedCount} users`);
    console.log(`Errors: ${errorCount}`);
    
  } catch (error) {
    console.error("Synchronization failed:", error);
  } finally {
    await db.$disconnect();
  }
}

main(); 