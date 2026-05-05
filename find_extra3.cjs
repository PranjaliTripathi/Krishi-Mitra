const fs = require('fs');
const lines = fs.readFileSync('public/admin_dashboard.html', 'utf8').split('\n');
let depth = 0;
for(let i=875; i<1130; i++) {
   const o = (lines[i].match(/<div/g) || []).length;
   const c = (lines[i].match(/<\/div/g) || []).length;
   depth += o - c;
   console.log(`Line ${i+1}: o=${o} c=${c} depth=${depth}`);
}
