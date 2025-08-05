// Profile Manager
class ProfileManager {
    constructor() {
        this.data = null;
    }
    
    setDataManager(dataManager) {
        this.data = dataManager;
    }
    
    show() {
        const user = window.app.currentUser;
        if (!user) return;
        
        const summary = window.app.data.getTransactionSummary(user.id);
        const formatCurrency = (amount) => window.app.data.formatCurrency(amount, user.currency);
        
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="container-fluid">
                <!-- Profile Header -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="card profile-header">
                            <div class="card-body">
                                <div class="row align-items-center">
                                    <div class="col-md-3 text-center">
                                        <div class="profile-avatar">
                                            <i class="fas fa-user-circle"></i>
                                        </div>
                                        <h4 class="mt-3 mb-1">${user.first_name} ${user.last_name}</h4>
                                        <p class="text-muted mb-0">${user.email}</p>
                                        <div class="mt-2">
                                            <span class="badge bg-primary">${user.currency}</span>
                                            <span class="badge bg-secondary">${user.country}</span>
                                        </div>
                                    </div>
                                    <div class="col-md-9">
                                        <div class="row">
                                            <div class="col-md-3">
                                                <div class="stat-card">
                                                    <h5 class="text-success">${formatCurrency(summary.totalIncome)}</h5>
                                                    <p class="text-muted mb-0">Total Income</p>
                                                </div>
                                            </div>
                                            <div class="col-md-3">
                                                <div class="stat-card">
                                                    <h5 class="text-danger">${formatCurrency(summary.totalExpense)}</h5>
                                                    <p class="text-muted mb-0">Total Expenses</p>
                                                </div>
                                            </div>
                                            <div class="col-md-3">
                                                <div class="stat-card">
                                                    <h5 class="${summary.netIncome >= 0 ? 'text-success' : 'text-danger'}">${formatCurrency(summary.netIncome)}</h5>
                                                    <p class="text-muted mb-0">Net Balance</p>
                                                </div>
                                            </div>
                                            <div class="col-md-3">
                                                <div class="stat-card">
                                                    <h5 class="text-info">${summary.totalTransactions}</h5>
                                                    <p class="text-muted mb-0">Transactions</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Account Information -->
                <div class="row">
                    <div class="col-lg-8">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-info-circle me-2"></i>
                                    Account Information
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="row mb-3">
                                    <div class="col-sm-3">
                                        <strong>Full Name:</strong>
                                    </div>
                                    <div class="col-sm-9">
                                        ${user.first_name} ${user.last_name}
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-sm-3">
                                        <strong>Email:</strong>
                                    </div>
                                    <div class="col-sm-9">
                                        ${user.email}
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-sm-3">
                                        <strong>Country:</strong>
                                    </div>
                                    <div class="col-sm-9">
                                        ${user.country}
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-sm-3">
                                        <strong>Currency:</strong>
                                    </div>
                                    <div class="col-sm-9">
                                        ${user.currency}
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-sm-3">
                                        <strong>Member Since:</strong>
                                    </div>
                                    <div class="col-sm-9">
                                        ${new Date(user.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                
                                <div class="mt-4">
                                    <button class="btn btn-primary" data-page="settings">
                                        <i class="fas fa-edit me-2"></i>Edit Profile
                                    </button>
                                    <button class="btn btn-outline-info" onclick="profile.exportData()">
                                        <i class="fas fa-download me-2"></i>Export Data
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-4">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-chart-pie me-2"></i>
                                    Quick Stats
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="d-flex justify-content-between mb-3">
                                    <span>Income Transactions:</span>
                                    <strong class="text-success">${summary.incomeTransactions}</strong>
                                </div>
                                <div class="d-flex justify-content-between mb-3">
                                    <span>Expense Transactions:</span>
                                    <strong class="text-danger">${summary.expenseTransactions}</strong>
                                </div>
                                <div class="d-flex justify-content-between mb-3">
                                    <span>Categories Used:</span>
                                    <strong>${Object.keys(summary.categoryBreakdown).length}</strong>
                                </div>
                                <div class="d-flex justify-content-between mb-3">
                                    <span>Average per Transaction:</span>
                                    <strong>${formatCurrency((summary.totalIncome + summary.totalExpense) / Math.max(summary.totalTransactions, 1))}</strong>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card mt-4">
                            <div class="card-header">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-cog me-2"></i>
                                    Quick Actions
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="d-grid gap-2">
                                    <button class="btn btn-outline-primary" data-page="transactions">
                                        <i class="fas fa-plus me-2"></i>Add Transaction
                                    </button>
                                    <button class="btn btn-outline-info" data-page="reports">
                                        <i class="fas fa-chart-bar me-2"></i>View Reports
                                    </button>
                                    <button class="btn btn-outline-secondary" onclick="profile.clearData()">
                                        <i class="fas fa-trash me-2"></i>Clear All Data
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    showSettings() {
        const user = window.app.currentUser;
        if (!user) return;
        
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="container-fluid">
                <div class="row mb-4">
                    <div class="col-12">
                        <h1 class="h3 mb-0">
                            <i class="fas fa-cog me-2 text-primary"></i>
                            Settings
                        </h1>
                        <p class="text-muted mb-0">Manage your account preferences</p>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-lg-8">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-user me-2"></i>
                                    Account Settings
                                </h5>
                            </div>
                            <div class="card-body">
                                <form id="settings-form" class="needs-validation" novalidate>
                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <label for="settingsFirstName" class="form-label">First Name</label>
                                            <input type="text" class="form-control" id="settingsFirstName" 
                                                   value="${user.first_name}" required>
                                            <div class="invalid-feedback">Please provide your first name.</div>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label for="settingsLastName" class="form-label">Last Name</label>
                                            <input type="text" class="form-control" id="settingsLastName" 
                                                   value="${user.last_name}" required>
                                            <div class="invalid-feedback">Please provide your last name.</div>
                                        </div>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="settingsEmail" class="form-label">Email Address</label>
                                        <input type="email" class="form-control" id="settingsEmail" 
                                               value="${user.email}" required>
                                        <div class="invalid-feedback">Please provide a valid email.</div>
                                    </div>
                                    
                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <label for="settingsCountry" class="form-label">Country</label>
                                            <select class="form-select" id="settingsCountry" required>
                                                <option value="">Select your country...</option>
                                            </select>
                                            <div class="invalid-feedback">Please select your country.</div>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label for="settingsCurrency" class="form-label">Currency</label>
                                            <select class="form-select" id="settingsCurrency" required>
                                                <option value="">Select your currency...</option>
                                            </select>
                                            <div class="invalid-feedback">Please select your currency.</div>
                                        </div>
                                    </div>
                                    
                                    <div class="mt-4">
                                        <button type="button" class="btn btn-primary" onclick="profile.saveSettings()">
                                            <i class="fas fa-save me-2"></i>Save Changes
                                        </button>
                                        <button type="button" class="btn btn-outline-secondary" data-page="profile">
                                            <i class="fas fa-times me-2"></i>Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-4">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-database me-2"></i>
                                    Data Management
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="d-grid gap-2">
                                    <button class="btn btn-outline-info" onclick="profile.exportData()">
                                        <i class="fas fa-download me-2"></i>Export All Data
                                    </button>
                                    <button class="btn btn-outline-warning" onclick="profile.showImportForm()">
                                        <i class="fas fa-upload me-2"></i>Import Data
                                    </button>
                                    <button class="btn btn-outline-danger" onclick="profile.clearData()">
                                        <i class="fas fa-trash me-2"></i>Clear All Data
                                    </button>
                                </div>
                                
                                <hr>
                                
                                <h6>Storage Info</h6>
                                <p class="text-muted small">
                                    Your data is stored locally in your browser. 
                                    Export regularly to keep backups.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.populateSettingsForm();
    }
    
    populateSettingsForm() {
        this.populateCountries();
        this.populateCurrencies();
        
        const user = window.app.currentUser;
        if (user) {
            document.getElementById('settingsCountry').value = user.country;
            document.getElementById('settingsCurrency').value = user.currency;
        }
    }
    
    populateCountries() {
        const countries = [
            "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia",
            "Austria", "Azerbaijan", "Bahrain", "Bangladesh", "Belarus", "Belgium", "Bolivia", "Brazil",
            "Bulgaria", "Cambodia", "Canada", "Chile", "China", "Colombia", "Croatia", "Cyprus", "Czech Republic",
            "Denmark", "Ecuador", "Egypt", "Estonia", "Ethiopia", "Finland", "France", "Georgia", "Germany",
            "Ghana", "Greece", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel",
            "Italy", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Latvia", "Lebanon", "Lithuania",
            "Luxembourg", "Malaysia", "Mexico", "Morocco", "Netherlands", "New Zealand", "Nigeria", "Norway",
            "Pakistan", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Saudi Arabia",
            "Singapore", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland", "Thailand",
            "Turkey", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Vietnam"
        ];
        
        const countrySelect = document.getElementById('settingsCountry');
        if (countrySelect) {
            countrySelect.innerHTML = '<option value="">Select your country...</option>';
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country;
                option.textContent = country;
                countrySelect.appendChild(option);
            });
        }
    }
    
    populateCurrencies() {
        const currencies = [
            { code: "USD", name: "US Dollar", symbol: "$" },
            { code: "EUR", name: "Euro", symbol: "€" },
            { code: "GBP", name: "British Pound", symbol: "£" },
            { code: "JPY", name: "Japanese Yen", symbol: "¥" },
            { code: "AUD", name: "Australian Dollar", symbol: "A$" },
            { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
            { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
            { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
            { code: "INR", name: "Indian Rupee", symbol: "₹" },
            { code: "BDT", name: "Bangladeshi Taka", symbol: "৳" },
            { code: "QAR", name: "Qatari Riyal", symbol: "ر.ق" },
            { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
            { code: "SAR", name: "Saudi Riyal", symbol: "ر.س" },
            { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك" },
            { code: "BHD", name: "Bahraini Dinar", symbol: ".د.ب" },
            { code: "OMR", name: "Omani Rial", symbol: "ر.ع." },
            { code: "JOD", name: "Jordanian Dinar", symbol: "د.ا" },
            { code: "LBP", name: "Lebanese Pound", symbol: "ل.ل" },
            { code: "EGP", name: "Egyptian Pound", symbol: "ج.م" },
            { code: "TRY", name: "Turkish Lira", symbol: "₺" },
            { code: "IRR", name: "Iranian Rial", symbol: "﷼" },
            { code: "IQD", name: "Iraqi Dinar", symbol: "ع.د" },
            { code: "SYP", name: "Syrian Pound", symbol: "ل.س" },
            { code: "YER", name: "Yemeni Rial", symbol: "﷼" },
            { code: "MAD", name: "Moroccan Dirham", symbol: "د.م." },
            { code: "TND", name: "Tunisian Dinar", symbol: "د.ت" },
            { code: "DZD", name: "Algerian Dinar", symbol: "د.ج" },
            { code: "LYD", name: "Libyan Dinar", symbol: "ل.د" },
            { code: "SDG", name: "Sudanese Pound", symbol: "ج.س." },
            { code: "PKR", name: "Pakistani Rupee", symbol: "₨" },
            { code: "AFN", name: "Afghan Afghani", symbol: "؋" },
            { code: "KRW", name: "South Korean Won", symbol: "₩" },
            { code: "THB", name: "Thai Baht", symbol: "฿" },
            { code: "VND", name: "Vietnamese Dong", symbol: "₫" },
            { code: "PHP", name: "Philippine Peso", symbol: "₱" },
            { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
            { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
            { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
            { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
            { code: "TWD", name: "Taiwan Dollar", symbol: "NT$" },
            { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
            { code: "ZAR", name: "South African Rand", symbol: "R" },
            { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
            { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
            { code: "GHS", name: "Ghanaian Cedi", symbol: "₵" },
            { code: "ETB", name: "Ethiopian Birr", symbol: "Br" },
            { code: "BRL", name: "Brazilian Real", symbol: "R$" },
            { code: "ARS", name: "Argentine Peso", symbol: "$" },
            { code: "CLP", name: "Chilean Peso", symbol: "$" },
            { code: "COP", name: "Colombian Peso", symbol: "$" },
            { code: "PEN", name: "Peruvian Sol", symbol: "S/" }
        ];
        
        const currencySelect = document.getElementById('settingsCurrency');
        if (currencySelect) {
            currencySelect.innerHTML = '<option value="">Select your currency...</option>';
            currencies.forEach(currency => {
                const option = document.createElement('option');
                option.value = currency.code;
                option.textContent = `${currency.code} - ${currency.name} (${currency.symbol})`;
                currencySelect.appendChild(option);
            });
        }
    }
    
    saveSettings() {
        const form = document.getElementById('settings-form');
        
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }
        
        const user = window.app.currentUser;
        const updatedUser = {
            ...user,
            first_name: document.getElementById('settingsFirstName').value,
            last_name: document.getElementById('settingsLastName').value,
            email: document.getElementById('settingsEmail').value,
            country: document.getElementById('settingsCountry').value,
            currency: document.getElementById('settingsCurrency').value,
            updated_at: new Date().toISOString()
        };
        
        // Update user in storage
        window.app.auth.saveUser(updatedUser);
        window.app.auth.saveUserToDatabase(updatedUser);
        window.app.currentUser = updatedUser;
        
        // Update navigation
        window.app.updateNavigation();
        
        window.app.showMessage('Settings saved successfully!', 'success');
        window.app.loadPage('profile');
    }
    
    exportData() {
        const user = window.app.currentUser;
        const data = window.app.data.exportData(user.id);
        
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `finance-data-${user.first_name}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        window.app.showMessage('Data exported successfully!', 'success');
    }
    
    showImportForm() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const success = window.app.data.importData(e.target.result, window.app.currentUser.id);
                        if (success) {
                            window.app.showMessage('Data imported successfully!', 'success');
                            if (window.app.currentPage === 'dashboard') {
                                window.app.dashboard.refreshData();
                            }
                        } else {
                            window.app.showMessage('Failed to import data. Please check the file format.', 'danger');
                        }
                    } catch (error) {
                        window.app.showMessage('Invalid file format.', 'danger');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }
    
    clearData() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            window.app.data.clearAllData();
            window.app.showMessage('All data cleared successfully!', 'info');
            window.app.loadPage('dashboard');
        }
    }
}

// Global profile functions
const profile = new ProfileManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProfileManager;
}
