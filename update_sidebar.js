const fs = require('fs');
const files = fs.readdirSync('public').filter(f => f.endsWith('.html'));

const target = /<a href="all_crops_info\.html"([^>]*)><i class="bi bi-journal-text me-2"><\/i>\s*<span data-t="all_crops_info_nav">Smart Crop Information<\/span><\/a>/g;
const replacement = '<a href="all_crops_info.html"$1><i class="bi bi-journal-text me-2"></i> <span data-t="all_crops_info_nav">Smart Crop Information</span></a>\n        <a href="schemes.html"><i class="bi bi-award me-2"></i> <span data-t="schemes_nav">Schemes</span></a>';

files.forEach(file => {
    const path = 'public/' + file;
    let content = fs.readFileSync(path, 'utf8');
    if (content.match(target)) {
        content = content.replace(target, replacement);
        fs.writeFileSync(path, content);
        console.log('Updated ' + file);
    }
});
