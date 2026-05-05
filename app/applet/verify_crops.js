
const fs = require('fs');
const content = fs.readFileSync('/app/applet/public/crops_data.js', 'utf8');
// Extract the array. It starts with const cropsData = [ and ends with ];
const start = content.indexOf('[');
const end = content.lastIndexOf(']');
const jsonStr = content.substring(start, end + 1);

// Since it's a JS file, not pure JSON, we might have issues parsing it with JSON.parse if there are comments or unquoted keys.
// But usually these files are formatted as objects.
// Let's try to evaluate it in a sandbox or just use regex to count.

const crops = eval(content.replace('const cropsData =', ''));

crops.forEach(crop => {
    console.log(`Crop: ${crop.name_en} (ID: ${crop.id})`);
    if (!crop.diseases) {
        console.log(`  - NO DISEASES ARRAY`);
    } else {
        console.log(`  - Diseases count: ${crop.diseases.length}`);
        crop.diseases.forEach((d, i) => {
            const missing = [];
            if (!d.name_en) missing.push('name_en');
            if (!d.name_hi) missing.push('name_hi');
            if (!d.cause) missing.push('cause');
            if (!d.occurrence_en) missing.push('occurrence_en');
            if (!d.occurrence_hi) missing.push('occurrence_hi');
            if (!d.symptoms_en) missing.push('symptoms_en');
            if (!d.symptoms_hi) missing.push('symptoms_hi');
            if (!d.prevention_en) missing.push('prevention_en');
            if (!d.prevention_hi) missing.push('prevention_hi');
            if (!d.treatment_en) missing.push('treatment_en');
            if (!d.treatment_hi) missing.push('treatment_hi');
            
            if (missing.length > 0) {
                console.log(`    - Disease ${i+1} missing: ${missing.join(', ')}`);
            }
        });
    }
    if (crop.images && crop.images.length > 0) {
        console.log(`  - Images NOT empty: ${crop.images.length}`);
    }
});
