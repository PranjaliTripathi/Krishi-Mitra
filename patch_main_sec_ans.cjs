const fs = require('fs');
let code = fs.readFileSync('public/main_admin.js', 'utf8');

// For admSecA1 / admSecA2 length check
let logicRegex = /const sa2 = document\.getElementById\('admSecA2'\)\.value\.toLowerCase\(\)\.trim\(\);/;
let newLogic = `const sa2 = document.getElementById('admSecA2').value.toLowerCase().trim();
        
        if (sa1.length < 6 || (sq2 && sa2.length < 6)) {
            Swal.fire('Validation Error', 'Security answers must be at least 6 characters long.', 'error');
            return;
        }
`;

code = code.replace(logicRegex, newLogic);
fs.writeFileSync('public/main_admin.js', code);
console.log("Admin security form validations patched.");
