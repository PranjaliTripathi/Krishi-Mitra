const fs = require('fs');

let loginCode = fs.readFileSync('public/login.html', 'utf8');

loginCode = loginCode.replace(/id="email_mobile"/, 'id="email_mobile" maxlength="50"');

fs.writeFileSync('public/login.html', loginCode);

console.log("Patched login.html for max length.");
