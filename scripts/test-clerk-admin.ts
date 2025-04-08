import { clerkClient } from "@clerk/nextjs/server";

async function testClerkAdminAccess() {
  console.log("Testing Clerk Admin API access...");
  
  try {
    // Try to list users - this requires admin permissions
    const response = await clerkClient.users.getUserList({
      limit: 1, // Just get one user to verify access
    });
    
    // Access the data property which contains the array of users
    const users = response.data;
    
    console.log("✅ SUCCESS: Admin API access confirmed!");
    console.log(`Found ${users.length} user(s)`);
    
    if (users.length > 0) {
      console.log("First user ID:", users[0]?.id);
    }
    
    return true;
  } catch (error: unknown) {
    console.error("❌ ERROR: Failed to access Clerk Admin API");
    console.error("Error details:", error);
    
    // Type guard for error
    if (typeof error === 'object' && error !== null && 'message' in error) {
      const errorMessage = String(error.message);
      if (errorMessage.includes("unauthorized") || errorMessage.includes("Unauthorized")) {
        console.error("\nYour API key may not have admin permissions. Please check:");
        console.error("1. You're using a secret key (sk_), not a publishable key (pk_)");
        console.error("2. The key has not expired or been revoked");
        console.error("3. Your application has the 'Organization' feature enabled in Clerk dashboard");
        console.error("4. You have proper API key permissions configured in Clerk dashboard");
      }
    }
    
    return false;
  }
}

// Run the test
testClerkAdminAccess(); 