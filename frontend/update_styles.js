const fs = require('fs');
const files = [
  'src/components/Layout/header.jsx',
  'src/components/Layout/footer.jsx',
  'src/pages/Login.jsx',
  'src/pages/Signup.jsx',
  'src/pages/Home.jsx',
  'src/pages/Emailverify.jsx'
];

let allStyles = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const styleRegex = /style={{([^}]+)}}/g;
  let match;
  while ((match = styleRegex.exec(content)) !== null) {
    allStyles.push({ file, style: match[1].trim() });
  }
});

console.log(`Found ${allStyles.length} inline styles.`);
// We could automatically convert them to CSS, but since CSS requires camelCase to kebab-case conversion, 
// let's just generate a custom-utilities.css file and use regex to replace them in the files.
