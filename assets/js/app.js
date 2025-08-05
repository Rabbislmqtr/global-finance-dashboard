// Global Finance Dashboard - Main Application
class FinanceApp {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'landing';
        this.data = new DataManager();
        this.auth = new AuthManager();
        this.dashboard = new DashboardManager();
        this.transactions = new TransactionManager();
        this.profile = new ProfileManager();
        this.reports = new ReportsManager();
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.checkAuth();
        this.updateNavigation();
    }
    
    setupEventListeners() {
        // Handle navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-page]')) {
                e.preventDefault();
                this.loadPage(e.target.dataset.page);
            }
        });
        
        // Handle hash changes for routing
        window.addEventListener('hashchange', () => {
            this.handleRouting();
        });
        
        // Handle initial route
        window.addEventListener('load', () => {
            this.handleRouting();
        });
    }
    
    checkAuth() {
        const user = this.auth.getCurrentUser();
        if (user) {
            this.currentUser = user;
            this.currentPage = 'dashboard';
        } else {
            this.currentUser = null;
            this.currentPage = 'landing';
        }
    }
    
    updateNavigation() {
        const navbarLinks = document.getElementById('navbar-links');
        
        if (this.currentUser) {
            // Logged in navigation
            navbarLinks.innerHTML = `
                <li class="nav-item">
                    <a class="nav-link" href="#" data-page="dashboard">
                        <i class="fas fa-tachometer-alt me-1"></i>Dashboard
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" data-page="transactions">
                        <i class="fas fa-exchange-alt me-1"></i>Transactions
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" data-page="categories">
                        <i class="fas fa-tags me-1"></i>Categories
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" data-page="reports">
                        <i class="fas fa-chart-bar me-1"></i>Reports
                    </a>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                        <i class="fas fa-user-circle me-1"></i>
                        ${this.currentUser.first_name || 'User'}
                        <span class="badge bg-secondary ms-1">${this.currentUser.currency || 'USD'}</span>
                    </a>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#" data-page="profile">
                            <i class="fas fa-user me-2"></i>Profile
                        </a></li>
                        <li><a class="dropdown-item" href="#" data-page="settings">
                            <i class="fas fa-cog me-2"></i>Settings
                        </a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#" onclick="app.logout()">
                            <i class="fas fa-sign-out-alt me-2"></i>Logout
                        </a></li>
                    </ul>
                </li>
            `;
        } else {
            // Not logged in navigation
            navbarLinks.innerHTML = `
                <li class="nav-item">
                    <a class="nav-link" href="#features">Features</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#about">About</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" data-page="login">
                        <i class="fas fa-sign-in-alt me-1"></i>Login
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" data-page="register">
                        <i class="fas fa-user-plus me-1"></i>Register
                    </a>
                </li>
            `;
        }
        
        this.updateActiveNavLink();
    }
    
    updateActiveNavLink() {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current page
        const activeLink = document.querySelector(`[data-page="${this.currentPage}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    handleRouting() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            this.loadPage(hash);
        } else if (this.currentUser) {
            this.loadPage('dashboard');
        } else {
            this.loadPage('landing');
        }
    }
    
    loadPage(page) {
        this.currentPage = page;
        window.location.hash = page;
        
        // Check authentication for protected pages
        const protectedPages = ['dashboard', 'transactions', 'categories', 'reports', 'profile', 'settings'];
        if (protectedPages.includes(page) && !this.currentUser) {
            this.showMessage('Please login to access this page', 'warning');
            this.loadPage('login');
            return;
        }
        
        const mainContent = document.getElementById('main-content');
        
        switch (page) {
            case 'landing':
                this.loadLandingPage();
                break;
            case 'login':
                this.auth.showLoginForm();
                break;
            case 'register':
                this.auth.showRegisterForm();
                break;
            case 'dashboard':
                this.dashboard.show();
                break;
            case 'transactions':
                this.transactions.show();
                break;
            case 'categories':
                this.showCategoriesPage();
                break;
            case 'reports':
                this.reports.show();
                break;
            case 'profile':
                this.profile.show();
                break;
            case 'settings':
                this.profile.showSettings();
                break;
            default:
                this.loadLandingPage();
        }
        
        this.updateActiveNavLink();
    }
    
    loadLandingPage() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <!-- Hero Section -->
            <section class="hero-section">
                <div class="container">
                    <div class="row align-items-center">
                        <div class="col-lg-6">
                            <h1 class="display-4 fw-bold mb-4 fade-in">
                                Manage Your Global Finances
                            </h1>
                            <p class="lead mb-4 fade-in">
                                Track expenses, monitor investments, and analyze your financial health across 
                                <strong>80+ countries</strong> with support for <strong>50+ currencies</strong>.
                            </p>
                            <div class="d-flex gap-3 mb-4 fade-in">
                                <button class="btn btn-light btn-lg" data-page="register">
                                    <i class="fas fa-rocket me-2"></i>Get Started Free
                                </button>
                                <button class="btn btn-outline-light btn-lg" data-page="login">
                                    <i class="fas fa-sign-in-alt me-2"></i>Sign In
                                </button>
                            </div>
                            <div class="d-flex align-items-center gap-4 text-light fade-in">
                                <div class="d-flex align-items-center">
                                    <i class="fas fa-shield-alt me-2"></i>
                                    <span>Secure & Private</span>
                                </div>
                                <div class="d-flex align-items-center">
                                    <i class="fas fa-mobile-alt me-2"></i>
                                    <span>Mobile Friendly</span>
                                </div>
                                <div class="d-flex align-items-center">
                                    <i class="fas fa-globe me-2"></i>
                                    <span>Multi-Currency</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="text-center fade-in">
                                <i class="fas fa-chart-line" style="font-size: 20rem; color: rgba(255,255,255,0.1);"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Features Section -->
            <section id="features" class="features-section">
                <div class="container">
                    <div class="row text-center mb-5">
                        <div class="col-lg-8 mx-auto">
                            <h2 class="display-5 fw-bold mb-3">Everything You Need for Financial Success</h2>
                            <p class="lead text-muted">
                                Comprehensive tools to track, analyze, and optimize your financial journey
                            </p>
                        </div>
                    </div>
                    
                    <div class="row g-4">
                        <div class="col-lg-3 col-md-6">
                            <div class="card feature-card h-100">
                                <div class="card-body">
                                    <div class="feature-icon income">
                                        <i class="fas fa-plus"></i>
                                    </div>
                                    <h5 class="card-title">Income Tracking</h5>
                                    <p class="card-text">Monitor all income sources with detailed categorization and automatic calculations.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-lg-3 col-md-6">
                            <div class="card feature-card h-100">
                                <div class="card-body">
                                    <div class="feature-icon expense">
                                        <i class="fas fa-minus"></i>
                                    </div>
                                    <h5 class="card-title">Expense Management</h5>
                                    <p class="card-text">Track and categorize expenses to understand your spending patterns better.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-lg-3 col-md-6">
                            <div class="card feature-card h-100">
                                <div class="card-body">
                                    <div class="feature-icon reports">
                                        <i class="fas fa-chart-bar"></i>
                                    </div>
                                    <h5 class="card-title">Advanced Reports</h5>
                                    <p class="card-text">Generate detailed financial reports with beautiful charts and insights.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-lg-3 col-md-6">
                            <div class="card feature-card h-100">
                                <div class="card-body">
                                    <div class="feature-icon security">
                                        <i class="fas fa-lock"></i>
                                    </div>
                                    <h5 class="card-title">Secure & Private</h5>
                                    <p class="card-text">Your financial data is stored securely with client-side encryption.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- About Section -->
            <section id="about" class="py-5 bg-light">
                <div class="container">
                    <div class="row align-items-center">
                        <div class="col-lg-6">
                            <h2 class="display-5 fw-bold mb-4">Built for Global Users</h2>
                            <p class="lead mb-4">
                                Whether you're in Bangladesh using BDT, Qatar using QAR, or anywhere else in the world,
                                our platform supports your local currency and provides meaningful insights.
                            </p>
                            <div class="row g-3">
                                <div class="col-6">
                                    <div class="d-flex align-items-center">
                                        <div class="bg-primary text-white rounded-circle p-2 me-3">
                                            <i class="fas fa-globe"></i>
                                        </div>
                                        <div>
                                            <h6 class="mb-0">80+ Countries</h6>
                                            <small class="text-muted">Global Support</small>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="d-flex align-items-center">
                                        <div class="bg-success text-white rounded-circle p-2 me-3">
                                            <i class="fas fa-coins"></i>
                                        </div>
                                        <div>
                                            <h6 class="mb-0">50+ Currencies</h6>
                                            <small class="text-muted">Multi-Currency</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="text-center">
                                <i class="fas fa-globe-asia text-primary" style="font-size: 15rem; opacity: 0.1;"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
    
    showCategoriesPage() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="container-fluid">
                <div class="row mb-4">
                    <div class="col-12">
                        <h1 class="h3 mb-0">
                            <i class="fas fa-tags me-2 text-primary"></i>
                            Categories Management
                        </h1>
                        <p class="text-muted mb-0">Organize your transactions with custom categories</p>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-body text-center py-5">
                        <i class="fas fa-tags text-muted" style="font-size: 4rem; margin-bottom: 1rem;"></i>
                        <h4>Categories Management</h4>
                        <p class="text-muted">This feature is coming soon! You can currently manage categories through the transaction forms.</p>
                        <button class="btn btn-primary" data-page="transactions">
                            <i class="fas fa-exchange-alt me-2"></i>Manage Transactions
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    login(user) {
        this.currentUser = user;
        this.updateNavigation();
        this.loadPage('dashboard');
        this.showMessage('Welcome back!', 'success');
    }
    
    logout() {
        this.auth.logout();
        this.currentUser = null;
        this.updateNavigation();
        this.loadPage('landing');
        this.showMessage('You have been logged out successfully', 'info');
    }
    
    showMessage(message, type = 'info') {
        // Create alert element
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alert.style.cssText = 'top: 70px; right: 20px; z-index: 9999; min-width: 300px;';
        alert.innerHTML = `
            <i class="fas fa-${this.getAlertIcon(type)} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alert);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);
    }
    
    getAlertIcon(type) {
        const icons = {
            success: 'check-circle',
            danger: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Global functions
function loadPage(page) {
    if (window.app) {
        window.app.loadPage(page);
    }
}

function initializeApp() {
    window.app = new FinanceApp();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FinanceApp;
}
