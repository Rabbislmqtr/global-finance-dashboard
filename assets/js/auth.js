// Authentication Manager
class AuthManager {
    constructor() {
        this.storageKey = 'finance_app_user';
        this.usersKey = 'finance_app_users';
    }
    
    getCurrentUser() {
        const userStr = localStorage.getItem(this.storageKey);
        return userStr ? JSON.parse(userStr) : null;
    }
    
    getAllUsers() {
        const usersStr = localStorage.getItem(this.usersKey);
        return usersStr ? JSON.parse(usersStr) : [];
    }
    
    saveUser(user) {
        localStorage.setItem(this.storageKey, JSON.stringify(user));
    }
    
    saveUserToDatabase(user) {
        const users = this.getAllUsers();
        const existingIndex = users.findIndex(u => u.email === user.email);
        
        if (existingIndex >= 0) {
            users[existingIndex] = user;
        } else {
            users.push(user);
        }
        
        localStorage.setItem(this.usersKey, JSON.stringify(users));
    }
    
    showLoginForm() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-6 col-lg-5">
                        <div class="card shadow-lg border-0">
                            <div class="card-header bg-primary text-white text-center py-4">
                                <h3 class="mb-0">
                                    <i class="fas fa-sign-in-alt me-2"></i>
                                    Welcome Back
                                </h3>
                                <p class="mb-0 opacity-75">Sign in to your account</p>
                            </div>
                            <div class="card-body p-4">
                                <form id="login-form" class="needs-validation" novalidate>
                                    <div class="mb-3">
                                        <label for="loginEmail" class="form-label">
                                            <i class="fas fa-envelope me-1"></i>Email Address
                                        </label>
                                        <input type="email" class="form-control" id="loginEmail" required>
                                        <div class="invalid-feedback">Please provide a valid email.</div>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="loginPassword" class="form-label">
                                            <i class="fas fa-lock me-1"></i>Password
                                        </label>
                                        <div class="input-group">
                                            <input type="password" class="form-control" id="loginPassword" required>
                                            <button class="btn btn-outline-secondary" type="button" onclick="this.previousElementSibling.type = this.previousElementSibling.type === 'password' ? 'text' : 'password'; this.innerHTML = this.previousElementSibling.type === 'password' ? '<i class=\\'fas fa-eye\\'></i>' : '<i class=\\'fas fa-eye-slash\\'></i>'">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                        </div>
                                        <div class="invalid-feedback">Please provide a password.</div>
                                    </div>
                                    
                                    <div class="mb-3 form-check">
                                        <input type="checkbox" class="form-check-input" id="rememberMe">
                                        <label class="form-check-label" for="rememberMe">
                                            Remember me
                                        </label>
                                    </div>
                                    
                                    <div class="d-grid mb-3">
                                        <button type="submit" class="btn btn-primary btn-lg">
                                            <i class="fas fa-sign-in-alt me-2"></i>Sign In
                                        </button>
                                    </div>
                                    
                                    <div class="text-center">
                                        <p class="mb-0">Don't have an account? 
                                            <a href="#" data-page="register" class="text-decoration-none">Create one here</a>
                                        </p>
                                    </div>
                                    
                                    <!-- Demo Account Info -->
                                    <div class="mt-4 p-3 bg-light rounded">
                                        <h6 class="text-muted mb-2">
                                            <i class="fas fa-info-circle me-1"></i>Demo Account
                                        </h6>
                                        <p class="small mb-1"><strong>Email:</strong> demo@example.com</p>
                                        <p class="small mb-0"><strong>Password:</strong> demo123</p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.setupLoginForm();
    }
    
    showRegisterForm() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-8 col-lg-7">
                        <div class="card shadow-lg border-0">
                            <div class="card-header bg-success text-white text-center py-4">
                                <h3 class="mb-0">
                                    <i class="fas fa-user-plus me-2"></i>
                                    Create Account
                                </h3>
                                <p class="mb-0 opacity-75">Join thousands of users managing their finances</p>
                            </div>
                            <div class="card-body p-4">
                                <form id="register-form" class="needs-validation" novalidate>
                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <label for="firstName" class="form-label">
                                                <i class="fas fa-user me-1"></i>First Name
                                            </label>
                                            <input type="text" class="form-control" id="firstName" required>
                                            <div class="invalid-feedback">Please provide your first name.</div>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label for="lastName" class="form-label">
                                                <i class="fas fa-user me-1"></i>Last Name
                                            </label>
                                            <input type="text" class="form-control" id="lastName" required>
                                            <div class="invalid-feedback">Please provide your last name.</div>
                                        </div>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="email" class="form-label">
                                            <i class="fas fa-envelope me-1"></i>Email Address
                                        </label>
                                        <input type="email" class="form-control" id="email" required>
                                        <div class="invalid-feedback">Please provide a valid email.</div>
                                    </div>
                                    
                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <label for="password" class="form-label">
                                                <i class="fas fa-lock me-1"></i>Password
                                            </label>
                                            <div class="input-group">
                                                <input type="password" class="form-control" id="password" required minlength="6">
                                                <button class="btn btn-outline-secondary" type="button" onclick="this.previousElementSibling.type = this.previousElementSibling.type === 'password' ? 'text' : 'password'; this.innerHTML = this.previousElementSibling.type === 'password' ? '<i class=\\'fas fa-eye\\'></i>' : '<i class=\\'fas fa-eye-slash\\'></i>'">
                                                    <i class="fas fa-eye"></i>
                                                </button>
                                            </div>
                                            <div class="invalid-feedback">Password must be at least 6 characters.</div>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label for="confirmPassword" class="form-label">
                                                <i class="fas fa-lock me-1"></i>Confirm Password
                                            </label>
                                            <input type="password" class="form-control" id="confirmPassword" required>
                                            <div class="invalid-feedback">Passwords must match.</div>
                                        </div>
                                    </div>
                                    
                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <label for="country" class="form-label">
                                                <i class="fas fa-globe me-1"></i>Country
                                            </label>
                                            <select class="form-select" id="country" required>
                                                <option value="">Select your country...</option>
                                            </select>
                                            <div class="invalid-feedback">Please select your country.</div>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label for="currency" class="form-label">
                                                <i class="fas fa-coins me-1"></i>Currency
                                            </label>
                                            <select class="form-select" id="currency" required>
                                                <option value="">Select your currency...</option>
                                            </select>
                                            <div class="invalid-feedback">Please select your currency.</div>
                                        </div>
                                    </div>
                                    
                                    <div class="mb-3 form-check">
                                        <input type="checkbox" class="form-check-input" id="agreeTerms" required>
                                        <label class="form-check-label" for="agreeTerms">
                                            I agree to the <a href="#" data-page="terms" class="text-decoration-none">Terms of Service</a> 
                                            and <a href="#" data-page="privacy" class="text-decoration-none">Privacy Policy</a>
                                        </label>
                                        <div class="invalid-feedback">You must agree to the terms.</div>
                                    </div>
                                    
                                    <div class="d-grid mb-3">
                                        <button type="submit" class="btn btn-success btn-lg">
                                            <i class="fas fa-user-plus me-2"></i>Create Account
                                        </button>
                                    </div>
                                    
                                    <div class="text-center">
                                        <p class="mb-0">Already have an account? 
                                            <a href="#" data-page="login" class="text-decoration-none">Sign in here</a>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.setupRegisterForm();
    }
    
    setupLoginForm() {
        const form = document.getElementById('login-form');
        
        // Create demo account if it doesn't exist
        this.createDemoAccount();
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!form.checkValidity()) {
                e.stopPropagation();
                form.classList.add('was-validated');
                return;
            }
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            this.login(email, password);
        });
    }
    
    setupRegisterForm() {
        const form = document.getElementById('register-form');
        
        // Populate countries and currencies
        this.populateCountries();
        this.populateCurrencies();
        
        // Password confirmation validation
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        
        confirmPassword.addEventListener('input', () => {
            if (password.value !== confirmPassword.value) {
                confirmPassword.setCustomValidity('Passwords must match');
            } else {
                confirmPassword.setCustomValidity('');
            }
        });
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!form.checkValidity()) {
                e.stopPropagation();
                form.classList.add('was-validated');
                return;
            }
            
            this.register();
        });
    }
    
    createDemoAccount() {
        const users = this.getAllUsers();
        const demoExists = users.find(u => u.email === 'demo@example.com');
        
        if (!demoExists) {
            const demoUser = {
                id: 'demo-user',
                email: 'demo@example.com',
                password: 'demo123', // In a real app, this would be hashed
                first_name: 'Demo',
                last_name: 'User',
                country: 'United States',
                currency: 'USD',
                created_at: new Date().toISOString()
            };
            
            this.saveUserToDatabase(demoUser);
        }
    }
    
    login(email, password) {
        const users = this.getAllUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.saveUser(user);
            if (window.app) {
                window.app.login(user);
            }
        } else {
            if (window.app) {
                window.app.showMessage('Invalid email or password', 'danger');
            }
        }
    }
    
    register() {
        const form = document.getElementById('register-form');
        const formData = new FormData(form);
        
        const userData = {
            id: 'user-' + Date.now(),
            email: document.getElementById('email').value,
            password: document.getElementById('password').value, // In a real app, this would be hashed
            first_name: document.getElementById('firstName').value,
            last_name: document.getElementById('lastName').value,
            country: document.getElementById('country').value,
            currency: document.getElementById('currency').value,
            created_at: new Date().toISOString()
        };
        
        // Check if user already exists
        const users = this.getAllUsers();
        const existingUser = users.find(u => u.email === userData.email);
        
        if (existingUser) {
            if (window.app) {
                window.app.showMessage('An account with this email already exists', 'danger');
            }
            return;
        }
        
        // Save user
        this.saveUserToDatabase(userData);
        this.saveUser(userData);
        
        if (window.app) {
            window.app.login(userData);
            window.app.showMessage('Account created successfully!', 'success');
        }
    }
    
    logout() {
        localStorage.removeItem(this.storageKey);
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
        
        const countrySelect = document.getElementById('country');
        if (countrySelect) {
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
        
        const currencySelect = document.getElementById('currency');
        if (currencySelect) {
            currencies.forEach(currency => {
                const option = document.createElement('option');
                option.value = currency.code;
                option.textContent = `${currency.code} - ${currency.name} (${currency.symbol})`;
                currencySelect.appendChild(option);
            });
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}
