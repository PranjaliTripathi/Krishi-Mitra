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

// How about profile.html?
let profCode = fs.readFileSync('public/profile.html', 'utf8');
profCode = profCode.replace(/user\.security_answer = document\.getElementById\('edit_a1'\)\.value;/, 
`
                const uAnswer1 = document.getElementById('edit_a1').value;
                const uAnswer2 = document.getElementById('edit_a2').value;
                if(uAnswer1 && uAnswer1.length < 6) return Swal.fire({ icon: 'warning', text: 'Answer must be at least 6 characters' });
                if(uAnswer2 && uAnswer2.length < 6) return Swal.fire({ icon: 'warning', text: 'Answer must be at least 6 characters' });
                user.security_answer = uAnswer1;`);

profCode = profCode.replace(/user\.security_a2 = document\.getElementById\('edit_a2'\)\.value;/, `user.security_a2 = uAnswer2;`);

fs.writeFileSync('public/profile.html', profCode);

// Admin dashboard also has security answers when creating an admin or changing profile
let adminCode = fs.readFileSync('public/main_admin.js', 'utf8');
// For AdmProfile change
adminCode = adminCode.replace(/const a2 = document\.getElementById\('admSecA2'\)\.value;/,
`const a2 = document.getElementById('admSecA2').value;
                if(a1.length < 6 || (a2 && a2.length < 6)) return Swal.fire({icon:'warning', text:'Security answers must be at least 6 characters'});`);


// What about addAdminUser?
adminCode = adminCode.replace(/const q1 = document\.getElementById\('naQ1'\)\.value;[\s\n]*const a1 = document\.getElementById\('naA1'\)\.value;/,
`const q1 = document.getElementById('naQ1').value;
        const a1 = document.getElementById('naA1').value;
        if(a1.length < 6) return Swal.fire({icon:'warning', text:'Security answers must be at least 6 characters'});`);

fs.writeFileSync('public/main_admin.js', adminCode);

console.log("Security answer checks patched");
