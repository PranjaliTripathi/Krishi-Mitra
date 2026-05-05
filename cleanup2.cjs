const fs = require('fs');
let html = fs.readFileSync('public/admin_dashboard.html', 'utf8');

const headStart = html.indexOf('<head>');
const headEnd = html.indexOf('</head>');

const newHead = `<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Krishi Mitra</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
    <script src="https://cdn.jsdelivr.net/npm/flatpickr/dist/l10n/hi.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #f0f2f5; margin: 0; }
`;

// Extract styles and keep them
const styleStart = html.indexOf('<style>', headStart);
const styleHtml = html.substring(styleStart + 7, headEnd);

html = html.substring(0, headStart) + newHead + styleHtml + html.substring(headEnd);

// Move crops_data.js to the bottom, just above main_admin.js
html = html.replace(/<script src="crops_data.js"><\/script>\n?/g, '');
html = html.replace('<script src="main_admin.js"></script>', '<script src="crops_data.js"></script>\n    <script src="main_admin.js"></script>');

fs.writeFileSync('public/admin_dashboard.html', html);
console.log("Head cleaned up");
