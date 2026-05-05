const fs = require('fs');
const lines = fs.readFileSync('public/admin_dashboard.html', 'utf8').split('\n');
let depth = 0;
let mainContentOpenedAt = -1;
let mainContentTargetDepth = -1;

for(let i=0; i<lines.length; i++) {
   const open = (lines[i].match(/<div/g) || []).length;
   const close = (lines[i].match(/<\/div/g) || []).length;
   
   if (lines[i].includes('class="main-content"')) {
       mainContentOpenedAt = i + 1;
       mainContentTargetDepth = depth;
       console.log('main-content opened at', mainContentOpenedAt, 'with depth', depth);
   }
   
   depth += open - close;
   
   if (mainContentOpenedAt !== -1 && depth === mainContentTargetDepth) {
       console.log('main-content closed at line', i + 1);
       mainContentOpenedAt = -1; // reset to avoid repeating
   }
}
