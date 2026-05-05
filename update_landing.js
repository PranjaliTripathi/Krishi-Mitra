const fs = require('fs');
let code = fs.readFileSync('public/main_admin.js', 'utf8');
code = code.replace(/const defaultLandingData = \{[\s\S]*?    };\s*let landingData = JSON.parse/, 
`const defaultLandingData = {
        hero: {
            title_en: "Empowering Modern Farmers",
            title_hi: "आधुनिक किसानों को सशक्त बनाना",
            sub_en: "Access real-time intelligence on crops, weather forecasts, market prices, and government schemes from anywhere.",
            sub_hi: "फसलों, मौसम पूर्वानुमानों, बाजार भावों और सरकारी योजनाओं पर वास्तविक समय की जानकारी कहीं से भी प्राप्त करें।"
        },
        features: [
            { id: 1, icon: "bi-flower1", title_en: "Crop Information", title_hi: "फसल की जानकारी", desc_en: "Get detailed intelligence on planting, cultivating, and managing numerous crops tailored to your soil type.", desc_hi: "अपनी मिट्टी के प्रकार के अनुरूप विभिन्न फसलों के रोपण, खेती और प्रबंधन पर विस्तृत जानकारी प्राप्त करें।" },
            { id: 2, icon: "bi-bank", title_en: "Government Schemes", title_hi: "सरकारी योजनाएं", desc_en: "Stay updated on the latest financial schemes, subsidies, and government programs to benefit your farming.", desc_hi: "अपनी खेती को लाभ पहुंचाने के लिए नवीनतम वित्तीय योजनाओं, सब्सिडी और सरकारी कार्यक्रमों पर अद्यतित रहें।" },
            { id: 3, icon: "bi-graph-up", title_en: "Market Prices", title_hi: "बाजार भाव", desc_en: "Access daily updated agricultural market prices (Mandi Bhav) to sell your harvest at the best rates.", desc_hi: "सर्वोत्तम दरों पर अपनी फसल बेचने के लिए दैनिक अद्यतन कृषि बाजार मूल्य (मंडी भाव) तक पहुंचें।" },
            { id: 4, icon: "bi-cloud-sun", title_en: "Weather Updates", title_hi: "मौसम अद्यतन", desc_en: "Plan your farming activities effectively with real-time weather forecasts and upcoming climate predictions.", desc_hi: "रीयल-टाइम मौसम पूर्वानुमान और आगामी जलवायु भविष्यवाणियों के साथ अपनी खेती की गतिविधियों की प्रभावी योजना बनाएं।" },
            { id: 5, icon: "bi-bell", title_en: "Notifications", title_hi: "सूचनाएं", desc_en: "Receive critical alerts regarding pests, crop diseases, and urgent weather anomalies directly.", desc_hi: "कीटों, फसल रोगों और तत्काल मौसम विसंगतियों के बारे में महत्वपूर्ण अलर्ट सीधे प्राप्त करें।" },
            { id: 6, icon: "bi-person-workspace", title_en: "Farmer Dashboard", title_hi: "किसान डैशबोर्ड", desc_en: "A centralized workspace where you can track your registered crops, queries, and advisory responses.", desc_hi: "एक केंद्रीकृत कार्यक्षेत्र जहां आप अपनी पंजीकृत फसलों, प्रश्नों और सलाहकार प्रतिक्रियाओं को ट्रैक कर सकते हैं।" }
        ],
        about: {
            en: "Krishi Mitra is a comprehensive digital platform designed with the sole purpose of empowering farmers.",
            hi: "कृषि मित्र किसानों को सशक्त बनाने के उद्देश्य से डिजाइन किया गया एक डिजिटल प्लेटफॉर्म है।"
        },
        links: [
            { id: 1, url: "https://agricoop.nic.in", title_en: "Department of Agriculture", title_hi: "कृषि विभाग" },
            { id: 2, url: "https://pmkisan.gov.in", title_en: "PM-Kisan", title_hi: "पीएम-किसान" }
        ],
        terms: {
            en: "Welcome to Krishi Mitra. terms applied...",
            hi: "कृषि मित्र में आपका स्वागत है। शर्तें लागू..."
        },
        privacy: {
            en: "We respect your privacy.",
            hi: "हम आपकी गोपनीयता का सम्मान करते हैं।"
        },
        contact: {
            phone: "+91-1800-120-123",
            email: "support@krishimitra.gov.in",
            address_en: "Krishi Bhavan, New Delhi",
            address_hi: "कृषि भवन, नई दिल्ली"
        },
        footer: {
            desc_en: "Empowering farmers with tools.",
            desc_hi: "किसानों को उपकरणों से सशक्त बनाना।",
            copyright: "© 2026 Krishi Mitra.",
            social: [
                { id: 1, icon: "bi-facebook", url: "https://facebook.com/krishimitra" },
                { id: 2, icon: "bi-twitter-x", url: "https://twitter.com/krishimitra" }
            ]
        }
    };
    let landingData = JSON.parse`);
fs.writeFileSync('public/main_admin.js', code);
console.log("Updated defaultLandingData successfully!");
