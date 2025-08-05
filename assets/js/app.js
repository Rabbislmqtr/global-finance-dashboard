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
            case 'help':
                this.showHelpPage();
                break;
            case 'contact':
                this.showContactPage();
                break;
            case 'privacy':
                this.showPrivacyPage();
                break;
            case 'terms':
                this.showTermsPage();
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

    // Support Pages
    showHelpPage() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="container py-5">
                <div class="row justify-content-center">
                    <div class="col-lg-10">
                        <div class="text-center mb-5">
                            <h1 class="display-4 mb-3">
                                <i class="fas fa-question-circle text-primary me-3"></i>
                                Help Center
                            </h1>
                            <p class="lead">Find answers to common questions and get help with your Global Finance Dashboard</p>
                        </div>

                        <div class="row g-4">
                            <div class="col-md-6">
                                <div class="card h-100 shadow-sm">
                                    <div class="card-body">
                                        <h5 class="card-title">
                                            <i class="fas fa-chart-bar text-primary me-2"></i>
                                            Getting Started
                                        </h5>
                                        <p class="card-text">Learn how to set up your dashboard, add accounts, and start tracking your finances.</p>
                                        <ul class="list-unstyled">
                                            <li><i class="fas fa-check text-success me-2"></i>Setting up your profile</li>
                                            <li><i class="fas fa-check text-success me-2"></i>Adding financial accounts</li>
                                            <li><i class="fas fa-check text-success me-2"></i>Understanding the dashboard</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card h-100 shadow-sm">
                                    <div class="card-body">
                                        <h5 class="card-title">
                                            <i class="fas fa-exchange-alt text-success me-2"></i>
                                            Managing Transactions
                                        </h5>
                                        <p class="card-text">Learn how to add, categorize, and manage your financial transactions effectively.</p>
                                        <ul class="list-unstyled">
                                            <li><i class="fas fa-check text-success me-2"></i>Adding new transactions</li>
                                            <li><i class="fas fa-check text-success me-2"></i>Categorizing expenses</li>
                                            <li><i class="fas fa-check text-success me-2"></i>Editing and deleting transactions</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card h-100 shadow-sm">
                                    <div class="card-body">
                                        <h5 class="card-title">
                                            <i class="fas fa-chart-pie text-info me-2"></i>
                                            Reports & Analytics
                                        </h5>
                                        <p class="card-text">Understand your financial reports and make the most of analytics features.</p>
                                        <ul class="list-unstyled">
                                            <li><i class="fas fa-check text-success me-2"></i>Reading financial reports</li>
                                            <li><i class="fas fa-check text-success me-2"></i>Setting up budgets</li>
                                            <li><i class="fas fa-check text-success me-2"></i>Tracking spending patterns</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card h-100 shadow-sm">
                                    <div class="card-body">
                                        <h5 class="card-title">
                                            <i class="fas fa-globe text-warning me-2"></i>
                                            Multi-Currency Support
                                        </h5>
                                        <p class="card-text">Learn how to manage multiple currencies and international transactions.</p>
                                        <ul class="list-unstyled">
                                            <li><i class="fas fa-check text-success me-2"></i>Adding different currencies</li>
                                            <li><i class="fas fa-check text-success me-2"></i>Exchange rate handling</li>
                                            <li><i class="fas fa-check text-success me-2"></i>Currency conversion</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="text-center mt-5">
                            <h3>Still need help?</h3>
                            <p class="mb-4">Can't find what you're looking for? Contact our support team for personalized assistance.</p>
                            <button onclick="loadPage('contact')" class="btn btn-primary btn-lg">
                                <i class="fas fa-envelope me-2"></i>
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    showContactPage() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="container py-5">
                <div class="row justify-content-center">
                    <div class="col-lg-8">
                        <div class="text-center mb-5">
                            <h1 class="display-4 mb-3">
                                <i class="fas fa-envelope text-primary me-3"></i>
                                Contact Support
                            </h1>
                            <p class="lead">Get in touch with our support team for assistance with your Global Finance Dashboard</p>
                        </div>

                        <div class="row g-4 mb-5">
                            <div class="col-md-4 text-center">
                                <div class="card border-0 h-100">
                                    <div class="card-body">
                                        <div class="mb-3">
                                            <i class="fas fa-envelope fa-3x text-primary"></i>
                                        </div>
                                        <h5>Email Support</h5>
                                        <p class="text-muted">Send us an email and we'll respond within 24 hours</p>
                                        <a href="mailto:rabbilslmqtr@gmail.com" class="btn btn-outline-primary">
                                            <i class="fas fa-paper-plane me-2"></i>
                                            Send Email
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 text-center">
                                <div class="card border-0 h-100">
                                    <div class="card-body">
                                        <div class="mb-3">
                                            <i class="fas fa-question-circle fa-3x text-success"></i>
                                        </div>
                                        <h5>Help Center</h5>
                                        <p class="text-muted">Browse our comprehensive help documentation</p>
                                        <button onclick="loadPage('help')" class="btn btn-outline-success">
                                            <i class="fas fa-book me-2"></i>
                                            Browse Help
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 text-center">
                                <div class="card border-0 h-100">
                                    <div class="card-body">
                                        <div class="mb-3">
                                            <i class="fas fa-bug fa-3x text-warning"></i>
                                        </div>
                                        <h5>Report Bug</h5>
                                        <p class="text-muted">Found an issue? Let us know so we can fix it</p>
                                        <a href="mailto:rabbilslmqtr@gmail.com?subject=Bug Report - Global Finance Dashboard" class="btn btn-outline-warning">
                                            <i class="fas fa-exclamation-triangle me-2"></i>
                                            Report Bug
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card shadow-sm">
                            <div class="card-header bg-primary text-white">
                                <h4 class="mb-0">
                                    <i class="fas fa-comment-dots me-2"></i>
                                    Quick Contact Form
                                </h4>
                            </div>
                            <div class="card-body">
                                <form id="contactForm">
                                    <div class="row g-3">
                                        <div class="col-md-6">
                                            <label for="contactName" class="form-label">Name</label>
                                            <input type="text" class="form-control" id="contactName" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label for="contactEmail" class="form-label">Email</label>
                                            <input type="email" class="form-control" id="contactEmail" required>
                                        </div>
                                        <div class="col-12">
                                            <label for="contactSubject" class="form-label">Subject</label>
                                            <select class="form-select" id="contactSubject" required>
                                                <option value="">Choose a subject...</option>
                                                <option value="general">General Inquiry</option>
                                                <option value="technical">Technical Support</option>
                                                <option value="feature">Feature Request</option>
                                                <option value="bug">Bug Report</option>
                                                <option value="billing">Billing Question</option>
                                            </select>
                                        </div>
                                        <div class="col-12">
                                            <label for="contactMessage" class="form-label">Message</label>
                                            <textarea class="form-control" id="contactMessage" rows="5" required 
                                                placeholder="Please describe your question or issue in detail..."></textarea>
                                        </div>
                                        <div class="col-12">
                                            <button type="submit" class="btn btn-primary btn-lg">
                                                <i class="fas fa-paper-plane me-2"></i>
                                                Send Message
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div class="alert alert-info mt-4">
                            <i class="fas fa-info-circle me-2"></i>
                            <strong>Note:</strong> This contact form will open your default email client with a pre-filled message. 
                            Our support email is <strong>rabbilslmqtr@gmail.com</strong>.
                        </div>
                    </div>
                </div>
            </div>

            <script>
                document.getElementById('contactForm').addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    const name = document.getElementById('contactName').value;
                    const email = document.getElementById('contactEmail').value;
                    const subject = document.getElementById('contactSubject').value;
                    const message = document.getElementById('contactMessage').value;
                    
                    const emailSubject = 'Global Finance Dashboard - ' + subject;
                    const emailBody = 'Name: ' + name + '\\n' +
                                     'Email: ' + email + '\\n\\n' +
                                     'Message:\\n' + message;
                    
                    const mailtoLink = 'mailto:rabbilslmqtr@gmail.com?subject=' + 
                                      encodeURIComponent(emailSubject) + 
                                      '&body=' + encodeURIComponent(emailBody);
                    
                    window.location.href = mailtoLink;
                });
            </script>
        `;
    }

    showPrivacyPage() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="container py-5">
                <div class="row justify-content-center">
                    <div class="col-lg-10">
                        <div class="text-center mb-5">
                            <h1 class="display-4 mb-3">
                                <i class="fas fa-shield-alt text-primary me-3"></i>
                                Privacy Policy
                            </h1>
                            <p class="lead">Your privacy is important to us. Learn how we collect, use, and protect your information.</p>
                            <small class="text-muted">Last updated: August 5, 2025</small>
                        </div>

                        <div class="card shadow-sm">
                            <div class="card-body">
                                <h3>1. Information We Collect</h3>
                                <p>We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.</p>
                                <ul>
                                    <li><strong>Personal Information:</strong> Name, email address, and profile information</li>
                                    <li><strong>Financial Data:</strong> Transaction information, account balances, and financial goals</li>
                                    <li><strong>Usage Data:</strong> How you interact with our dashboard and features</li>
                                </ul>

                                <h3 class="mt-4">2. How We Use Your Information</h3>
                                <p>We use the information we collect to:</p>
                                <ul>
                                    <li>Provide and maintain our financial dashboard services</li>
                                    <li>Process transactions and manage your financial data</li>
                                    <li>Send you technical notices and support messages</li>
                                    <li>Improve our services and develop new features</li>
                                </ul>

                                <h3 class="mt-4">3. Data Security</h3>
                                <p>We implement appropriate security measures to protect your personal information:</p>
                                <ul>
                                    <li>All data is stored locally in your browser</li>
                                    <li>No financial data is transmitted to external servers</li>
                                    <li>Secure authentication and session management</li>
                                    <li>Regular security updates and monitoring</li>
                                </ul>

                                <h3 class="mt-4">4. Data Sharing</h3>
                                <p>We do not sell, trade, or otherwise transfer your personal information to third parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.</p>

                                <h3 class="mt-4">5. Your Rights</h3>
                                <p>You have the right to:</p>
                                <ul>
                                    <li>Access your personal data</li>
                                    <li>Correct inaccurate data</li>
                                    <li>Delete your account and associated data</li>
                                    <li>Export your financial data</li>
                                </ul>

                                <h3 class="mt-4">6. Contact Us</h3>
                                <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                                <div class="alert alert-primary">
                                    <i class="fas fa-envelope me-2"></i>
                                    Email: <a href="mailto:rabbilslmqtr@gmail.com">rabbilslmqtr@gmail.com</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    showTermsPage() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="container py-5">
                <div class="row justify-content-center">
                    <div class="col-lg-10">
                        <div class="text-center mb-5">
                            <h1 class="display-4 mb-3">
                                <i class="fas fa-file-contract text-primary me-3"></i>
                                Terms of Service
                            </h1>
                            <p class="lead">Please read these terms carefully before using our Global Finance Dashboard.</p>
                            <small class="text-muted">Last updated: August 5, 2025</small>
                        </div>

                        <div class="card shadow-sm">
                            <div class="card-body">
                                <h3>1. Acceptance of Terms</h3>
                                <p>By accessing and using Global Finance Dashboard, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>

                                <h3 class="mt-4">2. Description of Service</h3>
                                <p>Global Finance Dashboard is a personal financial management tool that helps you:</p>
                                <ul>
                                    <li>Track income and expenses</li>
                                    <li>Manage multiple currencies</li>
                                    <li>Generate financial reports</li>
                                    <li>Set and monitor financial goals</li>
                                </ul>

                                <h3 class="mt-4">3. User Responsibilities</h3>
                                <p>As a user of our service, you agree to:</p>
                                <ul>
                                    <li>Provide accurate and complete information</li>
                                    <li>Keep your account credentials secure</li>
                                    <li>Use the service for lawful purposes only</li>
                                    <li>Not attempt to compromise the security of the service</li>
                                </ul>

                                <h3 class="mt-4">4. Data and Privacy</h3>
                                <p>Your financial data is stored locally in your browser and is not transmitted to our servers. You are responsible for backing up your data. We recommend regularly exporting your data for safekeeping.</p>

                                <h3 class="mt-4">5. Limitation of Liability</h3>
                                <p>This service is provided "as is" without any representations or warranties. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.</p>

                                <h3 class="mt-4">6. Modifications to Service</h3>
                                <p>We reserve the right to modify or discontinue, temporarily or permanently, the service with or without notice. We shall not be liable to you or to any third party for any modification, suspension, or discontinuance of the service.</p>

                                <h3 class="mt-4">7. Termination</h3>
                                <p>You may terminate your use of the service at any time. We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever.</p>

                                <h3 class="mt-4">8. Contact Information</h3>
                                <p>Questions about the Terms of Service should be sent to us at:</p>
                                <div class="alert alert-primary">
                                    <i class="fas fa-envelope me-2"></i>
                                    Email: <a href="mailto:rabbilslmqtr@gmail.com">rabbilslmqtr@gmail.com</a>
                                </div>

                                <div class="alert alert-info mt-4">
                                    <i class="fas fa-info-circle me-2"></i>
                                    <strong>Note:</strong> By continuing to use this service, you agree to these terms. If you have any questions, please don't hesitate to contact us.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
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
