// Reports Manager
class ReportsManager {
    constructor() {
        this.data = null;
        this.charts = {};
        this.currentDateRange = '30'; // Default to last 30 days
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
                <!-- Header -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h1 class="h3 mb-0">
                                    <i class="fas fa-chart-bar me-2 text-primary"></i>
                                    Financial Reports
                                </h1>
                                <p class="text-muted mb-0">Analyze your financial patterns and trends</p>
                            </div>
                            <div class="d-flex gap-2">
                                <select class="form-select" id="dateRange" onchange="reports.updateDateRange()">
                                    <option value="7">Last 7 days</option>
                                    <option value="30" selected>Last 30 days</option>
                                    <option value="90">Last 3 months</option>
                                    <option value="365">Last year</option>
                                    <option value="all">All time</option>
                                </select>
                                <button class="btn btn-outline-primary" onclick="reports.refreshReports()">
                                    <i class="fas fa-sync-alt me-1"></i>Refresh
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Summary Cards -->
                <div class="row mb-4" id="report-summary">
                    <!-- Summary cards will be populated here -->
                </div>
                
                <!-- Charts Row 1 -->
                <div class="row mb-4">
                    <div class="col-lg-8">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-chart-line me-2"></i>
                                    Income vs Expenses Over Time
                                </h5>
                            </div>
                            <div class="card-body">
                                <canvas id="timelineChart" height="100"></canvas>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-chart-pie me-2"></i>
                                    Income Categories
                                </h5>
                            </div>
                            <div class="card-body">
                                <canvas id="incomeCategoryChart" height="200"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Charts Row 2 -->
                <div class="row mb-4">
                    <div class="col-lg-4">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-chart-doughnut me-2"></i>
                                    Expense Categories
                                </h5>
                            </div>
                            <div class="card-body">
                                <canvas id="expenseCategoryChart" height="200"></canvas>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-8">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-chart-bar me-2"></i>
                                    Monthly Comparison
                                </h5>
                            </div>
                            <div class="card-body">
                                <canvas id="monthlyComparisonChart" height="100"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Category Breakdown Table -->
                <div class="row">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-table me-2"></i>
                                    Category Breakdown
                                </h5>
                            </div>
                            <div class="card-body">
                                <div id="category-breakdown-table">
                                    <!-- Table will be populated here -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.loadReports();
    }
    
    loadReports() {
        const user = window.app.currentUser;
        if (!user || !window.app.data) return;
        
        const { startDate, endDate } = this.getDateRange();
        const summary = window.app.data.getTransactionSummary(user.id, startDate, endDate);
        
        this.populateSummaryCards(summary, user.currency);
        this.createTimelineChart(summary, user.currency);
        this.createCategoryCharts(summary, user.currency);
        this.createMonthlyComparisonChart(summary, user.currency);
        this.createCategoryBredownTable(summary, user.currency);
    }
    
    getDateRange() {
        let startDate = null;
        let endDate = new Date();
        
        if (this.currentDateRange !== 'all') {
            startDate = new Date();
            startDate.setDate(startDate.getDate() - parseInt(this.currentDateRange));
        }
        
        return { startDate, endDate };
    }
    
    populateSummaryCards(summary, currency) {
        const container = document.getElementById('report-summary');
        const formatCurrency = (amount) => window.app.data.formatCurrency(amount, currency);
        
        const avgTransaction = summary.totalTransactions > 0 ? 
            (summary.totalIncome + summary.totalExpense) / summary.totalTransactions : 0;
        
        const savingsRate = summary.totalIncome > 0 ? 
            ((summary.totalIncome - summary.totalExpense) / summary.totalIncome * 100) : 0;
        
        container.innerHTML = `
            <div class="col-lg-3 col-md-6 mb-3">
                <div class="card report-card">
                    <div class="card-body text-center">
                        <i class="fas fa-wallet text-primary mb-2" style="font-size: 2rem;"></i>
                        <h6 class="card-subtitle text-muted">Net Income</h6>
                        <h4 class="card-title ${summary.netIncome >= 0 ? 'text-success' : 'text-danger'}">
                            ${formatCurrency(summary.netIncome)}
                        </h4>
                        <small class="text-muted">${this.getDateRangeText()}</small>
                    </div>
                </div>
            </div>
            
            <div class="col-lg-3 col-md-6 mb-3">
                <div class="card report-card">
                    <div class="card-body text-center">
                        <i class="fas fa-calculator text-info mb-2" style="font-size: 2rem;"></i>
                        <h6 class="card-subtitle text-muted">Avg Transaction</h6>
                        <h4 class="card-title text-info">
                            ${formatCurrency(avgTransaction)}
                        </h4>
                        <small class="text-muted">${summary.totalTransactions} transactions</small>
                    </div>
                </div>
            </div>
            
            <div class="col-lg-3 col-md-6 mb-3">
                <div class="card report-card">
                    <div class="card-body text-center">
                        <i class="fas fa-percentage text-warning mb-2" style="font-size: 2rem;"></i>
                        <h6 class="card-subtitle text-muted">Savings Rate</h6>
                        <h4 class="card-title ${savingsRate >= 0 ? 'text-success' : 'text-danger'}">
                            ${savingsRate.toFixed(1)}%
                        </h4>
                        <small class="text-muted">${savingsRate >= 0 ? 'Good' : 'Overspending'}</small>
                    </div>
                </div>
            </div>
            
            <div class="col-lg-3 col-md-6 mb-3">
                <div class="card report-card">
                    <div class="card-body text-center">
                        <i class="fas fa-tags text-secondary mb-2" style="font-size: 2rem;"></i>
                        <h6 class="card-subtitle text-muted">Active Categories</h6>
                        <h4 class="card-title text-secondary">
                            ${Object.keys(summary.categoryBreakdown).length}
                        </h4>
                        <small class="text-muted">Categories used</small>
                    </div>
                </div>
            </div>
        `;
    }
    
    createTimelineChart(summary, currency) {
        const ctx = document.getElementById('timelineChart');
        if (!ctx) return;
        
        if (this.charts.timeline) {
            this.charts.timeline.destroy();
        }
        
        // Prepare monthly data
        const monthlyData = summary.monthlyData;
        const months = Object.keys(monthlyData).sort();
        const incomeData = months.map(month => monthlyData[month].income || 0);
        const expenseData = months.map(month => monthlyData[month].expense || 0);
        const netData = months.map(month => 
            (monthlyData[month].income || 0) - (monthlyData[month].expense || 0)
        );
        
        this.charts.timeline = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months.map(month => {
                    const date = new Date(month + '-01');
                    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                }),
                datasets: [{
                    label: 'Income',
                    data: incomeData,
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    tension: 0.4,
                    fill: false
                }, {
                    label: 'Expenses',
                    data: expenseData,
                    borderColor: '#dc3545',
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    tension: 0.4,
                    fill: false
                }, {
                    label: 'Net',
                    data: netData,
                    borderColor: '#17a2b8',
                    backgroundColor: 'rgba(23, 162, 184, 0.1)',
                    tension: 0.4,
                    fill: false
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
    
    createCategoryCharts(summary, currency) {
        this.createIncomeCategoryChart(summary, currency);
        this.createExpenseCategoryChart(summary, currency);
    }
    
    createIncomeCategoryChart(summary, currency) {
        const ctx = document.getElementById('incomeCategoryChart');
        if (!ctx) return;
        
        if (this.charts.incomeCategory) {
            this.charts.incomeCategory.destroy();
        }
        
        const incomeCategories = Object.entries(summary.categoryBreakdown)
            .filter(([name, data]) => data.type === 'income')
            .sort((a, b) => b[1].amount - a[1].amount);
        
        if (incomeCategories.length === 0) {
            ctx.getContext('2d').clearRect(0, 0, ctx.width, ctx.height);
            ctx.getContext('2d').fillText('No income data', 50, 50);
            return;
        }
        
        const labels = incomeCategories.map(([name]) => name);
        const data = incomeCategories.map(([name, data]) => data.amount);
        const colors = incomeCategories.map(([name, data]) => data.color);
        
        this.charts.incomeCategory = new Chart(ctx, {
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
                            padding: 10,
                            usePointStyle: true,
                            font: { size: 11 }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.raw / total) * 100).toFixed(1);
                                return context.label + ': ' + 
                                       window.app.data.formatCurrency(context.raw, currency) +
                                       ' (' + percentage + '%)';
                            }
                        }
                    }
                }
            }
        });
    }
    
    createExpenseCategoryChart(summary, currency) {
        const ctx = document.getElementById('expenseCategoryChart');
        if (!ctx) return;
        
        if (this.charts.expenseCategory) {
            this.charts.expenseCategory.destroy();
        }
        
        const expenseCategories = Object.entries(summary.categoryBreakdown)
            .filter(([name, data]) => data.type === 'expense')
            .sort((a, b) => b[1].amount - a[1].amount)
            .slice(0, 8); // Top 8 categories
        
        if (expenseCategories.length === 0) {
            ctx.getContext('2d').clearRect(0, 0, ctx.width, ctx.height);
            ctx.getContext('2d').fillText('No expense data', 50, 50);
            return;
        }
        
        const labels = expenseCategories.map(([name]) => name);
        const data = expenseCategories.map(([name, data]) => data.amount);
        const colors = expenseCategories.map(([name, data]) => data.color);
        
        this.charts.expenseCategory = new Chart(ctx, {
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
                            padding: 10,
                            usePointStyle: true,
                            font: { size: 11 }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.raw / total) * 100).toFixed(1);
                                return context.label + ': ' + 
                                       window.app.data.formatCurrency(context.raw, currency) +
                                       ' (' + percentage + '%)';
                            }
                        }
                    }
                }
            }
        });
    }
    
    createMonthlyComparisonChart(summary, currency) {
        const ctx = document.getElementById('monthlyComparisonChart');
        if (!ctx) return;
        
        if (this.charts.monthlyComparison) {
            this.charts.monthlyComparison.destroy();
        }
        
        // Get last 6 months for comparison
        const months = [];
        const incomeData = [];
        const expenseData = [];
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthKey = date.toISOString().substr(0, 7);
            const monthLabel = date.toLocaleDateString('en-US', { month: 'short' });
            
            months.push(monthLabel);
            incomeData.push(summary.monthlyData[monthKey]?.income || 0);
            expenseData.push(summary.monthlyData[monthKey]?.expense || 0);
        }
        
        this.charts.monthlyComparison = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [{
                    label: 'Income',
                    data: incomeData,
                    backgroundColor: 'rgba(40, 167, 69, 0.8)',
                    borderColor: '#28a745',
                    borderWidth: 1
                }, {
                    label: 'Expenses',
                    data: expenseData,
                    backgroundColor: 'rgba(220, 53, 69, 0.8)',
                    borderColor: '#dc3545',
                    borderWidth: 1
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
    
    createCategoryBredownTable(summary, currency) {
        const container = document.getElementById('category-breakdown-table');
        const formatCurrency = (amount) => window.app.data.formatCurrency(amount, currency);
        
        const categories = Object.entries(summary.categoryBreakdown)
            .sort((a, b) => b[1].amount - a[1].amount);
        
        if (categories.length === 0) {
            container.innerHTML = `
                <div class="text-center py-4">
                    <p class="text-muted">No category data available for the selected period.</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead class="table-light">
                        <tr>
                            <th>Category</th>
                            <th>Type</th>
                            <th class="text-end">Amount</th>
                            <th class="text-center">Transactions</th>
                            <th class="text-end">Avg per Transaction</th>
                            <th class="text-end">% of Total</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        const totalAmount = categories.reduce((sum, [name, data]) => sum + data.amount, 0);
        
        categories.forEach(([categoryName, data]) => {
            const percentage = totalAmount > 0 ? (data.amount / totalAmount * 100) : 0;
            const avgPerTransaction = data.count > 0 ? data.amount / data.count : 0;
            
            html += `
                <tr>
                    <td>
                        <span class="badge rounded-pill" style="background-color: ${data.color};">
                            ${categoryName}
                        </span>
                    </td>
                    <td>
                        <span class="badge ${data.type === 'income' ? 'bg-success' : 'bg-danger'}">
                            ${data.type === 'income' ? 'Income' : 'Expense'}
                        </span>
                    </td>
                    <td class="text-end">
                        <strong class="${data.type === 'income' ? 'text-success' : 'text-danger'}">
                            ${formatCurrency(data.amount)}
                        </strong>
                    </td>
                    <td class="text-center">${data.count}</td>
                    <td class="text-end">${formatCurrency(avgPerTransaction)}</td>
                    <td class="text-end">${percentage.toFixed(1)}%</td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
        `;
        
        container.innerHTML = html;
    }
    
    getDateRangeText() {
        switch (this.currentDateRange) {
            case '7': return 'Last 7 days';
            case '30': return 'Last 30 days';
            case '90': return 'Last 3 months';
            case '365': return 'Last year';
            case 'all': return 'All time';
            default: return 'Selected period';
        }
    }
    
    updateDateRange() {
        this.currentDateRange = document.getElementById('dateRange').value;
        this.loadReports();
    }
    
    refreshReports() {
        this.loadReports();
        window.app.showMessage('Reports refreshed successfully!', 'success');
    }
}

// Global reports functions
const reports = new ReportsManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReportsManager;
}
