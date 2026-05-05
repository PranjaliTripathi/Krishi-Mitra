const fs = require('fs');
let code = fs.readFileSync('public/market_history.html', 'utf8');

const regex = /<div class="row g-4" id="priceGrid">[\s\S]*?<div class="mt-5">/m;

code = code.replace(regex, `<div class="mt-4">
            <h4 class="fw-bold mb-4"><span id="historyCropName"></span> - <span data-t="view_history">History (Last 3 Months)</span></h4>
            <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
                <div style="height: 400px;">
                    <canvas id="detailTrendChart"></canvas>
                </div>
            </div>
            
            <div class="card border-0 shadow-sm rounded-4 p-4">
                <h5 class="fw-bold mb-3">Price History Details</h5>
                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead class="table-light">
                            <tr>
                                <th>Date</th>
                                <th>Market</th>
                                <th>Price (₹ / qtl)</th>
                                <th>Trend</th>
                            </tr>
                        </thead>
                        <tbody id="historyTableBody">
                            <!-- JS will load history -->
                        </tbody>
                    </table>
                </div>
                <div class="mt-3">
                    <a href="market_prices.html" class="btn btn-outline-secondary"><i class="bi bi-arrow-left"></i> Back to Markets</a>
                </div>
            </div>
        </div>
        <div class="mt-5" style="display:none;">`);

// Replace script logic entirely to only show history
let scriptRegex = /function loadPrices\(\) \{[\s\S]*?renderTrendChart\(prices\.slice\(0, 5\)\);\s*\}/m;
code = code.replace(scriptRegex, `
    function loadHistory() {
        const cropName = localStorage.getItem('history_crop') || 'Wheat';
        document.getElementById('historyCropName').innerText = cropName;
        
        const historyData = [];
        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        
        // Generate realistic 3 months history
        let currentPrice = 2400 + Math.random() * 500;
        let d = new Date();
        for(let i = 0; i < 90; i++) {
            currentPrice = currentPrice + (Math.random() * 100 - 50);
            let histDate = new Date(d);
            histDate.setDate(d.getDate() - i);
            historyData.push({
                date: histDate.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { day: 'numeric', month: 'short', year:'numeric' }),
                rawDate: histDate,
                price: Math.round(currentPrice),
                trend: Math.random() > 0.5 ? 'up' : 'down'
            });
        }
        
        historyData.reverse(); // oldest to newest
        
        const tbody = document.getElementById('historyTableBody');
        tbody.innerHTML = historyData.slice().reverse().map((h, index) => \`
            <tr>
                <td>\${h.date}</td>
                <td>Indore</td>
                <td class="fw-bold text-success">₹ \${h.price.toLocaleString()}</td>
                <td><span class="text-\${h.trend === 'up' ? 'success' : 'danger'}"><i class="bi bi-caret-\${h.trend}-fill"></i></span></td>
            </tr>
        \`).join('');

        const ctx = document.getElementById('detailTrendChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: historyData.map(h => h.date),
                datasets: [{
                    label: cropName + ' Price Trend (Last 3 Months)',
                    data: historyData.map(h => h.price),
                    borderColor: '#2e7d32',
                    backgroundColor: 'rgba(46, 125, 50, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // Replace loadPrices call at the end of file
    loadHistory();
`);

// The file has a loadPrices(); call at the bottom. We need to replace it.
code = code.replace(/loadPrices\(\);/g, '');

fs.writeFileSync('public/market_history.html', code);
console.log("Updated market_history.html complete.");
