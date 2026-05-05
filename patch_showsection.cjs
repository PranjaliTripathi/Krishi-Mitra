const fs = require('fs');
let content = fs.readFileSync('public/admin_dashboard.html', 'utf8');

const targetStr = "if (id === 'admAlerts') loadAdminAlerts();";
content = content.replace(targetStr, "if (id === 'admAlerts') loadAdminAlerts();\n        if (id === 'admSchemes') loadAdminSchemes();\n");

fs.writeFileSync('public/admin_dashboard.html', content);
console.log('patched showSection');
