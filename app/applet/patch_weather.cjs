const fs = require('fs');
let code = fs.readFileSync('public/weather.html', 'utf8');

// 1. Remove from top
code = code.replace(/<div class="text-end">[\s\S]*?id="weatherLastUpdated"[\s\S]*?<\/div>\s*<\/div>/, '');

fs.writeFileSync('public/weather.html', code);
console.log("Top block removed.");
