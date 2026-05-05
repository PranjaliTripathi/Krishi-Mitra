const fs = require('fs');

function patch(file, targetStr, patchStr) {
    let code = fs.readFileSync(file, 'utf8');
    if (code.includes(patchStr)) return;
    if (!code.includes(targetStr)) {
        console.log(`Could not find target in ${file}`);
        return;
    }
    code = code.replace(targetStr, targetStr + '\n' + patchStr);
    fs.writeFileSync(file, code);
    console.log(`Patched ${file}`);
}

// 1. patch register.html
patch('public/register.html', 
"const password = document.getElementById('password').value;",
`        const passErr = window.getPasswordError(password);
        if (passErr) {
            Swal.fire({ icon: 'error', title: 'Invalid Password', text: passErr });
            return;
        }`
);

// 2. patch profile.html
patch('public/profile.html',
"const nPass = document.getElementById('new_pass').value;",
`            const passErr = window.getPasswordError(nPass);
            if (passErr) {
                Swal.fire({ icon: 'error', title: 'Invalid Password', text: passErr });
                return;
            }`
);

// 3. patch forgot_password.html
patch('public/forgot_password.html',
"const new_password = document.getElementById('new_password').value;",
`        const passErr = window.getPasswordError(new_password);
        if (passErr) {
            Swal.fire({ icon: 'error', title: 'Invalid Password', text: passErr });
            return;
        }`
);

// wait what about login? The prompt says "Apply same password rules in: Admin Login, Farmer Login... Any password field."
// But wait, "login" typically means *when registering or resetting password*. Do we validate it *when logging in* too?
// Yes, the prompt says "Admin Login, Farmer Login... Any password field".
// If the user tries to login with a bad password (maybe they typed it wrong), they should get the same error instantly and on submission prevent. So:

patch('public/login.html',
"let password = document.getElementById('password').value;",
`        const passErr = window.getPasswordError(password);
        if (passErr) {
            Swal.fire({ icon: 'error', title: 'Invalid Password', text: passErr });
            return;
        }`
);

console.log("Done");
