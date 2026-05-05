const fs = require('fs');
let content = fs.readFileSync('public/admin_dashboard.html', 'utf8');

const schemeModal = `<div class="modal fade" id="schemeModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content border-0 shadow-lg rounded-4">
            <div class="modal-header bg-success text-white border-0 py-3">
                <h5 class="modal-title fw-bold" id="schemeModalTitle">Add Scheme</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
                <form id="schemeForm">
                    <input type="hidden" id="schemeId">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Scheme Name</label>
                            <input type="text" id="schName" class="form-control" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Crop Name</label>
                            <input type="text" id="schCrop" class="form-control" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">State</label>
                            <select id="schState" class="form-select" required>
                                <option value="Central">Central Govt</option>
                                <option value="Andhra Pradesh">Andhra Pradesh</option>
                                <option value="Bihar">Bihar</option>
                                <option value="Gujarat">Gujarat</option>
                                <option value="Haryana">Haryana</option>
                                <option value="Karnataka">Karnataka</option>
                                <option value="Madhya Pradesh">Madhya Pradesh</option>
                                <option value="Maharashtra">Maharashtra</option>
                                <option value="Punjab">Punjab</option>
                                <option value="Rajasthan">Rajasthan</option>
                                <option value="Uttar Pradesh">Uttar Pradesh</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Type</label>
                            <select id="schType" class="form-select" required>
                                <option value="Govt">Govt</option>
                                <option value="Semi Govt">Semi Govt</option>
                                <option value="Private">Private</option>
                                <option value="NGO">NGO</option>
                            </select>
                        </div>
                        <div class="col-12">
                            <label class="form-label small fw-bold">Short Description</label>
                            <textarea id="schShortDesc" class="form-control" rows="2" required></textarea>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Eligibility</label>
                            <textarea id="schEligibility" class="form-control" rows="3" required></textarea>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Benefits</label>
                            <textarea id="schBenefits" class="form-control" rows="3" required></textarea>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Subsidy %</label>
                            <input type="text" id="schSubsidy" class="form-control">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Area Limit (Acre)</label>
                            <input type="text" id="schArea" class="form-control">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Farmer Contribution</label>
                            <input type="text" id="schFarmerCont" class="form-control">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Govt Contribution</label>
                            <input type="text" id="schGovtCont" class="form-control">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-bold">Max Usage (Times)</label>
                            <input type="text" id="schMaxUsage" class="form-control">
                        </div>
                        <div class="col-12">
                            <label class="form-label small fw-bold">Application Process</label>
                            <textarea id="schProcess" class="form-control" rows="3" required></textarea>
                        </div>
                        <div class="col-12">
                            <label class="form-label small fw-bold">Required Documents</label>
                            <textarea id="schDocs" class="form-control" rows="2" placeholder="Comma separated values" required></textarea>
                        </div>
                        <div class="col-12">
                            <label class="form-label small fw-bold">Terms & Conditions</label>
                            <textarea id="schTerms" class="form-control" rows="2" required></textarea>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer border-0">
                <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                <button type="button" id="saveSchemeBtn" class="btn btn-success rounded-pill px-5">Save Scheme</button>
            </div>
        </div>
    </div>
</div>
`;

if (!content.includes('id="schemeModal"')) {
    content = content.replace('</body>', schemeModal + '\n</body>');
}

// Ensure proper event listener mapping for the "Save Scheme" inside modal
content = content.replace(/onclick="saveScheme\(\)"/g, 'id="saveSchemeBtn"');

// We also need to fix `loadAdminSchemes` to check both yojana_data and schemes_data.
// Since loadAdminSchemes exists, let's keep it but redefine save.
// The existing `window.saveScheme = function() { ... ` we can comment out or remove.

const oldSavePattern = /window\.saveScheme = function[\s\S]*?(?=window\.deleteScheme)/;
content = content.replace(oldSavePattern, '');

const newSaveLogic = `
window.saveScheme = async function() {
    try {
        const reqFields = ['schName', 'schCrop', 'schShortDesc', 'schEligibility', 'schBenefits', 'schProcess', 'schDocs', 'schTerms'];
        let isValid = true;
        for (let f of reqFields) {
            if (!document.getElementById(f).value) isValid = false;
        }
        if (!isValid) {
            if(typeof Swal !== 'undefined') return Swal.fire('Error', 'Please fill all required fields.', 'error');
            return alert('Please fill all required fields.');
        }

        const lang = localStorage.getItem('krishi_mitra_lang') || 'en';
        let confirmSave = false;
        if(typeof Swal !== 'undefined') {
            const res = await Swal.fire({
                title: lang === 'hi' ? 'क्या आप यह बदलाव करना चाहते हैं?' : 'Do you want to save this change?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#1a531b',
                cancelButtonText: lang === 'hi' ? 'रद्द करें' : 'Cancel',
                confirmButtonText: lang === 'hi' ? 'हाँ' : 'Yes'
            });
            confirmSave = res.isConfirmed;
        } else {
            confirmSave = confirm('Do you want to save this change?');
        }

        if (confirmSave) {
            let schemes = [];
            // Preference given to yojana_data if exists
            try { schemes = JSON.parse(localStorage.getItem('yojana_data')) || []; } catch(e){}
            if(schemes.length === 0) {
                try { schemes = JSON.parse(localStorage.getItem('schemes_data')) || []; } catch(e){}
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

            const idx = schemes.findIndex(s => s.id == id);
            if (idx !== -1) schemes[idx] = newScheme;
            else schemes.push(newScheme);

            localStorage.setItem('yojana_data', JSON.stringify(schemes));
            localStorage.setItem('schemes_data', JSON.stringify(schemes));

            if(typeof schemeModalInstance !== 'undefined' && schemeModalInstance) {
                schemeModalInstance.hide();
            } else {
                const m = bootstrap.Modal.getInstance(document.getElementById('schemeModal'));
                if(m) m.hide();
            }

            if(typeof window.loadAdminSchemes === 'function') window.loadAdminSchemes();

            if(typeof Swal !== 'undefined') Swal.fire('Saved!', 'Yojana has been saved successfully.', 'success');
            else alert('Saved successfully!');
        }
    } catch (error) {
        console.error('Error saving yojana:', error);
        if(typeof Swal !== 'undefined') Swal.fire('Error!', 'An error occurred while saving. Check console.', 'error');
        else alert('Error: ' + error.message);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.getElementById('saveSchemeBtn');
    if(saveBtn) saveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.saveScheme();
    });
});
`;

content = content.replace('window.deleteScheme = function', newSaveLogic + '\n\nwindow.deleteScheme = function');

fs.writeFileSync('public/admin_dashboard.html', content);
console.log('patched successfully.');
