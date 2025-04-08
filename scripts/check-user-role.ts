import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

// Usage: ts-node scripts/check-user-role.ts email
async function main() {
  const [email] = process.argv.slice(2);
  
  if (!email) {
    console.error("Usage: ts-node scripts/check-user-role.ts email");
    process.exit(1);
  }
  
  try {
    console.log(`Checking user ${email}...`);
    
    // Find user in database
    const dbUser = await db.liveClassUser.findUnique({
      where: { email },
    });
    
    if (!dbUser) {
      console.error(`User with email ${email} not found in database`);
      process.exit(1);
    }
    
    console.log(`Database user:`, {
      id: dbUser.id,
      clerkUserId: dbUser.clerkUserId,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role,
      isActive: dbUser.isActive,
    });
    
    // Find user in Clerk
    try {
      const clerkResponse = await clerkClient.users.getUserList({
        emailAddress: [email]
      });
      
      const clerkUsers = clerkResponse.data;
      
      if (clerkUsers.length === 0) {
        console.log(`No matching Clerk user found for ${email}`);
      } else {
        console.log(`Clerk user:`, {
          id: clerkUsers[0]?.id,
          email: clerkUsers[0]?.emailAddresses[0]?.emailAddress,
          firstName: clerkUsers[0]?.firstName,
          lastName: clerkUsers[0]?.lastName,
          systemRole: clerkUsers[0]?.publicMetadata?.systemRole || 'None',
        });
        
        // Check if IDs match
        if (dbUser.clerkUserId !== clerkUsers[0].id) {
          console.error(`⚠️ MISMATCH: Database clerkUserId (${dbUser.clerkUserId}) does not match Clerk user ID (${clerkUsers[0].id})`);
        } else {
          console.log(`✅ IDs match`);
        }
        
        // Check if roles match
        if (dbUser.role !== clerkUsers[0].publicMetadata?.systemRole) {
          console.error(`⚠️ MISMATCH: Database role (${dbUser.role}) does not match Clerk metadata (${clerkUsers[0].publicMetadata?.systemRole || 'None'})`);
        } else {
          console.log(`✅ Roles match`);
        }
      }
    } catch (error) {
      console.error(`Error fetching Clerk user:`, error);
    }
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await db.$disconnect();
  }
}

main(); 