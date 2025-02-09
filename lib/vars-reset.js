// Imports
const fs = require('fs');
const path = require('path');

// Options
const replacements = [
  {
    regex: /appVersion:\s*['"].*['"],/,
    newValue: 'appVersion: null,',
  },
  {
    regex: /buildDate:\s*\d+,/,
    newValue: 'buildDate: null,',
  },
  {
    regex: /isLocal:\s*true,/,
    newValue: 'isLocal: false,',
  },
];

// Resolve the path to the JavaScript file
const filePath = path.resolve(__dirname, '../electron/_config.js');

// Read the JavaScript file
let fileContent = fs.readFileSync(filePath, 'utf8');

// Replace the variables as defined
for (const replacement of replacements) {
  fileContent = fileContent.replace(replacement.regex, replacement.newValue);
}

// Write the updated JavaScript file back to the file system
fs.writeFileSync(filePath, fileContent, 'utf8');

// Log the action
console.log(`Setting isLocal = false`);
