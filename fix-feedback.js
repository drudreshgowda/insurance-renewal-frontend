const fs = require('fs');

// Read the file
const content = fs.readFileSync('src/pages/Feedback.jsx', 'utf8');
const lines = content.split('\n');

// Find and remove the duplicate SurveyResponsesTab declaration and orphaned code
let newLines = [];
let skipMode = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Start skipping from the duplicate SurveyResponsesTab (around line 2870)
  if (i >= 2869 && line.includes('const SurveyResponsesTab = () => (')) {
    skipMode = true;
    continue;
  }
  
  // Stop skipping when we find the proper SurveyResponsesTab at line 4665
  if (skipMode && i >= 4664 && line.includes('const SurveyResponsesTab = () => (')) {
    skipMode = false;
    newLines.push(line);
    continue;
  }
  
  if (!skipMode) {
    newLines.push(line);
  }
}

// Write the fixed file
fs.writeFileSync('src/pages/Feedback.jsx', newLines.join('\n'));
console.log('Fixed duplicate SurveyResponsesTab declaration');