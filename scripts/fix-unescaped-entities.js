const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to recursively find all files in a directory
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.git')) {
      findFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to fix unescaped entities in a file
function fixUnescapedEntities(filePath) {
  console.log(`Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Fix apostrophes
  const apostropheRegex = /([^&])'([^']*?)'([^>])/g;
  const newContent = content.replace(apostropheRegex, (match, before, text, after) => {
    // Skip if it's already escaped
    if (before === '&' && after === ';') return match;
    
    modified = true;
    return `${before}&apos;${text}&apos;${after}`;
  });
  
  // Fix quotes
  const quoteRegex = /([^&])"([^"]*?)"([^>])/g;
  const finalContent = newContent.replace(quoteRegex, (match, before, text, after) => {
    // Skip if it's already escaped
    if (before === '&' && after === ';') return match;
    
    modified = true;
    return `${before}&quot;${text}&quot;${after}`;
  });
  
  if (modified) {
    fs.writeFileSync(filePath, finalContent, 'utf8');
    console.log(`Fixed unescaped entities in: ${filePath}`);
    return true;
  }
  
  return false;
}

// Main function
function main() {
  console.log('Starting to fix unescaped entities in JSX files...');
  
  const rootDir = process.cwd();
  const files = findFiles(rootDir);
  
  console.log(`Found ${files.length} JSX files to process`);
  
  let fixedCount = 0;
  
  files.forEach(file => {
    if (fixUnescapedEntities(file)) {
      fixedCount++;
    }
  });
  
  console.log(`Fixed unescaped entities in ${fixedCount} files`);
}

main(); 