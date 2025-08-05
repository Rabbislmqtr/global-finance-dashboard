# Global Finance Dashboard - Static Version

A comprehensive personal finance management application built with HTML5, CSS3, and JavaScript. This static version is designed to run on GitHub Pages without requiring any server-side processing.

## 🌟 Features

### Multi-Currency Support
- **50+ Currencies** including major global currencies
- **Special Support** for Middle Eastern, Asian, and African currencies
- **Real-time Display** in your selected currency
- **Localized Symbols** (৳, ر.ق, د.إ, ₹, etc.)

### Global Coverage
- **80+ Countries** supported
- **Regional Categories** for different spending patterns
- **Localized Experience** for global users

### Core Functionality
- **Dashboard** with real-time financial overview
- **Transaction Management** with income/expense tracking
- **Category System** with customizable categories
- **Advanced Reports** with interactive charts
- **Profile Management** with user preferences
- **Data Export/Import** for backup and portability

### Technical Features
- **Client-side Storage** using localStorage
- **Responsive Design** for all screen sizes
- **Bootstrap 5.3** for modern UI components
- **Chart.js** for interactive visualizations
- **No Server Required** - runs entirely in browser

## 🚀 Quick Start

### For GitHub Pages Deployment

1. **Fork or Download** this repository
2. **Upload to GitHub** (if downloaded)
3. **Enable GitHub Pages** in repository settings
4. **Visit your GitHub Pages URL**

### For Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/global-finance-dashboard-static.git
   cd global-finance-dashboard-static
   ```

2. **Serve locally** (optional - can also open index.html directly)
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   - Direct: `file:///path/to/index.html`
   - Local server: `http://localhost:8000`

## 📱 Demo Account

Try the application immediately with our demo account:

- **Email:** demo@example.com
- **Password:** demo123

## 🏗️ Project Structure

```
global-finance-dashboard-static/
├── index.html              # Main application file
├── assets/
│   ├── css/
│   │   └── style.css       # Custom styles and themes
│   └── js/
│       ├── app.js          # Main application controller
│       ├── auth.js         # Authentication manager
│       ├── data.js         # Data storage and management
│       ├── dashboard.js    # Dashboard functionality
│       ├── transactions.js # Transaction management
│       ├── profile.js      # Profile and settings
│       └── reports.js      # Reports and analytics
├── pages/                  # Support pages (optional)
│   ├── help-center.html
│   ├── contact-support.html
│   ├── privacy-policy.html
│   └── terms-of-service.html
└── README.md              # This file
```

## 💾 Data Storage

### Local Storage
- All data is stored in browser's localStorage
- No data is sent to external servers
- Data persists across browser sessions
- Automatically cleared when browser data is cleared

### Data Security
- Client-side only processing
- No network transmission of personal data
- Password storage (demo purposes - not for production)
- Export/import for data portability

## 🌍 Supported Currencies

### Major Currencies
- USD ($), EUR (€), GBP (£), JPY (¥)
- AUD, CAD, CHF, CNY, INR

### Middle Eastern
- QAR (ر.ق), AED (د.إ), SAR (ر.س)
- KWD (د.ك), BHD (.د.ب), OMR (ر.ع.)
- JOD (د.ا), LBP (ل.ل), EGP (ج.م)

### Asian Pacific
- BDT (৳), PKR (₨), KRW (₩)
- THB (฿), VND (₫), PHP (₱)
- IDR (Rp), MYR (RM), SGD (S$)

### African
- ZAR (R), NGN (₦), KES (KSh)
- GHS (₵), ETB (Br)

### And many more...

## 📊 Features in Detail

### Dashboard
- **Real-time Overview** of financial health
- **Interactive Charts** showing trends
- **Quick Actions** for common tasks
- **Summary Cards** with key metrics

### Transactions
- **Add/Edit/Delete** transactions easily
- **Category Filtering** and search
- **Bulk Operations** for efficiency
- **Import/Export** capabilities

### Reports
- **Time-based Analysis** (7 days to all-time)
- **Category Breakdown** with percentages
- **Trend Analysis** with interactive charts
- **Savings Rate** calculations

### Profile & Settings
- **Multi-currency** preferences
- **Country Selection** for localization
- **Data Management** tools
- **Export/Import** functionality

## 🛠️ Customization

### Adding New Categories
Edit `assets/js/data.js` in the `initializeDefaultCategories()` method:

```javascript
{ 
    id: 'new_category', 
    name: 'New Category', 
    type: 'expense', 
    icon: 'fas fa-icon', 
    color: '#hexcolor' 
}
```

### Adding New Currencies
Update the currency arrays in `assets/js/auth.js` and `assets/js/profile.js`:

```javascript
{ code: "XYZ", name: "Currency Name", symbol: "¤" }
```

### Styling
Modify `assets/css/style.css` for custom themes and colors.

## 🔧 Browser Compatibility

- **Chrome** 80+
- **Firefox** 75+
- **Safari** 13+
- **Edge** 80+

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## ⚠️ Important Notes

### Security Considerations
- This is a demo/personal use application
- Passwords are stored in plain text (demo purposes only)
- For production use, implement proper authentication
- Consider encryption for sensitive data

### Data Backup
- Regularly export your data
- Browser data can be lost when clearing storage
- No automatic cloud backup

### Performance
- Large datasets may impact performance
- Consider data pagination for 1000+ transactions
- Regular cleanup of old data recommended

## 📞 Support

For questions or issues:
1. Check the documentation
2. Review existing issues
3. Create a new issue with details
4. Include browser and version information

---

**Built with ❤️ for global financial management**

Supports users worldwide with local currencies and categories. Perfect for individuals, freelancers, and small businesses tracking finances across multiple countries and currencies.
