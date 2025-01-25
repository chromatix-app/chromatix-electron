// Import required modules
const fs = require('fs');
const path = require('path');

// Resolve the path to the JavaScript file
const filePath = path.resolve(__dirname, '../electron/menu.js');

// Read the JavaScript file
let fileContent = fs.readFileSync(filePath, 'utf8');

// Replace the variable (example: replace `const homepage = 'oldValue';` with `const homepage = 'newValue';`)
const oldValue = 'const isLocal = false;';
const newValue = 'const isLocal = true;';
fileContent = fileContent.replace(oldValue, newValue);

// Write the updated JavaScript file back to the file system
fs.writeFileSync(filePath, fileContent, 'utf8');

// Log the action
console.log(`Setting isLocal = true`);
