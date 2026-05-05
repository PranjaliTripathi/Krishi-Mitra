
    // --- SCHEMES MANAGEMENT ---
    let schemeModalInstance;
    window.openSchemeModal = function(id = null) {
        if (!schemeModalInstance) {
            schemeModalInstance = new bootstrap.Modal(document.getElementById('schemeModal'));
        }
        document.getElementById('schemeForm').reset();
        document.getElementById('schemeId').value = '';
        document.getElementById('schemeModalTitle').innerText = 'Add Scheme';
        
        if (id) {
            const schemes = JSON.parse(localStorage.getItem('schemes_data')) || [];
            const scheme = schemes.find(s => s.id === id);
            if (scheme) {
                document.getElementById('schemeModalTitle').innerText = 'Edit Scheme';
                document.getElementById('schemeId').value = scheme.id;
                document.getElementById('schName').value = scheme.name || '';
                document.getElementById('schCrop').value = scheme.cropName || '';
                document.getElementById('schState').value = scheme.state || 'Central';
                document.getElementById('schType').value = scheme.type || 'Govt';
                document.getElementById('schShortDesc').value = scheme.shortDesc || '';
                document.getElementById('schEligibility').value = scheme.eligibility || '';
                document.getElementById('schBenefits').value = scheme.benefits || '';
                document.getElementById('schSubsidy').value = scheme.subsidyPercent || '';
                document.getElementById('schArea').value = scheme.areaLimit || '';
                document.getElementById('schFarmerCont').value = scheme.farmerCont || '';
                document.getElementById('schGovtCont').value = scheme.govtCont || '';
                document.getElementById('schMaxUsage').value = scheme.maxUsage || '';
                document.getElementById('schProcess').value = scheme.process || '';
                document.getElementById('schDocs').value = scheme.docs || '';
                document.getElementById('schTerms').value = scheme.terms || '';
            }
        }
        schemeModalInstance.show();
    };

    window.saveScheme = function() {
        if (!document.getElementById('schName').value || !document.getElementById('schCrop').value || !document.getElementById('schShortDesc').value || !document.getElementById('schEligibility').value || !document.getElementById('schBenefits').value || !document.getElementById('schProcess').value || !document.getElementById('schDocs').value || !document.getElementById('schTerms').value) {
            return Swal.fire('Error', 'Please fill all required fields.', 'error');
        }

        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        Swal.fire({
            title: lang === 'hi' ? 'क्या आप यह बदलाव करना चाहते हैं?' : 'Do you want to save this change?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#1a531b',
            cancelButtonText: lang === 'hi' ? 'रद्द करें' : 'Cancel',
            confirmButtonText: lang === 'hi' ? 'हाँ' : 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                let schemes = JSON.parse(localStorage.getItem('schemes_data')) || [];
                // Add initial dummy payload if empty (Sync with farmer side default logic)
                if (schemes.length === 0) {
                     schemes = [
                        {id: 1, name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)", cropName: "All Major Crops", state: "Central", type: "Govt", shortDesc: "Comprehensive crop insurance scheme...", eligibility: "All farmers...", benefits: "Financial support...", subsidyPercent: "varies", areaLimit: "No limit", process: "Apply via PMFBY portal...", docs: "Aadhar card...", maxUsage: "Once per season", farmerCont: "varies", govtCont: "varies", terms: "Must apply..."}
                     ]
                }
                
                const id = document.getElementById('schemeId').value;
                const newScheme = {
                    id: id ? parseInt(id) : Date.now(),
                    name: document.getElementById('schName').value,
                    cropName: document.getElementById('schCrop').value,
                    state: document.getElementById('schState').value,
                    type: document.getElementById('schType').value,
                    shortDesc: document.getElementById('schShortDesc').value,
                    eligibility: document.getElementById('schEligibility').value,
                    benefits: document.getElementById('schBenefits').value,
                    subsidyPercent: document.getElementById('schSubsidy').value,
                    areaLimit: document.getElementById('schArea').value,
                    farmerCont: document.getElementById('schFarmerCont').value,
                    govtCont: document.getElementById('schGovtCont').value,
                    maxUsage: document.getElementById('schMaxUsage').value,
                    process: document.getElementById('schProcess').value,
                    docs: document.getElementById('schDocs').value,
                    terms: document.getElementById('schTerms').value
                };

                if (id) {
                    const idx = schemes.findIndex(s => s.id == id);
                    if (idx !== -1) schemes[idx] = newScheme;
                } else {
                    schemes.push(newScheme);
                }

                localStorage.setItem('schemes_data', JSON.stringify(schemes));
                
                schemeModalInstance.hide();
                loadAdminSchemes();
                Swal.fire('Saved!', 'Scheme has been saved successfully.', 'success');
            }
        });
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
                loadAdminSchemes();
                Swal.fire('Deleted!', 'Scheme has been deleted.', 'success');
            }
        });
    };

    window.loadAdminSchemes = function() {
        let schemes = JSON.parse(localStorage.getItem('schemes_data')) || [];
        
        // Sync logic: default schemes if null to ensure proper preview
        if(schemes.length === 0 && !localStorage.getItem('schemes_data_initialized')) {
            schemes = [
                {id: 1, name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)", cropName: "All Major Crops", state: "Central", type: "Govt", shortDesc: "Comprehensive crop insurance scheme protecting farmers from non-preventable natural risks from pre-sowing to post-harvest.", eligibility: "All farmers including sharecroppers and tenant farmers growing notified crops in notified areas.", benefits: "Financial support to farmers suffering crop loss/damage arising out of unforeseen events.", subsidyPercent: "varies", areaLimit: "No limit", process: "Apply via PMFBY portal, CSCs, banks, or agriculture department office before the cutoff date.", docs: "Aadhar card, Bank passbook, Land records (Khasra/Khatauni), Sowing certificate.", maxUsage: "Once per season", farmerCont: "1.5% to 5% of sum insured", govtCont: "Balance premium shared by Central & State Govt", terms: "Must apply within cutoff date. Losses due to war, nuclear risks, malicious damage not covered."},
                {id: 2, name: "Paramparagat Krishi Vikas Yojana (PKVY)", cropName: "Organic Farming", state: "Central", type: "Govt", shortDesc: "Promotion of commercial organic production through certified organic farming.", eligibility: "Groups of farmers who want to do organic farming. Cluster of 20 hectares.", benefits: "Financial assistance for organic farming certification and inputs.", subsidyPercent: "100%", areaLimit: "50 Acres per cluster", process: "Form a cluster and apply through state agriculture department.", docs: "Aadhar, Land records, Group resolution.", maxUsage: "Once per 3-year term", farmerCont: "Labor", govtCont: "₹50,000 per hectare", terms: "Must avoid chemical fertilizers."}
            ];
            localStorage.setItem('schemes_data', JSON.stringify(schemes));
            localStorage.setItem('schemes_data_initialized', 'true');
        }

        const stateF = document.getElementById('admSchemeStateFilter').value;
        const typeF = document.getElementById('admSchemeTypeFilter').value;
        const cropF = document.getElementById('admSchemeCropFilter').value;

        // Populate crop filter dropdown options dynamically based on all schemes
        const crops = new Set(schemes.map(s => s.cropName).filter(Boolean));
        const cropSelect = document.getElementById('admSchemeCropFilter');
        if (cropSelect) {
            const currCrop = cropSelect.value;
            cropSelect.innerHTML = '<option value="">All Crops</option>' + Array.from(crops).map(c => `<option value="${c}">${c}</option>`).join('');
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
            list.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-muted">No schemes found.</td></tr>';
            return;
        }

        list.innerHTML = filtered.map(s => `
            <tr>
                <td class="ps-4 fw-bold">${s.name}</td>
                <td>${s.cropName}</td>
                <td>
                    <span class="badge ${s.type === 'Govt' || s.type === 'Central' ? 'bg-success' : 'bg-info'} border mb-1">${s.type}</span><br>
                    <span class="badge bg-secondary bg-opacity-10 text-secondary border">${s.state}</span>
                </td>
                <td class="text-end pe-4">
                    <button class="btn btn-sm btn-outline-primary rounded-pill px-3" onclick="openSchemeModal(${s.id})"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-outline-danger rounded-pill px-3 ms-1" onclick="deleteScheme(${s.id})"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `).join('');
    };

