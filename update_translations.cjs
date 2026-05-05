const fs = require('fs');
let content = fs.readFileSync('public/translations.js', 'utf8');

const enKeys = `
        schemes_nav: "Schemes",
        schemes_title: "Agricultural Schemes",
        schemes_management: "Schemes Management",
        state: "State",
        type: "Type",
        crop: "Crop",
        eligibility: "Eligibility",
        benefits: "Benefits",
        subsidy_percent: "Subsidy %",
        area_limit: "Area Limit (Acre)",
        application_process: "Application Process",
        required_docs: "Required Documents",
        max_usage: "Max Usage (Times)",
        farmer_cont: "Farmer Contribution",
        govt_cont: "Govt Contribution",
        terms: "Terms & Conditions",
        add_scheme: "Add Scheme",
        edit_scheme: "Edit Scheme",
        delete_scheme: "Delete Scheme",
        scheme_name: "Scheme Name",
`;

const hiKeys = `
        schemes_nav: "योजनाएं",
        schemes_title: "कृषि योजनाएं",
        schemes_management: "योजनाएं प्रबंधन",
        state: "राज्य",
        type: "प्रकार",
        crop: "फसल",
        eligibility: "पात्रता",
        benefits: "लाभ",
        subsidy_percent: "सब्सिडी %",
        area_limit: "क्षेत्रफल सीमा (एकड़)",
        application_process: "आवेदन प्रक्रिया",
        required_docs: "आवश्यक दस्तावेज",
        max_usage: "अधिकतम उपयोग (बार)",
        farmer_cont: "किसान का योगदान",
        govt_cont: "सरकार का योगदान",
        terms: "नियम एवं शर्तें",
        add_scheme: "योजना जोड़ें",
        edit_scheme: "योजना संपादित करें",
        delete_scheme: "योजना हटाएं",
        scheme_name: "योजना का नाम",
`;

content = content.replace(/(en:\s*\{)/, '$1' + enKeys);
content = content.replace(/(hi:\s*\{)/, '$1' + hiKeys);

fs.writeFileSync('public/translations.js', content);
console.log('Translations updated.');
