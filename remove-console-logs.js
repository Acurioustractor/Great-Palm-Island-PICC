const fs = require('fs');
const path = require('path');

// Directories to search
const directories = [
  './frontend/src',
  './'
];

// File extensions to process
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

// Files to skip
const skipFiles = ['remove-console-logs.js', 'node_modules'];

function removeConsoleLogs(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Regex patterns to match console.log statements
  const patterns = [
    /console\.log\s*\([^)]*\)\s*;?/g,
    /console\.error\s*\([^)]*\)\s*;?/g,
    /console\.warn\s*\([^)]*\)\s*;?/g,
    /console\.debug\s*\([^)]*\)\s*;?/g,
  ];
  
  patterns.forEach(pattern => {
    content = content.replace(pattern, '');
  });
  
  // Clean up empty lines that might be left
  content = content.replace(/^\s*[\r\n]/gm, '\n');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`Cleaned: ${filePath}`);
    return true;
  }
  
  return false;
}

function processDirectory(dir) {
  let filesProcessed = 0;
  let filesModified = 0;
  
  function walk(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    files.forEach(file => {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      // Skip if in skip list
      if (skipFiles.some(skip => filePath.includes(skip))) {
        return;
      }
      
      if (stat.isDirectory()) {
        walk(filePath);
      } else if (extensions.includes(path.extname(file))) {
        filesProcessed++;
        if (removeConsoleLogs(filePath)) {
          filesModified++;
        }
      }
    });
  }
  
  walk(dir);
  return { filesProcessed, filesModified };
}

console.log('Removing console.log statements...\n');

let totalProcessed = 0;
let totalModified = 0;

directories.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`Processing ${dir}...`);
    const { filesProcessed, filesModified } = processDirectory(dir);
    totalProcessed += filesProcessed;
    totalModified += filesModified;
  }
});

console.log(`\nComplete! Processed ${totalProcessed} files, modified ${totalModified} files.`);
console.log('\nRemember to test your application after removing console statements!');