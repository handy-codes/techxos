const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Function to fix prisma imports in a file
function fixPrismaImports(content) {
  // Replace import { prisma } from "@/lib/db" with import { db } from "@/lib/db"
  let newContent = content.replace(
    /import\s*{\s*prisma\s*}\s*from\s*["']@\/lib\/db["']/g,
    'import { db } from "@/lib/db"'
  );
  
  // Replace prisma. with db.
  newContent = newContent.replace(/\bprisma\./g, 'db.');
  
  return newContent;
}

// Function to process a file
async function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixedContent = fixPrismaImports(content);
    
    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`✅ Fixed ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main function to process all relevant files
async function processAllFiles() {
  const patterns = [
    'app/**/*.tsx',
    'app/**/*.ts',
    'components/**/*.tsx',
    'components/**/*.ts',
    'lib/**/*.ts',
    'scripts/**/*.ts',
    'scripts/**/*.js'
  ];

  let totalFiles = 0;
  let fixedFiles = 0;

  for (const pattern of patterns) {
    const files = glob.sync(pattern);
    totalFiles += files.length;
    
    for (const file of files) {
      const wasFixed = await processFile(file);
      if (wasFixed) fixedFiles++;
    }
  }

  console.log(`\nProcessed ${totalFiles} files`);
  console.log(`Fixed ${fixedFiles} files`);
}

// Run the script
processAllFiles().catch(console.error); 