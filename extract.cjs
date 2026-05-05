const fs = require('fs');
let html = fs.readFileSync('public/admin_dashboard.html', 'utf8');

// The first script is at line 13.
const scriptStart1 = html.indexOf('<script>');
const scriptEnd1 = html.indexOf('</script>');
const headScript = html.substring(scriptStart1 + 8, scriptEnd1);

// The second script is at line 1594.
const scriptStart2 = html.lastIndexOf('<script>');
const scriptEnd2 = html.lastIndexOf('</script>');
const bodyScript = html.substring(scriptStart2 + 8, scriptEnd2);

const fullScript = `// HEAD SCRIPT\n${headScript}\n// BODY SCRIPT\n${bodyScript}`;
fs.writeFileSync('public/main_admin.js', fullScript);

// Remove the inline scripts from html
html = html.substring(0, scriptStart1) + html.substring(scriptEnd1 + 9, scriptStart2) + html.substring(scriptEnd2 + 9);

fs.writeFileSync('public/admin_dashboard.html', html);
console.log("Done");
