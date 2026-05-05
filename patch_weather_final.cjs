const fs = require('fs');
let code = fs.readFileSync('public/weather.html', 'utf8');

// 1. Remove Top Update Info from loadRainfallDetails
code = code.replace(/if\(document\.getElementById\('weatherLastUpdated'\)\).*?\n/g, '');
code = code.replace(/if\(document\.getElementById\('weatherSource'\)\).*?\n/g, '');
code = code.replace(/if\(document\.getElementById\('weatherUpdatedBy'\)\).*?\n/g, '');

// Compute update string early
let newLogic = `
        let updateStr = "";
        if (weather.lastUpdated && weather.lastUpdated.includes('Updated on')) {
            updateStr = weather.lastUpdated;
        } else if (weather.lastUpdated) {
            updateStr = "Updated on " + weather.lastUpdated + " by " + (weather.updatedBy || 'Admin');
        }
        const updateTemplate = updateStr ? \`<div class="text-muted small mt-2 d-flex justify-content-end w-100"><i class="bi bi-clock-history me-1"></i> \${updateStr}</div>\` : '';
        const updateTemplateLeft = updateStr ? \`<div class="text-muted small mt-2"><i class="bi bi-clock-history me-1"></i> \${updateStr}</div>\` : '';
        
        // Add to main temp card
        const tempContainer = document.getElementById('currentTemp').parentElement;
        if(!tempContainer.querySelector('.update-tag')) {
            tempContainer.insertAdjacentHTML('beforeend', '<div class="update-tag">' + updateTemplateLeft + '</div>');
        } else {
            tempContainer.querySelector('.update-tag').innerHTML = updateTemplateLeft;
        }
        
        // Add to small cards
        ['valHumidity', 'valWind', 'valRain', 'valPressure'].forEach(id => {
            const el = document.getElementById(id);
            if(el) {
                const box = el.closest('.weather-value-box');
                if(box) {
                    if(!box.querySelector('.update-tag')) {
                        box.insertAdjacentHTML('beforeend', '<div class="update-tag mt-1">' + updateTemplateLeft + '</div>');
                    } else {
                        box.querySelector('.update-tag').innerHTML = updateTemplateLeft;
                    }
                }
            }
        });
`;

code = code.replace(/const now = new Date\(\);/, newLogic + '\nconst now = new Date();');

// Fix the duplicated definition of updateTemplate
code = code.replace(/let updatedInfoFmt = "";[\s\S]*?const updateTemplate = updateStr \? \`<div class="text-muted small mt-2 d-flex justify-content-end w-100"><i class="bi bi-clock-history me-1"><\/i> \$\{updateStr\}<\/div>\` : '';/m, '');

fs.writeFileSync('public/weather.html', code);
console.log("Patched weather info");
