const fs = require('fs');
let code = fs.readFileSync('public/main_admin.js', 'utf8');

let loadLandingDataCode = code.match(/    function loadLandingData\(\) \{[\s\S]*?renderAdmSocialLinks\(\);\s*\}/)[0];

loadLandingDataCode = loadLandingDataCode.replace(
    /document\.getElementById\('admFooterDescEn'\)\.value = landingData\.footer\.desc_en;/,
    `document.getElementById('admFooterTitleEn').value = landingData.footer.title_en || '';
        document.getElementById('admFooterTitleHi').value = landingData.footer.title_hi || '';
        document.getElementById('admFooterDescEn').value = landingData.footer.desc_en || '';`
);

loadLandingDataCode = loadLandingDataCode.replace(
    /renderAdmSocialLinks\(\);/,
    `renderAdmSocialLinks();
        renderAdmFooterLinks('nav');
        renderAdmFooterLinks('support');`
);

let saveLandingDataCode = code.match(/    window\.saveLandingData = function\(\) \{[\s\S]*?\}\);\s*\};/)[0];

saveLandingDataCode = saveLandingDataCode.replace(
    /const socialContainers = document\.querySelectorAll\('#admSocialLinksContainer > div\.border'\);/,
    `const getFooterArr = (type) => {
                    const containers = document.querySelectorAll(\`#adm\${type === 'nav' ? 'Nav' : 'Support'}LinksContainer > div.border\`);
                    const arr = [];
                    containers.forEach((c, i) => {
                        arr.push({
                            id: Date.now() + i,
                            title_en: c.querySelector(\`.\${type}-title-en\`).value,
                            title_hi: c.querySelector(\`.\${type}-title-hi\`).value,
                            url: c.querySelector(\`.\${type}-url\`).value
                        });
                    });
                    return arr;
                };

                const socialContainers = document.querySelectorAll('#admSocialLinksContainer > div.border');`
);

saveLandingDataCode = saveLandingDataCode.replace(
    /landingData\.footer\.desc_en = document\.getElementById\('admFooterDescEn'\)\.value;/,
    `landingData.footer.title_en = document.getElementById('admFooterTitleEn').value;
                landingData.footer.title_hi = document.getElementById('admFooterTitleHi').value;
                landingData.footer.desc_en = document.getElementById('admFooterDescEn').value;`
);

saveLandingDataCode = saveLandingDataCode.replace(
    /landingData\.footer\.social = updatedSocial;/,
    `landingData.footer.social = updatedSocial;
                landingData.footer.nav_links = getFooterArr('nav');
                landingData.footer.support_links = getFooterArr('support');`
);

code = code.replace(/    function loadLandingData\(\) \{[\s\S]*?renderAdmSocialLinks\(\);\s*\}/, loadLandingDataCode);
code = code.replace(/    window\.saveLandingData = function\(\) \{[\s\S]*?\}\);\s*\};/, saveLandingDataCode);

fs.writeFileSync('public/main_admin.js', code);
console.log('Updated load/save for full footer data');
