const fs = require('fs');
const lines = fs.readFileSync('public/admin_dashboard.html', 'utf8').split('\n');
let depth = 0;
let tags = [];

for(let i=103; i<1130; i++) {
   const line = lines[i];
   // simplified tracking...
   let p = 0;
   while(true) {
       const o = line.indexOf('<div', p);
       const c = line.indexOf('</div', p);
       if (o === -1 && c === -1) break;
       
       if (o !== -1 && (c === -1 || o < c)) {
           let idMatch = line.slice(o, line.indexOf('>', o)).match(/id="([^"]+)"/);
           tags.push({line: i+1, id: idMatch ? idMatch[1] : null, type: 'open'});
           depth++;
           p = o + 4;
       } else {
           tags.push({line: i+1, type: 'close'});
           depth--;
           if (depth === 0) {
               console.log('Zero depth at line', i+1);
           }
           p = c + 5;
       }
   }
}
console.log('Depth at end:', depth);
