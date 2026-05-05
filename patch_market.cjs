const fs = require('fs');
let code = fs.readFileSync('public/market_prices.html', 'utf8');

const regex = /const grid = document\.getElementById\('priceGrid'\);\s*grid\.innerHTML = prices\.map\(p => \`[\s\S]*?`\)\.join\(''\);/g;

const newHTML = `
        const grid = document.getElementById('priceGrid');
        
        // Group prices by crop
        const groupedPrices = {};
        prices.forEach(p => {
            if (!groupedPrices[p.name]) {
                groupedPrices[p.name] = [];
            }
            groupedPrices[p.name].push(p);
        });

        const updateStr = mandiData.lastUpdated ? "Updated " + mandiData.lastUpdated : "";

        grid.innerHTML = Object.keys(groupedPrices).map(cropName => {
            const cropPrices = groupedPrices[cropName];
            const p = cropPrices[0]; // default selected
            const options = cropPrices.map((cp, idx) => \`<option value="\${idx}">\${cp.market}</option>\`).join('');
            
            return \`
            <div class="col-md-4 col-sm-6">
                <div class="p-4 bg-white border border-success border-opacity-25 rounded-4 shadow-sm h-100 position-relative">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="fw-bold mb-0 text-dark">\${cropName}</h5>
                        <span class="badge bg-\${p.trend === 'up' ? 'success' : (p.trend === 'down' ? 'danger' : 'secondary')} bg-opacity-10 text-\${p.trend === 'up' ? 'success' : (p.trend === 'down' ? 'danger' : 'secondary')}">
                            <i class="bi bi-\${p.trend === 'up' ? 'caret-up-fill' : (p.trend === 'down' ? 'caret-down-fill' : 'dash-lg')}"></i> \${p.change}
                        </span>
                    </div>
                    <div class="mb-3">
                        <select class="form-select form-select-sm border-success border-opacity-50 text-success fw-bold" onchange="updateCardPrice(this, '\${cropName}')">
                            \${options}
                        </select>
                    </div>
                    <h3 class="fw-bold text-success mb-1 price-val">₹ \${p.price.toLocaleString()}</h3>
                    <div class="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
                        <small class="text-muted">\${t.per || (lang === 'hi' ? 'प्रति' : 'Per')} \${p.unit}</small>
                        <small class="text-\${p.trend === 'up' ? 'success' : 'danger'} fw-bold trend15-val">
                            <i class="bi bi-clock-history me-1"></i> \${p.trend15} (\${lang === 'hi' ? '15 दिन' : '15d'})
                        </small>
                    </div>
                    \${updateStr ? \`<div class="text-muted small mt-2 text-end"><i class="bi bi-info-circle me-1"></i>\${updateStr}</div>\` : ''}
                </div>
            </div>
            \`;
        }).join('');

        window.groupedCropData = groupedPrices;
`;

code = code.replace(regex, newHTML);

let scriptAddition = `
    window.updateCardPrice = function(selectEl, cropName) {
        const cropPrices = window.groupedCropData[cropName];
        if (!cropPrices) return;
        const selectedIndex = selectEl.value;
        const cp = cropPrices[selectedIndex];
        
        const card = selectEl.closest('.p-4');
        const priceEl = card.querySelector('.price-val');
        const trend15El = card.querySelector('.trend15-val');
        
        priceEl.innerHTML = '₹ ' + cp.price.toLocaleString();
        trend15El.innerHTML = '<i class="bi bi-clock-history me-1"></i> ' + cp.trend15 + ' ';
    };

    window.openHistoryPage = function(cropName) {
        localStorage.setItem('history_crop', cropName);
        window.location.href = 'past_crop_detail.html';
    };
`;

code = code.replace('</script>', scriptAddition + '\n</script>');

fs.writeFileSync('public/market_prices.html', code);
console.log("Updated market_prices.html with grouped cards and history modal link");
