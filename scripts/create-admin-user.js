// Script to create admin and lecturer users
// Usage: 
// npx prisma studio  
// Then in another terminal:
// node scripts/create-admin-user.js careers@techxos.com ADMIN
// node scripts/create-admin-user.js emekaowo@yahoo.com LECTURER

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Get command line arguments
  const email = process.argv[2];
  const role = process.argv[3]; // Should be ADMIN, LECTURER, HEAD_ADMIN, or LEARNER
  
  if (!email || !email.includes('@')) {
    console.error('Please provide a valid email address as the first argument');
    process.exit(1);
  }
  
  if (!role || !['ADMIN', 'LECTURER', 'HEAD_ADMIN', 'LEARNER'].includes(role)) {
    console.error('Please provide a valid role (ADMIN, LECTURER, HEAD_ADMIN, or LEARNER) as the second argument');
    process.exit(1);
  }
  
  console.log(`\n=== Creating/Updating user with email: ${email} and role: ${role} ===\n`);
  
  try {
    // Check if user already exists
    const existingUser = await db.liveClassUser.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      console.log('User already exists with ID:', existingUser.id);
      console.log('Current role:', existingUser.role);
      console.log('Current Clerk User ID:', existingUser.clerkUserId || 'None');
      
      // Update user role
      const updatedUser = await db.liveClassUser.update({
        where: { id: existingUser.id },
        data: { 
          role,
          // Don't update clerkUserId if it already exists
          clerkUserId: existingUser.clerkUserId || `pending_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        }
      });
      
      console.log('\n✅ User successfully updated:');
      console.log('ID:', updatedUser.id);
      console.log('Email:', updatedUser.email);
      console.log('Name:', updatedUser.name);
      console.log('Role:', updatedUser.role);
      console.log('Clerk User ID:', updatedUser.clerkUserId);
      console.log('\n✅ User will now have', role, 'permissions and see "Join Live Class" instead of "Purchase Course"');
    } else {
      // Create new user
      const newUser = await db.liveClassUser.create({
        data: {
          email,
          name: email.split('@')[0],
          role,
          isActive: true,
          clerkUserId: `pending_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        }
      });
      
      console.log('\n✅ New user successfully created:');
      console.log('ID:', newUser.id);
      console.log('Email:', newUser.email);
      console.log('Name:', newUser.name);
      console.log('Role:', newUser.role);
      console.log('Clerk User ID:', newUser.clerkUserId);
      console.log('\n✅ When this user signs in with email', email, 'they will have', role, 'permissions');
      console.log('✅ They will see "Join Live Class" instead of "Purchase Course"');
    }
    
    console.log('\n=== IMPORTANT ===');
    console.log('1. The user must sign in with the exact email:', email);
    console.log('2. After first sign-in, their Clerk ID will be properly linked to this record');
    console.log('3. Make sure no duplicate records exist for this email in the database\n');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await db.$disconnect();
  }
}

main(); 