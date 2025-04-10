const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Function to fix HTML entities in a file
function fixEntities(content) {
  // Replace quotes and apostrophes with their regular characters
  return content
    .replace(/"/g, '"')
    .replace(/'/g, "'");
}

// Function to process a file
async function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixedContent = fixEntities(content);
    
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
    'app/(home)/**/*.tsx',
    'app/(instructor)/**/*.tsx',
    'app/admin/**/*.tsx',
    'app/lecturer/**/*.tsx',
    'app/pages/**/*.tsx',
    'components/**/*.tsx',
    'components/**/*.jsx',
    'scripts/**/*.js',
    'scripts/**/*.ts'
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