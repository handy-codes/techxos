import { db } from "@/lib/db";

// Usage: ts-node scripts/set-clerk-id.ts userEmail clerkUserId
async function main() {
  const [userEmail, clerkUserId] = process.argv.slice(2);
  
  if (!userEmail || !clerkUserId) {
    console.error("Usage: ts-node scripts/set-clerk-id.ts userEmail clerkUserId");
    process.exit(1);
  }
  
  try {
    console.log(`Setting Clerk ID ${clerkUserId} for user ${userEmail}...`);
    
    // Find user by email
    const user = await db.liveClassUser.findUnique({
      where: { email: userEmail },
    });
    
    if (!user) {
      console.error(`User with email ${userEmail} not found`);
      process.exit(1);
    }
    
    // Update user with Clerk ID
    const updated = await db.liveClassUser.update({
      where: { id: user.id },
      data: { clerkUserId },
    });
    
    console.log(`Successfully updated user:`, updated);
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await db.$disconnect();
  }
}

main(); 