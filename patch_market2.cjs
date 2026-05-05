const fs = require('fs');
let code = fs.readFileSync('public/market_prices.html', 'utf8');

code = code.replace(/window\.location\.href = 'past_crop_detail\.html';/, "window.location.href = 'market_history.html';");

// The trend table code:
// <td><button class="btn btn-sm btn-outline-success" data-t="view_history">${t.view_history}</button></td>
code = code.replace(/<td><button class="btn btn-sm btn-outline-success" data-t="view_history">\$\{t\.view_history\}<\/button><\/td>/g, `<td><button class="btn btn-sm btn-outline-success" data-t="view_history" onclick="openHistoryPage('\${p.name}')">\${t.view_history}</button></td>`);

fs.writeFileSync('public/market_prices.html', code);
