import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { LiveClassUserRole } from "@prisma/client";

// Usage: ts-node scripts/create-user-with-role.ts email firstName lastName role
async function main() {
  const [email, firstName, lastName, role] = process.argv.slice(2);
  
  if (!email || !firstName || !role) {
    console.error("Usage: ts-node scripts/create-user-with-role.ts email firstName lastName role");
    console.error("Example: ts-node scripts/create-user-with-role.ts admin@example.com John Doe HEAD_ADMIN");
    process.exit(1);
  }
  
  // Validate role
  if (!Object.values(LiveClassUserRole).includes(role as LiveClassUserRole)) {
    console.error(`Invalid role: ${role}`);
    console.error(`Valid roles: ${Object.values(LiveClassUserRole).join(", ")}`);
    process.exit(1);
  }
  
  try {
    console.log(`Creating user ${email} with role ${role}...`);
    
    // Create user in Clerk
    const clerkUser = await clerkClient.users.createUser({
      emailAddress: [email],
      firstName,
      lastName: lastName || "",
      password: "Password123!", // Default password, should be changed
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
        name: `${firstName} ${lastName || ""}`.trim(),
        role: role as LiveClassUserRole,
        isActive: true,
      },
    });
    
    console.log(`Created database user:`, dbUser);
    console.log(`\nIMPORTANT: An email will be sent to ${email} to verify the account.`);
    console.log(`The default password is 'Password123!' - the user should change this after first login.`);
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await db.$disconnect();
  }
}

main(); 