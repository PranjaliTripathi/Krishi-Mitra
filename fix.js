const fs = require('fs');
let content = fs.readFileSync('public/translations.js', 'utf8');

content = content.replace(/"प्रोफ़ाइल"/g, '"प्रोफाइल"');
content = content.replace(/"सूचनाएं"/g, '"सूचनाएँ"');
content = content.replace(/"योजनाएं"/g, '"योजनाएँ"');
content = content.replace(/"योजनाएं /g, '"योजनाएँ '); // if any spaces

fs.writeFileSync('public/translations.js', content, 'utf8');
console.log('Done');
