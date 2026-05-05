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

// AdmProfile -> submitAdmPassChange
patch('public/main_admin.js',
"const np = document.getElementById('admNewPass').value;",
`        const passErr = window.getPasswordError(np);
        if(passErr) return Swal.fire({icon:'error', text: passErr});`
);

// AdmProfile -> addAdminUser
patch('public/main_admin.js',
"const naPass = document.getElementById('naPass').value;",
`        const passErr = window.getPasswordError(naPass);
        if(passErr) return Swal.fire({icon:'error', text: passErr});`
);

// AdmUsers -> handleUserSave
patch('public/main_admin.js',
"const rawPass = document.getElementById('userInputPass').value;",
`        const passErr = window.getPasswordError(rawPass);
        if(passErr) return Swal.fire({icon:'error', text: passErr});`
);


console.log("Admin Dashboard patching done.");
