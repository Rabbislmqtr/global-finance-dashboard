// Dashboard Manager
class DashboardManager {
    constructor() {
        this.data = null;
        this.charts = {};
    }
    
    setDataManager(dataManager) {
        this.data = dataManager;
    }
    
    show() {
        const user = window.app.currentUser;
        if (!user) return;
        
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="container-fluid">
                <!-- Dashboard Header -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h1 class="h3 mb-0">
                                    <i class="fas fa-tachometer-alt me-2 text-primary"></i>
                                    Dashboard
                                </h1>
                                <p class="text-muted mb-0">Welcome back, ${user.first_name}!</p>
                            </div>
                            <div class="d-flex gap-2">
                                <button class="btn btn-outline-primary" onclick="dashboard.refreshData()">
                                    <i class="fas fa-sync-alt me-1"></i>Refresh
                                </button>
                                <button class="btn btn-primary" data-page="transactions">
                                    <i class="fas fa-plus me-1"></i>Add Transaction
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Summary Cards -->
                <div class="row mb-4" id="summary-cards">
                    <!-- Cards will be populated by JavaScript -->
                </div>
                
                <!-- Charts Row -->
                <div class="row mb-4">
                    <div class="col-lg-8">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-chart-line me-2"></i>
                                    Monthly Overview
                                </h5>
                            </div>
                            <div class="card-body">
                                <canvas id="monthlyChart" height="100"></canvas>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-chart-pie me-2"></i>
                                    Expenses by Category
                                </h5>
                            </div>
                            <div class="card-body">
                                <canvas id="categoryChart" height="200"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Recent Transactions -->
                <div class="row">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-history me-2"></i>
                                    Recent Transactions
                                </h5>
                                <a href="#" data-page="transactions" class="btn btn-sm btn-outline-primary">
                                    View All <i class="fas fa-arrow-right ms-1"></i>
                                </a>
                            </div>
                            <div class="card-body">
                                <div id="recent-transactions">
                                    <!-- Recent transactions will be populated by JavaScript -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.loadDashboardData();
    }
    
    loadDashboardData() {
        const user = window.app.currentUser;
        if (!user || !window.app.data) return;
        
        const summary = window.app.data.getTransactionSummary(user.id);
        const recentTransactions = window.app.data.getRecentTransactions(user.id, 5);
        
        this.populateSummaryCards(summary, user.currency);
        this.populateRecentTransactions(recentTransactions, user.currency);
        this.createCharts(summary, user.currency);
    }
    
    populateSummaryCards(summary, currency) {
        const summaryCards = document.getElementById('summary-cards');
        const formatCurrency = (amount) => window.app.data.formatCurrency(amount, currency);
        
        summaryCards.innerHTML = `
            <div class="col-lg-3 col-md-6 mb-3">
                <div class="card summary-card income">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h6 class="card-subtitle mb-1 text-muted">Total Income</h6>
                                <h4 class="card-title mb-0">${formatCurrency(summary.totalIncome)}</h4>
                                <small class="text-success">
                                    <i class="fas fa-arrow-up me-1"></i>
                                    ${summary.incomeTransactions} transactions
                                </small>
                            </div>
                            <div class="summary-icon income">
                                <i class="fas fa-arrow-up"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-lg-3 col-md-6 mb-3">
                <div class="card summary-card expense">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h6 class="card-subtitle mb-1 text-muted">Total Expenses</h6>
                                <h4 class="card-title mb-0">${formatCurrency(summary.totalExpense)}</h4>
                                <small class="text-danger">
                                    <i class="fas fa-arrow-down me-1"></i>
                                    ${summary.expenseTransactions} transactions
                                </small>
                            </div>
                            <div class="summary-icon expense">
                                <i class="fas fa-arrow-down"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-lg-3 col-md-6 mb-3">
                <div class="card summary-card ${summary.netIncome >= 0 ? 'income' : 'expense'}">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h6 class="card-subtitle mb-1 text-muted">Net Balance</h6>
                                <h4 class="card-title mb-0">${formatCurrency(summary.netIncome)}</h4>
                                <small class="${summary.netIncome >= 0 ? 'text-success' : 'text-danger'}">
                                    <i class="fas fa-${summary.netIncome >= 0 ? 'plus' : 'minus'} me-1"></i>
                                    ${summary.netIncome >= 0 ? 'Profit' : 'Loss'}
                                </small>
                            </div>
                            <div class="summary-icon ${summary.netIncome >= 0 ? 'income' : 'expense'}">
                                <i class="fas fa-balance-scale"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-lg-3 col-md-6 mb-3">
                <div class="card summary-card neutral">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h6 class="card-subtitle mb-1 text-muted">Total Transactions</h6>
                                <h4 class="card-title mb-0">${summary.totalTransactions}</h4>
                                <small class="text-info">
                                    <i class="fas fa-exchange-alt me-1"></i>
                                    This month
                                </small>
                            </div>
                            <div class="summary-icon neutral">
                                <i class="fas fa-list"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    populateRecentTransactions(transactions, currency) {
        const container = document.getElementById('recent-transactions');
        const formatCurrency = (amount) => window.app.data.formatCurrency(amount, currency);
        
        if (transactions.length === 0) {
            container.innerHTML = `
                <div class="text-center py-4">
                    <i class="fas fa-receipt text-muted" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <h5 class="text-muted">No transactions yet</h5>
                    <p class="text-muted mb-3">Start tracking your finances by adding your first transaction.</p>
                    <button class="btn btn-primary" data-page="transactions">
                        <i class="fas fa-plus me-2"></i>Add Transaction
                    </button>
                </div>
            `;
            return;
        }
        
        let html = '<div class="list-group list-group-flush">';
        
        transactions.forEach(transaction => {
            const category = window.app.data.getCategoryById(transaction.category_id);
            const isIncome = category && category.type === 'income';
            const date = new Date(transaction.date).toLocaleDateString();
            
            html += `
                <div class="list-group-item d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <div class="transaction-icon ${isIncome ? 'income' : 'expense'} me-3">
                            <i class="${category ? category.icon : 'fas fa-circle'}"></i>
                        </div>
                        <div>
                            <h6 class="mb-1">${transaction.description || 'No description'}</h6>
                            <small class="text-muted">
                                ${category ? category.name : 'Unknown Category'} • ${date}
                            </small>
                        </div>
                    </div>
                    <div class="text-end">
                        <span class="h6 mb-0 ${isIncome ? 'text-success' : 'text-danger'}">
                            ${isIncome ? '+' : '-'}${formatCurrency(Math.abs(transaction.amount))}
                        </span>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }
    
    createCharts(summary, currency) {
        this.createMonthlyChart(summary, currency);
        this.createCategoryChart(summary);
    }
    
    createMonthlyChart(summary, currency) {
        const ctx = document.getElementById('monthlyChart');
        if (!ctx) return;
        
        // Destroy existing chart if it exists
        if (this.charts.monthly) {
            this.charts.monthly.destroy();
        }
        
        // Prepare data for the last 6 months
        const months = [];
        const incomeData = [];
        const expenseData = [];
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthKey = date.toISOString().substr(0, 7);
            const monthLabel = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            
            months.push(monthLabel);
            incomeData.push(summary.monthlyData[monthKey]?.income || 0);
            expenseData.push(summary.monthlyData[monthKey]?.expense || 0);
        }
        
        this.charts.monthly = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Income',
                    data: incomeData,
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Expenses',
                    data: expenseData,
                    borderColor: '#dc3545',
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + 
                                       window.app.data.formatCurrency(context.raw, currency);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return window.app.data.formatCurrency(value, currency);
                            }
                        }
                    }
                }
            }
        });
    }
    
    createCategoryChart(summary) {
        const ctx = document.getElementById('categoryChart');
        if (!ctx) return;
        
        // Destroy existing chart if it exists
        if (this.charts.category) {
            this.charts.category.destroy();
        }
        
        // Prepare expense category data
        const expenseCategories = Object.entries(summary.categoryBreakdown)
            .filter(([name, data]) => data.type === 'expense')
            .sort((a, b) => b[1].amount - a[1].amount)
            .slice(0, 8); // Top 8 categories
        
        if (expenseCategories.length === 0) {
            // Show placeholder when no data
            ctx.getContext('2d').fillText('No expense data available', 50, 50);
            return;
        }
        
        const labels = expenseCategories.map(([name]) => name);
        const data = expenseCategories.map(([name, data]) => data.amount);
        const colors = expenseCategories.map(([name, data]) => data.color);
        
        this.charts.category = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.raw / total) * 100).toFixed(1);
                                return context.label + ': ' + 
                                       window.app.data.formatCurrency(context.raw, window.app.currentUser.currency) +
                                       ' (' + percentage + '%)';
                            }
                        }
                    }
                }
            }
        });
    }
    
    refreshData() {
        if (window.app.currentUser) {
            this.loadDashboardData();
            if (window.app) {
                window.app.showMessage('Dashboard data refreshed', 'success');
            }
        }
    }
}

// Global function for dashboard refresh
function refreshDashboard() {
    if (window.app && window.app.dashboard) {
        window.app.dashboard.refreshData();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardManager;
}
