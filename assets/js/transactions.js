// Transactions Manager
class TransactionManager {
    constructor() {
        this.data = null;
        this.currentFilter = 'all';
        this.currentSort = 'date_desc';
        this.editingTransaction = null;
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
                                    <i class="fas fa-exchange-alt me-2 text-primary"></i>
                                    Transactions
                                </h1>
                                <p class="text-muted mb-0">Manage your income and expenses</p>
                            </div>
                            <button class="btn btn-primary" onclick="transactions.showAddForm()">
                                <i class="fas fa-plus me-1"></i>Add Transaction
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Filters and Controls -->
                <div class="row mb-4">
                    <div class="col-lg-8">
                        <div class="card">
                            <div class="card-body">
                                <div class="row g-3">
                                    <div class="col-md-3">
                                        <label class="form-label">Filter by Type</label>
                                        <select class="form-select" id="filterType" onchange="transactions.applyFilters()">
                                            <option value="all">All Transactions</option>
                                            <option value="income">Income Only</option>
                                            <option value="expense">Expenses Only</option>
                                        </select>
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label">Category</label>
                                        <select class="form-select" id="filterCategory" onchange="transactions.applyFilters()">
                                            <option value="all">All Categories</option>
                                        </select>
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label">Sort By</label>
                                        <select class="form-select" id="sortBy" onchange="transactions.applyFilters()">
                                            <option value="date_desc">Date (Newest)</option>
                                            <option value="date_asc">Date (Oldest)</option>
                                            <option value="amount_desc">Amount (High to Low)</option>
                                            <option value="amount_asc">Amount (Low to High)</option>
                                        </select>
                                    </div>
                                    <div class="col-md-3 d-flex align-items-end">
                                        <button class="btn btn-outline-secondary w-100" onclick="transactions.clearFilters()">
                                            <i class="fas fa-times me-1"></i>Clear Filters
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="card">
                            <div class="card-body text-center">
                                <div class="d-flex justify-content-around">
                                    <div>
                                        <h6 class="text-muted mb-1">Total Income</h6>
                                        <h5 class="text-success mb-0" id="totalIncome">$0.00</h5>
                                    </div>
                                    <div>
                                        <h6 class="text-muted mb-1">Total Expenses</h6>
                                        <h5 class="text-danger mb-0" id="totalExpenses">$0.00</h5>
                                    </div>
                                    <div>
                                        <h6 class="text-muted mb-1">Net</h6>
                                        <h5 class="mb-0" id="netAmount">$0.00</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Transactions List -->
                <div class="row">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-body">
                                <div id="transactions-list">
                                    <!-- Transactions will be populated here -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Add/Edit Transaction Modal -->
            <div class="modal fade" id="transactionModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modalTitle">Add Transaction</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="transaction-form" class="needs-validation" novalidate>
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="transactionType" class="form-label">
                                            <i class="fas fa-tags me-1"></i>Transaction Type
                                        </label>
                                        <select class="form-select" id="transactionType" required onchange="transactions.updateCategoriesDropdown()">
                                            <option value="">Select type...</option>
                                            <option value="income">Income</option>
                                            <option value="expense">Expense</option>
                                        </select>
                                        <div class="invalid-feedback">Please select a transaction type.</div>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="transactionCategory" class="form-label">
                                            <i class="fas fa-folder me-1"></i>Category
                                        </label>
                                        <select class="form-select" id="transactionCategory" required>
                                            <option value="">Select category...</option>
                                        </select>
                                        <div class="invalid-feedback">Please select a category.</div>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="transactionAmount" class="form-label">
                                            <i class="fas fa-dollar-sign me-1"></i>Amount (${user.currency})
                                        </label>
                                        <input type="number" class="form-control" id="transactionAmount" 
                                               step="0.01" min="0" required>
                                        <div class="invalid-feedback">Please enter a valid amount.</div>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="transactionDate" class="form-label">
                                            <i class="fas fa-calendar me-1"></i>Date
                                        </label>
                                        <input type="date" class="form-control" id="transactionDate" required>
                                        <div class="invalid-feedback">Please select a date.</div>
                                    </div>
                                </div>
                                
                                <div class="mb-3">
                                    <label for="transactionDescription" class="form-label">
                                        <i class="fas fa-sticky-note me-1"></i>Description
                                    </label>
                                    <textarea class="form-control" id="transactionDescription" 
                                              rows="3" placeholder="Optional description..."></textarea>
                                </div>
                                
                                <div class="mb-3">
                                    <label for="transactionNotes" class="form-label">
                                        <i class="fas fa-comment me-1"></i>Notes
                                    </label>
                                    <textarea class="form-control" id="transactionNotes" 
                                              rows="2" placeholder="Additional notes..."></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" onclick="transactions.saveTransaction()">
                                <i class="fas fa-save me-1"></i>Save Transaction
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.loadTransactions();
        this.populateCategories();
        this.setupDateDefault();
    }
    
    loadTransactions() {
        const user = window.app.currentUser;
        if (!user || !window.app.data) return;
        
        const transactions = window.app.data.getTransactions(user.id);
        this.displayTransactions(transactions);
        this.updateSummary(transactions);
    }
    
    displayTransactions(transactions) {
        const container = document.getElementById('transactions-list');
        const user = window.app.currentUser;
        const formatCurrency = (amount) => window.app.data.formatCurrency(amount, user.currency);
        
        if (transactions.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-receipt text-muted" style="font-size: 4rem; margin-bottom: 1rem;"></i>
                    <h4 class="text-muted">No transactions found</h4>
                    <p class="text-muted mb-3">Start tracking your finances by adding your first transaction.</p>
                    <button class="btn btn-primary" onclick="transactions.showAddForm()">
                        <i class="fas fa-plus me-2"></i>Add Your First Transaction
                    </button>
                </div>
            `;
            return;
        }
        
        // Sort transactions
        const sortedTransactions = this.sortTransactions(transactions);
        
        let html = '<div class="table-responsive"><table class="table table-hover">';
        html += `
            <thead class="table-light">
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th class="text-end">Amount</th>
                    <th class="text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
        `;
        
        sortedTransactions.forEach(transaction => {
            const category = window.app.data.getCategoryById(transaction.category_id);
            const isIncome = category && category.type === 'income';
            const date = new Date(transaction.date).toLocaleDateString();
            
            html += `
                <tr>
                    <td>${date}</td>
                    <td>
                        <div>
                            <strong>${transaction.description || 'No description'}</strong>
                            ${transaction.notes ? `<br><small class="text-muted">${transaction.notes}</small>` : ''}
                        </div>
                    </td>
                    <td>
                        <span class="badge rounded-pill" style="background-color: ${category ? category.color : '#6c757d'};">
                            <i class="${category ? category.icon : 'fas fa-circle'} me-1"></i>
                            ${category ? category.name : 'Unknown'}
                        </span>
                    </td>
                    <td>
                        <span class="badge ${isIncome ? 'bg-success' : 'bg-danger'}">
                            ${isIncome ? 'Income' : 'Expense'}
                        </span>
                    </td>
                    <td class="text-end">
                        <strong class="${isIncome ? 'text-success' : 'text-danger'}">
                            ${isIncome ? '+' : '-'}${formatCurrency(Math.abs(transaction.amount))}
                        </strong>
                    </td>
                    <td class="text-center">
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-primary" onclick="transactions.editTransaction('${transaction.id}')" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-outline-danger" onclick="transactions.deleteTransaction('${transaction.id}')" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        html += '</tbody></table></div>';
        container.innerHTML = html;
    }
    
    sortTransactions(transactions) {
        const [field, direction] = this.currentSort.split('_');
        
        return [...transactions].sort((a, b) => {
            let comparison = 0;
            
            switch (field) {
                case 'date':
                    comparison = new Date(a.date) - new Date(b.date);
                    break;
                case 'amount':
                    comparison = parseFloat(a.amount) - parseFloat(b.amount);
                    break;
                default:
                    comparison = 0;
            }
            
            return direction === 'desc' ? -comparison : comparison;
        });
    }
    
    updateSummary(transactions) {
        const user = window.app.currentUser;
        const formatCurrency = (amount) => window.app.data.formatCurrency(amount, user.currency);
        
        let totalIncome = 0;
        let totalExpenses = 0;
        
        transactions.forEach(transaction => {
            const category = window.app.data.getCategoryById(transaction.category_id);
            const isIncome = category && category.type === 'income';
            const amount = parseFloat(transaction.amount) || 0;
            
            if (isIncome) {
                totalIncome += amount;
            } else {
                totalExpenses += amount;
            }
        });
        
        const netAmount = totalIncome - totalExpenses;
        
        document.getElementById('totalIncome').textContent = formatCurrency(totalIncome);
        document.getElementById('totalExpenses').textContent = formatCurrency(totalExpenses);
        
        const netElement = document.getElementById('netAmount');
        netElement.textContent = formatCurrency(netAmount);
        netElement.className = netAmount >= 0 ? 'text-success mb-0' : 'text-danger mb-0';
    }
    
    populateCategories() {
        const categories = window.app.data.getCategories();
        const filterCategory = document.getElementById('filterCategory');
        
        // Clear existing options except "All Categories"
        filterCategory.innerHTML = '<option value="all">All Categories</option>';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = `${category.name} (${category.type})`;
            filterCategory.appendChild(option);
        });
    }
    
    updateCategoriesDropdown() {
        const type = document.getElementById('transactionType').value;
        const categorySelect = document.getElementById('transactionCategory');
        
        categorySelect.innerHTML = '<option value="">Select category...</option>';
        
        if (type) {
            const categories = window.app.data.getCategoriesByType(type);
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        }
    }
    
    setupDateDefault() {
        const dateInput = document.getElementById('transactionDate');
        if (dateInput) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }
    }
    
    showAddForm() {
        this.editingTransaction = null;
        document.getElementById('modalTitle').textContent = 'Add Transaction';
        document.getElementById('transaction-form').reset();
        this.setupDateDefault();
        
        const modal = new bootstrap.Modal(document.getElementById('transactionModal'));
        modal.show();
    }
    
    editTransaction(id) {
        const user = window.app.currentUser;
        const transactions = window.app.data.getTransactions(user.id);
        const transaction = transactions.find(t => t.id === id);
        
        if (!transaction) return;
        
        this.editingTransaction = transaction;
        document.getElementById('modalTitle').textContent = 'Edit Transaction';
        
        // Populate form
        const category = window.app.data.getCategoryById(transaction.category_id);
        const type = category ? category.type : 'expense';
        
        document.getElementById('transactionType').value = type;
        this.updateCategoriesDropdown();
        document.getElementById('transactionCategory').value = transaction.category_id;
        document.getElementById('transactionAmount').value = transaction.amount;
        document.getElementById('transactionDate').value = transaction.date;
        document.getElementById('transactionDescription').value = transaction.description || '';
        document.getElementById('transactionNotes').value = transaction.notes || '';
        
        const modal = new bootstrap.Modal(document.getElementById('transactionModal'));
        modal.show();
    }
    
    saveTransaction() {
        const form = document.getElementById('transaction-form');
        
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }
        
        const user = window.app.currentUser;
        const transactionData = {
            user_id: user.id,
            category_id: document.getElementById('transactionCategory').value,
            amount: parseFloat(document.getElementById('transactionAmount').value),
            date: document.getElementById('transactionDate').value,
            description: document.getElementById('transactionDescription').value.trim(),
            notes: document.getElementById('transactionNotes').value.trim()
        };
        
        if (this.editingTransaction) {
            transactionData.id = this.editingTransaction.id;
            transactionData.created_at = this.editingTransaction.created_at;
            transactionData.updated_at = new Date().toISOString();
        }
        
        window.app.data.saveTransaction(transactionData);
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('transactionModal'));
        modal.hide();
        
        // Refresh the list
        this.loadTransactions();
        
        // Show success message
        const message = this.editingTransaction ? 'Transaction updated successfully!' : 'Transaction added successfully!';
        window.app.showMessage(message, 'success');
        
        this.editingTransaction = null;
    }
    
    deleteTransaction(id) {
        if (confirm('Are you sure you want to delete this transaction? This action cannot be undone.')) {
            window.app.data.deleteTransaction(id);
            this.loadTransactions();
            window.app.showMessage('Transaction deleted successfully!', 'info');
        }
    }
    
    applyFilters() {
        const user = window.app.currentUser;
        let transactions = window.app.data.getTransactions(user.id);
        
        // Apply type filter
        const typeFilter = document.getElementById('filterType').value;
        if (typeFilter !== 'all') {
            transactions = transactions.filter(transaction => {
                const category = window.app.data.getCategoryById(transaction.category_id);
                return category && category.type === typeFilter;
            });
        }
        
        // Apply category filter
        const categoryFilter = document.getElementById('filterCategory').value;
        if (categoryFilter !== 'all') {
            transactions = transactions.filter(transaction => 
                transaction.category_id === categoryFilter
            );
        }
        
        // Update sort
        this.currentSort = document.getElementById('sortBy').value;
        
        this.displayTransactions(transactions);
        this.updateSummary(transactions);
    }
    
    clearFilters() {
        document.getElementById('filterType').value = 'all';
        document.getElementById('filterCategory').value = 'all';
        document.getElementById('sortBy').value = 'date_desc';
        this.currentSort = 'date_desc';
        this.loadTransactions();
    }
}

// Global transaction functions
const transactions = new TransactionManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TransactionManager;
}
