# Goceng - Personal Finance Tracker

A modern personal finance tracker built with React, Vite, and Tailwind CSS 4.

![Goceng Finance Tracker](https://img.shields.io/badge/React-19.2.0-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-4.1.18-teal) ![Vite](https://img.shields.io/badge/Vite-7.2.4-purple)

## Features

### 💰 Wallet Management
- Add, edit, and delete wallets (bank accounts, e-wallets, cash)
- Track balances across multiple wallets
- Transfer money between wallets

### 📊 Transaction Tracking
- Record income, expenses, and transfers
- Categorize transactions with predefined categories
- Filter by date, category, type, or wallet
- Automatic wallet balance updates

### 📅 Budget Management
- Set monthly budgets per expense category
- Track spending against budget limits
- Visual progress bars with alerts when near/exceeding limits
- Derived spending automatically calculated from transactions

<<<<<<< HEAD
### 🎯 Financial Goals
- Create savings goals with target amounts
- Add contributions to track progress
- Set deadlines and monitor completion

### 📈 Reports & Analytics
- Monthly income/expense summary
- Category breakdown pie chart
- Monthly trend line chart
- Export transactions to CSV

### ⚙️ Settings
- Dark/Light theme toggle
- Export all data as JSON backup
- Reset all data
- Load demo data for first-time users

## Tech Stack

- **Frontend**: React 19 with Vite
- **Styling**: Tailwind CSS 4 with custom theme
- **State Management**: Zustand with localStorage persistence
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Notifications**: react-hot-toast
- **Routing**: React Router DOM

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/goceng.git
cd goceng

# Install dependencies
npm install

# Start development server
npm run dev
=======
```
goceng/
  ├── src/
  │   ├── components/  # Reusable UI components
  │   ├── layouts/     # Page layouts (Auth, Dashboard)
  │   └── pages/       # Application views
  └── ...
>>>>>>> a33f036af16c1ef24760873f11d3c1226860eee7
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

<<<<<<< HEAD
### Build for Production

```bash
npm run build
npm run preview
```
=======
1.  **Clone the repository**
    ```bash
    git clone https://github.com/udinvoldigoad/goceng-financial.git
    cd goceng
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```
>>>>>>> a33f036af16c1ef24760873f11d3c1226860eee7

## Data Persistence

All data is stored locally in your browser using `localStorage`. This means:

- ✅ Data persists across page refreshes
- ✅ No server or database required
- ✅ Your data stays on your device
- ⚠️ Clearing browser data will delete your finance data

### Data Backup

You can export all your data as a JSON file from **Settings → Export Data**. This backup can be kept for reference.

### Reset Data

To start fresh, go to **Settings → Zona Berbahaya → Hapus Semua Data**.

## Project Structure

```
src/
├── components/
│   ├── forms/          # Form components (WalletForm, TransactionForm, etc.)
│   ├── ui/             # Reusable UI components (Modal, Toast, EmptyState)
│   └── Sidebar.jsx
├── layouts/
│   └── DashboardLayout.jsx
├── models/
│   ├── types.js        # JSDoc type definitions
│   └── categories.js   # Category definitions with icons/colors
├── pages/
│   ├── Dashboard.jsx
│   ├── Assets.jsx
│   ├── Transactions.jsx
│   ├── Budget.jsx
│   ├── Goals.jsx
│   ├── Reports.jsx
│   ├── Profile.jsx
│   └── Settings.jsx
├── services/
│   ├── formatters.js   # Currency, date formatting
│   ├── calculations.js # Financial calculations
│   ├── exportCsv.js    # CSV/JSON export utilities
│   └── demoData.js     # Demo data generator
├── store/
│   └── useStore.js     # Zustand store with persistence
└── styles/
    └── index.css       # Tailwind theme configuration
```

## License

MIT License - feel free to use this project for personal or commercial purposes.

---

Built with ❤️ by Goceng Team
