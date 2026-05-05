const fs = require('fs');
let code = fs.readFileSync('public/weather.html', 'utf8');

code = code.replace(/document\.getElementById\('weatherLastUpdated'\)\.innerText = `Updated: \$\{weather\.lastUpdated \|\| 'Unknown'\}\`;/g, `if(document.getElementById('weatherLastUpdated')) document.getElementById('weatherLastUpdated').innerText = \`Updated: \$\{weather.lastUpdated || 'Unknown'\}\`;`);
code = code.replace(/document\.getElementById\('weatherSource'\)\.innerText = weather\.source \|\| 'N\/A';/g, `if(document.getElementById('weatherSource')) document.getElementById('weatherSource').innerText = weather.source || 'N/A';`);
code = code.replace(/document\.getElementById\('weatherUpdatedBy'\)\.innerText = weather\.updatedBy \|\| 'N\/A';/g, `if(document.getElementById('weatherUpdatedBy')) document.getElementById('weatherUpdatedBy').innerText = weather.updatedBy || 'N/A';`);

fs.writeFileSync('public/weather.html', code);
