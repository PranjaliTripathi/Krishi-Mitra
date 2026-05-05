const fs = require('fs');
const lines = fs.readFileSync('public/admin_dashboard.html', 'utf8').split('\n');
let depth = 0;
for(let i=0; i<lines.length; i++) {
   const open = (lines[i].match(/<div/g) || []).length;
   const close = (lines[i].match(/<\/div>/g) || []).length;
   depth += open - close;
   if(depth < 0) {
       console.log('Mismatched exactly at line:', i+1);
       depth = 0;
   }
}
console.log('Final depth:', depth);
