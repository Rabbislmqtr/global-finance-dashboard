// Data Manager for localStorage operations
class DataManager {
    constructor() {
        this.keys = {
            users: 'finance_app_users',
            transactions: 'finance_app_transactions',
            categories: 'finance_app_categories',
            settings: 'finance_app_settings'
        };
        
        this.initializeDefaultData();
    }
    
    initializeDefaultData() {
        // Initialize default categories if they don't exist
        if (!this.getCategories().length) {
            this.initializeDefaultCategories();
        }
    }
    
    initializeDefaultCategories() {
        const defaultCategories = [
            // Income Categories
            { id: 'salary', name: 'Salary', type: 'income', icon: 'fas fa-briefcase', color: '#28a745' },
            { id: 'freelance', name: 'Freelance', type: 'income', icon: 'fas fa-laptop-code', color: '#17a2b8' },
            { id: 'investment', name: 'Investment', type: 'income', icon: 'fas fa-chart-line', color: '#ffc107' },
            { id: 'bonus', name: 'Bonus', type: 'income', icon: 'fas fa-gift', color: '#28a745' },
            { id: 'rental', name: 'Rental Income', type: 'income', icon: 'fas fa-home', color: '#6f42c1' },
            { id: 'business', name: 'Business', type: 'income', icon: 'fas fa-store', color: '#fd7e14' },
            { id: 'other_income', name: 'Other Income', type: 'income', icon: 'fas fa-plus-circle', color: '#20c997' },
            
            // Expense Categories
            { id: 'food', name: 'Food & Dining', type: 'expense', icon: 'fas fa-utensils', color: '#dc3545' },
            { id: 'transport', name: 'Transportation', type: 'expense', icon: 'fas fa-car', color: '#6c757d' },
            { id: 'housing', name: 'Housing', type: 'expense', icon: 'fas fa-home', color: '#e83e8c' },
            { id: 'utilities', name: 'Utilities', type: 'expense', icon: 'fas fa-bolt', color: '#fd7e14' },
            { id: 'healthcare', name: 'Healthcare', type: 'expense', icon: 'fas fa-heartbeat', color: '#dc3545' },
            { id: 'entertainment', name: 'Entertainment', type: 'expense', icon: 'fas fa-film', color: '#6f42c1' },
            { id: 'shopping', name: 'Shopping', type: 'expense', icon: 'fas fa-shopping-bag', color: '#e83e8c' },
            { id: 'education', name: 'Education', type: 'expense', icon: 'fas fa-graduation-cap', color: '#17a2b8' },
            { id: 'insurance', name: 'Insurance', type: 'expense', icon: 'fas fa-shield-alt', color: '#6c757d' },
            { id: 'savings', name: 'Savings', type: 'expense', icon: 'fas fa-piggy-bank', color: '#28a745' },
            { id: 'debt', name: 'Debt Payment', type: 'expense', icon: 'fas fa-credit-card', color: '#dc3545' },
            { id: 'travel', name: 'Travel', type: 'expense', icon: 'fas fa-plane', color: '#17a2b8' },
            { id: 'other_expense', name: 'Other Expenses', type: 'expense', icon: 'fas fa-minus-circle', color: '#6c757d' }
        ];
        
        this.saveCategories(defaultCategories);
    }
    
    // Generic storage methods
    getData(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
    
    setData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }
    
    removeData(key) {
        localStorage.removeItem(key);
    }
    
    // User data methods
    getUsers() {
        return this.getData(this.keys.users) || [];
    }
    
    saveUsers(users) {
        this.setData(this.keys.users, users);
    }
    
    // Transaction methods
    getTransactions(userId = null) {
        const allTransactions = this.getData(this.keys.transactions) || [];
        return userId ? allTransactions.filter(t => t.user_id === userId) : allTransactions;
    }
    
    saveTransaction(transaction) {
        const transactions = this.getTransactions();
        const existingIndex = transactions.findIndex(t => t.id === transaction.id);
        
        if (existingIndex >= 0) {
            transactions[existingIndex] = transaction;
        } else {
            transaction.id = transaction.id || this.generateId();
            transaction.created_at = transaction.created_at || new Date().toISOString();
            transactions.push(transaction);
        }
        
        this.setData(this.keys.transactions, transactions);
        return transaction;
    }
    
    deleteTransaction(id) {
        const transactions = this.getTransactions();
        const filteredTransactions = transactions.filter(t => t.id !== id);
        this.setData(this.keys.transactions, filteredTransactions);
    }
    
    // Category methods
    getCategories() {
        return this.getData(this.keys.categories) || [];
    }
    
    saveCategories(categories) {
        this.setData(this.keys.categories, categories);
    }
    
    getCategoryById(id) {
        const categories = this.getCategories();
        return categories.find(c => c.id === id);
    }
    
    getCategoriesByType(type) {
        const categories = this.getCategories();
        return categories.filter(c => c.type === type);
    }
    
    // Settings methods
    getSettings() {
        return this.getData(this.keys.settings) || {};
    }
    
    saveSetting(key, value) {
        const settings = this.getSettings();
        settings[key] = value;
        this.setData(this.keys.settings, settings);
    }
    
    getSetting(key, defaultValue = null) {
        const settings = this.getSettings();
        return settings[key] !== undefined ? settings[key] : defaultValue;
    }
    
    // Analytics methods
    getTransactionSummary(userId, startDate = null, endDate = null) {
        const transactions = this.getTransactions(userId);
        let filteredTransactions = transactions;
        
        // Filter by date range if provided
        if (startDate || endDate) {
            filteredTransactions = transactions.filter(t => {
                const transactionDate = new Date(t.date);
                if (startDate && transactionDate < new Date(startDate)) return false;
                if (endDate && transactionDate > new Date(endDate)) return false;
                return true;
            });
        }
        
        const summary = {
            totalIncome: 0,
            totalExpense: 0,
            totalTransactions: filteredTransactions.length,
            incomeTransactions: 0,
            expenseTransactions: 0,
            categoryBreakdown: {},
            monthlyData: {}
        };
        
        filteredTransactions.forEach(transaction => {
            const amount = parseFloat(transaction.amount) || 0;
            const category = this.getCategoryById(transaction.category_id);
            const type = category ? category.type : 'expense';
            const month = new Date(transaction.date).toISOString().substr(0, 7); // YYYY-MM
            
            if (type === 'income') {
                summary.totalIncome += amount;
                summary.incomeTransactions++;
            } else {
                summary.totalExpense += amount;
                summary.expenseTransactions++;
            }
            
            // Category breakdown
            const categoryName = category ? category.name : 'Unknown';
            if (!summary.categoryBreakdown[categoryName]) {
                summary.categoryBreakdown[categoryName] = {
                    amount: 0,
                    count: 0,
                    type: type,
                    color: category ? category.color : '#6c757d'
                };
            }
            summary.categoryBreakdown[categoryName].amount += amount;
            summary.categoryBreakdown[categoryName].count++;
            
            // Monthly data
            if (!summary.monthlyData[month]) {
                summary.monthlyData[month] = { income: 0, expense: 0 };
            }
            summary.monthlyData[month][type] += amount;
        });
        
        summary.netIncome = summary.totalIncome - summary.totalExpense;
        
        return summary;
    }
    
    getRecentTransactions(userId, limit = 10) {
        const transactions = this.getTransactions(userId);
        return transactions
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, limit);
    }
    
    // Utility methods
    generateId() {
        return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    formatCurrency(amount, currencyCode = 'USD') {
        const currencySymbols = {
            'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'AUD': 'A$', 'CAD': 'C$',
            'CHF': 'CHF', 'CNY': '¥', 'INR': '₹', 'BDT': '৳', 'QAR': 'ر.ق',
            'AED': 'د.إ', 'SAR': 'ر.س', 'KWD': 'د.ك', 'BHD': '.د.ب', 'OMR': 'ر.ع.',
            'JOD': 'د.ا', 'LBP': 'ل.ل', 'EGP': 'ج.م', 'TRY': '₺', 'IRR': '﷼',
            'IQD': 'ع.د', 'SYP': 'ل.س', 'YER': '﷼', 'MAD': 'د.م.', 'TND': 'د.ت',
            'DZD': 'د.ج', 'LYD': 'ل.د', 'SDG': 'ج.س.', 'PKR': '₨', 'AFN': '؋',
            'KRW': '₩', 'THB': '฿', 'VND': '₫', 'PHP': '₱', 'IDR': 'Rp',
            'MYR': 'RM', 'SGD': 'S$', 'HKD': 'HK$', 'TWD': 'NT$', 'NZD': 'NZ$',
            'ZAR': 'R', 'NGN': '₦', 'KES': 'KSh', 'GHS': '₵', 'ETB': 'Br',
            'BRL': 'R$', 'ARS': '$', 'CLP': '$', 'COP': '$', 'PEN': 'S/'
        };
        
        const symbol = currencySymbols[currencyCode] || currencyCode;
        const formattedAmount = parseFloat(amount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        
        return `${symbol}${formattedAmount}`;
    }
    
    // Export/Import methods
    exportData(userId = null) {
        const data = {
            transactions: this.getTransactions(userId),
            categories: this.getCategories(),
            settings: this.getSettings(),
            exportDate: new Date().toISOString()
        };
        
        if (!userId) {
            data.users = this.getUsers();
        }
        
        return JSON.stringify(data, null, 2);
    }
    
    importData(jsonData, userId = null) {
        try {
            const data = JSON.parse(jsonData);
            
            if (data.transactions) {
                const currentTransactions = this.getTransactions();
                const newTransactions = userId 
                    ? data.transactions.map(t => ({ ...t, user_id: userId }))
                    : data.transactions;
                    
                // Merge transactions, avoiding duplicates
                const allTransactions = [...currentTransactions];
                newTransactions.forEach(newTrans => {
                    if (!allTransactions.find(t => t.id === newTrans.id)) {
                        allTransactions.push(newTrans);
                    }
                });
                
                this.setData(this.keys.transactions, allTransactions);
            }
            
            if (data.categories) {
                // Merge categories
                const currentCategories = this.getCategories();
                const newCategories = data.categories;
                const allCategories = [...currentCategories];
                
                newCategories.forEach(newCat => {
                    if (!allCategories.find(c => c.id === newCat.id)) {
                        allCategories.push(newCat);
                    }
                });
                
                this.saveCategories(allCategories);
            }
            
            if (data.settings) {
                const currentSettings = this.getSettings();
                this.setData(this.keys.settings, { ...currentSettings, ...data.settings });
            }
            
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
    
    // Clear all data (for development/testing)
    clearAllData() {
        Object.values(this.keys).forEach(key => {
            this.removeData(key);
        });
        this.initializeDefaultData();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
}
