
    // --- SCHEMES MANAGEMENT ---
    let schemeModalInstance;
    window.openSchemeModal = function(id = null) {
        if (id) {
            const schemes = JSON.parse(localStorage.getItem('schemes_data')) || [];
            const scheme = schemes.find(s => s.id === id);
            if (scheme) {
                localStorage.setItem('selected_yojana', JSON.stringify(scheme));
            }
        } else {
            localStorage.removeItem('selected_yojana');
        }
        window.location.href = 'edit_yojana.html';
    };

    
    window.deleteScheme = function(id) {
        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        Swal.fire({
            title: lang === 'hi' ? 'क्या आप यह बदलाव करना चाहते हैं?' : 'Do you want to permanently delete this scheme?',
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonText: lang === 'hi' ? 'रद्द करें' : 'Cancel',
            confirmButtonText: lang === 'hi' ? 'हाँ, हटाएं' : 'Yes, delete'
        }).then((result) => {
            if (result.isConfirmed) {
                let schemes = JSON.parse(localStorage.getItem('schemes_data')) || [];
                schemes = schemes.filter(s => s.id !== id);
                localStorage.setItem('schemes_data', JSON.stringify(schemes));
                localStorage.setItem('yojana_data', JSON.stringify(schemes));
                loadAdminSchemes();
                Swal.fire('Deleted!', 'Scheme has been deleted.', 'success');
            }
        });
    };

    window.loadAdminSchemes = function() {
        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        const t = (typeof translations !== 'undefined') ? translations[lang] : {};
        let schemes = JSON.parse(localStorage.getItem('yojana_data')) || JSON.parse(localStorage.getItem('schemes_data')) || [];
        
        // Sync logic: default schemes if null to ensure proper preview
        if(schemes.length === 0 && !localStorage.getItem('yojana_data_initialized')) {
            schemes = [
                {id: 1, name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)", cropName: "All Major Crops", state: "Central", type: "Govt", shortDesc: "Comprehensive crop insurance scheme protecting farmers from non-preventable natural risks from pre-sowing to post-harvest.", eligibility: "All farmers including sharecroppers and tenant farmers growing notified crops in notified areas.", benefits: "Financial support to farmers suffering crop loss/damage arising out of unforeseen events.", subsidyPercent: "varies", areaLimit: "No limit", process: "Apply via PMFBY portal, CSCs, banks, or agriculture department office before the cutoff date.", docs: "Aadhar card, Bank passbook, Land records (Khasra/Khatauni), Sowing certificate.", maxUsage: "Once per season", farmerCont: "1.5% to 5% of sum insured", govtCont: "Balance premium shared by Central & State Govt", terms: "Must apply within cutoff date. Losses due to war, nuclear risks, malicious damage not covered."},
                {id: 2, name: "Paramparagat Krishi Vikas Yojana (PKVY)", cropName: "Organic Farming", state: "Central", type: "Govt", shortDesc: "Promotion of commercial organic production through certified organic farming.", eligibility: "Groups of farmers who want to do organic farming. Cluster of 20 hectares.", benefits: "Financial assistance for organic farming certification and inputs.", subsidyPercent: "100%", areaLimit: "50 Acres per cluster", process: "Form a cluster and apply through state agriculture department.", docs: "Aadhar, Land records, Group resolution.", maxUsage: "Once per 3-year term", farmerCont: "Labor", govtCont: "₹50,000 per hectare", terms: "Must avoid chemical fertilizers."}
            ];
            localStorage.setItem('yojana_data', JSON.stringify(schemes));
            localStorage.setItem('yojana_data_initialized', 'true');
        }

        const stateF = document.getElementById('admSchemeStateFilter').value;
        const typeF = document.getElementById('admSchemeTypeFilter').value;
        const cropF = document.getElementById('admSchemeCropFilter').value;

        // Populate crop filter dropdown options dynamically based on all schemes
        const crops = new Set(schemes.map(s => s.cropName).filter(Boolean));
        const cropSelect = document.getElementById('admSchemeCropFilter');
        if (cropSelect) {
            const currCrop = cropSelect.value;
            cropSelect.innerHTML = `<option value="">${t.all_crops || 'All Crops'}</option>` + Array.from(crops).map(c => `<option value="${c}">${c}</option>`).join('');
            if (Array.from(crops).includes(currCrop)) cropSelect.value = currCrop;
        }

        const filtered = schemes.filter(s => {
            return (!stateF || s.state === stateF) && 
                   (!typeF || s.type === typeF) && 
                   (!cropF || s.cropName === cropF);
        });

        const list = document.getElementById('adminSchemeList');
        if (!list) return;

        if (filtered.length === 0) {
            list.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted">${t.no_schemes || 'No schemes found.'}</td></tr>`;
            return;
        }

        list.innerHTML = filtered.map(s => {
            const status = s.status || 'Active';
            const name = lang === 'hi' ? (s.name_hi || s.name_en || s.name || '') : (s.name_en || s.name_hi || s.name || '');
            const cropName = lang === 'hi' ? (s.cropName_hi || s.cropName_en || s.cropName || '') : (s.cropName_en || s.cropName_hi || s.cropName || '');

            return `
            <tr>
                <td class="ps-4 fw-bold">${name}</td>
                <td>${cropName}</td>
                <td>
                    <span class="badge ${s.type === 'Govt' || s.type === 'Central' ? 'bg-success' : 'bg-info'} border mb-1">${s.type}</span><br>
                    <span class="badge bg-secondary bg-opacity-10 text-secondary border">${s.state}</span>
                </td>
                <td>
                    <span class="badge ${status === 'Inactive' ? 'bg-danger' : 'bg-success'} bg-opacity-10 text-${status === 'Inactive' ? 'danger' : 'success'} border border-${status === 'Inactive' ? 'danger' : 'success'} shadow-sm">
                        ${status === 'Inactive' ? (t.inactive || 'Inactive') : (t.active || 'Active')}
                    </span>
                </td>
                <td class="text-end pe-4">
                    <button class="btn btn-sm ${status === 'Inactive' ? 'btn-outline-success' : 'btn-outline-warning'} rounded-pill px-3 me-1" onclick="toggleSchemeStatus(${s.id})" title="${status === 'Inactive' ? (t.active || 'Active') : (t.inactive || 'Inactive')}">
                        <i class="bi ${status === 'Inactive' ? 'bi-check-circle' : 'bi-pause-circle'}"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-primary rounded-pill px-3" onclick="openSchemeModal(${s.id})" title="${t.edit_scheme || 'Edit'}"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-outline-danger rounded-pill px-3 ms-1" onclick="deleteScheme(${s.id})" title="${t.delete_scheme || 'Delete'}"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `; }).join('');
    };

    window.toggleSchemeStatus = function(id) {
        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        const t = translations[lang];

        Swal.fire({
            title: t.status_change_confirm || 'Are you sure you want to change status?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#6c757d',
            confirmButtonText: lang === 'hi' ? 'हाँ' : 'Yes',
            cancelButtonText: lang === 'hi' ? 'नहीं' : 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                let schemes = JSON.parse(localStorage.getItem('schemes_data')) || [];
                const idx = schemes.findIndex(s => s.id == id);
                if (idx !== -1) {
                    schemes[idx].status = schemes[idx].status === 'Inactive' ? 'Active' : 'Inactive';
                    localStorage.setItem('schemes_data', JSON.stringify(schemes));
                    localStorage.setItem('yojana_data', JSON.stringify(schemes));
                    loadAdminSchemes();
                    
                    Swal.fire({
                        title: lang === 'hi' ? 'स्टेटस अपडेट हो गया!' : 'Status Updated!',
                        icon: 'success',
                        timer: 1000,
                        showConfirmButton: false
                    });
                }
            }
        });
    }



document.addEventListener("DOMContentLoaded", initApp);

    function initApp(){
        restoreData();
        applyTranslations();
        bindSidebar();
        bindNavigation();
        bindButtons();
        renderDashboard();
        initFlatpickrs();
    }

    window.globalData = { crops: [], users: [], queries: [], alerts: [], market: [], logs: [], yojana: [] };

    function restoreData() {
        initAuth();
        // Load data from localStorage or scripts
        globalData.crops = JSON.parse(localStorage.getItem('crops_data')) || window.cropsData || [];
        globalData.yojana = JSON.parse(localStorage.getItem('yojana_data')) || JSON.parse(localStorage.getItem('schemes_data')) || [];
        globalData.users = JSON.parse(localStorage.getItem('users')) || [];
        globalData.queries = JSON.parse(localStorage.getItem('queries')) || [];
        globalData.alerts = JSON.parse(localStorage.getItem('alerts')) || [];
        globalData.market = JSON.parse(localStorage.getItem('market_data')) || [];
        globalData.logs = JSON.parse(localStorage.getItem('admin_user_logs')) || [];
    }

    function renderDashboard() {
        // Handle direct section navigation via URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        let section = urlParams.get('section');
        if (!section) section = 'dashboard';

        const el = document.getElementById(`nav_${section}`);
        showSection(section, el);
    }

    function bindSidebar() {
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('adminSidebar');
        const overlay = document.getElementById('sidebarOverlay');

        if(menuToggle) {
            menuToggle.addEventListener('click', () => {
                if(sidebar) sidebar.classList.toggle('active');
                if(overlay) overlay.classList.toggle('active');
            });
        }
        if(overlay) {
            overlay.addEventListener('click', () => {
                if(sidebar) sidebar.classList.remove('active');
                if(overlay) overlay.classList.remove('active');
            });
        }
    }

    function bindNavigation() {
        const sidebar = document.getElementById('adminSidebar');
        const overlay = document.getElementById('sidebarOverlay');

        // Close sidebar on mobile when a link is clicked
        document.querySelectorAll('.admin-sidebar a').forEach(a => {
            a.addEventListener('click', () => {
                if (window.innerWidth <= 992) {
                    if(sidebar) sidebar.classList.remove('active');
                    if(overlay) overlay.classList.remove('active');
                }
            });
        });

        // Setup Dashboard cards to be clickable
        const cardUsers = document.getElementById('cardUsers');
        const cardCrops = document.getElementById('cardCrops');
        const cardQueries = document.getElementById('cardQueries');
        const cardAlerts = document.getElementById('cardAlerts');

        if(cardUsers) cardUsers.addEventListener('click', () => showSection('users', document.getElementById('nav_users')));
        if(cardCrops) cardCrops.addEventListener('click', () => showSection('crops', document.getElementById('nav_crops')));
        if(cardQueries) cardQueries.addEventListener('click', () => showSection('admQueries', document.getElementById('nav_admQueries')));
        if(cardAlerts) cardAlerts.addEventListener('click', () => showSection('admNotifications', document.getElementById('nav_admNotifications'), 'Alerts'));
    }

    function bindButtons() {
        const btnProfile = document.getElementById('btnProfile');
        const btnToggleLang = document.getElementById('btnToggleLang');
        const btnLogout = document.getElementById('btnLogout');
        const btnBack = document.getElementById('btnBack');
        const btnHome = document.getElementById('btnHome');

        if(btnProfile) btnProfile.addEventListener('click', () => showSection('admProfile', document.getElementById('nav_admProfile')));
        if(btnToggleLang) btnToggleLang.addEventListener('click', () => { if(typeof toggleLang === 'function') toggleLang(); });
        
        if(btnLogout) {
            btnLogout.addEventListener('click', () => { 
                localStorage.removeItem("currentUser");
                localStorage.removeItem("admin_user");
                if(typeof handleLogout === 'function') handleLogout(); 
                else window.location.href = "index.html#top";
            });
        }
        
        if(btnBack) btnBack.addEventListener('click', () => {
            if (windowHistoryStack && windowHistoryStack.length > 0) {
                const prev = windowHistoryStack.pop();
                window.showSection(prev.id, prev.el, prev.filter, true);
            } else {
                window.showSection('dashboard', document.getElementById('nav_dashboard'), null, true);
            }
        });
        if(btnHome) btnHome.addEventListener('click', () => window.showSection('dashboard', document.getElementById('nav_dashboard'), null, true));
    }


    window.initFlatpickrs = function() {
        if(typeof flatpickr !== 'undefined') {
            const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
            const fLocale = lang === 'hi' ? 'hi' : 'default';

            window.datePickerInstance = flatpickr("#logFilterDate", {
                dateFormat: "d/m/Y",
                locale: fLocale,
                onChange: function(selectedDates, dateStr, instance) {
                    applyAuditFilters();
                }
            });

            window.timePickerInstance = flatpickr("#logFilterTime", {
                enableTime: true,
                noCalendar: true,
                dateFormat: "h:i K",
                locale: fLocale,
                onChange: function(selectedDates, dateStr, instance) {
                    applyAuditFilters();
                }
            });
        }
    }

    window.clearSpecificFilter = function(type) {
        if(type === 'date' && window.datePickerInstance) {
            window.datePickerInstance.clear();
        } else if(type === 'time' && window.timePickerInstance) {
            window.timePickerInstance.clear();
        }
        applyAuditFilters();
    };

    window.handleLogout = () => {
        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        const msg = lang === 'hi' ? 'क्या आप लॉगआउट करना चाहते हैं?' : 'Do you want to logout?';
        
        Swal.fire({
            title: msg,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#d33',
            confirmButtonText: lang === 'hi' ? 'हाँ' : 'Yes',
            cancelButtonText: lang === 'hi' ? 'नहीं' : 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('admin_user');
                const curr = JSON.parse(localStorage.getItem('currentUser') || 'null');
                if (curr && curr.role === 'admin') localStorage.removeItem('currentUser');
                window.location.href = 'index.html#top';
            }
        });
    };

    window.initAuth = function() {
        const admin = JSON.parse(localStorage.getItem('admin_user'));
        
        // Use currentUser as a generic check as well if that's what the system looks for
        const session = admin || JSON.parse(localStorage.getItem('currentUser'));

        if (!session || session.role !== 'admin') {
            window.location.href = 'login.html';
            return;
        }

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) logoutBtn.onclick = window.handleLogout;
    }

    let windowHistoryStack = [];
    window.showSection = function(id, el, filter, isBack = false) {
        const target = document.getElementById(id);
        if (!target) {
            console.error('Section ID not found:', id);
            return;
        }

        // Store current section for language toggle refresh
        if (window.currentSectionId && !isBack && window.currentSectionId !== id) {
            windowHistoryStack.push({
                id: window.currentSectionId,
                el: window.currentSectionEl,
                filter: window.currentSectionFilter
            });
        } else if (!isBack && window.currentSectionId === id) {
            // Do not push same section
        }

        window.currentSectionId = id;
        window.currentSectionEl = el;
        window.currentSectionFilter = filter;

        if (id === 'dashboard') {
            windowHistoryStack = []; // Reset history when reaching dashboard
        }

        // Dashboard Removal Exception: Hide Back/Home buttons row on main dashboard
        const navRow = document.querySelector('.nav-row');
        if (id === 'dashboard') {
            if (navRow) navRow.style.display = 'none';
        } else {
            if (navRow) navRow.style.display = 'flex';
        }

        document.querySelectorAll('.main-content > div').forEach(d => {
            if (d.classList.contains('modal')) return; // Don't hide modals
            d.style.display = 'none';
        });
        
        target.style.display = 'block';
        document.querySelectorAll('.sidebar a, .admin-sidebar a').forEach(a => a.classList.remove('active'));
        if (el) el.classList.add('active');
        
        switch(id) {
            case 'dashboard': loadAdminDashboard(); break;
            case 'crops': loadCrops(); break;
            case 'users': loadUsers(); break;
            case 'reset': loadResetRequests(); break;
            case 'admQueries': 
                loadFarmerQueries();
                loadLandingPageQueries();
                break;
            case 'admNotifications':
                filterNotifs(filter || 'All');
                break;
            case 'admAlerts': loadAdminAlerts(); break;
            case 'admSchemes': loadAdminSchemes(); break;
            case 'admWeather':
                loadWeatherDisplay();
                loadWeatherHistory();
                break;
            case 'admMandi': loadMandiManagement(); break;
            case 'admLandingPage': loadLandingData(); break;
        }
        
        applyTranslations();
    }

    window.toggleLang = function() {
        const curr = localStorage.getItem('krishi_mitra_lang') || 'en';
        const newLang = curr === 'en' ? 'hi' : 'en';
        localStorage.setItem('krishi_mitra_lang', newLang);
        localStorage.setItem('lang', newLang);
        if(typeof setLanguage === 'function') setLanguage(newLang);
        
        applyTranslations();
        
        // Refresh all dynamic parts
        loadAdminDashboard();
        
        // Refresh current active section if any
        if (window.currentSectionId) {
            showSection(window.currentSectionId, window.currentSectionEl, window.currentSectionFilter);
        }

        if(window.datePickerInstance) window.datePickerInstance.set("locale", newLang === 'hi' ? 'hi' : 'default');
        if(window.timePickerInstance) window.timePickerInstance.set("locale", newLang === 'hi' ? 'hi' : 'default');
        
        window.dispatchEvent(new Event('languageChanged'));
    }

    // --- Admin Dashboard Loaders ---
    window.loadAdminDashboard = function() {
        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        const t = (typeof translations !== 'undefined' ? translations[lang] : {}) || {};
        
        // --- RESTORE DATA & SYNC KEYS (CRITICAL) ---
        // Sync crops_data from admin_crops if needed
        if(!localStorage.getItem('crops_data')) {
            const legacyCrops = JSON.parse(localStorage.getItem('admin_crops')) || (window.cropsData || []);
            if(legacyCrops.length > 0) {
                localStorage.setItem('crops_data', JSON.stringify(legacyCrops));
            }
        }
        // Sync yojana_data from schemes_data if needed
        if(!localStorage.getItem('yojana_data')) {
            const legacySchemes = JSON.parse(localStorage.getItem('schemes_data')) || [];
            if(legacySchemes.length > 0) {
                 localStorage.setItem('yojana_data', JSON.stringify(legacySchemes));
            }
        }
        // Ensure notifications and support_messages exist (even if empty) to prevent undefined errors
        if(!localStorage.getItem('notifications')) localStorage.setItem('notifications', '[]');
        if(!localStorage.getItem('support_messages')) localStorage.setItem('support_messages', '[]');
        if(!localStorage.getItem('users')) localStorage.setItem('users', '[]');

        if(!localStorage.getItem('market_data')) {
            const seedMandi = JSON.parse(localStorage.getItem('mandiData')) || { prices: [] };
            localStorage.setItem('market_data', JSON.stringify(seedMandi.prices || []));
        }

        let users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.length === 0) {
            users = [
                { name: "Demo Farmer 1", role: "farmer", status: "Active", joined_at: new Date(Date.now() - 86400000).toISOString() },
                { name: "Demo Farmer 2", role: "farmer", status: "Active", joined_at: new Date(Date.now() - 172800000).toISOString() },
                { name: "Admin Setup", role: "admin", status: "Active", joined_at: new Date(Date.now() - 259200000).toISOString() }
            ];
        }
        const farmers = users.filter(u => u.role === 'farmer');
        document.getElementById('dashTotalUsers').innerText = users.length;
        
        let crops = JSON.parse(localStorage.getItem('crops_data') || '[]');
        if (crops.length === 0) {
            crops = [
                { name_en: "Wheat", status: "Active" },
                { name_en: "Rice", status: "Active" },
                { name_en: "Sugarcane", status: "Active" }
            ];
        }
        document.getElementById('totalCrops').innerText = crops.length;
        
        const queries = JSON.parse(localStorage.getItem('queries') || '[]');
        document.getElementById('pendingQueries').innerText = queries.filter(q => q.status === 'pending').length;
        
        const notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
        let itemsAlerts = JSON.parse(localStorage.getItem('alerts') || '[]');
        if (itemsAlerts.length === 0) {
            itemsAlerts = [
                { title: "Heavy Rain Warning", text: "Expected heavy rain in central districts.", date: new Date().toISOString() },
                { title: "Market Price Update", text: "Wheat prices surged by 5% today.", date: new Date(Date.now() - 86400000).toISOString() }
            ];
        }
        document.getElementById('dashTotalAlerts').innerText = notifs.length + itemsAlerts.length;
        
        // Weather Summary
        const weatherObj = JSON.parse(localStorage.getItem('weatherData')) || { current: { temp: 32, condition: 'Sunny', status: 'Sunny', location: 'Indore, MP' } };
        const c = weatherObj.current || {};
        const dashWeather = document.getElementById('dashWeather');
        dashWeather.innerHTML = `
            <div class="d-flex align-items-center mb-3">
                <i class="bi bi-cloud-sun text-warning fs-1 me-3"></i>
                <div>
                    <h3 class="fw-bold mb-0">${c.temp || '--'}°C</h3>
                    <p class="text-muted mb-0">${c.status || c.condition || 'Sunny'}</p>
                </div>
            </div>
            <div class="small text-muted mb-1"><i class="bi bi-geo-alt-fill me-1 text-danger"></i> ${c.location || 'Unknown'}</div>
            <div class="small text-muted"><i class="bi bi-clock me-1 text-primary"></i> ${lang==='hi'?'अपडेट किया गया: ':'Updated: '} ${new Date().toLocaleTimeString()}</div>
            <div class="small fw-bold text-success mt-2"><i class="bi bi-broadcast me-1"></i> ${lang==='hi'?'API स्रोत':'API Source'}</div>
        `;

        // Market Price Summary (Top 5)
        let marketPrices = JSON.parse(localStorage.getItem('market_data') || '[]');
        if (marketPrices.length === 0) {
            marketPrices = [
                { crop: "Wheat", price: 2125, trend: "Up", updatedAt: new Date().toISOString(), status: "Active" },
                { crop: "Rice", price: 3200, trend: "Up", updatedAt: new Date().toISOString(), status: "Active" },
                { crop: "Soyabean", price: 4500, trend: "Down", updatedAt: new Date().toISOString(), status: "Active" },
                { crop: "Cotton", price: 6200, trend: "Down", updatedAt: new Date().toISOString(), status: "Active" },
                { crop: "Maize", price: 1800, trend: "Up", updatedAt: new Date().toISOString(), status: "Active" }
            ];
        }
        const dashMarketPrices = document.getElementById('dashMarketPrices');
        let rates = [];
        if(marketPrices && marketPrices.length > 0) {
            let cropMap = {};
            marketPrices.forEach(p => {
               if(p && p.status !== 'Hold' && p.crop && !cropMap[p.crop]) cropMap[p.crop] = p;
            });
            rates = Object.values(cropMap);
            dashMarketPrices.innerHTML = rates.slice(0,5).map(r => `
                    <tr>
                        <td class="fw-bold">${r.crop}</td>
                        <td>₹${r.price}</td>
                        <td><span class="badge ${r.trend==='Up'?'bg-success-subtle text-success':'bg-danger-subtle text-danger'}">${r.trend==='Up'?'<i class="bi bi-arrow-up"></i>':'<i class="bi bi-arrow-down"></i>'}</span></td>
                        <td class="text-end text-muted small">${new Date(r.updatedAt || r.date || Date.now()).toLocaleDateString('en-GB')}</td>
                    </tr>
                `).join('');
        } else if(dashMarketPrices) {
            dashMarketPrices.innerHTML = `<tr><td colspan="4" class="text-muted small">${t.no_market_data || (lang === 'hi' ? 'कोई बाजार डेटा उपलब्ध नहीं है।' : 'No market data available.')}</td></tr>`;
        }

        // Recent Users (Top 5)
        const dashRecentUsers = document.getElementById('dashRecentUsers');
        const sortedUsers = [...users].sort((a,b) => new Date(b.joined_at || b.joinedDate || 0) - new Date(a.joined_at || a.joinedDate || 0)).slice(0,5);
        dashRecentUsers.innerHTML = sortedUsers.map(u => `
            <tr>
                <td class="fw-bold">${u.name}</td>
                <td><span class="badge bg-light text-dark border">${(u.role === 'admin' || u.role === 'Admin') ? (t.admin || 'Admin') : (t.farmer || 'Farmer')}</span></td>
                <td class="text-end"><span class="badge ${u.status === 'Hold' ? 'bg-warning' : 'bg-success'}">${u.status==='Hold'?(lang==='hi'?'होल्ड':'Hold'):(lang==='hi'?'सक्रिय':'Active')}</span></td>
            </tr>
        `).join('');

        // Recent Activity Logs (Top 5)
        const dashRecentLogs = document.getElementById('dashRecentLogs');
        let logs = JSON.parse(localStorage.getItem('admin_user_logs') || '[]');
        if (logs.length === 0) {
            logs = [
                { userName: "Admin Setup", action: "Update", date: new Date().toLocaleDateString('en-GB') },
                { userName: "Demo Farmer 1", action: "Active", date: new Date(Date.now() - 86400000).toLocaleDateString('en-GB') },
                { userName: "Demo Farmer 2", action: "Hold", date: new Date(Date.now() - 172800000).toLocaleDateString('en-GB') }
            ];
        }
        dashRecentLogs.innerHTML = logs.slice(0,5).map(l => `
            <tr>
                <td class="fw-bold small">${l.userName}</td>
                <td><span class="badge ${l.action === 'Delete' ? 'bg-danger' : (l.action === 'Hold' ? 'bg-warning' : 'bg-primary')}">${lang === 'hi' ? (l.action === 'Delete' ? 'हटाएं' : (l.action === 'Hold' ? 'होल्ड' : (l.action === 'Update' ? 'अपडेट' : l.action))) : l.action}</span></td>
                <td class="text-end text-muted small">${l.date}</td>
            </tr>
        `).join('') || `<tr><td colspan="3" class="text-muted small">${t.no_logs_found || (lang === 'hi' ? 'कोई लॉग नहीं मिला।' : 'No logs found.')}</td></tr>`;

        // Latest Alerts (Top 3)
        const dashAlertsList = document.getElementById('dashAlertsList');
        const alerts = itemsAlerts.slice(0, 3);
        dashAlertsList.innerHTML = alerts.map(a => `
            <div class="d-flex align-items-start border-bottom pb-2">
                <div class="bg-danger bg-opacity-10 text-danger rounded-circle p-2 me-3"><i class="bi bi-exclamation-triangle-fill"></i></div>
                <div>
                    <h6 class="mb-1 fw-bold">${a.title}</h6>
                    <p class="mb-0 small text-muted text-truncate" style="max-width: 200px;">${a.text}</p>
                    <small class="text-muted" style="font-size: 0.7rem;">${new Date(a.date).toLocaleDateString('en-GB')}</small>
                </div>
            </div>
        `).join('') || `<p class="text-muted small">${t.no_active_alerts || (lang === 'hi' ? 'कोई सक्रिय अलर्ट नहीं।' : 'No active alerts.')}</p>`;

        const list = document.getElementById('queryList');

        if (list) {
            const displayQueries = queries.slice(0, 5); // Just top 5
            list.innerHTML = displayQueries.length ? displayQueries.map(q => `
                <tr>
                    <td class="fw-bold">${q.farmerName}</td>
                    <td class="text-muted text-truncate" style="max-width: 300px;">${q.text}</td>
                    <td><span class="badge ${q.status === 'pending' ? 'bg-warning' : 'bg-success'}">${q.status === 'pending' ? (t.pending || 'Pending') : (t.answered || 'Answered')}</span></td>
                    <td><button class="btn btn-sm btn-success rounded-pill px-3" onclick="openReplyModal(${q.id})"><i class="bi bi-reply me-1"></i> ${t.reply || 'Reply'}</button></td>
                </tr>
            `).join('') : `<tr><td colspan="4" class="text-center py-4 text-muted">${t.no_queries || 'No queries found.'}</td></tr>`;
        }

        renderCharts(users, crops, rates);
    }

    let growthChart, distChart, trendChart;
    window.renderCharts = function(users, crops, rates) {
        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        const noDataMsg = lang === 'hi' ? 'डेटा उपलब्ध नहीं है' : 'No data available';

        if (growthChart) growthChart.destroy();
        if (distChart) distChart.destroy();
        if (trendChart) trendChart.destroy();

        // Helper to show "No Data"
        const showNoData = (containerId, canvasId) => {
            const container = document.getElementById(containerId);
            const canvas = document.getElementById(canvasId);
            if (!container || !canvas) return true;
            
            const existingMsg = container.querySelector('.no-data-msg');
            if (existingMsg) existingMsg.remove();
            
            if (!users.length && containerId === 'growthContainer') {
                canvas.style.display = 'none';
                const msg = document.createElement('div');
                msg.className = 'no-data-msg d-flex align-items-center justify-content-center h-100 text-muted small';
                msg.innerText = noDataMsg;
                container.appendChild(msg);
                return true;
            }
            if (!crops.length && containerId === 'distContainer') {
                canvas.style.display = 'none';
                const msg = document.createElement('div');
                msg.className = 'no-data-msg d-flex align-items-center justify-content-center h-100 text-muted small';
                msg.innerText = noDataMsg;
                container.appendChild(msg);
                return true;
            }
            if (!rates.length && containerId === 'trendContainer') {
                canvas.style.display = 'none';
                const msg = document.createElement('div');
                msg.className = 'no-data-msg d-flex align-items-center justify-content-center h-100 text-muted small';
                msg.innerText = noDataMsg;
                container.appendChild(msg);
                return true;
            }
            canvas.style.display = 'block';
            return false;
        };

        const chartColors = ['#1a531b', '#28a745', '#ffc107', '#17a2b8', '#dc3545', '#6610f2', '#6f42c1', '#e83e8c', '#fd7e14', '#20c997'];

        // User Growth Chart
        if (!showNoData('growthContainer', 'userGrowthChart')) {
            const ctxGrowth = document.getElementById('userGrowthChart').getContext('2d');
            growthChart = new Chart(ctxGrowth, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: lang === 'hi' ? 'उपयोगकर्ता' : 'Users',
                        data: [10, 25, 45, Math.max(50, users.length - 15), Math.max(70, users.length - 5), users.length],
                        borderColor: '#1a531b',
                        backgroundColor: 'rgba(26, 83, 27, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: false, // Performance improvement
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { 
                            beginAtZero: true,
                            ticks: { precision: 0 },
                            suggestedMax: 10
                        }
                    }
                }
            });
        }

        // Crop Distribution Chart
        if (!showNoData('distContainer', 'cropDistChart')) {
            try {
                const ctxDist = document.getElementById('cropDistChart').getContext('2d');
                
                // Load crops from management and usage data from farmers
                const allCrops = JSON.parse(localStorage.getItem('crops_data') || '[]');
                const currentCrops = JSON.parse(localStorage.getItem('currentCrops') || '[]');
                
                // Top 8 active crops to display
                let topCrops = allCrops.filter(c => c.active || c.status === 'Active').slice(0, 8);
                
                if (topCrops.length === 0) {
                    topCrops = [
                        { name_en: "Wheat", name_hi: "गेहूँ", active: true },
                        { name_en: "Rice", name_hi: "चावल", active: true },
                        { name_en: "Sugarcane", name_hi: "गन्ना", active: true },
                        { name_en: "Cotton", name_hi: "कपास", active: true },
                        { name_en: "Soyabean", name_hi: "सोयाबीन", active: true }
                    ];
                }
                
                // Calculate actual counts from currentCrops if data exists
                    // We match by name (English or Hindi depending on context, or just fallback)
                    const distributionData = topCrops.map(c => {
                        const nameEn = c.name_en || '';
                        const nameHi = c.name_hi || '';
                        return currentCrops.filter(cc => cc.name === nameEn || cc.name === nameHi).length;
                    });

                    // If all counts are 0, maybe just use 1 for each to show they exist in management
                    // But requirement says "load data from crops management". 
                    // If no farmers are growing them, maybe distribution by "Duration" or something else?
                    // Let's stick to counts from currentCrops, if all 0, provide 1 each so chart isn't empty but report is accurate
                    const hasUsage = distributionData.some(d => d > 0);
                    const finalData = hasUsage ? distributionData : topCrops.map(() => 1);

                    distChart = new Chart(ctxDist, {
                        type: 'doughnut',
                        data: {
                            labels: topCrops.map(c => lang === 'hi' ? c.name_hi : c.name_en),
                            datasets: [{
                                data: finalData,
                                backgroundColor: chartColors
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            animation: false,
                            plugins: { 
                                legend: { 
                                    position: 'bottom',
                                    labels: { boxWidth: 12, padding: 10, font: { size: 9 } }
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function(context) {
                                            const val = context.raw;
                                            return `${context.label}: ${hasUsage ? val : (lang === 'hi' ? 'डेटा नहीं' : 'No Data')}`;
                                        }
                                    }
                                }
                            },
                            cutout: '65%'
                        }
                    });
            } catch (err) {
                console.error("Error rendering crop distribution chart:", err);
                showNoData('distContainer', 'cropDistChart');
            }
        }

        // Market Trends Bar Chart
        if (!showNoData('trendContainer', 'marketTrendChart')) {
            const ctxTrend = document.getElementById('marketTrendChart').getContext('2d');
            const topRates = rates.slice(0, 7);
            trendChart = new Chart(ctxTrend, {
                type: 'bar',
                data: {
                    labels: topRates.map(r => r.crop),
                    datasets: [{
                        label: lang === 'hi' ? 'कीमत (₹)' : 'Price (₹)',
                        data: topRates.map(r => r.price),
                        backgroundColor: '#198754',
                        borderRadius: 6,
                        barThickness: 20
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { 
                            beginAtZero: true,
                            ticks: { font: { size: 10 } }
                        },
                        x: {
                            ticks: { font: { size: 10 }, maxRotation: 45, minRotation: 45 }
                        }
                    }
                }
            });
        }
    }

    window.loadCrops = function() {
        const crops = globalData.crops && globalData.crops.length > 0 ? globalData.crops : (JSON.parse(localStorage.getItem('crops_data')) || JSON.parse(localStorage.getItem('admin_crops')) || []);
        const list = document.getElementById('adminCropList');
        const countDisplay = document.getElementById('totalCropsCount');
        if (!list) return;
        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        const t = translations[lang] || {};

        const displayCrops = crops;

        if (countDisplay) {
            countDisplay.innerText = lang === 'hi' ? `कुल फसलें: ${displayCrops.length}` : `Total Crops: ${displayCrops.length}`;
        }

        list.innerHTML = displayCrops.map((c, index) => {
            let statusText = c.status || (c.active ? 'Active' : 'Inactive');
            if (lang === 'hi') {
                if (statusText === 'Active') statusText = 'सक्रिय';
                else if (statusText === 'Inactive') statusText = 'निष्क्रिय';
                else if (statusText === 'Hold') statusText = 'होल्ड';
                else if (statusText === 'Deleted') statusText = 'हटाया गया';
            }
            
            let statusBadge = 'bg-secondary-subtle text-secondary border border-secondary';
            if (c.status === 'Active' || (!c.status && c.active)) {
                statusBadge = 'bg-success-subtle text-success border border-success';
            } else if (c.status === 'Hold') {
                statusBadge = 'bg-warning-subtle text-warning border border-warning';
            } else if (c.status === 'Deleted') {
                statusBadge = 'bg-danger-subtle text-danger border border-danger';
            }

            return `
            <tr>
                <td class="ps-4 fw-bold text-muted">${index + 1}.</td>
                <td class="fw-medium">${lang === 'en' ? c.name_en : c.name_hi}</td>
                <td>${lang === 'en' ? c.soil_en : c.soil_hi}</td>
                <td>${c.duration} ${t.days || 'days'}</td>
                <td class="text-center">
                    <span class="badge ${statusBadge}">
                        ${statusText}
                    </span>
                </td>
                <td>
                    <div class="d-flex justify-content-end gap-2 pe-3">
                        <button class="btn btn-sm btn-outline-primary rounded-pill px-3" onclick="openCropModal(${c.id})" title="${lang==='hi'?'संपादित करें':'Edit'}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        ${c.status !== 'Hold' ? 
                        `<button class="btn btn-sm btn-outline-warning rounded-pill px-3" onclick="holdCrop(${c.id})" title="${lang==='hi'?'होल्ड करें':'Disable / Hold'}">
                            <i class="bi bi-pause-circle"></i>
                        </button>` : 
                        `<button class="btn btn-sm btn-outline-success rounded-pill px-3" onclick="activateCrop(${c.id})" title="${lang==='hi'?'सक्रिय करें':'Activate'}">
                            <i class="bi bi-play-circle"></i>
                        </button>`}
                        <button class="btn btn-sm btn-outline-danger rounded-pill px-3" onclick="deleteCrop(${c.id})" title="${lang==='hi'?'हटाएं':'Delete'}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `}).join('');
    }

    window.openCropModal = (id = null) => {
        window.location.href = id ? `edit-crop.html?id=${id}` : 'edit-crop.html';
    };

    window.activateCrop = (id) => {
        let crops = JSON.parse(localStorage.getItem('admin_crops') || '[]');
        const idx = crops.findIndex(c => c.id === id);
        if (idx !== -1) {
            crops[idx].status = 'Active';
            crops[idx].active = true;
            localStorage.setItem('admin_crops', JSON.stringify(crops));
            loadCrops();
        }
    };

    window.holdCrop = (id) => {
        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        const msg = lang === 'hi' ? 'क्या आप इसे होल्ड करना चाहते हैं?' : 'Do you want to hold this crop?';
        
        Swal.fire({
            title: msg,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ffc107',
            cancelButtonColor: '#6c757d',
            confirmButtonText: lang === 'hi' ? 'हाँ' : 'Yes',
            cancelButtonText: lang === 'hi' ? 'नहीं' : 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                let crops = JSON.parse(localStorage.getItem('admin_crops') || '[]');
                const idx = crops.findIndex(c => c.id === id);
                if (idx !== -1) {
                    crops[idx].status = 'Hold';
                    crops[idx].active = false;
                    localStorage.setItem('admin_crops', JSON.stringify(crops));
                    loadCrops();
                    Swal.fire('Held!', 'Crop status set to hold.', 'success');
                }
            }
        });
    };

    window.deleteCrop = (id) => {
        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        const msg = lang === 'hi' ? 'क्या आप इसे अस्थाई रूप से हटाना चाहते हैं?' : 'Do you want to temporarily delete this crop?';
        
        Swal.fire({
            title: msg,
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: lang === 'hi' ? 'हाँ' : 'Yes',
            cancelButtonText: lang === 'hi' ? 'नहीं' : 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                let crops = JSON.parse(localStorage.getItem('admin_crops') || '[]');
                const idx = crops.findIndex(c => c.id === id);
                if (idx !== -1) {
                    crops[idx].status = 'Deleted';
                    crops[idx].active = false;
                    localStorage.setItem('admin_crops', JSON.stringify(crops));
                    loadCrops();
                    Swal.fire('Deleted', 'Crop marked as deleted.', 'success');
                }
            }
        });
    };

    window.logUserAction = function(userName, action, reason = '') {
        let logs = JSON.parse(localStorage.getItem('admin_user_logs') || '[]');
        const d = new Date();
        logs.unshift({
            userName,
            action,
            reason,
            date: d.toLocaleDateString('en-GB'), // DD/MM/YYYY
            time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        });
        localStorage.setItem('admin_user_logs', JSON.stringify(logs));
        renderUserLogs();
    }

    window.renderUserLogs = function() {
        const logs = JSON.parse(localStorage.getItem('admin_user_logs') || '[]');
        const list = document.getElementById('userActionLogs');
        if (!list) return;
        if (logs.length === 0) {
            list.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No logs available</td></tr>';
            return;
        }
        list.innerHTML = logs.map(l => `
            <tr>
                <td class="fw-bold">${l.userName}</td>
                <td><span class="badge ${l.action === 'Delete' ? 'bg-danger' : (l.action === 'Hold' ? 'bg-warning' : 'bg-primary')}">${l.action}</span></td>
                <td class="text-muted"><small>${l.reason || '-'}</small></td>
                <td><small>${l.date}</small></td>
                <td><small>${l.time}</small></td>
            </tr>
        `).join('');
    }

    window.loadUsers = function() {
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Sort users: Admins on top
        users.sort((a, b) => {
            const aIsAdmin = (a.role === 'admin' || a.role === 'System Admin');
            const bIsAdmin = (b.role === 'admin' || b.role === 'System Admin');
            if (aIsAdmin && !bIsAdmin) return -1;
            if (!aIsAdmin && bIsAdmin) return 1;
            return 0;
        });

        const list = document.getElementById('userTableList');
        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        if(!list) return;
        
        list.innerHTML = users.map((u, index) => {
            let statusText = u.status === 'Hold' ? 'Hold' : 'Active';
            if(lang === 'hi') {
                statusText = statusText === 'Active' ? 'सक्रिय' : 'होल्ड';
            }
            
            const rawJoinDate = u.joinedDate || u.joined_at;
            const joinDate = rawJoinDate ? new Date(rawJoinDate).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB');

            let actions = '';
            
            const isSys = (u.id === 1 || u.name === 'System Admin' || u.isSystemAdmin);
            
            if (isSys) {
                actions = `<span class="text-muted small fst-italic">System Admin</span>`;
            } else {
                const holdBtn = u.status !== 'Hold' ? 
                    `<button class="btn btn-sm btn-outline-warning rounded-pill px-3" onclick="holdUser(${u.id}, '${u.name}')" title="${lang==='hi'?'होल्ड करें':'Hold'}"><i class="bi bi-pause-circle"></i></button>` :
                    `<button class="btn btn-sm btn-outline-success rounded-pill px-3" onclick="activateUser(${u.id}, '${u.name}')" title="${lang==='hi'?'सक्रिय करें':'Activate'}"><i class="bi bi-play-circle"></i></button>`;
                
                actions = `
                    <div class="d-flex justify-content-end gap-2 text-nowrap">
                        <button class="btn btn-sm btn-outline-primary rounded-pill px-3" onclick="openUserModal(${u.id})" data-t="edit_profile_btn">${lang==='hi'?'संपादित करें':'Edit'}</button>
                        ${holdBtn}
                        <button class="btn btn-sm btn-outline-danger rounded-pill px-3" onclick="deleteUser(${u.id}, '${u.name}')" title="${lang==='hi'?'हटाएं':'Delete'}"><i class="bi bi-trash"></i></button>
                    </div>
                `;
            }

            const roleDisplay = u.role === 'System Admin' ? 'System Admin' : (u.role === 'admin' ? 'Admin' : (u.role || 'Farmer'));
            const roleBadgeClass = (u.role === 'admin' || u.role === 'System Admin') ? 'bg-primary text-white border-primary' : 'bg-light text-dark border-secondary';
            const rowClass = (u.role === 'admin' || u.role === 'System Admin') ? 'table-primary bg-opacity-10' : '';

            return `
            <tr class="${rowClass}">
                <td class="ps-4 fw-bold text-muted">${index + 1}.</td>
                <td class="fw-bold">${u.name}</td>
                <td><span class="badge ${roleBadgeClass} border">${roleDisplay}</span></td>
                <td><span class="badge ${u.status === 'Hold' ? 'bg-warning-subtle text-warning border-warning' : 'bg-success-subtle text-success border-success'} border">${statusText}</span></td>
                <td class="text-muted"><small>${joinDate}</small></td>
                <td class="text-end pe-4">${actions}</td>
            </tr>
            `;
        }).join('');
    }

    window.editUser = (id) => {
        window.location.href = `edit-user.html?id=${id}`;
    };

    window.activateUser = (id, name) => {
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        const idx = users.findIndex(u => u.id === id);
        if(idx !== -1) {
            users[idx].status = 'Active';
            localStorage.setItem('users', JSON.stringify(users));
            logUserAction(name, 'Activate', 'Manually activated by admin');
            loadUsers();
        }
    };

    window.holdUser = (id, name) => {
        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        const msg = lang === 'hi' ? 'क्या आप इसे अस्थाई रूप से होल्ड करना चाहते हैं?' : 'Do you want to temporarily hold this user?';
        
        Swal.fire({
            title: msg,
            icon: 'warning',
            input: 'text',
            inputPlaceholder: 'Reason (optional)',
            showCancelButton: true,
            confirmButtonColor: '#ffc107',
            confirmButtonText: lang === 'hi' ? 'हाँ' : 'Yes',
            cancelButtonText: lang === 'hi' ? 'नहीं' : 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                let users = JSON.parse(localStorage.getItem('users') || '[]');
                const idx = users.findIndex(u => u.id === id);
                if (idx !== -1 && users[idx].role !== 'admin') {
                    users[idx].status = 'Hold';
                    localStorage.setItem('users', JSON.stringify(users));
                    logUserAction(name, 'Hold', result.value || 'Temporarily held');
                    loadUsers();
                    Swal.fire('Held!', 'User is on hold.', 'success');
                }
            }
        });
    };

    window.deleteUser = (id, name) => {
        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        const msg = lang === 'hi' ? 'क्या आप इसे स्थायी रूप से हटाना चाहते हैं?' : 'Do you want to permanently delete this user?';
        
        Swal.fire({
            title: msg,
            icon: 'error',
            input: 'text',
            inputPlaceholder: 'Reason (optional)',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            confirmButtonText: lang === 'hi' ? 'हाँ' : 'Yes',
            cancelButtonText: lang === 'hi' ? 'नहीं' : 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                let users = JSON.parse(localStorage.getItem('users') || '[]');
                const userToDelete = users.find(u => u.id === id);
                if (userToDelete && userToDelete.role !== 'admin') {
                    users = users.filter(u => u.id !== id);
                    localStorage.setItem('users', JSON.stringify(users));
                    logUserAction(name, 'Delete', result.value || 'Permanently deleted');
                    loadUsers();
                    Swal.fire('Deleted!', 'User has been permanently removed.', 'success');
                }
            }
        });
    };

    window.loadResetRequests = function() {
        const requests = JSON.parse(localStorage.getItem('reset_requests') || '[]');
        const list = document.getElementById('resetRequestList');
        list.innerHTML = requests.map(r => `
            <tr>
                <td>${r.name}</td>
                <td>${r.securityQuestion}</td>
                <td><button class="btn btn-sm btn-success" onclick="approveReset(${r.userId})">Approve</button></td>
            </tr>
        `).join('');
    }

    // Weather toggle logic
    window.toggleWMode = (mode) => {
        const viewMode = document.getElementById('weatherViewMode');
        const editMode = document.getElementById('weatherEditMode');
        const controls = document.getElementById('weatherControls');
        
        viewMode.style.display = mode === 'view' ? 'block' : 'none';
        editMode.style.display = mode === 'edit' ? 'block' : 'none';
        controls.style.display = mode === 'view' ? 'block' : 'none';

        if (mode === 'edit') {
            const weather = JSON.parse(localStorage.getItem('weatherData')) || { 
                current: { temp: 32, humidity: 45, wind: 12, rain: 8, pressure: 1012, location: 'Indore', status: 'Sunny' },
                pastRain: [],
                forecast: [],
                details: {},
                graphData: { temp: [], rain: [] }
            };
            const c = weather.current;
            const det = weather.details || {};
            const gd = weather.graphData || { temp: [], rain: [] };
            
            document.getElementById('wTemp').value = c.temp || '';
            document.getElementById('wHumidity').value = c.humidity || '';
            document.getElementById('wWind').value = c.wind || '';
            document.getElementById('wRain').value = c.rain || '';
            document.getElementById('wPressure').value = c.pressure || '';
            document.getElementById('wLoc').value = c.location || '';
            document.getElementById('wStatus').value = c.status || '';

            // Advisory fields
            document.getElementById('wAgriAdvisory').value = det.advisory || '';
            document.getElementById('wCropAlerts').value = det.cropImpact || det.alert || '';
            document.getElementById('wTempTrends').value = det.tempTrends || '';
            document.getElementById('wRainfallInfo').value = det.rainInfo || '';
            document.getElementById('wSeasonalPatterns').value = det.seasonalPatterns || '';

            // Rainfall List
            const rList = document.getElementById('editRainfallList');
            rList.innerHTML = '';
            (weather.pastRain || []).forEach(r => addRainfallRow(r.month, r.mm, r.date, r.duration, r.frequency));
            if(!(weather.pastRain || []).length) addRainfallRow();

            // Forecast List
            const fList = document.getElementById('editForecastList');
            fList.innerHTML = '';
            (weather.forecast || []).forEach(f => addForecastRow(f.date, f.temp, f.status, f.prob, f.time, f.wind));
            if(!(weather.forecast || []).length) addForecastRow();

            // Graph Data
            const tList = document.getElementById('editGraphTempList');
            tList.innerHTML = '';
            (gd.temp || []).forEach(p => addGraphDataRow('temp', p.date, p.value));
            
            const rnList = document.getElementById('editGraphRainList');
            rnList.innerHTML = '';
            (gd.rain || []).forEach(p => addGraphDataRow('rain', p.date, p.value));
        }
    };

    window.addRainfallRow = function(month = '', rain = '', date = '', duration = 1, frequency = 'Medium') {
        const container = document.getElementById('editRainfallList');
        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        const t = translations[lang];
        const row = document.createElement('div');
        row.className = 'card bg-light border-0 p-3 mb-2 rainfall-edit-row shadow-sm';
        row.innerHTML = `
            <div class="row g-2">
                <div class="col-md-4">
                    <label class="small text-muted mb-1">${t.month_label}</label>
                    <input type="month" class="form-control form-control-sm r-month" value="${month}">
                </div>
                <div class="col-md-4">
                    <label class="small text-muted mb-1">${t.date_label}</label>
                    <input type="date" class="form-control form-control-sm r-date" value="${date}">
                </div>
                <div class="col-md-4">
                    <label class="small text-muted mb-1">${t.rainfall_mm_label}</label>
                    <input type="number" class="form-control form-control-sm r-mm" value="${rain}">
                </div>
                <div class="col-md-6">
                    <label class="small text-muted mb-1">${t.duration_label}</label>
                    <select class="form-select form-select-sm r-duration">
                        ${Array.from({length: 24}, (_, i) => `<option value="${i+1}" ${duration == i+1 ? 'selected' : ''}>${i+1} hrs</option>`).join('')}
                    </select>
                </div>
                <div class="col-md-6">
                    <label class="small text-muted mb-1">${t.frequency_label}</label>
                    <select class="form-select form-select-sm r-frequency">
                        <option value="Low" ${frequency === 'Low' ? 'selected' : ''}>${t.freq_low}</option>
                        <option value="Medium" ${frequency === 'Medium' ? 'selected' : ''}>${t.freq_medium}</option>
                        <option value="High" ${frequency === 'High' ? 'selected' : ''}>${t.freq_high}</option>
                    </select>
                </div>
                <div class="col-12 mt-2 text-end">
                    <button class="btn btn-sm btn-outline-danger" type="button" onclick="this.closest('.card').remove()"><i class="bi bi-trash me-1"></i>Remove</button>
                </div>
            </div>
        `;
        container.appendChild(row);
    };

    window.addForecastRow = function(date = '', temp = '', status = 'Sunny', prob = '', time = '12:00 PM', wind = '') {
        const container = document.getElementById('editForecastList');
        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        const t = translations[lang];
        const row = document.createElement('div');
        row.className = 'card bg-light border-0 p-3 mb-2 forecast-edit-row shadow-sm';
        row.innerHTML = `
            <div class="row g-2">
                <div class="col-md-6">
                    <label class="small text-muted mb-1">${t.date_label}</label>
                    <input type="date" class="form-control form-control-sm f-date" value="${date}">
                </div>
                <div class="col-md-6">
                    <label class="small text-muted mb-1">${t.time_label}</label>
                    <input type="time" class="form-control form-control-sm f-time" value="${time.includes('AM') || time.includes('PM') ? '12:00' : time}">
                </div>
                <div class="col-md-4">
                    <label class="small text-muted mb-1">${t.temperature} (°C)</label>
                    <input type="number" class="form-control form-control-sm f-temp" value="${temp}">
                </div>
                <div class="col-md-4">
                    <label class="small text-muted mb-1">${t.rain_chance_label}</label>
                    <input type="number" class="form-control form-control-sm f-prob" value="${prob}">
                </div>
                <div class="col-md-4">
                    <label class="small text-muted mb-1">${t.wind_speed_label}</label>
                    <input type="number" class="form-control form-control-sm f-wind" value="${wind}">
                </div>
                <div class="col-md-10">
                    <label class="small text-muted mb-1">${t.weather_condition}</label>
                    <select class="form-select form-select-sm f-status">
                        <option value="Sunny" ${status==='Sunny'?'selected':''}>${t.condition_sunny}</option>
                        <option value="Rainy" ${status==='Rainy'?'selected':''}>${t.condition_rainy}</option>
                        <option value="Cloudy" ${status==='Cloudy'?'selected':''}>${t.condition_cloudy}</option>
                    </select>
                </div>
                <div class="col-md-2 mt-auto">
                    <button type="button" class="btn btn-sm btn-outline-danger w-100" onclick="this.closest('.card').remove()"><i class="bi bi-trash"></i></button>
                </div>
            </div>
        `;
        container.appendChild(row);
    };

    window.addGraphDataRow = function(type, date = '', value = '') {
        const container = document.getElementById(type === 'temp' ? 'editGraphTempList' : 'editGraphRainList');
        const row = document.createElement('div');
        row.className = `input-group input-group-sm mb-2 graph-row-${type}`;
        row.innerHTML = `
            <input type="date" class="form-control g-date" value="${date}">
            <input type="number" class="form-control g-val" value="${value}" placeholder="Value">
            <button class="btn btn-outline-danger" type="button" onclick="this.parentElement.remove()"><i class="bi bi-trash"></i></button>
        `;
        container.appendChild(row);
    };

    window.approveReset = function(userId) {
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIdx = users.findIndex(u => u.id == userId);
        if (userIdx !== -1) {
            users[userIdx].password = '123456';
            localStorage.setItem('users', JSON.stringify(users));
            let requests = JSON.parse(localStorage.getItem('reset_requests') || '[]');
            requests = requests.filter(r => r.userId != userId);
            localStorage.setItem('reset_requests', JSON.stringify(requests));
            Swal.fire('Success', 'Password reset to 123456', 'success');
            loadResetRequests();
        }
    }

    let notifModal;
    window.openNotifModal = function(type, id = null) {
        if (!notifModal) notifModal = new bootstrap.Modal(document.getElementById('notifModal'));
        document.getElementById('notifType').value = type;
        document.getElementById('notifId').value = id || '';
        document.getElementById('notifModalTitle').innerText = id ? (type === 'alert' ? 'Edit Alert' : 'Edit Notification') : (type === 'alert' ? 'Add New Alert' : 'Add New Notification');
        
        const form = document.getElementById('notifForm');
        form.reset();
        
        if (id) {
            const key = type === 'alert' ? 'alerts' : 'notifications';
            const items = JSON.parse(localStorage.getItem(key) || '[]');
            const n = items.find(i => i.id == id);
            if (n) {
                document.getElementById('notifItemTitle').value = n.title;
                document.getElementById('notifItemText').value = n.text;
                document.getElementById('notifSeverity').value = n.severity;
                document.getElementById('notifExpiryDate').value = n.expiry_date || '';
                document.getElementById('notifExpiryTime').value = n.expiry_time || '';
                document.getElementById('notifStatus').value = n.status || 'Active';
            }
        } else {
            document.getElementById('notifStatus').value = 'Active';
        }

        notifModal.show();
    }

    window.saveNotif = function() {
        const type = document.getElementById('notifType').value;
        const id = document.getElementById('notifId').value;
        const title = document.getElementById('notifItemTitle').value;
        const text = document.getElementById('notifItemText').value;
        const severity = document.getElementById('notifSeverity').value;
        const expiry_date = document.getElementById('notifExpiryDate').value;
        const expiry_time = document.getElementById('notifExpiryTime').value;
        const status = document.getElementById('notifStatus').value;
        
        if (!title || !text) return Swal.fire('Error', 'Please fill required fields (Title & Message)', 'error');

        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        const key = type === 'alert' ? 'alerts' : 'notifications';
        const items = JSON.parse(localStorage.getItem(key) || '[]');
        
        const now = new Date();
        const created_date = now.toLocaleDateString('en-GB'); 
        const created_time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

        if (id) {
            const idx = items.findIndex(i => i.id == id);
            if (idx !== -1) {
                items[idx] = { ...items[idx], title, text, severity, expiry_date, expiry_time, status };
            }
        } else {
            items.unshift({ id: Date.now(), title, text, severity, expiry_date, expiry_time, status, created_date, created_time });
        }
        
        localStorage.setItem(key, JSON.stringify(items));
        notifModal.hide();
        loadAdminNotifications();
        window.dispatchEvent(new Event('storage'));
        Swal.fire(lang === 'hi' ? 'सेव हो गया!' : 'Saved!', '', 'success');
    }

    window.loadAdminNotifications = function() {
        let itemsNotifs = JSON.parse(localStorage.getItem('notifications') || '[]');
        let itemsAlerts = JSON.parse(localStorage.getItem('alerts') || '[]');
        
        let allItems = [
            ...itemsNotifs.map(n => ({ ...n, sourceKey: 'notifications'})),
            ...itemsAlerts.map(a => ({ ...a, sourceKey: 'alerts'}))
        ];

        // Expiry Check
        const now = new Date();
        allItems = allItems.map(n => {
            if (n.expiry_date && n.expiry_time && n.status === 'Active') {
                const expiry = new Date(`${n.expiry_date}T${n.expiry_time}`);
                if (now > expiry) {
                    n.status = 'Inactive';
                    // Update key
                    const key = n.sourceKey;
                    const items = JSON.parse(localStorage.getItem(key) || '[]');
                    const idx = items.findIndex(i => i.id == n.id);
                    if (idx !== -1) {
                        items[idx].status = 'Inactive';
                        localStorage.setItem(key, JSON.stringify(items));
                    }
                }
            }
            return n;
        });

        allItems.sort((a, b) => b.id - a.id);

        if (window.currentNotifFilter === 'Alerts') {
            allItems = allItems.filter(i => i.severity === 'Critical');
        } else if (window.currentNotifFilter === 'General') {
            allItems = allItems.filter(i => i.severity !== 'Critical');
        }

        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        const t = (typeof translations !== 'undefined') ? translations[lang] : {};
        
        list.innerHTML = allItems.length ? allItems.map(n => {
            let sClass = 'bg-primary';
            if (n.severity === 'Warning') sClass = 'bg-warning';
            if (n.severity === 'Critical') sClass = 'bg-danger';
            
            const borderClass = n.severity === 'Critical' ? 'border-start border-4 border-danger' : '';
            return `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100 shadow-sm border-0 ${borderClass}">
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between mb-3"><span class="badge ${sClass} bg-opacity-10 text-${sClass.replace('bg-', '')} rounded-pill">${n.severity || 'Info'}</span>
                        <div class="d-flex gap-2">
                             <button class="btn btn-link text-primary p-0" onclick="openNotifModal('${n.sourceKey === 'alerts' ? 'alert' : 'notification'}', ${n.id})"><i class="bi bi-pencil"></i></button>
                             <button class="btn btn-link ${n.status === 'Active' ? 'text-warning' : 'text-success'} p-0" onclick="toggleNotifStatus(${n.id}, '${n.sourceKey}', '${n.status}')" title="${n.status === 'Active' ? 'Inactive' : 'Active'}"><i class="bi ${n.status === 'Active' ? 'bi-pause-circle' : 'bi-play-circle'}"></i></button>
                             <button class="btn btn-link text-danger p-0" onclick="deleteNotif(${n.id}, '${n.sourceKey}')"><i class="bi bi-trash"></i></button>
                        </div>
                        </div>
                        <h5 class="fw-bold">${n.title}</h5><p class="text-muted small mb-3">${n.text}</p>
                        <div class="card-footer bg-transparent p-0 pt-2 border-0">
                             <div class="d-flex justify-content-between align-items-center"><small class="text-muted">${n.created_date || ''} ${n.created_time || ''}</small><span class="text-${n.status === 'Inactive' ? 'muted' : 'success'} small fw-bold">${n.status || 'Active'}</span></div>
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('') : `<div class="col-12 text-center py-5 text-muted">No updates found.</div>`;
    }

    window.toggleNotifStatus = function(id, key, status) {
        const newStatus = status === 'Active' ? 'Inactive' : 'Active';
        const msg = newStatus === 'Active' ? 'क्या आप इस सूचना को सक्रिय करना चाहते हैं?' : 'क्या आप इस सूचना को निष्क्रिय करना चाहते हैं?';
        
        Swal.fire({
            title: msg,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                let items = JSON.parse(localStorage.getItem(key) || '[]');
                const idx = items.findIndex(i => i.id == id);
                if (idx !== -1) {
                    items[idx].status = newStatus;
                    localStorage.setItem(key, JSON.stringify(items));
                    loadAdminNotifications();
                    window.dispatchEvent(new Event('storage'));
                }
            }
        });
    }

    window.deleteNotif = function(id, sourceKey) {
        Swal.fire({
            title: 'क्या आप इस सूचना को हमेशा के लिए डिलीट करना चाहते हैं?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                let items = JSON.parse(localStorage.getItem(sourceKey) || '[]');
                items = items.filter(i => i.id != id);
                localStorage.setItem(sourceKey, JSON.stringify(items));
                loadAdminNotifications();
                window.dispatchEvent(new Event('storage'));
            }
        });
    }

    // --- Weather & Mandi ---
    document.getElementById('admWeatherForm').onsubmit = (e) => {
        e.preventDefault();
        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        const t = translations[lang];

        Swal.fire({
            title: t.confirm_save_weather || 'Do you want to save changes?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#1a531b',
            cancelButtonColor: '#6c757d',
            confirmButtonText: lang === 'hi' ? 'हाँ' : 'Yes',
            cancelButtonText: lang === 'hi' ? 'नहीं' : 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                saveWeatherChanges();
            }
        });
    };

    window.saveWeatherChanges = function() {
        const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{}');
        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        const t = translations[lang];

        const oldW = JSON.parse(localStorage.getItem('weatherData')) || { current: {}, details: {}, pastRain: [], forecast: [], graphData: { temp: [], rain: [] } };
        
        // Collect dynamic rainfall advanced
        const pastRain = [];
        document.querySelectorAll('.rainfall-edit-row').forEach(row => {
            const m = row.querySelector('.r-month').value;
            const dStr = row.querySelector('.r-date').value;
            const v = row.querySelector('.r-mm').value;
            const dur = row.querySelector('.r-duration').value;
            const freq = row.querySelector('.r-frequency').value;
            if(m && v) {
                pastRain.push({ 
                    month: m, 
                    mm: parseFloat(v), 
                    date: dStr || '--', 
                    duration: dur + ' hrs', 
                    frequency: freq 
                });
            }
        });

        // Collect dynamic forecast advanced
        const forecast = [];
        document.querySelectorAll('.forecast-edit-row').forEach(row => {
            const d = row.querySelector('.f-date').value;
            const tm = row.querySelector('.f-time').value;
            const tmp = row.querySelector('.f-temp').value;
            const st = row.querySelector('.f-status').value;
            const pr = row.querySelector('.f-prob').value;
            const wd = row.querySelector('.f-wind').value;
            if(d && tmp) {
                // Formatting time for display
                let displayTime = tm;
                if(tm) {
                    const [h, m] = tm.split(':');
                    const hh = parseInt(h);
                    displayTime = (hh % 12 || 12) + ':' + m + (hh >= 12 ? ' PM' : ' AM');
                }
                forecast.push({ 
                    date: d, 
                    temp: parseFloat(tmp), 
                    status: st, 
                    prob: parseInt(pr || 0), 
                    time: displayTime, 
                    wind: parseFloat(wd || 0) 
                });
            }
        });

        // Collect graph data
        const graphTemp = [];
        document.querySelectorAll('.graph-row-temp').forEach(row => {
            const dt = row.querySelector('.g-date').value;
            const vl = row.querySelector('.g-val').value;
            if(dt && vl) graphTemp.push({ date: dt, value: parseFloat(vl) });
        });
        const graphRain = [];
        document.querySelectorAll('.graph-row-rain').forEach(row => {
            const dt = row.querySelector('.g-date').value;
            const vl = row.querySelector('.g-val').value;
            if(dt && vl) graphRain.push({ date: dt, value: parseFloat(vl) });
        });

        const newC = {
            temp: parseFloat(document.getElementById('wTemp').value),
            humidity: parseInt(document.getElementById('wHumidity').value),
            wind: parseFloat(document.getElementById('wWind').value),
            rain: parseFloat(document.getElementById('wRain').value),
            pressure: parseInt(document.getElementById('wPressure').value),
            location: document.getElementById('wLoc').value,
            status: document.getElementById('wStatus').value,
            lastUpdated: new Date().toLocaleString(lang === 'hi' ? 'hi-IN' : 'en-US'),
            updatedBy: adminUser.email || 'Admin',
            source: 'Admin Verified System'
        };

        const newDetails = {
            advisory: document.getElementById('wAgriAdvisory').value,
            cropImpact: document.getElementById('wCropAlerts').value,
            tempTrends: document.getElementById('wTempTrends').value,
            rainInfo: document.getElementById('wRainfallInfo').value,
            seasonalPatterns: document.getElementById('wSeasonalPatterns').value,
            alert: document.getElementById('wCropAlerts').value
        };

        const newWeatherData = {
            current: newC,
            details: newDetails,
            pastRain: pastRain,
            forecast: forecast,
            graphData: {
                temp: graphTemp,
                rain: graphRain
            },
            ranges: oldW.ranges || {
                humidity: { min: 30, max: 60 },
                wind: { min: 5, max: 20 },
                rain: { min: 0, max: 10 },
                pressure: { min: 1000, max: 1020 }
            }
        };

        // History logic
        let history = JSON.parse(localStorage.getItem('weather_history') || '[]');
        const now = new Date().toLocaleString(lang === 'hi' ? 'hi-IN' : 'en-US');
        
        history.unshift({
            field: 'Advanced System Sync',
            oldVal: 'Admin Update',
            newVal: 'Success',
            updatedBy: adminUser.email || 'Admin',
            date: now
        });

        localStorage.setItem('weather_history', JSON.stringify(history.slice(0, 50)));
        localStorage.setItem('weatherData', JSON.stringify(newWeatherData));

        // Real-time notification logic (simulate socket/presence if farmer open)
        localStorage.setItem('weather_update_signal', Date.now()); 

        Swal.fire({
            title: t.success,
            text: t.weather_sync_success,
            icon: 'success'
        });
        
        toggleWMode('view');
        loadWeatherDisplay();
        loadWeatherHistory();
        if(typeof loadAdminDashboard === 'function') loadAdminDashboard();
    }

    window.loadWeatherDisplay = function() {
        const weather = JSON.parse(localStorage.getItem('weatherData')) || { 
            current: { temp: 32, humidity: 45, wind: 12, rain: 8, pressure: 1012, location: 'Indore', status: 'Sunny' },
            pastRain: [],
            forecast: [],
            details: {},
            graphData: { temp: [], rain: [] }
        };
        const c = weather.current;
        const det = weather.details || {};
        const gd = weather.graphData || { temp: [], rain: [] };
        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        const t = translations[lang];

        document.getElementById('viewWTemp').innerText = (c.temp || '--') + '°C';
        document.getElementById('viewWHumidity').innerText = (c.humidity || '--') + '%';
        document.getElementById('viewWWind').innerText = (c.wind || '--') + ' km/h';
        document.getElementById('viewWRain').innerText = (c.rain || '--') + ' mm';
        document.getElementById('viewWPressure').innerText = (c.pressure || '--') + ' hPa';
        document.getElementById('viewWLoc').innerText = c.location || '--';
        document.getElementById('viewWStatus').innerText = t['condition_' + (c.status || '').toLowerCase()] || c.status || '--';
        
        const updateTime = c.lastUpdated || '--';
        document.getElementById('viewWTimeSync').innerText = updateTime;
        document.getElementById('viewWBy').innerText = c.updatedBy || '--';
        document.getElementById('viewWTime').innerText = updateTime;

        // View Rainfall
        const rv = document.getElementById('viewRainfallBody');
        rv.innerHTML = (weather.pastRain || []).map(r => `
            <tr>
                <td>${r.month} (${r.date})</td>
                <td>${r.mm} mm <br><small class="text-muted">${r.duration} | ${t['freq_'+r.frequency.toLowerCase()] || r.frequency}</small></td>
            </tr>
        `).join('') || '<tr><td colspan="2" class="text-center text-muted">No data</td></tr>';

        // View Forecast
        const fv = document.getElementById('viewForecastBody');
        fv.innerHTML = (weather.forecast || []).map(f => `
            <tr>
                <td>${f.date} <br><small class="text-primary">${f.time}</small></td>
                <td>${f.temp}°C <br><small class="text-muted">${f.wind} km/h</small></td>
                <td>${f.status}</td>
                <td>${f.prob}%</td>
            </tr>
        `).join('') || '<tr><td colspan="4" class="text-center text-muted">No data</td></tr>';

        // View Advisories
        document.getElementById('viewAgriAdvisory').innerText = det.advisory || t.no_advisory;
        document.getElementById('viewCropAlerts').innerText = det.cropImpact || det.alert || t.no_alerts;
        document.getElementById('viewTempTrends').innerText = det.tempTrends || t.no_data;
        document.getElementById('viewRainfallInfo').innerText = det.rainInfo || t.no_data;
        document.getElementById('viewSeasonalPatterns').innerText = det.seasonalPatterns || t.no_data;

        // Graph Data View
        document.getElementById('viewGraphTempBody').innerHTML = (gd.temp || []).map(p => `<tr><td>${p.date}</td><td>${p.value}°C</td></tr>`).join('') || '<tr><td colspan="2">--</td></tr>';
        document.getElementById('viewGraphRainBody').innerHTML = (gd.rain || []).map(p => `<tr><td>${p.date}</td><td>${p.value} mm</td></tr>`).join('') || '<tr><td colspan="2">--</td></tr>';
    }

    window.loadWeatherHistory = function() {
        const history = JSON.parse(localStorage.getItem('weather_history') || '[]');
        const list = document.getElementById('weatherHistoryList');
        
        if (history.length === 0) {
            list.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted">${t.no_history_found}</td></tr>`;
            return;
        }

        list.innerHTML = history.map(h => `
            <tr>
                <td class="px-4 fw-bold text-success">${h.field}</td>
                <td class="text-muted">${h.oldVal}</td>
                <td class="fw-bold">${h.newVal}</td>
                <td><span class="badge bg-light text-dark border">${h.updatedBy}</span></td>
                <td class="px-4 small text-muted">${h.date}</td>
            </tr>
        `).join('');
    }

    let mandiModal;
    window.openMandiModal = function(id = null) {
        if (!mandiModal) mandiModal = new bootstrap.Modal(document.getElementById('mandiModal'));
        document.getElementById('mandiForm').reset();
        document.getElementById('editMandiId').value = id || '';
        document.getElementById('mandiModalTitle').setAttribute('data-t', id ? 'action_edit' : 'add_price');
        
        if (id) {
            const mandi = JSON.parse(localStorage.getItem('mandiData')) || { prices: [] };
            const item = mandi.prices.find(p => p.id === id);
            if (item) {
                document.getElementById('mandiCrop').value = item.crop;
                document.getElementById('mandiMarket').value = item.market;
                document.getElementById('mandiPrice').value = item.price;
                document.getElementById('mandiDate').value = item.date || new Date().toISOString().split('T')[0];
                document.getElementById('mandiStatus').value = item.status || 'Active';
            }
        } else {
            document.getElementById('mandiDate').value = new Date().toISOString().split('T')[0];
        }
        
        applyTranslations();
        mandiModal.show();
    }

    window.handleMandiSave = function() {
        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        const t = translations[lang];

        Swal.fire({
            title: t.save_confirm_msg,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#1a531b',
            cancelButtonColor: '#6c757d',
            confirmButtonText: t.yes,
            cancelButtonText: t.no
        }).then((result) => {
            if (result.isConfirmed) {
                saveMandiData();
            }
        });
    }

    window.saveMandiData = function() {
        const id = document.getElementById('editMandiId').value;
        const crop = document.getElementById('mandiCrop').value;
        const market = document.getElementById('mandiMarket').value;
        const price = parseFloat(document.getElementById('mandiPrice').value);
        const date = document.getElementById('mandiDate').value;
        const status = document.getElementById('mandiStatus').value;

        if (!crop || !market || !price || !date) return Swal.fire(t.error, t.details_required, 'error');

        let mandi = JSON.parse(localStorage.getItem('mandiData')) || { prices: [] };
        
        if (id) {
            // Edit mode
            const idx = mandi.prices.findIndex(p => p.id == id);
            if (idx !== -1) {
                const oldPrice = mandi.prices[idx].price;
                mandi.prices[idx] = { 
                    ...mandi.prices[idx], 
                    crop, market, price, date, status,
                    trend: price > oldPrice ? 'up' : (price < oldPrice ? 'down' : 'stable')
                };
                
                // Track history (trend logic)
                if (!mandi.prices[idx].history) mandi.prices[idx].history = [];
                mandi.prices[idx].history.unshift({ date, price });
                mandi.prices[idx].history = mandi.prices[idx].history.slice(0, 15);
            }
        } else {
            // Add mode
            mandi.prices.unshift({
                id: Date.now(),
                crop, market, price, date, status,
                trend: 'stable',
                history: [{ date, price }]
            });
        }

        mandi.lastUpdated = new Date().toLocaleString();
        mandi.updatedBy = 'Admin';
        
        localStorage.setItem('mandiData', JSON.stringify(mandi));
        mandiModal.hide();
        loadMandiManagement();
        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        const t = translations[lang];
        Swal.fire(t.saved, '', 'success');
    }

    window.loadMandiManagement = function() {
        seedMandiData();
        const mandi = JSON.parse(localStorage.getItem('mandiData')) || { prices: [] };
        const list = document.getElementById('admMandiList');
        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        const t = translations[lang];

        // Grouping by Crop
        const grouped = {};
        mandi.prices.forEach(p => {
            if (!grouped[p.crop]) grouped[p.crop] = [];
            grouped[p.crop].push(p);
        });

        const cropNames = Object.keys(grouped);
        
        // Update Labels
        const totalCropsLabel = document.getElementById('totalCropsCountLabel');
        totalCropsLabel.innerHTML = `<span class="badge bg-primary bg-opacity-10 text-primary border border-primary px-3 py-2 rounded-pill">${t.total_crops_count.replace('{count}', cropNames.length)}</span>`;
        
        const activeCount = mandi.prices.filter(p => p.status === 'Active').length;
        const inactiveCount = mandi.prices.filter(p => p.status === 'Inactive').length;

        document.getElementById('activeInactiveCountLabel').innerHTML = 
            `<span class="badge bg-success bg-opacity-10 text-success border border-success px-3 py-2 rounded-pill">${t.status_active}: ${activeCount}</span> 
             <span class="badge bg-danger bg-opacity-10 text-danger border border-danger px-3 py-2 rounded-pill ms-2">${t.status_inactive}: ${inactiveCount}</span>`;

        // Track selected cities (temporary in memory for this session, or just default to first)
        // For simplicity, we use the first one if not explicitly switched. 
        // We'll store selected cities in a global variable to persist during dashboard view.
        if (!window.selectedCities) window.selectedCities = {};

        list.innerHTML = cropNames.map(crop => {
            const cropItems = grouped[crop];
            const currentCity = window.selectedCities[crop] || cropItems[0].market;
            const p = cropItems.find(item => item.market === currentCity) || cropItems[0];

            return `
                <tr>
                    <td class="px-3">
                        <div class="fw-bold text-dark">${t[p.crop.toLowerCase()] || p.crop}</div>
                    </td>
                    <td>
                        <select class="form-select form-select-sm border-0 bg-light rounded-pill" onchange="switchMandiCity('${p.crop}', this.value)">
                            ${cropItems.map(item => `
                                <option value="${item.market}" ${item.market === currentCity ? 'selected' : ''}>
                                    ${t[item.market.toLowerCase()] || item.market}
                                </option>
                            `).join('')}
                        </select>
                    </td>
                    <td><span class="fw-bold text-success">₹ ${parseFloat(p.price).toFixed(2)}</span> <small class="text-muted">/Q</small></td>
                    <td>
                        ${p.trend === 'up' ? `<span class="text-success fw-bold"><i class="bi bi-arrow-up-right me-1"></i>${t.increased}</span>` : 
                          (p.trend === 'down' ? `<span class="text-danger fw-bold"><i class="bi bi-arrow-down-left me-1"></i>${t.decreased}</span>` : 
                          `<span class="text-muted fw-bold"><i class="bi bi-arrow-right me-1"></i>${t.no_change}</span>`)}
                    </td>
                    <td>
                        <span class="badge ${p.status === 'Active' ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'} rounded-pill">
                            ${p.status === 'Active' ? t.status_active : t.status_inactive}
                        </span>
                    </td>
                    <td class="text-end px-3">
                        <div class="btn-group shadow-sm rounded-pill overflow-hidden">
                            <button class="btn btn-sm btn-white border-end" onclick="window.location.href='edit-mandi.html?id=${p.id}'" title="${t.action_edit}">
                                <i class="bi bi-pencil text-primary"></i>
                            </button>
                            <button class="btn btn-sm btn-white border-end" onclick="toggleMandiStatus(${p.id})" title="${p.status === 'Active' ? t.action_inactive : t.action_active}">
                                <i class="bi ${p.status === 'Active' ? 'bi-pause-circle text-warning' : 'bi-play-circle text-success'}"></i>
                            </button>
                            <button class="btn btn-sm btn-white" onclick="deleteMandiRecord(${p.id})" title="${t.action_delete}">
                                <i class="bi bi-trash text-danger"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    window.switchMandiCity = function(crop, city) {
        if (!window.selectedCities) window.selectedCities = {};
        window.selectedCities[crop] = city;
        loadMandiManagement();
    }

    window.toggleMandiStatus = function(id) {
        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        const t = translations[lang];
        
        Swal.fire({
            title: t.confirm_hold_mandi || 'Do you want to put this data on hold?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ffc107',
            cancelButtonColor: '#6c757d',
            confirmButtonText: lang === 'hi' ? 'हाँ' : 'Yes',
            cancelButtonText: lang === 'hi' ? 'नहीं' : 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                let mandi = JSON.parse(localStorage.getItem('mandiData'));
                const idx = mandi.prices.findIndex(p => p.id == id);
                if (idx !== -1) {
                    mandi.prices[idx].status = mandi.prices[idx].status === 'Active' ? 'Inactive' : 'Active';
                    localStorage.setItem('mandiData', JSON.stringify(mandi));
                    loadMandiManagement();
                }
            }
        });
    }

    window.deleteMandiRecord = function(id) {
        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        const t = translations[lang];

        Swal.fire({
            title: t.confirm_delete_mandi || 'Do you want to permanently delete this?',
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: lang === 'hi' ? 'हाँ' : 'Yes',
            cancelButtonText: lang === 'hi' ? 'नहीं' : 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                let mandi = JSON.parse(localStorage.getItem('mandiData'));
                mandi.prices = mandi.prices.filter(p => p.id != id);
                localStorage.setItem('mandiData', JSON.stringify(mandi));
                loadMandiManagement();
            }
        });
    }

    window.exportMandi = function(type) {
        const mandi = JSON.parse(localStorage.getItem('mandiData')) || { prices: [] };
        const data = mandi.prices;
        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        const t = translations[lang];

        if (data.length === 0) {
            Swal.fire({
                title: 'No Data',
                text: 'There is no data to export.',
                icon: 'warning'
            });
            return;
        }

        // Format data for export
        const formattedData = data.map(p => {
            // Format dates as DD/MM/YYYY
            const formattedDate = p.date ? new Date(p.date).toLocaleDateString('en-GB') : '';
            
            // Format history
            const formattedHistory = p.history ? p.history.map(h => {
                const hd = new Date(h.date).toLocaleDateString('en-GB');
                return `${hd} (₹${h.price})`;
            }).join(' | ') : 'No history';

            return {
                "Crop Name": t[p.crop.toLowerCase()] || p.crop,
                "City": t[p.market.toLowerCase()] || p.market,
                "Price (₹/quintal)": p.price.toFixed(2),
                "Trend": p.trend.toUpperCase(),
                "Status": p.status,
                "Date": formattedDate,
                "History": formattedHistory
            };
        });

        if (type === 'json') {
            const blob = new Blob([JSON.stringify(formattedData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `market_prices_${new Date().getTime()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        } else if (type === 'csv') {
            const keys = Object.keys(formattedData[0]);
            let csv = keys.join(',') + '\n';
            formattedData.forEach(row => {
                const values = keys.map(k => {
                    let val = String(row[k] || '');
                    if (val.includes(',') || val.includes('"') || val.includes('\n')) {
                        val = `"${val.replace(/"/g, '""')}"`;
                    }
                    return val;
                });
                csv += values.join(',') + '\n';
            });
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `market_prices_${new Date().getTime()}.csv`;
            a.click();
            URL.revokeObjectURL(url);
        } else if (type === 'xlsx') {
            const worksheet = XLSX.utils.json_to_sheet(formattedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Market Prices");
            XLSX.writeFile(workbook, `market_prices_${new Date().getTime()}.xlsx`);
        }
    }

    window.seedMandiData = function() {
        if (localStorage.getItem('mandi_seeded')) return;
        
        const crops = ['Wheat', 'Rice', 'Maize', 'Soybean', 'Gram', 'Mustard', 'Onion', 'Potato', 'Tomato', 'Sugarcane'];
        const cities = ['Indore', 'Bhopal', 'Ujjain'];
        let prices = [];
        
        crops.forEach((crop, cIdx) => {
            cities.forEach((city, cityIdx) => {
                const basePrice = 2000 + (cIdx * 200) + (cityIdx * 50);
                const history = Array.from({length: 15}, (_, i) => ({
                    date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
                    price: Math.floor(basePrice - (Math.random() * 300) + 150)
                }));
                
                // Set the current price to the first history entry for consistency
                const currentPrice = history[0].price;
                const oldestPrice = history[history.length - 1].price;
                const calculatedTrend = currentPrice > oldestPrice ? 'up' : (currentPrice < oldestPrice ? 'down' : 'stable');

                prices.push({
                    id: Date.now() + Math.random(),
                    crop: crop,
                    market: city,
                    price: currentPrice,
                    date: history[0].date,
                    status: 'Active',
                    trend: calculatedTrend,
                    history: history
                });
            });
        });
        
        localStorage.setItem('mandiData', JSON.stringify({ prices, lastUpdated: new Date().toLocaleString(), updatedBy: 'System' }));
        localStorage.setItem('mandi_seeded', 'true');
    }

    // --- Notifications Merge ---
    window.currentNotifFilter = 'All';
    window.filterNotifs = function(type) {
        window.currentNotifFilter = type;
        document.getElementById('filterNotifAll').classList.remove('active');
        document.getElementById('filterNotifAlerts').classList.remove('active');
        document.getElementById('filterNotifGeneral').classList.remove('active');
        
        if (type === 'All') document.getElementById('filterNotifAll').classList.add('active');
        if (type === 'Alerts') document.getElementById('filterNotifAlerts').classList.add('active');
        if (type === 'General') document.getElementById('filterNotifGeneral').classList.add('active');
        
        loadAdminNotifications();
    }

    // Rewrite global variables dynamically inside showSection callback if it triggers admProfile
    const origShowSection = window.showSection;
    window.showSection = function(id, el, filter, isBack = false) {
        origShowSection(id, el, filter, isBack);
        if(id === 'admProfile') {
            loadAdmProfile();
            loadAdminList();
            loadAuditLogs();
        }
    };

    window.isCurrentUserSystemAdmin = function() {
        const admin = JSON.parse(localStorage.getItem('admin_user'));
        return admin && (admin.id === 1 || admin.name === 'System Admin' || admin.isSystemAdmin);
    }

    window.toggleProfileEdit = function() {
        document.getElementById('admProfileName').readOnly = false;
        document.getElementById('admProfileEmail').readOnly = false;
        document.getElementById('admProfileImgUploadDiv').style.display = 'block';
        document.getElementById('admSaveBtn').style.display = 'block';
        document.getElementById('admEditBtn').style.display = 'none';
    };

    document.getElementById('admProfileImgFile').onchange = function(e) {
        const file = e.target.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = function(evt) {
            document.getElementById('admProfileImg').src = evt.target.result;
        };
        reader.readAsDataURL(file);
    };

    window.togglePassVisibility = function(id, btn) {
        const el = document.getElementById(id);
        if(el.type === 'password') {
            el.type = 'text';
            btn.innerHTML = '<i class="bi bi-eye-slash"></i>';
        } else {
            el.type = 'password';
            btn.innerHTML = '<i class="bi bi-eye"></i>';
        }
    };

    window.loadAdmProfile = function() {
        const admin = JSON.parse(localStorage.getItem('admin_user'));
        if(!admin) return;
        document.getElementById('admProfileName').value = admin.name || '';
        document.getElementById('admProfileEmail').value = admin.email || '';
        if (admin.imgUrl) {
            document.getElementById('admProfileImg').src = admin.imgUrl;
        }

        document.getElementById('admProfileName').readOnly = true;
        document.getElementById('admProfileEmail').readOnly = true;
        document.getElementById('admProfileImgUploadDiv').style.display = 'none';
        document.getElementById('admSaveBtn').style.display = 'none';
        document.getElementById('admEditBtn').style.display = 'block';
        
        loadSecurityQuestions(admin.secQ1, admin.secQ2);
        loadSecuritySummary();

        if (isCurrentUserSystemAdmin()) {
            document.getElementById('adminListSection').style.display = 'block';
            document.getElementById('addAdminSection').style.display = 'block';
        } else {
            document.getElementById('adminListSection').style.display = 'none';
            document.getElementById('addAdminSection').style.display = 'none';
        }
    }

    window.loadSecurityQuestions = function(selectedQ1 = '', selectedQ2 = '') {
        const defaultQs = [
            { id: 'q1', text: 'What was your childhood nickname?' },
            { id: 'q2', text: 'What is the name of your favorite pet?' },
            { id: 'q3', text: 'What city were you born in?' }
        ];
        let customQs = JSON.parse(localStorage.getItem('custom_sec_q') || '[]');
        let allQs = [...defaultQs, ...customQs];

        const select1 = document.getElementById('admSecQ1');
        const select2 = document.getElementById('admSecQ2');
        if(select1 && select2) {
            select1.innerHTML = '<option value="" disabled selected>Select Question</option>';
            select2.innerHTML = '<option value="" disabled selected>Select Question</option>';
            
            allQs.forEach(q => {
                let opt1 = document.createElement('option');
                opt1.value = q.id;
                opt1.innerText = q.text;
                if(q.id === selectedQ1) opt1.selected = true;
                select1.appendChild(opt1);

                let opt2 = document.createElement('option');
                opt2.value = q.id;
                opt2.innerText = q.text;
                if(q.id === selectedQ2) opt2.selected = true;
                select2.appendChild(opt2);
            });
        }
        
        // Also verify dropdown in PassForm
        const checkSelect = document.getElementById('admCheckSecQ');
        if(checkSelect) {
            checkSelect.innerHTML = '<option value="" disabled selected>Select Question</option>';
            let admin = JSON.parse(localStorage.getItem('admin_user')) || {};
            if(admin.secQ1) {
                let q1Text = allQs.find(q=>q.id===admin.secQ1)?.text || admin.secQ1;
                checkSelect.appendChild(new Option("Q1: " + q1Text, 'q1'));
            }
            if(admin.secQ2) {
                let q2Text = allQs.find(q=>q.id===admin.secQ2)?.text || admin.secQ2;
                checkSelect.appendChild(new Option("Q2: " + q2Text, 'q2'));
            }
        }
    }

    window.onPassSecQChange = function(sel) {
        if(sel.value) {
            document.getElementById('admCheckSecADiv').style.display = 'block';
        } else {
            document.getElementById('admCheckSecADiv').style.display = 'none';
        }
    };

    window.loadSecuritySummary = function() {
        const admin = JSON.parse(localStorage.getItem('admin_user'));
        const badge = document.getElementById('secStatusBadge');
        if (admin && admin.secQ1 && admin.secA1) {
            badge.className = 'badge bg-success rounded-pill px-3 py-2 fw-semibold shadow-sm';
            badge.innerHTML = '<i class="bi bi-check-circle me-1"></i> Configured';
        } else {
            badge.className = 'badge bg-danger rounded-pill px-3 py-2 fw-semibold shadow-sm';
            badge.innerHTML = '<i class="bi bi-x-circle me-1"></i> Not Set';
        }

        const logs = JSON.parse(localStorage.getItem('admin_user_logs') || '[]');
        const secLogs = logs.filter(l => l.userName === (admin ? admin.name : 'Admin') && (l.action === 'Updated Security Q&A' || l.action === 'Security Set' || l.action === 'Password Changed'));
        
        if (secLogs.length > 0) {
            document.getElementById('secLastUpdated').innerText = `${secLogs[0].date} ${secLogs[0].time}`;
        } else {
            document.getElementById('secLastUpdated').innerText = '--';
        }

        loadSecurityActivityLog(secLogs);
    }

    window.openSecurityModal = function() {
        const admin = JSON.parse(localStorage.getItem('admin_user'));
        if(admin) {
            loadSecurityQuestions(admin.secQ1, admin.secQ2);
            document.getElementById('admSecA1').value = admin.secA1 || '';
            document.getElementById('admSecA2').value = admin.secA2 || '';
        }
        let secModal = new bootstrap.Modal(document.getElementById('adminSecurityModal'));
        secModal.show();
    };

    window.addCustomSecQ = function(num) {
        let customQs = JSON.parse(localStorage.getItem('custom_sec_q') || '[]');
        
        if (customQs.length >= 10) {
            return Swal.fire('Limit Reached', 'You can only add up to 10 custom questions.', 'warning');
        }

        Swal.fire({
            title: 'Add Custom Question',
            input: 'text',
            inputPlaceholder: 'Type your custom question here...',
            showCancelButton: true,
            confirmButtonColor: '#1a531b',
            confirmButtonText: 'Add'
        }).then(res => {
            if (res.isConfirmed && res.value.trim()) {
                let qText = res.value.trim();
                if(customQs.find(q=>q.text.toLowerCase() === qText.toLowerCase())) {
                    return Swal.fire('Duplicate', 'This question already exists.', 'error');
                }
                customQs.push({ id: 'cq_' + Date.now(), text: qText });
                localStorage.setItem('custom_sec_q', JSON.stringify(customQs));
                addAuditLog('Added Custom Security Question', 'System', '', qText);
                loadSecurityQuestions(document.getElementById('admSecQ1').value, document.getElementById('admSecQ2').value);
                Swal.fire('Added!', '', 'success');
            }
        });
    };

    window.deleteCustomSecQ = function() {
        let customQs = JSON.parse(localStorage.getItem('custom_sec_q') || '[]');
        if (customQs.length === 0) {
            return Swal.fire('No Custom Questions', 'You haven\'t added any custom questions.', 'info');
        }

        let options = {};
        customQs.forEach(q => { options[q.id] = q.text; });

        Swal.fire({
            title: 'Select question to delete',
            input: 'select',
            inputOptions: options,
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Delete'
        }).then(result => {
            if (result.isConfirmed) {
                customQs = customQs.filter(q => q.id !== result.value);
                localStorage.setItem('custom_sec_q', JSON.stringify(customQs));
                addAuditLog('Deleted Custom Security Question', 'System', result.value, '');
                loadSecurityQuestions();
                Swal.fire('Deleted!', '', 'success');
            }
        });
    };

    window.loadSecurityActivityLog = function(secLogs) {
        const list = document.getElementById('securityActivityLogList');
        if (secLogs.length === 0) {
            list.innerHTML = '<tr><td class="text-center py-4 text-muted">No security activity yet.</td></tr>';
            return;
        }

        list.innerHTML = secLogs.slice(0, 10).map(l => `
            <tr>
                <td class="ps-3"><span class="fw-bold text-dark">${l.date} <span class="text-muted fw-normal ms-2">${l.time}</span></span></td>
                <td><span class="badge bg-light text-dark border px-3 py-2">${l.action}</span></td>
                <td class="text-end pe-4 text-secondary small">By ${l.userName || 'Admin'}</td>
            </tr>
        `).join('');
    }

    let currentAuditPage = 1;
    let currentAuditPageSize = 10;
    let filteredAuditLogs = [];

    window.addCustomFilter = function(type) {
        let placeholder = '';
        if(type === 'Admin Name') placeholder = 'Enter admin name (e.g., John Doe)';
        if(type === 'Date') placeholder = 'Enter date (e.g., 18/04/2026 or 15/04/2026 - 18/04/2026)';
        if(type === 'Time') placeholder = 'Enter time (e.g., 14:30 or 08:00 - 10:00)';

        Swal.fire({
            title: `Add Custom ${type} Option`,
            input: 'text',
            inputPlaceholder: placeholder,
            showCancelButton: true,
            confirmButtonColor: '#1a531b',
            confirmButtonText: 'Add Option'
        }).then(res => {
            if(res.isConfirmed && res.value.trim()) {
                let customFilters = JSON.parse(localStorage.getItem('custom_audit_filters') || '[]');
                customFilters.push({ type: type, value: res.value.trim() });
                localStorage.setItem('custom_audit_filters', JSON.stringify(customFilters));
                populateAuditFiltersList();
                Swal.fire('Added!', 'Custom filter option added.', 'success');
            }
        });
    };

    window.parseCustomDate = function(str) {
        if(!str) return null;
        let p = str.trim().split('/');
        if(p.length !== 3) return null;
        return new Date(`${p[2]}-${p[1]}-${p[0]}`);
    }

    window.parseCustomTime = function(tStr) {
        if(!tStr) return null;
        let isPM = tStr.toLowerCase().includes('pm');
        let isAM = tStr.toLowerCase().includes('am');
        let clean = tStr.replace(/[a-z]/gi, '').trim();
        let parts = clean.split(':');
        if(parts.length < 2) return null;
        let h = parseInt(parts[0]);
        let m = parseInt(parts[1]);
        if(isPM && h < 12) h += 12;
        if(isAM && h === 12) h = 0;
        return h * 60 + m;
    }

    window.applyAuditFilters = function() {
        let logs = JSON.parse(localStorage.getItem('admin_user_logs') || '[]');
        const admin = JSON.parse(localStorage.getItem('admin_user'));
        const _sys = isCurrentUserSystemAdmin();
        if (!_sys) {
            logs = logs.filter(l => l.userName === (admin ? admin.name : 'Admin'));
        }

        const search = document.getElementById('logSearch').value.toLowerCase();
        const fAdmin = document.getElementById('logFilterAdmin').value;
        const fDate = document.getElementById('logFilterDate').value;
        const fTime = document.getElementById('logFilterTime').value;

        filteredAuditLogs = logs.filter(l => {
            const rowStr = `${l.userName} ${l.action} ${l.target} ${l.oldV} ${l.newV} ${l.date} ${l.time}`.toLowerCase();
            if (search && !rowStr.includes(search)) return false;
            if (fAdmin && l.userName !== fAdmin) return false;
            
            if (fDate) {
                if (fDate.includes('-')) {
                    const parts = fDate.split('-').map(s=>s.trim());
                    const rowD = parseCustomDate(l.date);
                    const startD = parseCustomDate(parts[0]);
                    const endD = parseCustomDate(parts[1]);
                    if (startD && rowD < startD) return false;
                    if (endD && rowD > endD) return false;
                } else {
                    if (l.date !== fDate) return false;
                }
            }

            if (fTime) {
                if (fTime.includes('-')) {
                    const parts = fTime.split('-').map(s=>s.trim());
                    const rowT = parseCustomTime(l.time);
                    const startT = parseCustomTime(parts[0]);
                    const endT = parseCustomTime(parts[1]);
                    if (startT !== null && rowT < startT) return false;
                    if (endT !== null && rowT > endT) return false;
                } else {
                    if (l.time !== fTime) return false;
                }
            }
            return true;
        });

        currentAuditPage = 1;
        renderAuditLogs();
    };

    window.clearAuditFilters = function() {
        document.getElementById('logSearch').value = '';
        document.getElementById('logFilterAdmin').value = '';
        document.getElementById('logFilterDate').value = '';
        document.getElementById('logFilterTime').value = '';
        applyAuditFilters();
    };

    window.changeLogPageSize = function() {
        currentAuditPageSize = parseInt(document.getElementById('logPageSize').value);
        currentAuditPage = 1;
        renderAuditLogs();
    };

    window.goToAuditPage = function(p) {
        currentAuditPage = p;
        renderAuditLogs();
    }

    window.renderAuditLogs = function() {
        const list = document.getElementById('auditLogList');
        const pagination = document.getElementById('logPagination');
        const showingText = document.getElementById('logShowingText');

        if (filteredAuditLogs.length === 0) {
            list.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted">No logs recorded yet.</td></tr>';
            pagination.innerHTML = '';
            showingText.innerText = 'Showing 0-0 of 0 entries';
            return;
        }

        const totalPages = Math.ceil(filteredAuditLogs.length / currentAuditPageSize);
        if(currentAuditPage > totalPages) currentAuditPage = totalPages;
        if(currentAuditPage < 1) currentAuditPage = 1;

        const startIdx = (currentAuditPage - 1) * currentAuditPageSize;
        const endIdx = startIdx + currentAuditPageSize;
        const pageItems = filteredAuditLogs.slice(startIdx, endIdx);

        list.innerHTML = pageItems.map(l => `
            <tr>
                <td class="ps-4 fw-bold text-success">${l.userName || 'Admin'}</td>
                <td><span class="badge bg-light text-dark border px-3 py-2 ${l.action.includes('Delete')||l.action.includes('Hold') ? 'border-danger text-danger' : ''}">${l.action}</span></td>
                <td><span class="fw-semibold text-secondary">${l.target || '--'}</span></td>
                <td><span class="small text-muted">${l.oldV ? l.oldV + ' &rarr; ' : ''}${l.newV || '--'}</span></td>
                <td>${l.date || '--'}</td>
                <td class="text-muted small">${l.time || '--'}</td>
            </tr>
        `).join('');

        showingText.innerText = `Showing ${startIdx + 1} - ${Math.min(endIdx, filteredAuditLogs.length)} of ${filteredAuditLogs.length} entries`;

        // Pagination controls
        let pHTML = `<nav><ul class="pagination pagination-sm mb-0">`;
        pHTML += `<li class="page-item ${currentAuditPage === 1 ? 'disabled' : ''}"><a class="page-link" href="javascript:void(0)" onclick="goToAuditPage(${currentAuditPage - 1})">Previous</a></li>`;
        for (let i = 1; i <= totalPages; i++) {
            if(i === 1 || i === totalPages || (i >= currentAuditPage-2 && i <= currentAuditPage+2)) {
                pHTML += `<li class="page-item ${currentAuditPage === i ? 'active' : ''}"><a class="page-link" href="javascript:void(0)" onclick="goToAuditPage(${i})">${i}</a></li>`;
            } else if (i === currentAuditPage-3 || i === currentAuditPage+3) {
                pHTML += `<li class="page-item disabled"><a class="page-link" href="javascript:void(0)">...</a></li>`;
            }
        }
        pHTML += `<li class="page-item ${currentAuditPage === totalPages ? 'disabled' : ''}"><a class="page-link" href="javascript:void(0)" onclick="goToAuditPage(${currentAuditPage + 1})">Next</a></li>`;
        pHTML += `</ul></nav>`;
        pagination.innerHTML = pHTML;
    }

    window.populateAuditFiltersList = function() {
        let logs = JSON.parse(localStorage.getItem('admin_user_logs') || '[]');
        const admin = JSON.parse(localStorage.getItem('admin_user'));
        if (!isCurrentUserSystemAdmin()) {
            logs = logs.filter(l => l.userName === (admin ? admin.name : 'Admin'));
        }

        const admins = new Set();
        const dates = new Set();
        const times = new Set();
        
        logs.forEach(l => {
            if(l.userName) admins.add(l.userName);
            if(l.date) dates.add(l.date);
            if(l.time) times.add(l.time);
        });

        let customFilters = JSON.parse(localStorage.getItem('custom_audit_filters') || '[]');
        customFilters.forEach(cf => {
            if(cf.type === 'Admin Name') admins.add(cf.value);
            if(cf.type === 'Date') dates.add(cf.value);
            if(cf.type === 'Time') times.add(cf.value);
        });

        const vAdmin = document.getElementById('logFilterAdmin').value;
        const vDate = document.getElementById('logFilterDate').value;
        const vTime = document.getElementById('logFilterTime').value;

        document.getElementById('logFilterAdmin').innerHTML = '<option value="">All Admins</option>' + 
            Array.from(admins).map(a => `<option value="${a}" ${vAdmin===a?'selected':''}>${a}</option>`).join('');
            
        document.getElementById('logFilterDate').innerHTML = '<option value="">All Dates</option>' + 
            Array.from(dates).map(a => `<option value="${a}" ${vDate===a?'selected':''}>${a}</option>`).join('');

        document.getElementById('logFilterTime').innerHTML = '<option value="">All Times</option>' + 
            Array.from(times).map(a => `<option value="${a}" ${vTime===a?'selected':''}>${a}</option>`).join('');
    }

    window.downloadAuditLogs = function(type) {
        if (!filteredAuditLogs.length) return Swal.fire('No Data', 'There are no logs to download.', 'info');
        
        if (type === 'json') {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredAuditLogs, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "audit_logs.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        } else if (type === 'csv') {
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += "Admin Name,Action,Target,Old Value,New Value,Date,Time\n";
            filteredAuditLogs.forEach(row => {
                const escapeCsv = (str) => `"${(str||'').replace(/"/g, '""')}"`;
                csvContent += `${escapeCsv(row.userName)},${escapeCsv(row.action)},${escapeCsv(row.target)},${escapeCsv(row.oldV)},${escapeCsv(row.newV)},${escapeCsv(row.date)},${escapeCsv(row.time)}\n`;
            });
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", encodeURI(csvContent));
            downloadAnchorNode.setAttribute("download", "audit_logs.csv");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        }
    };

    window.loadAuditLogs = function() {
        populateAuditFiltersList();
        applyAuditFilters();
    }

    window.addAuditLog = function(actionMsg, targetName = '', oldVal = '', newVal = '') {
        let logs = JSON.parse(localStorage.getItem('admin_user_logs') || '[]');
        const admin = JSON.parse(localStorage.getItem('admin_user'));
        const d = new Date();
        logs.unshift({
            userName: admin ? admin.name : 'Admin',
            action: actionMsg,
            target: targetName,
            oldV: oldVal,
            newV: newVal,
            date: d.toLocaleDateString('en-GB'),
            time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        });
        localStorage.setItem('admin_user_logs', JSON.stringify(logs));
        if(document.getElementById('admProfile').style.display === 'block') {
            loadAuditLogs();
        }
    }

    document.getElementById('admProfileForm').onsubmit = (e) => {
        e.preventDefault();
        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        Swal.fire({
            title: lang === 'hi' ? 'क्या आप यह जानकारी सेव करना चाहते हैं?' : 'Do you want to save this information?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#1a531b',
            cancelButtonColor: '#6c757d',
            confirmButtonText: lang === 'hi' ? 'हाँ' : 'Yes',
            cancelButtonText: lang === 'hi' ? 'नहीं' : 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                let admin = JSON.parse(localStorage.getItem('admin_user')) || { role: 'admin' };
                const oldName = admin.name;
                const oldEmail = admin.email;
                
                admin.name = document.getElementById('admProfileName').value;
                admin.email = document.getElementById('admProfileEmail').value;
                admin.imgUrl = document.getElementById('admProfileImg').src;
                localStorage.setItem('admin_user', JSON.stringify(admin));
                
                let users = JSON.parse(localStorage.getItem('users') || '[]');
                const idx = users.findIndex(u => u.email === oldEmail && (u.role === 'admin' || u.role === 'System Admin'));
                if(idx !== -1) {
                    users[idx].name = admin.name;
                    users[idx].email = admin.email;
                    users[idx].mobile = admin.email;
                    localStorage.setItem('users', JSON.stringify(users));
                }

                if(oldName !== admin.name) addAuditLog('Profile Updated', 'Name', oldName, admin.name);
                if(oldEmail !== admin.email) addAuditLog('Profile Updated', 'Email', oldEmail, admin.email);

                loadAdmProfile();
                Swal.fire('Saved!', '', 'success');
            }
        });
    };

    document.getElementById('admSecurityForm').onsubmit = (e) => {
        e.preventDefault();
        
        const sq1 = document.getElementById('admSecQ1').value;
        const sa1 = document.getElementById('admSecA1').value.toLowerCase().trim();
        const sq2 = document.getElementById('admSecQ2').value;
        const sa2 = document.getElementById('admSecA2').value.toLowerCase().trim();
        
        if (sa1.length < 6 || (sq2 && sa2.length < 6)) {
            Swal.fire('Validation Error', 'Security answers must be at least 6 characters long.', 'error');
            return;
        }


        if (!sq1) return Swal.fire('Validation Error', 'Please select Security Question 1.', 'error');
        if (!sa1) return Swal.fire('Validation Error', 'Please provide an answer for Security Question 1.', 'error');

        if (sq2 || sa2) {
            if (!sq2) return Swal.fire('Validation Error', 'Please select Security Question 2.', 'error');
            if (!sa2) return Swal.fire('Validation Error', 'Please provide an answer for Security Question 2.', 'error');
            if (sq1 === sq2) {
                return Swal.fire('Validation Error', 'Security questions must be unique. Please select two different questions.', 'error');
            }
        }

        Swal.fire({
            title: 'Are you sure you want to update security settings?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1a531b',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, Update'
        }).then((result) => {
            if (result.isConfirmed) {
                let admin = JSON.parse(localStorage.getItem('admin_user')) || { role: 'admin' };
                admin.secQ1 = sq1;
                admin.secA1 = sa1;
                admin.secQ2 = sq2;
                admin.secA2 = sa2;
                localStorage.setItem('admin_user', JSON.stringify(admin));
                
                let users = JSON.parse(localStorage.getItem('users') || '[]');
                const idx = users.findIndex(u => u.email === admin.email && (u.role === 'admin' || u.role === 'System Admin'));
                if(idx !== -1) {
                    users[idx].secQ1 = admin.secQ1;
                    users[idx].secA1 = admin.secA1;
                    users[idx].secQ2 = admin.secQ2;
                    users[idx].secA2 = admin.secA2;
                    localStorage.setItem('users', JSON.stringify(users));
                }

                addAuditLog('Updated Security Q&A', 'System', '', 'Configured');
                loadSecuritySummary();
                bootstrap.Modal.getInstance(document.getElementById('adminSecurityModal')).hide();
                Swal.fire('Saved!', 'Security Information configured successfully.', 'success');
                // Reload pass form choices
                loadSecurityQuestions(admin.secQ1, admin.secQ2);
            }
        });
    };

    document.getElementById('admPassForm').onsubmit = (e) => {
        e.preventDefault();
        
        Swal.fire({
            title: 'Are you sure you want to change your password?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, Change'
        }).then((result) => {
            if (result.isConfirmed) {
                const qType = document.getElementById('admCheckSecQ').value;
                const checkAns = document.getElementById('checkSecA').value.toLowerCase().trim();
                const newPass = document.getElementById('admNewPass').value;
                const passErr = window.getPasswordError(newPass);
                if(passErr) return Swal.fire({icon:'error', text: passErr});
                const newPassConf = document.getElementById('admNewPassConf').value;
                const admin = JSON.parse(localStorage.getItem('admin_user')) || { role: 'admin' };

                if(!admin.secA1) {
                    return Swal.fire('Error', 'Please configure your security settings first.', 'error');
                }

                if(!qType) {
                    return Swal.fire('Error', 'Please select a security question for verification.', 'error');
                }

                if(qType === 'q1' && checkAns !== admin.secA1) {
                    return Swal.fire('Error', 'Security Answer is incorrect!', 'error');
                }
                if(qType === 'q2' && checkAns !== admin.secA2) {
                    return Swal.fire('Error', 'Security Answer is incorrect!', 'error');
                }
                
                if(newPass !== newPassConf) {
                    return Swal.fire('Error', 'Passwords do not match.', 'error');
                }

                admin.password = newPass;
                localStorage.setItem('admin_user', JSON.stringify(admin));

                let users = JSON.parse(localStorage.getItem('users') || '[]');
                const idx = users.findIndex(u => u.email === admin.email && (u.role === 'admin' || u.role === 'System Admin'));
                if(idx !== -1) {
                    users[idx].password = newPass;
                    localStorage.setItem('users', JSON.stringify(users));
                }

                addAuditLog('Password Changed', 'System', '********', '********');
                loadSecuritySummary();
                Swal.fire('Updated!', 'Your password has been changed securely.', 'success');
                document.getElementById('admPassForm').reset();
                document.getElementById('admCheckSecADiv').style.display = 'none';
            }
        });
    };

    window.holdAdmin = function(id, name) {
        Swal.fire({
            title: 'Do you want to hold this admin?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ffc107',
            confirmButtonText: 'Yes, Hold',
            cancelButtonText: 'Cancel'
        }).then(res => {
            if (res.isConfirmed) {
                let users = JSON.parse(localStorage.getItem('users') || '[]');
                const idx = users.findIndex(u => u.id === id);
                if (idx !== -1) {
                    users[idx].status = 'Hold';
                    localStorage.setItem('users', JSON.stringify(users));
                    addAuditLog('Admin Held', 'Status', 'Active', 'Hold');
                    loadAdminList();
                    Swal.fire('Held!', 'Admin account is on hold.', 'success');
                }
            }
        });
    };

    window.activateAdmin = function(id, name) {
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        const idx = users.findIndex(u => u.id === id);
        if (idx !== -1) {
            users[idx].status = 'Active';
            localStorage.setItem('users', JSON.stringify(users));
            addAuditLog('Admin Activated', 'Status', 'Hold', 'Active');
            loadAdminList();
        }
    };

    window.deleteAdmin = function(id, name) {
        Swal.fire({
            title: 'Delete permanently?',
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel'
        }).then(res => {
            if (res.isConfirmed) {
                let users = JSON.parse(localStorage.getItem('users') || '[]');
                const idx = users.findIndex(u => u.id === id);
                if (idx !== -1) {
                    users.splice(idx, 1);
                    localStorage.setItem('users', JSON.stringify(users));
                    addAuditLog('Admin Deleted', 'User', name, 'Deleted');
                    loadAdminList();
                    Swal.fire('Deleted!', 'Admin account removed.', 'success');
                }
            }
        });
    };

    window.editAdmin = function(id) {
        // We'll reuse the edit-user functionality naturally or build a small swal edit. 
        // For simplicity, we redirect to edit-user.html
        window.location.href = `edit-user.html?id=${id}`;
    };

    window.loadAdminList = function() {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const admins = users.filter(u => u.role === 'admin' || u.role === 'System Admin');
        const list = document.getElementById('admListBody');
        if(!list) return;

        if (admins.length === 0) {
            list.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-muted">No admins found.</td></tr>';
            return;
        }

        list.innerHTML = admins.map(u => {
            const isSys = (u.id === 1 || u.name === 'System Admin' || u.isSystemAdmin);
            let statusBadge = u.status === 'Hold' ? '<span class="badge bg-warning">Hold</span>' : '<span class="badge bg-success">Active</span>';
            
            let actions = '';
            if (isSys) {
                actions = `<span class="text-muted small fst-italic">System Admin (Read Only)</span>`;
            } else {
                const holdBtn = u.status !== 'Hold' ? 
                    `<button class="btn btn-sm btn-outline-warning rounded-pill px-3" onclick="holdAdmin(${u.id}, '${u.name}')" title="Hold"><i class="bi bi-pause-circle"></i></button>` :
                    `<button class="btn btn-sm btn-outline-success rounded-pill px-3" onclick="activateAdmin(${u.id}, '${u.name}')" title="Activate"><i class="bi bi-play-circle"></i></button>`;
                
                const editBtn = `<button class="btn btn-sm btn-outline-primary rounded-pill px-3 ms-1" onclick="editAdmin(${u.id})" title="Edit"><i class="bi bi-pencil"></i></button>`;
                const delBtn = `<button class="btn btn-sm btn-outline-danger rounded-pill px-3 ms-1" onclick="deleteAdmin(${u.id}, '${u.name}')" title="Delete"><i class="bi bi-trash"></i></button>`;
                actions = `<div class="d-flex justify-content-end">${holdBtn}${editBtn}${delBtn}</div>`;
            }

            return `
                <tr>
                    <td>
                        <div class="fw-bold">${u.name}</div>
                        ${statusBadge}
                    </td>
                    <td class="text-muted">${u.email || u.email_mobile || '--'}<br><small>${u.mobile || '--'}</small></td>
                    <td>${u.joinedDate ? new Date(u.joinedDate).toLocaleDateString() : (u.joined_at ? new Date(u.joined_at).toLocaleDateString() : '--')}</td>
                    <td class="text-end">${actions}</td>
                </tr>
            `;
        }).join('');
    }

    document.getElementById('addAdminForm').onsubmit = (e) => {
        e.preventDefault();
        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        
        const name = document.getElementById('naName').value;
        const email = document.getElementById('naEmail').value;
        const pass = document.getElementById('naPass').value;
        const passErr = window.getPasswordError(pass);
        if(passErr) return Swal.fire({icon:'error', text: passErr});
        const confirm = document.getElementById('naConfirm').value;

        if (pass !== confirm) return Swal.fire('Error', 'Passwords do not match', 'error');

        let users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find(u => u.email === email || u.mobile === email)) {
            return Swal.fire('Error', 'An account with this email/mobile already exists.', 'error');
        }

        users.push({
            id: Date.now(),
            name: name,
            email: email,
            mobile: email,
            password: pass,
            role: 'admin',
            status: 'Active',
            joinedDate: new Date().toISOString().split('T')[0]
        });

        localStorage.setItem('users', JSON.stringify(users));
        addAuditLog(`New admin added: ${name}`);
        Swal.fire('Success', 'New Administrative profile created successfully.', 'success');
        e.target.reset();
    };

    window.filterNotifs = function(type) {
        window.currentNotifFilter = type;
        document.querySelectorAll('.overflow-auto .btn').forEach(b => b.classList.remove('active'));
        if(type === 'All') document.getElementById('filterNotifAll')?.classList.add('active');
        if(type === 'Alerts') document.getElementById('filterNotifAlerts')?.classList.add('active');
        if(type === 'General') document.getElementById('filterNotifGeneral')?.classList.add('active');

        loadAdminNotifications();
    }

    window.loadAdminNotifications = function() {
        const notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
        const itemsAlerts = JSON.parse(localStorage.getItem('alerts') || '[]');
        const list = document.getElementById('admNotifList');
        if(!list) return;
        
        let all = [
            ...notifs.map(n => ({...n, type: 'General'})),
            ...itemsAlerts.map(a => ({...a, type: 'Alerts'}))
        ];

        if(window.currentNotifFilter === 'Alerts') all = all.filter(x => x.type === 'Alerts');
        if(window.currentNotifFilter === 'General') all = all.filter(x => x.type === 'General');

        list.innerHTML = all.length ? all.map(n => `
            <div class="col-md-6">
                <div class="card border-0 shadow-sm rounded-4 h-100">
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <span class="badge ${n.type === 'Alerts' ? 'bg-danger-subtle text-danger border-danger' : 'bg-primary-subtle text-primary border-primary'} border">${n.type}</span>
                            <small class="text-muted">${n.date || 'Today'}</small>
                        </div>
                        <h5 class="fw-bold mb-2">${n.title}</h5>
                        <p class="text-muted small mb-3">${n.text || n.message}</p>
                        <div class="d-flex gap-2">
                             <button class="btn btn-sm btn-outline-danger rounded-pill px-3" onclick="deleteNotif('${n.id}', '${n.type}')"><i class="bi bi-trash"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('') : '<div class="col-12 text-center py-5 text-muted">No notifications found in this category.</div>';
    }

    window.loadFarmerQueries = function() {
        const queries = JSON.parse(localStorage.getItem('queries') || '[]');
        const list = document.getElementById('farmerQueryList');
        if(!list) return;
        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        const t = translations[lang] || {};

        list.innerHTML = queries.length ? queries.slice().reverse().map(q => {
            let dateStr = q.date;
            let timeStr = q.time;
            
            if(!dateStr && q.created_at) {
                const d = new Date(q.created_at);
                dateStr = d.toLocaleDateString('en-GB');
                timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            }
            
            dateStr = dateStr || 'N/A';
            timeStr = timeStr || '--:--';

            return `
            <tr>
                <td class="ps-4">
                    <div class="fw-bold">${q.farmerName || q.farmer_name}</div>
                    <small class="text-muted">${q.farmerEmail || ''}</small>
                </td>
                <td class="text-muted">
                    <div class="p-3 border-start border-4 border-primary mb-2 bg-light rounded-3">${q.text || q.question}</div>
                    ${q.answer ? `
                    <div class="mt-2 p-3 bg-success bg-opacity-10 rounded-4 small border-start border-4 border-success text-dark shadow-sm">
                        <div class="fw-bold mb-1 text-success"><i class="bi bi-patch-check-fill me-1"></i> ${t.answer || 'Answer'}:</div>
                        ${q.answer}
                    </div>` : ''}
                </td>
                <td>
                    <span class="badge ${q.status === 'pending' ? 'bg-warning-subtle text-warning border border-warning' : 'bg-success-subtle text-success border border-success'} rounded-pill px-3">
                        ${q.status === 'pending' ? (t.pending || 'Pending') : (t.answered || 'Answered')}
                    </span>
                </td>
                <td>
                    <div class="small fw-bold text-dark"><i class="bi bi-calendar-event me-1 text-primary"></i> ${dateStr}</div>
                    <div class="small text-muted mb-2"><i class="bi bi-clock me-1 text-primary"></i> ${timeStr}</div>
                    ${q.answeredDate ? `
                        <div class="pt-2 border-top">
                            <div class="text-success small fw-bold"><i class="bi bi-reply-all-fill me-1"></i> Ans: ${q.answeredDate}</div>
                            <div class="text-muted extra-small"><i class="bi bi-clock me-1"></i> ${q.answeredTime || ''}</div>
                            <div class="text-muted extra-small">By: ${q.answeredBy || 'Admin'}</div>
                        </div>
                    ` : ''}
                </td>
                <td class="text-end pe-4">
                    <button class="btn btn-sm ${q.answer ? 'btn-outline-success' : 'btn-success'} rounded-pill px-3 shadow-sm" onclick="openReplyModal(${q.id})">
                        <i class="bi bi-reply-fill me-1"></i> ${q.answer ? (lang==='hi'?'पुनः उत्तर दें':'Re-answer') : (t.reply || 'Reply')}
                    </button>
                </td>
            </tr>
            `;
        }).join('') : `<tr><td colspan="5" class="text-center py-5 text-muted"><i class="bi bi-chat-square-text fs-1 mb-3 d-block opacity-25"></i>${t.no_queries || 'No queries found.'}</td></tr>`;
    }

    window.openReplyModal = function(id) {
        const queries = JSON.parse(localStorage.getItem('queries') || '[]');
        const q = queries.find(it => it.id === id);
        if(!q) return;

        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';

        Swal.fire({
            title: lang === 'hi' ? 'उत्तर दें' : 'Answer Question',
            input: 'textarea',
            inputValue: q.answer || '',
            inputLabel: q.text || q.question,
            inputPlaceholder: lang === 'hi' ? 'अपना उत्तर यहाँ लिखें...' : 'Type your answer here...',
            inputAttributes: {
                'aria-label': 'Type your answer here'
            },
            showCancelButton: true,
            confirmButtonColor: '#198754',
            confirmButtonText: lang === 'hi' ? 'सेव करें' : 'Save Answer',
            cancelButtonText: lang === 'hi' ? 'रद्द करें' : 'Cancel'
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                const admin = JSON.parse(localStorage.getItem('admin_user'));
                const now = new Date();
                q.answer = result.value;
                q.status = 'answered';
                q.answeredDate = now.toLocaleDateString('en-GB');
                q.answeredTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                q.answeredBy = admin ? admin.name : 'Admin';
                
                localStorage.setItem('queries', JSON.stringify(queries));
                loadFarmerQueries();
                
                if(typeof loadAdminDashboard === 'function') loadAdminDashboard();
                
                Swal.fire({
                    title: lang === 'hi' ? 'उत्तर सेव हो गया!' : 'Answer saved!',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    }

    window.loadLandingPageQueries = function() {
        const messages = JSON.parse(localStorage.getItem('support_messages') || '[]');
        const list = document.getElementById('landingPageQueryList');
        if(!list) return;
        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        const t = (typeof translations !== 'undefined' && translations[lang]) ? translations[lang] : {};

        list.innerHTML = messages.length ? messages.slice().reverse().map((m, idx) => {
            const mIdx = messages.length - 1 - idx; 
            return `
            <tr>
                <td class="ps-4">
                    <div class="fw-bold">${m.name}</div>
                    <small class="text-muted"><i class="bi bi-person-lines-fill me-1"></i> ${m.contact}</small><br>
                    <span class="badge bg-info bg-opacity-10 text-info border border-info extra-small mt-1">From Landing Page</span>
                </td>
                <td class="text-muted">
                    <div class="p-3 border-start border-4 border-info mb-2 bg-light rounded-3">${m.message}</div>
                    ${m.reply ? `
                    <div class="mt-2 p-3 bg-success bg-opacity-10 rounded-4 small border-start border-4 border-success text-dark shadow-sm">
                        <div class="fw-bold mb-1 text-success"><i class="bi bi-patch-check-fill me-1"></i> reply:</div>
                        ${m.reply}
                    </div>` : ''}
                </td>
                <td>
                    <span class="badge ${!m.reply ? 'bg-warning-subtle text-warning border border-warning' : 'bg-success-subtle text-success border border-success'} rounded-pill px-3">
                        ${!m.reply ? (lang === 'hi' ? 'लंबित' : 'Pending') : (lang === 'hi' ? 'उत्तर दिया' : 'Answered')}
                    </span>
                </td>
                <td>
                    <div class="small fw-bold text-dark"><i class="bi bi-calendar-event me-1 text-info"></i> ${m.date || 'N/A'}</div>
                    <div class="small text-muted mb-2"><i class="bi bi-clock me-1 text-info"></i> ${m.time || '--:--'}</div>
                    ${m.reply ? `
                        <div class="pt-2 border-top">
                            <div class="text-success small fw-bold"><i class="bi bi-reply-all-fill me-1"></i> Ans: ${m.replyDate || ''}</div>
                            <div class="text-muted extra-small"><i class="bi bi-clock me-1"></i> ${m.replyTime || ''}</div>
                        </div>
                    ` : ''}
                </td>
                <td class="text-end pe-4">
                    <button class="btn btn-sm ${m.reply ? 'btn-outline-success' : 'btn-success'} rounded-pill px-3 shadow-sm" onclick="openLandingReplyModal(${mIdx})">
                        <i class="bi bi-reply-fill me-1"></i> ${m.reply ? (lang==='hi'?'पुनः उत्तर दें':'Re-answer') : (lang === 'hi' ? 'उत्तर दें' : 'Reply')}
                    </button>
                    <button class="btn btn-sm btn-outline-danger rounded-circle p-1 ms-1" onclick="deleteLandingQuery(${mIdx})" title="Delete Query">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
            `;
        }).join('') : `<tr><td colspan="5" class="text-center py-5 text-muted"><i class="bi bi-chat-left-text fs-1 mb-3 d-block opacity-25"></i>No Landing Page queries found.</td></tr>`;
    }

    window.openLandingReplyModal = function(index) {
        const messages = JSON.parse(localStorage.getItem('support_messages') || '[]');
        const m = messages[index];
        if(!m) return;

        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';

        Swal.fire({
            title: lang === 'hi' ? (translations.hi.reply_title) : (translations.en.reply_title),
            input: 'textarea',
            inputValue: m.reply || '',
            inputLabel: `${m.name}: ${m.message}`,
            inputPlaceholder: lang === 'hi' ? (translations.hi.reply_ph) : (translations.en.reply_ph),
            showCancelButton: true,
            confirmButtonColor: '#198754',
            confirmButtonText: lang === 'hi' ? (translations.hi.save_changes) : (translations.en.save_changes),
            cancelButtonText: lang === 'hi' ? (translations.hi.cancel) : (translations.en.cancel)
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                const now = new Date();
                m.reply = result.value;
                m.replyDate = now.toLocaleDateString('en-GB');
                m.replyTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                
                localStorage.setItem('support_messages', JSON.stringify(messages));
                loadLandingPageQueries();
                
                Swal.fire({
                    title: lang === 'hi' ? (translations.hi.reply_saved) : (translations.en.reply_saved),
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    }

    window.deleteLandingQuery = function(index) {
        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        Swal.fire({
            title: lang === 'hi' ? (translations.hi.delete_confirm_msg) : (translations.en.delete_confirm_msg),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            confirmButtonText: lang === 'hi' ? (translations.hi.yes) : (translations.en.yes),
            cancelButtonText: lang === 'hi' ? (translations.hi.no) : (translations.en.no)
        }).then((result) => {
            if (result.isConfirmed) {
                let messages = JSON.parse(localStorage.getItem('support_messages') || '[]');
                messages.splice(index, 1);
                localStorage.setItem('support_messages', JSON.stringify(messages));
                loadLandingPageQueries();
                Swal.fire('Deleted!', '', 'success');
            }
        });
    }

    let detailedChartInstance;
    window.showChartDetail = function(type) {
        showSection('chartDetail');
        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        const title = document.getElementById('chartDetailTitle');
        const ctxEl = document.getElementById('detailedChart');
        if(!ctxEl) return;
        
        // Sync Data Sources
        if(!localStorage.getItem('crops_data')) {
            const seedCrops = JSON.parse(localStorage.getItem('admin_crops')) || (window.cropsData || []);
            localStorage.setItem('crops_data', JSON.stringify(seedCrops));
        }
        if(!localStorage.getItem('market_data')) {
            const seedMandi = JSON.parse(localStorage.getItem('mandiData')) || { prices: [] };
            localStorage.setItem('market_data', JSON.stringify(seedMandi.prices || []));
        }

        const ctx = ctxEl.getContext('2d');
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const cropsList = JSON.parse(localStorage.getItem('crops_data') || '[]');
        const marketList = JSON.parse(localStorage.getItem('market_data') || '[]');

        if(detailedChartInstance) detailedChartInstance.destroy();

        let labels = [], data = [], chartType = 'line', label = '', rawData = [];
        const addBtnRow = document.getElementById('chartDetailAddBtnRow');
        addBtnRow.innerHTML = '';

        if(type === 'user_growth') {
            title.innerText = lang === 'hi' ? 'उपयोगकर्ता वृद्धि' : 'User Growth';
            labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
            data = [10, 25, 45, 55, 70, 85, 100, 115, 130, users.length];
            label = 'Users';
            chartType = 'line';
        } else if(type === 'crop_distribution') {
            try {
                title.innerText = lang === 'hi' ? 'फसल विवरण' : 'Crop Distribution';
                rawData = cropsList.filter(c => c.active || c.status === 'Active');
                
                if (rawData.length === 0) {
                    labels = [lang === 'hi' ? 'कोई डेटा नहीं' : 'No Data'];
                    data = [0];
                } else {
                    labels = rawData.map(c => lang === 'hi' ? c.name_hi : c.name_en);
                    const currentCrops = JSON.parse(localStorage.getItem('currentCrops') || '[]');
                    data = rawData.map(c => {
                        const nameEn = c.name_en || '';
                        const nameHi = c.name_hi || '';
                        return currentCrops.filter(cc => cc.name === nameEn || cc.name === nameHi).length || 1; 
                    });
                }
                label = lang === 'hi' ? 'किसानों की संख्या' : 'Count of Farmers';
                chartType = 'pie';
                
                addBtnRow.innerHTML = `<button class="btn btn-success rounded-pill px-4" onclick="addChartItem('crop')"><i class="bi bi-plus-circle me-2"></i> ${lang === 'hi' ? 'फसल जोड़ें' : 'Add Crop'}</button>`;
            } catch (e) {
                console.error("Detailed Chart Error:", e);
                labels = ['Error'];
                data = [0];
            }
        } else if(type === 'market_trends') {
            title.innerText = lang === 'hi' ? 'बाजार रुझान' : 'Market Trends';
            rawData = marketList;
            if (rawData.length === 0) {
                labels = [lang === 'hi' ? 'कोई डेटा नहीं' : 'No Data'];
                data = [0];
            } else {
                labels = rawData.map(r => lang === 'hi' ? (translations.hi[r.crop.toLowerCase()] || r.crop) : r.crop);
                data = rawData.map(r => r.price);
            }
            label = lang === 'hi' ? 'कीमत (₹)' : 'Price (₹)';
            chartType = 'bar';
            
            addBtnRow.innerHTML = `<button class="btn btn-primary rounded-pill px-4" onclick="addChartItem('mandi')"><i class="bi bi-plus-circle me-2"></i> ${lang === 'hi' ? 'कीमत जोड़ें' : 'Add Price'}</button>`;
        }

        detailedChartInstance = new Chart(ctx, {
            type: chartType,
            data: {
                labels: labels,
                datasets: [{
                    label: label,
                    data: data,
                    borderColor: '#198754',
                    backgroundColor: chartType === 'pie' ? ['#198754', '#28a745', '#ffc107', '#17a2b8', '#dc3545', '#1a531b', '#6f42c1', '#e83e8c', '#fd7e14', '#20c997'] : 'rgba(25, 135, 84, 0.1)',
                    fill: chartType === 'line',
                    tension: 0.4
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });

        renderChartTable(type, rawData);

        // Attach search listener
        const searchInput = document.getElementById('chartSearchInput');
        searchInput.oninput = function() {
            const val = this.value.toLowerCase();
            const filtered = rawData.filter(item => {
               const searchStr = (item.name_en || item.crop || '').toLowerCase() + (item.name_hi || '').toLowerCase();
               return searchStr.includes(val);
            });
            renderChartTable(type, filtered);
        };
    }

    function renderChartTable(type, list) {
        const tHead = document.getElementById('chartTableHead');
        const tBody = document.getElementById('chartTableBody');
        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        
        if(!tHead || !tBody) return;

        if (type === 'crop_distribution') {
            tHead.innerHTML = `<th>Name</th><th>Soil Type</th><th>Duration</th><th>Status</th><th class="text-end">Actions</th>`;
            tBody.innerHTML = list.map(c => `
                <tr>
                    <td class="fw-bold">${lang === 'hi' ? c.name_hi : c.name_en}</td>
                    <td>${lang === 'hi' ? (c.soil_hi || '-') : (c.soil_en || '-')}</td>
                    <td>${c.duration || '-'} days</td>
                    <td><span class="badge bg-success bg-opacity-10 text-success border border-success">Active</span></td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-primary border-0" onclick="editChartItem('crop', ${c.id})"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-outline-danger border-0" onclick="deleteChartItem('crop', ${c.id})"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            `).join('') || '<tr><td colspan="5" class="text-center py-4">No crops found</td></tr>';
        } else if (type === 'market_trends') {
            tHead.innerHTML = `<th>Crop</th><th>Market</th><th>Price</th><th>Date</th><th class="text-end">Actions</th>`;
            tBody.innerHTML = list.map(r => `
                <tr>
                    <td class="fw-bold">${lang === 'hi' ? (translations.hi[r.crop.toLowerCase()] || r.crop) : r.crop}</td>
                    <td>${r.market}</td>
                    <td class="fw-bold text-success">₹ ${r.price}</td>
                    <td class="small text-muted">${r.date || '-'}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-primary border-0" onclick="editChartItem('mandi', ${r.id})"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-outline-danger border-0" onclick="deleteChartItem('mandi', ${r.id})"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            `).join('') || '<tr><td colspan="5" class="text-center py-4">No market data found</td></tr>';
        } else {
             tHead.innerHTML = `<th class="ps-4">Item Name</th><th>Recorded Value</th><th>Status</th><th>Region</th>`;
             tBody.innerHTML = '<tr><td colspan="4" class="text-center py-4">No granular data for this chart type.</td></tr>';
        }
    }

    window.addChartItem = function(entity) {
        if (entity === 'crop') {
            Swal.fire({
                title: 'Add New Crop',
                html: `
                    <input id="swalCropEn" class="swal2-input" placeholder="Name (English)">
                    <input id="swalCropHi" class="swal2-input" placeholder="Name (Hindi)">
                    <input id="swalCropSoil" class="swal2-input" placeholder="Soil Type">
                    <input id="swalCropDuration" type="number" class="swal2-input" placeholder="Duration (Days)">
                `,
                showCancelButton: true,
                confirmButtonText: 'Save',
                preConfirm: () => {
                    return {
                        name_en: document.getElementById('swalCropEn').value,
                        name_hi: document.getElementById('swalCropHi').value,
                        soil_en: document.getElementById('swalCropSoil').value,
                        duration: document.getElementById('swalCropDuration').value
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    let crops = JSON.parse(localStorage.getItem('crops_data') || '[]');
                    const newCrop = {
                        id: Date.now(),
                        ...result.value,
                        active: true,
                        status: 'Active'
                    };
                    if (crops.find(c => c.name_en === newCrop.name_en)) return Swal.fire('Error', 'Crop already exists', 'error');
                    crops.unshift(newCrop);
                    localStorage.setItem('crops_data', JSON.stringify(crops));
                    showChartDetail('crop_distribution');
                    Swal.fire('Saved!', '', 'success');
                }
            });
        } else {
            Swal.fire({
                title: 'Add Market Price',
                html: `
                    <input id="swalMandiCrop" class="swal2-input" placeholder="Crop Name">
                    <input id="swalMandiMarket" class="swal2-input" placeholder="Market Name">
                    <input id="swalMandiPrice" type="number" class="swal2-input" placeholder="Price (₹)">
                `,
                showCancelButton: true,
                confirmButtonText: 'Save',
                preConfirm: () => {
                    return {
                        crop: document.getElementById('swalMandiCrop').value,
                        market: document.getElementById('swalMandiMarket').value,
                        price: parseInt(document.getElementById('swalMandiPrice').value),
                        date: new Date().toLocaleDateString('en-CA') // YYYY-MM-DD
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    let market = JSON.parse(localStorage.getItem('market_data') || '[]');
                    const newItem = { id: Date.now(), ...result.value };
                    market.unshift(newItem);
                    localStorage.setItem('market_data', JSON.stringify(market));
                    showChartDetail('market_trends');
                    Swal.fire('Saved!', '', 'success');
                }
            });
        }
    }

    window.editChartItem = function(entity, id) {
        if (entity === 'crop') {
            let crops = JSON.parse(localStorage.getItem('crops_data') || '[]');
            const c = crops.find(crop => crop.id == id);
            Swal.fire({
                title: 'Edit Crop',
                html: `
                    <input id="swalCropEn" class="swal2-input" value="${c.name_en || ''}" placeholder="Name (English)">
                    <input id="swalCropHi" class="swal2-input" value="${c.name_hi || ''}" placeholder="Name (Hindi)">
                    <input id="swalCropSoil" class="swal2-input" value="${c.soil_en || ''}" placeholder="Soil Type">
                    <input id="swalCropDuration" type="number" class="swal2-input" value="${c.duration || ''}" placeholder="Duration (Days)">
                `,
                showCancelButton: true,
                preConfirm: () => {
                    return {
                        name_en: document.getElementById('swalCropEn').value,
                        name_hi: document.getElementById('swalCropHi').value,
                        soil_en: document.getElementById('swalCropSoil').value,
                        duration: document.getElementById('swalCropDuration').value
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const idx = crops.findIndex(item => item.id == id);
                    crops[idx] = { ...crops[idx], ...result.value };
                    localStorage.setItem('crops_data', JSON.stringify(crops));
                    showChartDetail('crop_distribution');
                }
            });
        } else {
            let market = JSON.parse(localStorage.getItem('market_data') || '[]');
            const r = market.find(item => item.id == id);
            Swal.fire({
                title: 'Edit Market Price',
                html: `
                    <input id="swalMandiCrop" class="swal2-input" value="${r.crop || ''}" placeholder="Crop Name">
                    <input id="swalMandiMarket" class="swal2-input" value="${r.market || ''}" placeholder="Market Name">
                    <input id="swalMandiPrice" type="number" class="swal2-input" value="${r.price || ''}" placeholder="Price (₹)">
                `,
                showCancelButton: true,
                preConfirm: () => ({
                    crop: document.getElementById('swalMandiCrop').value,
                    market: document.getElementById('swalMandiMarket').value,
                    price: parseInt(document.getElementById('swalMandiPrice').value)
                })
            }).then((result) => {
                if (result.isConfirmed) {
                    const idx = market.findIndex(item => item.id == id);
                    market[idx] = { ...market[idx], ...result.value };
                    localStorage.setItem('market_data', JSON.stringify(market));
                    showChartDetail('market_trends');
                }
            });
        }
    }

    window.deleteChartItem = function(entity, id) {
        Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33'
        }).then((result) => {
            if (result.isConfirmed) {
                const key = entity === 'crop' ? 'crops_data' : 'market_data';
                let list = JSON.parse(localStorage.getItem(key) || '[]');
                list = list.filter(item => item.id != id);
                localStorage.setItem(key, JSON.stringify(list));
                showChartDetail(entity === 'crop' ? 'crop_distribution' : 'market_trends');
            }
        });
    }

    window.loadAdminNotifications = function() {
        const notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
        const itemsAlerts = JSON.parse(localStorage.getItem('alerts') || '[]');
        const list = document.getElementById('admNotifList');
        if(!list) return;
        
        let all = [
            ...notifs.map(n => ({...n, type: 'General'})),
            ...itemsAlerts.map(a => ({...a, type: 'Alerts'}))
        ];

        if(window.currentNotifFilter === 'Alerts') all = all.filter(x => x.type === 'Alerts');
        if(window.currentNotifFilter === 'General') all = all.filter(x => x.type === 'General');

        list.innerHTML = all.length ? all.map(n => `
            <div class="col-md-6">
                <div class="card border-0 shadow-sm rounded-4 h-100">
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <span class="badge ${n.type === 'Alerts' ? 'bg-danger-subtle text-danger border-danger' : 'bg-primary-subtle text-primary border-primary'} border">${n.type}</span>
                            <small class="text-muted">${n.date || 'Today'}</small>
                        </div>
                        <h5 class="fw-bold mb-2">${n.title}</h5>
                        <p class="text-muted small mb-3">${n.text || n.message}</p>
                        <div class="d-flex gap-2">
                             <button class="btn btn-sm btn-outline-danger rounded-pill px-3" onclick="deleteNotif('${n.id}', '${n.type}')"><i class="bi bi-trash"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('') : '<div class="col-12 text-center py-5 text-muted">No notifications found in this category.</div>';
    }

    window.deleteNotif = function(id, type) {
        let key = type === 'Alerts' ? 'alerts' : 'notifications';
        let items = JSON.parse(localStorage.getItem(key) || '[]');
        items = items.filter(x => x.id != id);
        localStorage.setItem(key, JSON.stringify(items));
        loadAdminNotifications();
    }

    window.loadAdminAlerts = function() {
        // Redundant if merged
    }

    // Initialize with All
    window.currentNotifFilter = 'All';

    // --- User Management Improved ---
    window.userModal = new bootstrap.Modal(document.getElementById('userModal'));

    window.toggleFarmFields = function() {
        const role = document.getElementById('userInputRole').value;
        const farmSec = document.getElementById('farmDetailsSection');
        if(farmSec) farmSec.style.display = role === 'farmer' ? 'block' : 'none';
    };

    window.addFarmRow = function(village = '', landSize = '', soilType = 'Black') {
        const container = document.getElementById('farmRowsContainer');
        if(!container) return;
        const rowId = 'farmRow_' + Date.now() + Math.floor(Math.random() * 1000);
        const div = document.createElement('div');
        div.className = 'card bg-light border-0 rounded-3 mb-3 p-3 farm-row';
        div.id = rowId;
        div.innerHTML = `
            <div class="row g-2 align-items-end">
                <div class="col-md-4">
                    <label class="form-label small fw-bold">Village</label>
                    <input type="text" class="form-control form-control-sm village-input" value="${village}" placeholder="Enter village">
                </div>
                <div class="col-md-3">
                    <label class="form-label small fw-bold">Land (Acre)</label>
                    <input type="number" class="form-control form-control-sm land-input" value="${landSize}" min="0.1" step="0.1">
                </div>
                <div class="col-md-4">
                    <label class="form-label small fw-bold">Soil Type</label>
                    <select class="form-select form-select-sm soil-input">
                        <option value="Black" ${soilType === 'Black' ? 'selected' : ''}>Black Soil</option>
                        <option value="Alluvial" ${soilType === 'Alluvial' ? 'selected' : ''}>Alluvial Soil</option>
                        <option value="Red" ${soilType === 'Red' ? 'selected' : ''}>Red Soil</option>
                        <option value="Laterite" ${soilType === 'Laterite' ? 'selected' : ''}>Laterite Soil</option>
                        <option value="Loamy" ${soilType === 'Loamy' ? 'selected' : ''}>Loamy Soil</option>
                    </select>
                </div>
                <div class="col-md-1 text-center">
                    <button type="button" class="btn btn-sm btn-outline-danger border-0" onclick="document.getElementById('${rowId}').remove()"><i class="bi bi-trash"></i></button>
                </div>
            </div>
        `;
        container.appendChild(div);
    };

    window.openUserModal = function(id = null) {
        const form = document.getElementById('userForm');
        if(form) form.reset();
        
        const container = document.getElementById('farmRowsContainer');
        if(container) container.innerHTML = '';
        
        document.getElementById('editUserId').value = id || '';
        document.getElementById('userModalTitle').innerText = id ? 'Edit User Profile' : 'Add New User';
        
        if(id) {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const u = users.find(user => user.id == id);
            if(u) {
                document.getElementById('userInputName').value = u.name || '';
                document.getElementById('userInputMobile').value = u.mobile || u.email_mobile || '';
                document.getElementById('userInputEmail').value = u.email || '';
                document.getElementById('userInputRole').value = u.role || 'farmer';
                document.getElementById('userInputPass').value = u.password || '';
                document.getElementById('userInputAge').value = u.age || '';
                document.getElementById('userInputGender').value = u.gender || 'Male';
                
                const fData = u.farm_fields || u.farms || [];
                if(fData.length > 0) {
                    fData.forEach(f => addFarmRow(f.village, f.land_size || f.landSize, f.soil_type || f.soilType));
                } else if(u.role === 'farmer') {
                    addFarmRow();
                }
            }
        } else {
            addFarmRow();
        }
        
        toggleFarmFields();
        
        // Populate Sync Info
        const syncEl = document.getElementById('userSyncInfo');
        if(id) {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const u = users.find(user => user.id == id);
            if(u && u.last_updated) {
                syncEl.style.display = 'block';
                document.getElementById('userLastUpdated').innerText = u.last_updated;
                document.getElementById('userUpdatedBy').innerText = u.updated_by || 'Unknown';
            } else {
                syncEl.style.display = 'none';
            }
        } else {
            syncEl.style.display = 'none';
        }

        if(window.userModal) window.userModal.show();
    };

    window.handleUserSave = function() {
        const id = document.getElementById('editUserId').value;
        const name = document.getElementById('userInputName').value.trim();
        const mobile = document.getElementById('userInputMobile').value.trim();
        const email = document.getElementById('userInputEmail').value.trim();
        const role = document.getElementById('userInputRole').value;
        const pass = document.getElementById('userInputPass').value;
        if (pass.length > 0) {
            const passErr = window.getPasswordError(pass);
            if(passErr) return Swal.fire({icon:'error', text: passErr});
        }
        const ageVal = document.getElementById('userInputAge').value;
        const age = parseInt(ageVal);
        const gender = document.getElementById('userInputGender').value;

        if(!name || !mobile || !pass || !ageVal) {
             return Swal.fire('Error', 'Please fill all required fields.', 'error');
        }

        if(mobile.length !== 10) {
            return Swal.fire('Error', 'Mobile number must be exactly 10 digits.', 'error');
        }
        
        if(age < 1 || age > 100) {
            return Swal.fire('Error', 'Age must be between 1 and 100.', 'error');
        }

        let users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Farm data
        let farm_fields = [];
        if(role === 'farmer') {
            const rows = document.querySelectorAll('.farm-row');
            rows.forEach(r => {
                const village = r.querySelector('.village-input').value.trim();
                const land_size = r.querySelector('.land-input').value;
                const soil_type = r.querySelector('.soil-input').value;
                if(village && land_size) {
                    farm_fields.push({ village, land_size, soil_type });
                }
            });
        }

        const now = new Date().toLocaleString();
        const admin_user = JSON.parse(localStorage.getItem('admin_user'));
        const updated_by = admin_user ? admin_user.name : 'Admin';

        if(id) {
            const idx = users.findIndex(u => u.id == id);
            if(idx !== -1) {
                users[idx] = { 
                    ...users[idx], 
                    name, mobile, email, email_mobile: mobile, role, password: pass, age, gender, farm_fields,
                    last_updated: now,
                    updated_by: updated_by
                };
            }
        } else {
            if(users.find(u => u.email === email || u.mobile === mobile)) {
                return Swal.fire('Error', 'User with this Email or Mobile already exists.', 'error');
            }
            users.push({
                id: Date.now(),
                name, mobile, email, email_mobile: mobile, role, password: pass, age, gender, farm_fields,
                status: 'Active',
                joinedDate: new Date().toISOString(),
                last_updated: now,
                updated_by: updated_by
            });
        }

        localStorage.setItem('users', JSON.stringify(users));
        
        // Sync Active Farmer Session if it's the same user
        const activeUser = JSON.parse(localStorage.getItem('user'));
        if(activeUser && activeUser.id == id) {
             const updatedUser = users.find(u => u.id == id);
             localStorage.setItem('user', JSON.stringify(updatedUser));
        }

        if(window.userModal) window.userModal.hide();
        loadUsers();
        if(typeof loadAdminDashboard === 'function') loadAdminDashboard();
        Swal.fire('Success', id ? 'Profile updated successfully.' : 'User added successfully.', 'success');
    };

    window.exportUsers = function(type) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if(users.length === 0) return Swal.fire('No Data', 'No users found to export.', 'warning');

        const data = users.map((u, i) => ({
            "क्रमांक": i + 1,
            "Name": u.name,
            "Email/Mobile": u.email,
            "Role": u.role,
            "Status": u.status,
            "Age": u.age || '-',
            "Gender": u.gender || '-',
            "Joined Date": u.joinedDate ? new Date(u.joinedDate).toLocaleDateString('en-GB') : '-',
            "Farms": u.farms ? u.farms.map(f => `${f.village} (${f.landSize} Acre, ${f.soilType})`).join('; ') : '-'
        }));

        if(type === 'json') {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `users_export_${Date.now()}.json`;
            a.click();
        } else if(type === 'csv') {
            const keys = Object.keys(data[0]);
            let csv = keys.join(',') + '\n';
            data.forEach(row => {
                csv += keys.map(k => {
                    let val = String(row[k] || '');
                    if (val.includes(',') || val.includes('"') || val.includes('\n')) {
                        val = `"${val.replace(/"/g, '""')}"`;
                    }
                    return val;
                }).join(',') + '\n';
            });
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `users_export_${Date.now()}.csv`;
            a.click();
        } else if (type === 'xlsx') {
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Users");
            XLSX.writeFile(wb, `users_export_${Date.now()}.xlsx`);
        }
    };
    // ==========================================
    // LANDING PAGE MANAGEMENT
    // ==========================================

            title_en: "Krishi Mitra",
            title_hi: "कृषि मित्र",
            desc_en: "Empowering the farming community with smart digital tools and real-time advisory. We bridge the gap between technology and tradition.",
            desc_hi: "स्मार्ट डिजिटल टूल और रीयल-टाइम सलाह के साथ किसान समुदाय को सशक्त बनाना। हम तकनीक और परंपरा के बीच की खाई को पाटते हैं।",
            copyright: "© 2026 Krishi Mitra. All rights reserved.",
            social: [
                { icon: "bi-facebook", url: "#" },
                { icon: "bi-twitter-x", url: "#" },
                { icon: "bi-instagram", url: "#" }
            ],
            nav_links: [
                { title_en: "Key Features", title_hi: "मुख्य विशेषताएं", url: "#lblKeyFeatures" },
                { title_en: "About Us", title_hi: "हमारे बारे में", url: "#lblAboutTitle" },
                { title_en: "Useful Links", title_hi: "उपयोगी लिंक", url: "#lblUsefulLinks" },
                { title_en: "Farmer Login", title_hi: "किसान लॉगिन", url: "login.html" }
            ],
            support_links: [
                { title_en: "Terms & Conditions", title_hi: "नियम एवं शर्तें", url: "terms.html" },
                { title_en: "Privacy Policy", title_hi: "गोपनीयता नीति", url: "privacy.html" },
                { title_en: "Contact Support", title_hi: "संपर्क सहायता", url: "contact.html" }
            ]
        }�सान डैशबोर्ड", desc_en: "A centralized workspace where you can track your registered crops, queries, and advisory responses.", desc_hi: "एक केंद्रीकृत कार्यक्षेत्र जहां आप अपनी पंजीकृत फसलों, प्रश्नों और सलाहकार प्रतिक्रियाओं को ट्रैक कर सकते हैं।" }
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
            hi: "हम आपकी गोपनीयता का सम्मान करते हैं। फसलों, खेत के आकार और व्यक्तिगत जानकारी सहित आपका सभी डेटा पूरी तरह से सुरक्षित है और इसका उपयोग केवल बेहतर सेवाएं प्रदान करने के लिए किया जाता है।"
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
            desc_en: "Empowering farmers with tools.",
            desc_hi: "किसानों को उपकरणों से सशक्त बनाना।",
            copyright: "© 2026 Krishi Mitra.",
            social: [
                { id: 1, icon: "bi-facebook", url: "https://facebook.com/krishimitra" },
                { id: 2, icon: "bi-twitter-x", url: "https://twitter.com/krishimitra" }
            ],
            nav_links: [
                { id: 1, title_en: "Home", title_hi: "होम", url: "#hero" },
                { id: 2, title_en: "Features", title_hi: "विशेषताएं", url: "#features" }
            ],
            support_links: [
                { id: 1, title_en: "FAQ", title_hi: "सामान्य प्रश्न", url: "#faq" },
                { id: 2, title_en: "Contact", title_hi: "संपर्क करें", url: "#contact" }
            ]
        }
    };

    let landingData = JSON.parse(localStorage.getItem('landing_page_data'));
    if (!landingData) landingData = JSON.parse(JSON.stringify(defaultLandingData));

    window.toggleLandingEditMode = function() {
        const viewEls = document.querySelectorAll('.landing-view-only');
        const editEls = document.querySelectorAll('.landing-edit-only');
        const btn = document.getElementById('btnLandingEditMode');
        
        let isEdit = editEls[0].style.display !== 'none';
        if (isEdit) {
            // Turning OFF edit mode
            viewEls.forEach(el => el.style.display = '');
            editEls.forEach(el => el.style.display = 'none');
            btn.innerHTML = '<i class="bi bi-pencil"></i> Edit Details';
            loadLandingData(); // discard unsaved changes
        } else {
            // Turning ON edit mode
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

        // Load Add View Mode Data
        document.getElementById('admHeroView').innerHTML = `
            <strong>EN:</strong> ${landingData.hero.title_en} / ${landingData.hero.sub_en}<br><br>
            <strong>HI:</strong> ${landingData.hero.title_hi} / ${landingData.hero.sub_hi}
        `;
        document.getElementById('admAboutView').innerHTML = `
            <strong>EN:</strong> ${landingData.about.en || ''}<br><br>
            <strong>HI:</strong> ${landingData.about.hi || ''}
        `;
        document.getElementById('admTermsView').innerHTML = `
            <strong>EN:</strong><br>${landingData.terms?.en || defaultLandingData.terms.en}<br><br>
            <strong>HI:</strong><br>${landingData.terms?.hi || defaultLandingData.terms.hi}
        `;
        document.getElementById('admPrivacyView').innerHTML = `
            <strong>EN:</strong><br>${landingData.privacy?.en || defaultLandingData.privacy.en}<br><br>
            <strong>HI:</strong><br>${landingData.privacy?.hi || defaultLandingData.privacy.hi}
        `;
        document.getElementById('admContactView').innerHTML = `
            <strong>Phone:</strong> ${landingData.contact.phone} | <strong>Email:</strong> ${landingData.contact.email}<br>
            <strong>EN ADDR:</strong> ${landingData.contact.address_en}<br>
            <strong>HI ADDR:</strong> ${landingData.contact.address_hi}
        `;
        

        let socialView = landingData.footer.social.map(s => `[${s.icon}: <a href="${s.url}" target="_blank">link</a>]`).join('  ');
        let navView = (landingData.footer.nav_links || []).map(l => `${l.title_en}`).join(', ');
        let supportView = (landingData.footer.support_links || []).map(l => `${l.title_en}`).join(', ');
        document.getElementById('admFooterView').innerHTML = `
            <strong>Title:</strong> EN: ${landingData.footer.title_en || ''} | HI: ${landingData.footer.title_hi || ''}<br>
            <strong>Desc (EN):</strong> ${landingData.footer.desc_en}<br>
            <strong>Desc (HI):</strong> ${landingData.footer.desc_hi}<br>
            <strong>Copyright:</strong> ${landingData.footer.copyright}<br>
            <strong>Nav Links:</strong> ${navView}<br>
            <strong>Support Links:</strong> ${supportView}<br>
            <strong>Social:</strong> ${socialView}
        `;


        document.getElementById('admFeaturesViewContainer').innerHTML = landingData.features.map(f => `
            <div class="col-md-6">
                <div class="border rounded-3 p-3 bg-light d-flex gap-3">
                    <i class="bi ${f.icon} fs-2 text-success"></i>
                    <div>
                        <strong>EN:</strong> ${f.title_en} - <span class="text-muted">${f.desc_en}</span><br>
                        <strong>HI:</strong> ${f.title_hi} - <span class="text-muted">${f.desc_hi}</span>
                    </div>
                </div>
            </div>
        `).join('');

        document.getElementById('admLinksViewContainer').innerHTML = landingData.links.map(l => `
            <li>
                <a href="${l.url}" target="_blank">${l.url}</a><br>
                <small><strong>EN:</strong> ${l.title_en} | <strong>HI:</strong> ${l.title_hi}</small>
            </li>
        `).join('');

        // Load Edit Mode Data
        document.getElementById('admHeroTitleEn').value = landingData.hero.title_en;
        document.getElementById('admHeroTitleHi').value = landingData.hero.title_hi;
        document.getElementById('admHeroSubEn').value = landingData.hero.sub_en;
        document.getElementById('admHeroSubHi').value = landingData.hero.sub_hi;

        document.getElementById('admAboutEn').value = landingData.about.en || '';
        document.getElementById('admAboutHi').value = landingData.about.hi || '';
        document.getElementById('admTermsEn').value = landingData.terms?.en || defaultLandingData.terms.en;
        document.getElementById('admTermsHi').value = landingData.terms?.hi || defaultLandingData.terms.hi;
        document.getElementById('admPrivacyEn').value = landingData.privacy?.en || defaultLandingData.privacy.en;
        document.getElementById('admPrivacyHi').value = landingData.privacy?.hi || defaultLandingData.privacy.hi;
        
        document.getElementById('admContactPhone').value = landingData.contact.phone;
        document.getElementById('admContactEmail').value = landingData.contact.email;
        document.getElementById('admContactAddrEn').value = landingData.contact.address_en;
        document.getElementById('admContactAddrHi').value = landingData.contact.address_hi;

        document.getElementById('admFooterTitleEn').value = landingData.footer.title_en || '';
        document.getElementById('admFooterTitleHi').value = landingData.footer.title_hi || '';
        document.getElementById('admFooterDescEn').value = landingData.footer.desc_en || '';
        document.getElementById('admFooterDescHi').value = landingData.footer.desc_hi;
        document.getElementById('admFooterCopyright').value = landingData.footer.copyright;

        renderAdmFeatures();
        renderAdmLinks();
        renderAdmSocialLinks();
        renderAdmFooterLinks('nav');
        renderAdmFooterLinks('support');
    }

    function renderAdmFeatures() {
        const container = document.getElementById('admFeaturesContainer');
        container.innerHTML = landingData.features.map((f, index) => `
            <div class="border rounded-3 p-3 mb-3 position-relative bg-light">
                <button type="button" class="btn btn-outline-danger btn-sm position-absolute top-0 end-0 m-2" onclick="removeFeature(${index})"><i class="bi bi-trash"></i></button>
                <div class="row g-2">
                    <div class="col-md-4">
                        <label class="form-label small fw-bold">Icon (Bootstrap Class)</label>
                        <input type="text" class="form-control form-control-sm feature-icon-input" value="${f.icon}">
                    </div>
                </div>
                <div class="row g-2 mt-2">
                    <div class="col-md-6">
                        <label class="form-label small fw-bold">Title (English)</label>
                        <input type="text" class="form-control form-control-sm feature-title-en" value="${f.title_en}">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label small fw-bold">Title (Hindi)</label>
                        <input type="text" class="form-control form-control-sm feature-title-hi" value="${f.title_hi}">
                    </div>
                </div>
                <div class="row g-2 mt-2">
                    <div class="col-md-6">
                        <label class="form-label small fw-bold">Description (English)</label>
                        <textarea class="form-control form-control-sm feature-desc-en" rows="2">${f.desc_en}</textarea>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label small fw-bold">Description (Hindi)</label>
                        <textarea class="form-control form-control-sm feature-desc-hi" rows="2">${f.desc_hi}</textarea>
                    </div>
                </div>
            </div>
        `).join('') + `<button type="button" class="btn btn-sm btn-outline-primary mt-2" onclick="addFeature()"><i class="bi bi-plus"></i> Add Feature</button>`;
    }

    function renderAdmLinks() {
        const container = document.getElementById('admLinksContainer');
        container.innerHTML = landingData.links.map((l, index) => `
            <div class="border rounded-3 p-3 mb-3 position-relative bg-light">
                <button type="button" class="btn btn-outline-danger btn-sm position-absolute top-0 end-0 m-2" onclick="removeLink(${index})"><i class="bi bi-trash"></i></button>
                <div class="row g-2">
                    <div class="col-md-12">
                        <label class="form-label small fw-bold">URL</label>
                        <input type="text" class="form-control form-control-sm link-url" value="${l.url}">
                    </div>
                    <div class="col-md-6 mt-2">
                        <label class="form-label small fw-bold">Title (English)</label>
                        <input type="text" class="form-control form-control-sm link-title-en" value="${l.title_en}">
                    </div>
                    <div class="col-md-6 mt-2">
                        <label class="form-label small fw-bold">Title (Hindi)</label>
                        <input type="text" class="form-control form-control-sm link-title-hi" value="${l.title_hi}">
                    </div>
                </div>
            </div>
        `).join('') + `<button type="button" class="btn btn-sm btn-outline-primary mt-2" onclick="addLink()"><i class="bi bi-plus"></i> Add Link</button>`;
    }

    window.addFeature = function() {
        landingData.features.push({ id: Date.now(), icon: "bi-check-circle", title_en: "", title_hi: "", desc_en: "", desc_hi: "" });
        renderAdmFeatures();
    };

    window.removeFeature = function(index) {
        landingData.features.splice(index, 1);
        renderAdmFeatures();
    };

    window.addLink = function() {
        landingData.links.push({ id: Date.now(), url: "https://", title_en: "", title_hi: "" });
        renderAdmLinks();
    };

    window.removeLink = function(index) {
        landingData.links.splice(index, 1);
        renderAdmLinks();
    };

    window.renderAdmSocialLinks = function() {
        const container = document.getElementById('admSocialLinksContainer');
        if(!container) return;
        container.innerHTML = landingData.footer.social.map((s, index) => `
            <div class="border rounded-3 p-3 mb-2 position-relative bg-light">
                <button type="button" class="btn btn-outline-danger btn-sm position-absolute top-0 end-0 m-2" onclick="removeSocialLink(${index})"><i class="bi bi-trash"></i></button>
                <div class="row g-2">
                    <div class="col-md-4">
                        <label class="form-label small fw-bold">Icon Class</label>
                        <input type="text" class="form-control form-control-sm social-icon" value="${s.icon}">
                    </div>
                    <div class="col-md-8">
                        <label class="form-label small fw-bold">URL</label>
                        <input type="url" class="form-control form-control-sm social-url" value="${s.url}">
                    </div>
                </div>
            </div>
        `).join('');
    };

    window.addSocialLink = function() {
        if(!landingData.footer) landingData.footer = {social:[]};
        if(!landingData.footer.social) landingData.footer.social = [];
        landingData.footer.social.push({ id: Date.now(), icon: "bi-link", url: "https://" });
        renderAdmSocialLinks();
    };

    window.removeSocialLink = function(index) {
        landingData.footer.social.splice(index, 1);
        renderAdmSocialLinks();
    };

    window.renderAdmFooterLinks = function(type) {
        const key = type === 'nav' ? 'nav_links' : 'support_links';
        const containerId = type === 'nav' ? 'admNavLinksContainer' : 'admSupportLinksContainer';
        const container = document.getElementById(containerId);
        if(!container) return;
        
        let arr = landingData.footer[key] || [];
        
        container.innerHTML = arr.map((l, index) => `
            <div class="border rounded-3 p-2 mb-2 position-relative bg-light">
                <button type="button" class="btn text-danger btn-sm position-absolute top-0 end-0 m-1 p-0" onclick="removeFooterLink('${type}', ${index})"><i class="bi bi-x-circle-fill"></i></button>
                <div class="mb-1 mt-3">
                    <input type="text" class="form-control form-control-sm ${type}-title-en" value="${l.title_en}" placeholder="Title EN">
                </div>
                <div class="mb-1">
                    <input type="text" class="form-control form-control-sm ${type}-title-hi" value="${l.title_hi}" placeholder="Title HI">
                </div>
                <div>
                    <input type="text" class="form-control form-control-sm ${type}-url" value="${l.url}" placeholder="URL">
                </div>
            </div>
        `).join('');
    };

    window.addFooterLink = function(type) {
        const key = type === 'nav' ? 'nav_links' : 'support_links';
        if(!landingData.footer) landingData.footer = {};
        if(!landingData.footer[key]) landingData.footer[key] = [];
        landingData.footer[key].push({ id: Date.now(), title_en: "New Link", title_hi: "नया लिंक", url: "#" });
        renderAdmFooterLinks(type);
    };

    window.removeFooterLink = function(type, index) {
        const key = type === 'nav' ? 'nav_links' : 'support_links';
        landingData.footer[key].splice(index, 1);
        renderAdmFooterLinks(type);
    };



    window.saveLandingData = function() {
        Swal.fire({
            title: 'Save Changes?',
            text: 'Are you sure you want to update the landing page?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#1a531b'
        }).then((res) => {
            if (res.isConfirmed) {
                if (!landingData.hero) landingData.hero = {};
                landingData.hero.title_en = document.getElementById('admHeroTitleEn').value;
                landingData.hero.title_hi = document.getElementById('admHeroTitleHi').value;
                landingData.hero.sub_en = document.getElementById('admHeroSubEn').value;
                landingData.hero.sub_hi = document.getElementById('admHeroSubHi').value;

                // Sync features from DOM
                const featContainers = document.querySelectorAll('#admFeaturesContainer > div.border');
                const updatedFeatures = [];
                featContainers.forEach((fc, i) => {
                    updatedFeatures.push({
                        id: landingData.features[i] ? landingData.features[i].id : Date.now(),
                        icon: fc.querySelector('.feature-icon-input').value,
                        title_en: fc.querySelector('.feature-title-en').value,
                        title_hi: fc.querySelector('.feature-title-hi').value,
                        desc_en: fc.querySelector('.feature-desc-en').value,
                        desc_hi: fc.querySelector('.feature-desc-hi').value
                    });
                });

                // Sync links from DOM
                const linkContainers = document.querySelectorAll('#admLinksContainer > div.border');
                const updatedLinks = [];
                linkContainers.forEach((lc, i) => {
                    updatedLinks.push({
                        id: landingData.links[i] ? landingData.links[i].id : Date.now(),
                        url: lc.querySelector('.link-url').value,
                        title_en: lc.querySelector('.link-title-en').value,
                        title_hi: lc.querySelector('.link-title-hi').value
                    });
                });

                // Sync social links from DOM
                const getFooterArr = (type) => {
                    const containers = document.querySelectorAll(`#adm${type === 'nav' ? 'Nav' : 'Support'}LinksContainer > div.border`);
                    const arr = [];
                    containers.forEach((c, i) => {
                        arr.push({
                            id: Date.now() + i,
                            title_en: c.querySelector(`.${type}-title-en`).value,
                            title_hi: c.querySelector(`.${type}-title-hi`).value,
                            url: c.querySelector(`.${type}-url`).value
                        });
                    });
                    return arr;
                };

                const socialContainers = document.querySelectorAll('#admSocialLinksContainer > div.border');
                const updatedSocial = [];
                socialContainers.forEach((sc, i) => {
                    updatedSocial.push({
                        id: Date.now() + i,
                        icon: sc.querySelector('.social-icon').value,
                        url: sc.querySelector('.social-url').value
                    });
                });

                landingData.about.en = document.getElementById('admAboutEn').value;
                landingData.about.hi = document.getElementById('admAboutHi').value;

                if(!landingData.terms) landingData.terms = {};
                landingData.terms.en = document.getElementById('admTermsEn').value;
                landingData.terms.hi = document.getElementById('admTermsHi').value;

                if(!landingData.privacy) landingData.privacy = {};
                landingData.privacy.en = document.getElementById('admPrivacyEn').value;
                landingData.privacy.hi = document.getElementById('admPrivacyHi').value;

                if(!landingData.contact) landingData.contact = {};
                landingData.contact.phone = document.getElementById('admContactPhone').value;
                landingData.contact.email = document.getElementById('admContactEmail').value;
                landingData.contact.address_en = document.getElementById('admContactAddrEn').value;
                landingData.contact.address_hi = document.getElementById('admContactAddrHi').value;

                if(!landingData.footer) landingData.footer = {};
                landingData.footer.title_en = document.getElementById('admFooterTitleEn').value;
                landingData.footer.title_hi = document.getElementById('admFooterTitleHi').value;
                landingData.footer.desc_en = document.getElementById('admFooterDescEn').value;
                landingData.footer.desc_hi = document.getElementById('admFooterDescHi').value;
                landingData.footer.copyright = document.getElementById('admFooterCopyright').value;
                landingData.footer.social = updatedSocial;
                landingData.footer.nav_links = getFooterArr('nav');
                landingData.footer.support_links = getFooterArr('support');

                landingData.features = updatedFeatures;
                landingData.links = updatedLinks;

                localStorage.setItem('landing_page_data', JSON.stringify(landingData));
                
                toggleLandingEditMode();
                
                Swal.fire({
                    title: 'Saved!',
                    text: 'Landing page data updated successfully.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    };
