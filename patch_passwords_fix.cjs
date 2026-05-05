const fs = require('fs');

// 1. Remove validation from login.html
let loginCode = fs.readFileSync('public/login.html', 'utf8');
// It had:
// const passErr = window.getPasswordError(password);
// if (passErr) { Swal... return; }
loginCode = loginCode.replace(/const passErr = window\.getPasswordError\(password\);\s*if \(passErr\) \{\s*Swal\.fire\(\{\s*icon:\s*'error',\s*title:\s*'Invalid Password',\s*text:\s*passErr\s*\}\);\s*return;\s*\}/g, '');
loginCode = loginCode.replace(/<script src="password_validator\.js"><\/script>/, '');
fs.writeFileSync('public/login.html', loginCode);

let adminLoginCode = fs.readFileSync('public/admin_login.html', 'utf8');
adminLoginCode = adminLoginCode.replace(/const passErr = window\.getPasswordError\(password\);\s*if \(passErr\) \{.*?return;\s*\}/gs, '');
adminLoginCode = adminLoginCode.replace(/<script src="password_validator\.js"><\/script>/, '');
fs.writeFileSync('public/admin_login.html', adminLoginCode);

console.log("Login validations removed.");
