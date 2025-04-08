// Script to fix user roles and check for duplicates
// Usage: 
// npx prisma studio
// Then in another terminal:
// node scripts/fix-user-role.js check careers@techxos.com 
// node scripts/fix-user-role.js delete <user-id-to-delete>
// node scripts/fix-user-role.js fix careers@techxos.com ADMIN

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Get command line arguments
  const action = process.argv[2]; // 'check', 'fix', or 'delete'
  const param1 = process.argv[3]; // email or user ID
  const param2 = process.argv[4]; // role (for 'fix' action)
  
  if (!action || !['check', 'fix', 'delete'].includes(action)) {
    console.error('First argument must be "check", "fix", or "delete"');
    process.exit(1);
  }
  
  if (!param1) {
    console.error('Please provide an email or user ID as the second argument');
    process.exit(1);
  }
  
  if (action === 'check') {
    // Check for users with matching email
    const email = param1;
    console.log(`\n=== Checking for users with email: ${email} ===\n`);
    
    const users = await prisma.liveClassUser.findMany({
      where: {
        email: {
          equals: email,
        }
      }
    });
    
    if (users.length === 0) {
      console.log('❌ No users found with this email');
    } else {
      console.log(`✅ Found ${users.length} users with this email:\n`);
      users.forEach((user, index) => {
        console.log(`User ${index + 1}:`);
        console.log('ID:', user.id);
        console.log('Email:', user.email);
        console.log('Name:', user.name);
        console.log('Role:', user.role);
        console.log('Clerk User ID:', user.clerkUserId || 'None');
        console.log('Active:', user.isActive ? 'Yes' : 'No');
        console.log('Created:', user.createdAt);
        console.log('Updated:', user.updatedAt);
        console.log('---');
      });
      
      if (users.length > 1) {
        console.log('\n⚠️ WARNING: Multiple users found with the same email!');
        console.log('Consider deleting duplicate records and keeping just one.');
        console.log('To delete a user, run: node scripts/fix-user-role.js delete <user-id>');
      }
    }
  } else if (action === 'delete') {
    // Delete user by ID
    const userId = param1;
    console.log(`\n=== Deleting user with ID: ${userId} ===\n`);
    
    try {
      const user = await prisma.liveClassUser.findUnique({
        where: { id: userId }
      });
      
      if (!user) {
        console.log('❌ No user found with this ID');
        return;
      }
      
      console.log('User to delete:');
      console.log('ID:', user.id);
      console.log('Email:', user.email);
      console.log('Name:', user.name);
      console.log('Role:', user.role);
      
      // Delete user
      await prisma.liveClassUser.delete({
        where: { id: userId }
      });
      
      console.log('\n✅ User successfully deleted');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  } else if (action === 'fix') {
    // Fix user role
    const email = param1;
    const role = param2;
    
    if (!role || !['ADMIN', 'LECTURER', 'HEAD_ADMIN', 'LEARNER'].includes(role)) {
      console.error('Please provide a valid role (ADMIN, LECTURER, HEAD_ADMIN, or LEARNER) as the third argument');
      process.exit(1);
    }
    
    console.log(`\n=== Fixing user role for email: ${email} to ${role} ===\n`);
    
    // Check for duplicate users
    const users = await prisma.liveClassUser.findMany({
      where: {
        email: {
          equals: email,
        }
      }
    });
    
    if (users.length === 0) {
      console.log('❌ No users found with this email');
      
      // Create new user
      const newUser = await prisma.liveClassUser.create({
        data: {
          email,
          name: email.split('@')[0],
          role,
          isActive: true,
          clerkUserId: `pending_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        }
      });
      
      console.log('\n✅ New user created with role:', role);
      console.log('ID:', newUser.id);
      
    } else if (users.length === 1) {
      // Update single user
      const user = users[0];
      console.log('Found user:');
      console.log('ID:', user.id);
      console.log('Current role:', user.role);
      
      const updatedUser = await prisma.liveClassUser.update({
        where: { id: user.id },
        data: { 
          role,
          // Ensure there's a clerkUserId
          clerkUserId: user.clerkUserId || `pending_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        }
      });
      
      console.log('\n✅ User role updated to:', role);
      
    } else {
      // Multiple users found
      console.log(`⚠️ Found ${users.length} users with this email. Please resolve duplicates first.`);
      users.forEach((user, index) => {
        console.log(`User ${index + 1}:`);
        console.log('ID:', user.id);
        console.log('Role:', user.role);
        console.log('Clerk User ID:', user.clerkUserId || 'None');
        console.log('---');
      });
      
      console.log('\nRecommendation:');
      console.log('1. Keep the user with a valid Clerk ID (if any)');
      console.log('2. Delete other duplicates with: node scripts/fix-user-role.js delete <user-id>');
      console.log('3. Then run fix again: node scripts/fix-user-role.js fix', email, role);
    }
  }
  
  // Disconnect from the database
  await prisma.$disconnect();
}

main(); 