// Script to update database and fix the LEARNER role issue
// Usage: node scripts/update-role-enum.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Starting database update...");
    
    // 1. Get count of users with each role
    const roleCounts = await db.$queryRaw`
      SELECT "role", COUNT(*) as count 
      FROM "LiveClassUser" 
      GROUP BY "role" 
      ORDER BY count DESC
    `;
    
    console.log("\nCurrent role distribution:");
    roleCounts.forEach(row => {
      console.log(`${row.role}: ${row.count} users`);
    });
    
    // 2. Count users who have purchases (actual learners)
    const purchaseCountResult = await db.$queryRaw`
      SELECT COUNT(DISTINCT "studentId") as count 
      FROM "LiveClassPurchase"
    `;
    const purchaseCount = purchaseCountResult[0].count;
    
    console.log(`\nUsers with purchases: ${purchaseCount}`);
    
    // 3. Count users with LEARNER role but no purchases
    const nonPurchaseLearners = await db.$queryRaw`
      SELECT COUNT(*) as count
      FROM "LiveClassUser" u
      WHERE u.role = 'LEARNER'
      AND NOT EXISTS (
        SELECT 1 FROM "LiveClassPurchase" p
        WHERE p."studentId" = u.id
      )
    `;
    
    console.log(`Users with LEARNER role but no purchases: ${nonPurchaseLearners[0].count}`);
    
    // Ask for confirmation
    console.log("\n=== ACTION PLANNED ===");
    console.log(`We will update ${nonPurchaseLearners[0].count} users from LEARNER to VISITOR`);
    console.log("This will ensure only users who made purchases are marked as LEARNERs");
    console.log("\nTo execute this update, run:");
    console.log("node scripts/update-role-enum.js update");
    
    // Check if update flag is provided
    if (process.argv[2] === 'update') {
      console.log("\n=== EXECUTING UPDATE ===");
      
      // Perform the update on users with LEARNER role but no purchases
      const updateResult = await db.$executeRaw`
        UPDATE "LiveClassUser" u
        SET role = 'VISITOR'
        WHERE u.role = 'LEARNER'
        AND NOT EXISTS (
          SELECT 1 FROM "LiveClassPurchase" p
          WHERE p."studentId" = u.id
        )
      `;
      
      console.log(`Updated ${updateResult} users from LEARNER to VISITOR`);
      
      // Show final counts
      const finalRoleCounts = await db.$queryRaw`
        SELECT "role", COUNT(*) as count 
        FROM "LiveClassUser" 
        GROUP BY "role" 
        ORDER BY count DESC
      `;
      
      console.log("\nUpdated role distribution:");
      finalRoleCounts.forEach(row => {
        console.log(`${row.role}: ${row.count} users`);
      });
    }
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await db.$disconnect();
  }
}

main(); 