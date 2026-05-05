const fs = require('fs');

let reqCode = fs.readFileSync('public/register.html', 'utf8');

reqCode = reqCode.replace(/const confirm_password = document\.getElementById\('confirm_password'\)\.value;/g, 
`const confirm_password = document.getElementById('confirm_password').value;
        const secAnswer = document.getElementById('security_answer').value;
        if (secAnswer.length < 6) {
            Swal.fire({ icon: 'error', title: 'Invalid Security Answer', text: 'Answer must be at least 6 characters.' });
            return;
        }`);

fs.writeFileSync('public/register.html', reqCode);

// How about profile.html? It has `edit_a1` and `edit_a2` which are type="password".
let profCode = fs.readFileSync('public/profile.html', 'utf8');
profCode = profCode.replace(/const uAnswer = document\.getElementById\('edit_a1'\)\.value;/, 
`const uAnswer = document.getElementById('edit_a1').value;
                if(uAnswer && uAnswer.length < 6) return Swal.fire({ icon: 'warning', text: 'Answer must be at least 6 characters' });`);
profCode = profCode.replace(/const uAnswer2 = document\.getElementById\('edit_a2'\)\.value;/, 
`const uAnswer2 = document.getElementById('edit_a2').value;
                if(uAnswer2 && uAnswer2.length < 6) return Swal.fire({ icon: 'warning', text: 'Answer must be at least 6 characters' });`);

fs.writeFileSync('public/profile.html', profCode);

// Admin dashboard also has security answers when creating an admin or changing profile
let adminCode = fs.readFileSync('public/main_admin.js', 'utf8');
adminCode = adminCode.replace(/const a2 = document\.getElementById\('admSecA2'\)\.value;/,
`const a2 = document.getElementById('admSecA2').value;
                if(a1.length < 6 || (a2 && a2.length < 6)) return Swal.fire({icon:'warning', text:'Security answers must be at least 6 characters'});`);

fs.writeFileSync('public/main_admin.js', adminCode);

console.log("Security answer checks patched");
