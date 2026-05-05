const fs = require('fs');
let code = fs.readFileSync('public/market_history.html', 'utf8');

code = code.replace(/<div class="mt-5">(\s*<h4 class="fw-bold mb-4" data-t="market_trends">)/, '<div class="mt-5" style="display:none;">$1');

// Actually wait, I need to hide "Current Market Prices" text and the updated block? Let's just change the title
code = code.replace(/<h2 class="fw-bold mb-0" data-t="market_prices_title">Current Market Prices<\/h2>/, '<h2 class="fw-bold mb-0">Market Price History</h2>');

fs.writeFileSync('public/market_history.html', code);

console.log(" market_history.html hidden elements.");
