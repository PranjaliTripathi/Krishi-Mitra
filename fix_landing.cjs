const fs = require('fs');
let code = fs.readFileSync('public/main_admin.js', 'utf8');

// Find the mangled a.click portion to fix that first
let startBroken = code.indexOf(`a.click            { id: 4, icon: "bi-cloud-sun"`);
if (startBroken !== -1) {
    let fixEnd = code.indexOf(`            title_en: "Krishi Mitra",`, startBroken);
    let fixChunk = code.slice(startBroken, fixEnd);
    code = code.replace(fixChunk, "a.click();\n        } else if (type === 'xlsx') {\n            const ws = XLSX.utils.json_to_sheet(data);\n            const wb = XLSX.utils.book_new();\n            XLSX.utils.book_append_sheet(wb, ws, \"Users\");\n            XLSX.writeFile(wb, `users_export_${Date.now()}.xlsx`);\n        }\n    };\n    // ==========================================\n    // LANDING PAGE MANAGEMENT\n    // ==========================================\n\n");
}

const startIdx = code.indexOf('const defaultLandingData = {');
const nextFuncIdx = code.indexOf('function bindLandingEvents() {', startIdx);

const chunkToReplace = code.slice(startIdx, nextFuncIdx);

const validChunk = `const defaultLandingData = {
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
            { id: 4, icon: "bi-cloud-sun", title_en: "Weather Updates", title_hi: "मौसम अद्यतन", desc_en: "Plan your farming activities effectively with real-time weather forecasts and upcoming weather advisory.", desc_hi: "वास्तविक समय के मौसम पूर्वानुमान और आगामी मौसम सलाह के साथ अपनी कृषि गतिविधियों की प्रभावी ढंग से योजना बनाएं।" },
            { id: 5, icon: "bi-bug", title_en: "Advisory & Control", title_hi: "सलाह और नियंत्रण", desc_en: "Identify pests and diseases early and get actionable remedies to protect your yield.", desc_hi: "कीटों और बीमारियों की जल्दी पहचान करें और अपनी उपज की रक्षा के लिए कार्रवाई योग्य उपचार प्राप्त करें।" },
            { id: 6, icon: "bi-window-sidebar", title_en: "Farmer Dashboard", title_hi: "किसान डैशबोर्ड", desc_en: "A centralized workspace where you can track your registered crops, queries, and advisory responses.", desc_hi: "एक केंद्रीकृत कार्यक्षेत्र जहां आप अपनी पंजीकृत फसलों, प्रश्नों और सलाहकार प्रतिक्रियाओं को ट्रैक कर सकते हैं।" }
        ],
        about: {
            en: "Krishi Mitra is a comprehensive digital platform designed with the sole purpose of empowering farmers. By bridging the gap between technological advisory and traditional farming, we aim to increase agricultural productivity, improve resource management, and provide reliable support directly to the farmer's digitally enabled devices. Together, let's cultivate a smarter, sustainable future.",
            hi: "कृषि मित्र किसानों को सशक्त बनाने के एकमात्र उद्देश्य से डिजाइन किया गया एक व्यापक डिजिटल प्लेटफॉर्म है। तकनीकी सलाह और पारंपरिक खेती के बीच की खाई को पाटने के द्वारा, हमारा लक्ष्य कृषि उत्पादकता बढ़ाना, संसाधन प्रबंधन में सुधार करना और किसान के डिजिटल उपकरणों पर सीधे विश्वसनीय सहायता प्रदान करना है। आइए हम सब मिलकर एक स्मार्ट, संधारणीय भविष्य की खेती करें।"
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
            en: "We respect your privacy. All your data including crops, field size and personal information are strictly protected and used only to offer better services.",
            hi: "हम आपकी गोपनीयता का सम्मान চুক্তির।"
        },
        contact: {
            phone: "+91-1800-120-123",
            email: "support@krishimitra.gov.in",
            address_en: "Krishi Bhavan, New Delhi, India",
            address_hi: "कृषि भवन, नई दिल्ली, भारत"
        },
        footer: {
            title_en: "Krishi Mitra",
            title_hi: "कृषि मित्र",
            desc_en: "Empowering the farming community with smart digital tools and real-time advisory. We bridge the gap between technology and tradition.",
            desc_hi: "स्मार्ट डिजिटल टूल और रीयल-टाइम सलाह के साथ किसान समुदाय को सशक्त बनाना। हम तकनीक और परंपरा के बीच की खाई को पाटते हैं।",
            copyright: "© 2026 Krishi Mitra. All rights reserved.",
            social: [
                { id: 1, icon: "bi-facebook", url: "https://facebook.com/krishimitra" },
                { id: 2, icon: "bi-twitter-x", url: "https://twitter.com/krishimitra" },
                { id: 3, icon: "bi-instagram", url: "https://instagram.com/krishimitra" }
            ],
            nav_links: [
                { id: 1, title_en: "Key Features", title_hi: "मुख्य विशेषताएं", url: "#lblKeyFeatures" },
                { id: 2, title_en: "About Us", title_hi: "हमारे बारे में", url: "#lblAboutTitle" },
                { id: 3, title_en: "Useful Links", title_hi: "उपयोगी लिंक", url: "#lblUsefulLinks" },
                { id: 4, title_en: "Farmer Login", title_hi: "किसान लॉगिन", url: "login.html" }
            ],
            support_links: [
                { id: 1, title_en: "Terms & Conditions", title_hi: "नियम एवं शर्तें", url: "terms.html" },
                { id: 2, title_en: "Privacy Policy", title_hi: "गोपनीयता नीति", url: "privacy.html" },
                { id: 3, title_en: "Contact Support", title_hi: "संपर्क सहायता", url: "contact.html" }
            ]
        }
    };

    let landingData = {};

    let lpEditMode = false;

    window.toggleLandingEditMode = function() {
        lpEditMode = !lpEditMode;
        const btn = document.getElementById('btnLandingEditMode');
        const viewEls = document.querySelectorAll('.lp-view-mode');
        const editEls = document.querySelectorAll('.lp-edit-mode');

        if(!lpEditMode) {
            viewEls.forEach(el => el.style.display = 'block');
            editEls.forEach(el => el.style.display = 'none');
            btn.innerHTML = '<i class="bi bi-pencil"></i> Edit Details';
        } else {
            viewEls.forEach(el => el.style.display = 'none');
            editEls.forEach(el => el.style.display = 'block');
            btn.innerHTML = '<i class="bi bi-x-circle"></i> Cancel Editing';
        }
    };

    function loadLandingData() {
        if(!landingData.hero) landingData.hero = defaultLandingData.hero;
        if(!landingData.privacy) landingData.privacy = defaultLandingData.privacy;
        if(!landingData.contact) landingData.contact = defaultLandingData.contact;
        if(!landingData.footer) landingData.footer = defaultLandingData.footer;

        document.getElementById('lpHerotitleEn').value = landingData.hero.title_en || '';
        document.getElementById('lpHerotitleHi').value = landingData.hero.title_hi || '';
        document.getElementById('lpHeroSubEn').value = landingData.hero.sub_en || '';
        document.getElementById('lpHeroSubHi').value = landingData.hero.sub_hi || '';

        document.getElementById('valLpHerotitleEn').innerText = landingData.hero.title_en || '';
        document.getElementById('valLpHerotitleHi').innerText = landingData.hero.title_hi || '';
        document.getElementById('valLpHeroSubEn').innerText = landingData.hero.sub_en || '';
        document.getElementById('valLpHeroSubHi').innerText = landingData.hero.sub_hi || '';

        document.getElementById('lpContactPhone').value = landingData.contact.phone || '';
        document.getElementById('lpContactEmail').value = landingData.contact.email || '';
        document.getElementById('lpContactAddrEn').value = landingData.contact.address_en || '';
        document.getElementById('lpContactAddrHi').value = landingData.contact.address_hi || '';

        document.getElementById('valLpContactPhone').innerText = landingData.contact.phone || '';
        document.getElementById('valLpContactEmail').innerText = landingData.contact.email || '';
        document.getElementById('valLpContactAddrEn').innerText = landingData.contact.address_en || '';
        document.getElementById('valLpContactAddrHi').innerText = landingData.contact.address_hi || '';

        // Added footer bindings
        if (landingData.footer) {
            const getEl = id => document.getElementById(id);
            if(getEl('lpFooterTitleEn')) getEl('lpFooterTitleEn').value = landingData.footer.title_en || '';
            if(getEl('lpFooterTitleHi')) getEl('lpFooterTitleHi').value = landingData.footer.title_hi || '';
            if(getEl('lpFooterDescEn')) getEl('lpFooterDescEn').value = landingData.footer.desc_en || '';
            if(getEl('lpFooterDescHi')) getEl('lpFooterDescHi').value = landingData.footer.desc_hi || '';
            if(getEl('lpFooterCopyright')) getEl('lpFooterCopyright').value = landingData.footer.copyright || '';

            if(getEl('valLpFooterTitleEn')) getEl('valLpFooterTitleEn').innerText = landingData.footer.title_en || '';
            if(getEl('valLpFooterTitleHi')) getEl('valLpFooterTitleHi').innerText = landingData.footer.title_hi || '';
            if(getEl('valLpFooterDescEn')) getEl('valLpFooterDescEn').innerText = landingData.footer.desc_en || '';
            if(getEl('valLpFooterDescHi')) getEl('valLpFooterDescHi').innerText = landingData.footer.desc_hi || '';
            if(getEl('valLpFooterCopyright')) getEl('valLpFooterCopyright').innerText = landingData.footer.copyright || '';
            
            renderAdmFooterLinks('social');
            renderAdmFooterLinks('nav_links');
            renderAdmFooterLinks('support_links');
        }

        renderAdmFeatures();
        renderAdmLinks();
    }

    function renderAdmFeatures() {
        const list = document.getElementById('admFeaturesList');
        if(!list) return;
        const feats = landingData.features || defaultLandingData.features;
        list.innerHTML = "";
        feats.forEach(f => {
            list.innerHTML += \`
                <tr>
                    <td><i class="bi \${f.icon}"></i> \${f.icon}</td>
                    <td>\${f.title_en}</td>
                    <td>\${f.title_hi}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary me-1" onclick="editLpFeature(\${f.id})"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-outline-danger" onclick="delLpFeature(\${f.id})"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            \`;
        });
    }

    window.editLpFeature = function(id) {
        const f = (landingData.features || []).find(x => x.id === id) || (defaultLandingData.features || []).find(x => x.id === id);
        if(!f) return;
        document.getElementById('lpFeatId').value = f.id;
        document.getElementById('lpFeatIcon').value = f.icon;
        document.getElementById('lpFeatTitleEn').value = f.title_en;
        document.getElementById('lpFeatTitleHi').value = f.title_hi;
        document.getElementById('lpFeatDescEn').value = f.desc_en;
        document.getElementById('lpFeatDescHi').value = f.desc_hi;
        new bootstrap.Modal(document.getElementById('lpFeatureModal')).show();
    };

    window.delLpFeature = function(id) {
        if(!confirm('Delete this feature?')) return;
        landingData.features = (landingData.features || defaultLandingData.features).filter(x => x.id !== id);
        renderAdmFeatures();
    };

    window.saveLpFeature = function() {
        const id = parseInt(document.getElementById('lpFeatId').value) || Date.now();
        const f = {
            id,
            icon: document.getElementById('lpFeatIcon').value,
            title_en: document.getElementById('lpFeatTitleEn').value,
            title_hi: document.getElementById('lpFeatTitleHi').value,
            desc_en: document.getElementById('lpFeatDescEn').value,
            desc_hi: document.getElementById('lpFeatDescHi').value
        };
        landingData.features = landingData.features || JSON.parse(JSON.stringify(defaultLandingData.features));
        const idx = landingData.features.findIndex(x => x.id === id);
        if(idx >= 0) landingData.features[idx] = f;
        else landingData.features.push(f);

        bootstrap.Modal.getInstance(document.getElementById('lpFeatureModal')).hide();
        renderAdmFeatures();
    };

    // LINKS
    function renderAdmLinks() {
        const list = document.getElementById('admLinksList');
        if(!list) return;
        const lnks = landingData.links || defaultLandingData.links;
        list.innerHTML = "";
        lnks.forEach(l => {
            list.innerHTML += \`
                <tr>
                    <td><a href="\${l.url}" target="_blank">\${l.url}</a></td>
                    <td>\${l.title_en}</td>
                    <td>\${l.title_hi}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary me-1" onclick="editLpLink(\${l.id})"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-outline-danger" onclick="delLpLink(\${l.id})"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            \`;
        });
    }

    window.editLpLink = function(id) {
        const l = (landingData.links || []).find(x => x.id === id) || (defaultLandingData.links || []).find(x => x.id === id);
        if(!l) return;
        document.getElementById('lpLinkId').value = l.id;
        document.getElementById('lpLinkUrl').value = l.url;
        document.getElementById('lpLinkTitleEn').value = l.title_en;
        document.getElementById('lpLinkTitleHi').value = l.title_hi;
        new bootstrap.Modal(document.getElementById('lpLinkModal')).show();
    };

    window.delLpLink = function(id) {
        if(!confirm('Delete this link?')) return;
        landingData.links = (landingData.links || defaultLandingData.links).filter(x => x.id !== id);
        renderAdmLinks();
    };

    window.saveLpLink = function() {
        const id = parseInt(document.getElementById('lpLinkId').value) || Date.now();
        const l = {
            id,
            url: document.getElementById('lpLinkUrl').value,
            title_en: document.getElementById('lpLinkTitleEn').value,
            title_hi: document.getElementById('lpLinkTitleHi').value
        };
        landingData.links = landingData.links || JSON.parse(JSON.stringify(defaultLandingData.links));
        const idx = landingData.links.findIndex(x => x.id === id);
        if(idx >= 0) landingData.links[idx] = l;
        else landingData.links.push(l);

        bootstrap.Modal.getInstance(document.getElementById('lpLinkModal')).hide();
        renderAdmLinks();
    };

    // FOOTER LINKS (social, nav_links, support_links)
    function renderAdmFooterLinks(type) {
        const list = document.getElementById('admFooter' + type + 'List');
        if(!list) return;
        
        let ft = landingData.footer || defaultLandingData.footer;
        const lnks = ft[type] || [];
        list.innerHTML = "";
        lnks.forEach(l => {
            list.innerHTML += \`
                <tr>
                    \${type === 'social' ? \`<td><i class="bi \${l.icon}"></i> \${l.icon}</td>\` : \`<td>\${l.title_en}</td><td>\${l.title_hi}</td>\`}
                    <td><a href="\${l.url}" target="_blank">\${l.url}</a></td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary me-1" onclick="editLpFooterLink('\${type}', \${l.id})"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-outline-danger" onclick="delLpFooterLink('\${type}', \${l.id})"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            \`;
        });
    }

    window.openLpFooterLinkModal = function(type) {
        document.getElementById('lpFooterLinkType').value = type;
        document.getElementById('lpFooterLinkId').value = '';
        document.getElementById('lpFooterLinkUrl').value = '';
        
        if (type === 'social') {
            document.getElementById('lpFooterLinkIconGrp').style.display = 'block';
            document.getElementById('lpFooterLinkTitleEnGrp').style.display = 'none';
            document.getElementById('lpFooterLinkTitleHiGrp').style.display = 'none';
        } else {
            document.getElementById('lpFooterLinkIconGrp').style.display = 'none';
            document.getElementById('lpFooterLinkTitleEnGrp').style.display = 'block';
            document.getElementById('lpFooterLinkTitleHiGrp').style.display = 'block';
        }
        
        new bootstrap.Modal(document.getElementById('lpFooterLinkModal')).show();
    };

    window.editLpFooterLink = function(type, id) {
        let ft = landingData.footer || defaultLandingData.footer;
        const lnks = ft[type] || [];
        const l = lnks.find(x => x.id === id);
        if(!l) return;
        
        document.getElementById('lpFooterLinkType').value = type;
        document.getElementById('lpFooterLinkId').value = l.id;
        document.getElementById('lpFooterLinkUrl').value = l.url;
        
        if (type === 'social') {
            document.getElementById('lpFooterLinkIconGrp').style.display = 'block';
            document.getElementById('lpFooterLinkTitleEnGrp').style.display = 'none';
            document.getElementById('lpFooterLinkTitleHiGrp').style.display = 'none';
            document.getElementById('lpFooterLinkIcon').value = l.icon || '';
        } else {
            document.getElementById('lpFooterLinkIconGrp').style.display = 'none';
            document.getElementById('lpFooterLinkTitleEnGrp').style.display = 'block';
            document.getElementById('lpFooterLinkTitleHiGrp').style.display = 'block';
            document.getElementById('lpFooterLinkTitleEn').value = l.title_en || '';
            document.getElementById('lpFooterLinkTitleHi').value = l.title_hi || '';
        }
        new bootstrap.Modal(document.getElementById('lpFooterLinkModal')).show();
    };

    window.saveLpFooterLink = function() {
        let ft = landingData.footer || defaultLandingData.footer;
        const type = document.getElementById('lpFooterLinkType').value;
        const id = parseInt(document.getElementById('lpFooterLinkId').value) || Date.now();
        
        const l = { id, url: document.getElementById('lpFooterLinkUrl').value };
        
        if (type === 'social') {
            l.icon = document.getElementById('lpFooterLinkIcon').value;
        } else {
            l.title_en = document.getElementById('lpFooterLinkTitleEn').value;
            l.title_hi = document.getElementById('lpFooterLinkTitleHi').value;
        }
        
        if (!landingData.footer) landingData.footer = JSON.parse(JSON.stringify(defaultLandingData.footer));
        if (!landingData.footer[type]) landingData.footer[type] = [];
        
        const idx = landingData.footer[type].findIndex(x => x.id === id);
        if(idx >= 0) landingData.footer[type][idx] = l;
        else landingData.footer[type].push(l);

        bootstrap.Modal.getInstance(document.getElementById('lpFooterLinkModal')).hide();
        renderAdmFooterLinks(type);
    };

    window.delLpFooterLink = function(type, id) {
        if(!confirm('Delete this footer link?')) return;
        if (!landingData.footer) landingData.footer = JSON.parse(JSON.stringify(defaultLandingData.footer));
        landingData.footer[type] = (landingData.footer[type] || []).filter(x => x.id !== id);
        renderAdmFooterLinks(type);
    };
`;

if (startIdx !== -1) {
    code = code.slice(0, startIdx) + validChunk + '\n    ' + code.slice(nextFuncIdx);
}
fs.writeFileSync('public/main_admin.js', code);
