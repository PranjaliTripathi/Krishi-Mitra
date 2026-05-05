const fs = require('fs');
let code = fs.readFileSync('public/my_crops.html', 'utf8');

const newLoadCrops = `
    function loadCrops() {
        let growingCrops = JSON.parse(localStorage.getItem('currentCrops') || '[]');
        let pastCrops = JSON.parse(localStorage.getItem('pastCrops') || '[]');
        
        // Add Demo Data if empty and filter by farmer
        const userGrowing = growingCrops.filter(c => String(c.farmer_id) == String(user.id));
        const userPast = pastCrops.filter(c => String(c.farmer_id) == String(user.id));

        if (userGrowing.length === 0) {
            let demoGrowing = {
                id: Date.now(),
                farmer_id: user.id,
                name: 'Wheat',
                seed_type: 'Sharbati',
                sowing_date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                duration: 120, // days
                fertilizer: 'Urea',
                pesticide: 'Neem Oil',
                irrigation: 'Drip',
                farm_size: 5,
                season: 'Rabi'
            };
            growingCrops.push(demoGrowing);
            localStorage.setItem('currentCrops', JSON.stringify(growingCrops));
        }

        if (userPast.length === 0) {
            let demoPast = {
                id: Date.now() + 1,
                farmer_id: user.id,
                name: 'Soybean',
                seed_type: 'JS 335',
                sowing_date: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                harvest_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                duration: 100, // days
                production: 20, // quintals
                selling_price: 4500, // per quintal
                revenue: 90000,
                cost: 25000,
                profit: 65000,
                buyer: 'Indore Mandi',
                selling_date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                fertilizer: 'DAP',
                pesticide: 'Standard',
                irrigation: 'Rainfed',
                farm_size: 5,
                season: 'Kharif'
            };
            pastCrops.push(demoPast);
            localStorage.setItem('pastCrops', JSON.stringify(pastCrops));
        }

        // Re-filter after potential additions
        const growingCropsFinal = JSON.parse(localStorage.getItem('currentCrops') || '[]').filter(c => String(c.farmer_id) == String(user.id));
        const pastCropsFinal = JSON.parse(localStorage.getItem('pastCrops') || '[]').filter(c => String(c.farmer_id) == String(user.id));

        console.log("Data Loaded from localStorage:");
        console.log("Current Crops:", growingCropsFinal);
        console.log("Past Crops:", pastCropsFinal);

        renderCurrentCrops(growingCropsFinal);
        renderPastCrops(pastCropsFinal);
        updateProfitChart(pastCropsFinal, growingCropsFinal);
    }
`;

code = code.replace(/function loadCrops\(\) \{[\s\S]*?updateProfitChart\(pastCrops, growingCrops\);\s*\}/, newLoadCrops);

fs.writeFileSync('public/my_crops.html', code);
console.log("my_crops.html patched with demo data logic.");
