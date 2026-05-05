const fs = require('fs');
let code = fs.readFileSync('public/weather.html', 'utf8');

const newInit = `
    function initWeatherData() {
        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        // Generate realistic 6 months past rain based on current date
        const monthsStr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const pastRain = [];
        let d = new Date();
        for (let i = 1; i <= 6; i++) {
            let mDate = new Date(d.getFullYear(), d.getMonth() - i, 15);
            let mm = Math.floor(Math.random() * 50) + 10;
            pastRain.push({
                month: monthsStr[mDate.getMonth()],
                date: mDate.getDate(),
                duration: (Math.floor(Math.random() * 4) + 1) + 'h',
                mm: mm,
                frequency: mm > 30 ? 'High' : (mm > 15 ? 'Medium' : 'Low')
            });
        }
        
        // Generate 7 day forecast
        const forecast = [];
        for (let i = 1; i <= 7; i++) {
            let fDate = new Date();
            fDate.setDate(fDate.getDate() + i);
            forecast.push({
                date: fDate.toISOString().split('T')[0],
                time: '12:00 PM',
                temp: Math.floor(Math.random() * 10) + 25,
                status: Math.random() > 0.5 ? 'Sunny' : 'Cloudy',
                prob: Math.floor(Math.random() * 60) + 10,
                wind: Math.floor(Math.random() * 20) + 5
            });
        }

        const now = new Date();
        const demoLastUpdated = "Updated on " + now.toLocaleDateString('en-GB') + " at " + now.toLocaleTimeString('en-US') + " by Admin";

        const defaultData = {
            current: {
                temp: 32, humidity: 45, wind: 12, rain: 8, pressure: 1012, status: 'Sunny',
                lastUpdated: demoLastUpdated,
                updatedBy: 'Admin', source: 'IMD'
            },
            details: {
                alert: 'Heavy rain expected in low-lying areas tomorrow night.',
                advisory: 'Postpone pesticide spraying for next 2 days due to high wind expected.',
                cropImpact: 'Excess moisture may cause root rot in early wheat.',
                tempTrends: 'Temperature is expected to drop by 2-3°C next week.',
                rainInfo: 'Accumulated rainfall is 15% above normal for this season.',
                seasonalPatterns: 'Monsoon withdrawal is delayed, expect sporadic showers.'
            },
            pastRain: pastRain,
            forecast: forecast,
            graphData: { temp: [], rain: [] }
        };

        if (!localStorage.getItem('weatherData')) {
            localStorage.setItem('weatherData', JSON.stringify(defaultData));
        } else {
            // Force demo data to ensure it is visible for testing
            let wd = JSON.parse(localStorage.getItem('weatherData'));
            if (!wd.pastRain || wd.pastRain.length < 2) {
                wd.pastRain = pastRain;
                wd.forecast = forecast;
                wd.details = defaultData.details;
                localStorage.setItem('weatherData', JSON.stringify(wd));
            }
        }
    }
`;

code = code.replace(/function initWeatherData\(\) \{[\s\S]*?\}\n\n    function getRangeStatus/m, newInit + '\n    function getRangeStatus');

fs.writeFileSync('public/weather.html', code);
console.log("Updated initWeatherData");
