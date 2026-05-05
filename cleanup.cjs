const fs = require('fs');
let adminHtml = fs.readFileSync('public/admin_dashboard.html', 'utf8');

// Find the first script block (Scheme logic)
const startScript = adminHtml.indexOf('<script>');
const endScript = adminHtml.indexOf('</script>', startScript);
const schemeLogic = adminHtml.substring(startScript + 8, endScript);

// Remove the scheme logic from admin_dashboard.html
adminHtml = adminHtml.substring(0, startScript) + adminHtml.substring(endScript + 9);

// Add the main script inclusion
const bodyEnd = adminHtml.lastIndexOf('</body>');
const scriptTag = '\n    <script src="main_admin.js"></script>\n';
adminHtml = adminHtml.slice(0, bodyEnd) + scriptTag + adminHtml.slice(bodyEnd);

fs.writeFileSync('public/admin_dashboard.html', adminHtml);

let mainAdminJs = fs.readFileSync('public/main_admin.js', 'utf8');
// Clean the garbage at the top
mainAdminJs = mainAdminJs.substring(mainAdminJs.indexOf('document.addEventListener('));

mainAdminJs = schemeLogic + '\n\n' + mainAdminJs;

fs.writeFileSync('public/main_admin.js', mainAdminJs);
console.log("Cleanup complete");
