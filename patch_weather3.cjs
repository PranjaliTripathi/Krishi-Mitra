const fs = require('fs');
let code = fs.readFileSync('public/weather.html', 'utf8');

const regex = /document\.getElementById\('weatherAlertsList'\)\.innerHTML\s*=\s*alertsHtml;\s*document\.getElementById\('farmingAdvisoryList'\)\.innerHTML\s*=\s*advisoryHtml;\s*document\.getElementById\('cropImpactList'\)\.innerHTML\s*=\s*impactHtml;/m;

let newContent = `
        let updatedInfoFmt = "";
        let updateStr = "";
        // Try to parse typical date from lastUpdated or generated format
        if (weather.lastUpdated && weather.lastUpdated.includes('Updated on')) {
            updateStr = weather.lastUpdated;
        } else if (weather.lastUpdated) {
            updateStr = "Updated on " + weather.lastUpdated + " by " + (weather.updatedBy || 'Admin');
        }

        const updateTemplate = updateStr ? \`<div class="text-muted small mt-2 d-flex justify-content-end w-100"><i class="bi bi-clock-history me-1"></i> \${updateStr}</div>\` : '';

        // Only append to sections if details have content
        let alertsFinal = alertsHtml + (details.alert && details.alert !== 'No alerts' && details.alert !== '-' ? updateTemplate : '');
        let advisoryFinal = advisoryHtml + (details.advisory && details.advisory !== 'Continue regular irrigation' && details.advisory !== '-' ? updateTemplate : '');
        let impactFinal = impactHtml + (details.cropImpact && details.cropImpact !== 'None' && details.cropImpact !== '-' ? updateTemplate : '');

        // And for tables/charts, maybe add at the end of their containers
        if (pastRainRaw.length > 0) {
            document.getElementById('pastRainTable').parentElement.insertAdjacentHTML('afterend', updateTemplate);
        }
        if (forecastRaw.length > 0) {
            document.getElementById('futureRainTable').parentElement.insertAdjacentHTML('afterend', updateTemplate);
        }

        document.getElementById('weatherAlertsList').innerHTML = alertsFinal;
        document.getElementById('farmingAdvisoryList').innerHTML = advisoryFinal;
        document.getElementById('cropImpactList').innerHTML = impactFinal;
`;

code = code.replace(regex, newContent);

// Add to Seasonal Patterns
code = code.replace(/<p class="mb-0">\$\{details\.seasonalPatterns\}<\/p>/g, `<p class="mb-0">\${details.seasonalPatterns}</p>\${updateTemplate}`);

// Add to tempTrends & rainInfo
code = code.replace(/const trendBox = \`(<div class="alert-box alert-warning.*?)<\/div>\`;/, `const trendBox = \`$1\${updateTemplate}</div>\`;`);
code = code.replace(/const rainBox = \`(<div class="alert-box alert-info.*?)<\/div>\`;/, `const rainBox = \`$1\${updateTemplate}</div>\`;`);

fs.writeFileSync('public/weather.html', code);
console.log("Updated weather DOM for updateTemplate");
