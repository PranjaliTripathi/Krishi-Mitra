const fs = require('fs');
let content = fs.readFileSync('public/admin_dashboard.html', 'utf8');

// Insert Sidebar Nav
const sidebarTarget = '<a href="#" id="navCrops" onclick="showSection(\'crops\', this)"><i class="bi bi-tree me-2"></i> <span data-t="manage_crops">Manage Crops</span></a>';
const sidebarInsert = sidebarTarget + '\n        <a href="#" id="navSchemes" onclick="showSection(\'admSchemes\', this)"><i class="bi bi-award me-2"></i> <span data-t="schemes_management">Schemes Management</span></a>';
content = content.replace(sidebarTarget, sidebarInsert);

// Insert Main Content
const mainTarget = '    <!-- 5. User Management -->\n    <div id="users" style="display: none;">';
const schemeSection = `    <!-- 4.5 Schemes Management -->
    <div id="admSchemes" style="display: none;">
        <div class="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
            <div>
                <h2 class="mb-1 fw-bold" data-t="schemes_management">Schemes Management</h2>
                <p class="text-muted small mb-0">Add, edit or update agricultural schemes.</p>
            </div>
            <button class="btn btn-success px-4 rounded-pill shadow-sm" onclick="openSchemeModal()">
                <i class="bi bi-plus-lg me-2"></i> <span data-t="add_scheme">Add Scheme</span>
            </button>
        </div>

        <div class="card border-0 shadow-sm p-3 mb-4 rounded-4 bg-white">
            <div class="row g-2">
                <div class="col-md-4">
                    <select class="form-select" id="admSchemeStateFilter" onchange="loadAdminSchemes()">
                        <option value="">All States</option>
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
                <div class="col-md-4">
                    <select class="form-select" id="admSchemeTypeFilter" onchange="loadAdminSchemes()">
                        <option value="">All Types</option>
                        <option value="Govt">Govt</option>
                        <option value="Semi Govt">Semi Govt</option>
                        <option value="Private">Private</option>
                        <option value="NGO">NGO</option>
                    </select>
                </div>
                <div class="col-md-4">
                    <select class="form-select" id="admSchemeCropFilter" onchange="loadAdminSchemes()">
                        <option value="">All Crops</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light">
                        <tr>
                            <th class="ps-4">Scheme Name</th>
                            <th>Crop</th>
                            <th>State / Type</th>
                            <th class="text-end pe-4" data-t="action">Action</th>
                        </tr>
                    </thead>
                    <tbody id="adminSchemeList"></tbody>
                </table>
            </div>
        </div>
    </div>

`;
content = content.replace(mainTarget, schemeSection + mainTarget);

// Insert Modal
const modalTarget = '<!-- ALL MODALS BELOW -->';
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
                <button type="button" class="btn btn-success rounded-pill px-5" onclick="saveScheme()">Save Scheme</button>
            </div>
        </div>
    </div>
</div>

`;
content = content.replace(modalTarget, modalTarget + '\n\n' + schemeModal);

fs.writeFileSync('public/admin_dashboard.html', content);
console.log('HTML updated.');
