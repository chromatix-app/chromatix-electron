// Imports
const fs = require('fs');
const path = require('path');
const pJson = require('../package.json');

// Options
const replacements = [
  {
    oldValue: 'appVersion: null,',
    newValue: `appVersion: '${pJson.version}',`,
  },
  {
    oldValue: 'buildDate: null,',
    newValue: `buildDate: ${Math.floor(Date.now() / 1000)},`,
  },
  {
    oldValue: 'isLocal: false,',
    newValue: 'isLocal: true,',
  },
];

// Resolve the path to the JavaScript file
const filePath = path.resolve(__dirname, '../electron/_config.js');

// Read the JavaScript file
let fileContent = fs.readFileSync(filePath, 'utf8');

// Replace the variables as defined
for (const replacement of replacements) {
  fileContent = fileContent.replace(replacement.oldValue, replacement.newValue);
}

// Write the updated JavaScript file back to the file system
fs.writeFileSync(filePath, fileContent, 'utf8');

// Log the action
console.log(`Setting isLocal = true`);
