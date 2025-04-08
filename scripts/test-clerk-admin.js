// CommonJS version for node execution
require('dotenv').config();
const { clerkClient } = require('@clerk/clerk-sdk-node');

async function testClerkAdminAccess() {
  console.log("Testing Clerk Admin API access...");
  
  try {
    // Try to list users - this requires admin permissions
    const users = await clerkClient.users.getUserList({
      limit: 1, // Just get one user to verify access
    });
    
    console.log("✅ SUCCESS: Admin API access confirmed!");
    console.log(`Found ${users.data.length} user(s)`);
    
    if (users.data.length > 0) {
      console.log("First user ID:", users.data[0]?.id);
    }
    
    return true;
  } catch (error) {
    console.error("❌ ERROR: Failed to access Clerk Admin API");
    console.error("Error details:", error);
    
    if (error.message && (
      error.message.includes("unauthorized") || 
      error.message.includes("Unauthorized")
    )) {
      console.error("\nYour API key may not have admin permissions. Please check:");
      console.error("1. You're using a secret key (sk_), not a publishable key (pk_)");
      console.error("2. The key has not expired or been revoked");
      console.error("3. You have proper API key permissions configured in Clerk dashboard");
    }
    
    return false;
  }
}

// Run the test
testClerkAdminAccess(); 