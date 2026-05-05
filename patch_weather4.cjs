const fs = require('fs');
let code = fs.readFileSync('public/weather.html', 'utf8');

// Use innerHTML of a specific container or check if it exists instead of insertAdjacentHTML
code = code.replace(/if \(pastRainRaw\.length > 0\) \{[\s\S]*?parentElement\.insertAdjacentHTML\('afterend', updateTemplate\);\s*\}/, `
        if (pastRainRaw.length > 0) {
            let container = document.getElementById('pastRainTable').parentElement.parentElement;
            if(!container.querySelector('.update-tag')) container.insertAdjacentHTML('beforeend', '<div class="update-tag">' + updateTemplate + '</div>');
            else container.querySelector('.update-tag').innerHTML = updateTemplate;
        }
`);

code = code.replace(/if \(forecastRaw\.length > 0\) \{[\s\S]*?parentElement\.insertAdjacentHTML\('afterend', updateTemplate\);\s*\}/, `
        if (forecastRaw.length > 0) {
            let container = document.getElementById('futureRainTable').parentElement.parentElement;
            if(!container.querySelector('.update-tag')) container.insertAdjacentHTML('beforeend', '<div class="update-tag">' + updateTemplate + '</div>');
            else container.querySelector('.update-tag').innerHTML = updateTemplate;
        }
`);

fs.writeFileSync('public/weather.html', code);
console.log("Fixed infinite insertAdjacentHTML loop");
