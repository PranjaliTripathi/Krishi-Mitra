const fs = require('fs');

function patch(file, targetStr, patchStr) {
    let code = fs.readFileSync(file, 'utf8');
    if (code.includes(patchStr)) return;
    if (!code.includes(targetStr)) {
        console.log(`Could not find target in ${file}: ${targetStr.substring(0, 50)}...`);
        return;
    }
    code = code.replace(targetStr, targetStr + '\n' + patchStr);
    fs.writeFileSync(file, code);
    console.log(`Patched ${file}`);
}

patch('public/main_admin.js',
"const newPass = document.getElementById('admNewPass').value;",
`                const passErr = window.getPasswordError(newPass);
                if(passErr) return Swal.fire({icon:'error', text: passErr});`
);

patch('public/main_admin.js',
"const pass = document.getElementById('naPass').value;",
`        const passErr = window.getPasswordError(pass);
        if(passErr) return Swal.fire({icon:'error', text: passErr});`
);

patch('public/main_admin.js',
"const pass = document.getElementById('userInputPass').value;",
`        if (pass.length > 0) {
            const passErr = window.getPasswordError(pass);
            if(passErr) return Swal.fire({icon:'error', text: passErr});
        }`
);

console.log("Admin Dashboard patching done.");
