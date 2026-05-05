const fs = require('fs');
const lines = fs.readFileSync('public/admin_dashboard.html', 'utf8').split('\n');
let depth = 0;

for(let i=103; i<1130; i++) {
   const line = lines[i];
   let p = 0;
   while(true) {
       const o = line.indexOf('<div', p);
       const c = line.indexOf('</div', p);
       if (o === -1 && c === -1) break;
       
       if (o !== -1 && (c === -1 || o < c)) {
           depth++;
           if(line.includes('id="admProfile"')) console.log('admProfile opens at depth:', depth);
           p = o + 4;
       } else {
           depth--;
           p = c + 5;
       }
   }
}
console.log('Final:', depth);
