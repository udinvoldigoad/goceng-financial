import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, WALLET_TYPES } from '../models/categories';

/**
 * Generate demo data for first-time users
 * @returns {Object}
 */
export function generateDemoData() {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Generate dates for the last 30 days
    const getDate = (daysAgo) => {
        const d = new Date(now);
        d.setDate(d.getDate() - daysAgo);
        return d.toISOString().split('T')[0];
    };

    const wallets = [
        {
            id: 'wallet-1',
            name: 'BCA Digital',
            type: 'bank',
            accountNumber: '4829',
            balance: 15000000,
            icon: 'account_balance',
            color: 'blue',
            isPrimary: true,
            createdAt: new Date(now.getFullYear(), 0, 1).toISOString(),
        },
        {
            id: 'wallet-2',
            name: 'GoPay',
            type: 'ewallet',
            balance: 450000,
            icon: 'account_balance_wallet',
            color: 'cyan',
            createdAt: new Date(now.getFullYear(), 0, 1).toISOString(),
        },
        {
            id: 'wallet-3',
            name: 'Jago Syariah',
            type: 'savings',
            balance: 2300000,
            icon: 'savings',
            color: 'orange',
            createdAt: new Date(now.getFullYear(), 0, 1).toISOString(),
        },
        {
            id: 'wallet-4',
            name: 'Dompet',
            type: 'cash',
            balance: 250000,
            icon: 'payments',
            color: 'green',
            createdAt: new Date(now.getFullYear(), 0, 1).toISOString(),
        },
    ];

    const assets = [
        {
            id: 'asset-1',
            name: 'Honda Vario 2021',
            category: 'vehicle',
            value: 18000000,
            notes: 'Motor pribadi untuk transportasi harian',
            createdAt: new Date(now.getFullYear(), 0, 1).toISOString(),
        },
        {
            id: 'asset-2',
            name: 'MacBook Pro M1',
            category: 'electronics',
            value: 22000000,
            notes: 'Laptop kerja',
            createdAt: new Date(now.getFullYear(), 0, 1).toISOString(),
        },
    ];

    const transactions = [
        // Today
        {
            id: 'tx-1',
            type: 'expense',
            amount: 25000,
            category: 'food',
            walletId: 'wallet-2',
            date: today,
            description: 'Kopi Kenangan',
            createdAt: now.toISOString(),
        },
        // Yesterday
        {
            id: 'tx-2',
            type: 'expense',
            amount: 186000,
            category: 'entertainment',
            walletId: 'wallet-1',
            date: getDate(1),
            description: 'Netflix Subscription',
            createdAt: new Date(now.getTime() - 86400000).toISOString(),
        },
        {
            id: 'tx-3',
            type: 'income',
            amount: 15000000,
            category: 'salary',
            walletId: 'wallet-1',
            date: getDate(1),
            description: 'Gaji Bulanan',
            createdAt: new Date(now.getTime() - 86400000).toISOString(),
        },
        // 3 days ago
        {
            id: 'tx-4',
            type: 'expense',
            amount: 450000,
            category: 'shopping',
            walletId: 'wallet-1',
            date: getDate(3),
            description: 'Superindo Groceries',
            createdAt: new Date(now.getTime() - 3 * 86400000).toISOString(),
        },
        {
            id: 'tx-5',
            type: 'expense',
            amount: 300000,
            category: 'transport',
            walletId: 'wallet-4',
            date: getDate(3),
            description: 'Isi Bensin',
            createdAt: new Date(now.getTime() - 3 * 86400000).toISOString(),
        },
        // 5 days ago
        {
            id: 'tx-6',
            type: 'expense',
            amount: 350000,
            category: 'bills',
            walletId: 'wallet-1',
            date: getDate(5),
            description: 'Internet & TV IndiHome',
            createdAt: new Date(now.getTime() - 5 * 86400000).toISOString(),
        },
        {
            id: 'tx-7',
            type: 'expense',
            amount: 500000,
            category: 'bills',
            walletId: 'wallet-2',
            date: getDate(5),
            description: 'Token Listrik PLN',
            createdAt: new Date(now.getTime() - 5 * 86400000).toISOString(),
        },
        // 7 days ago
        {
            id: 'tx-8',
            type: 'expense',
            amount: 150000,
            category: 'food',
            walletId: 'wallet-2',
            date: getDate(7),
            description: 'Makan Siang dengan Teman',
            createdAt: new Date(now.getTime() - 7 * 86400000).toISOString(),
        },
        // 10 days ago
        {
            id: 'tx-9',
            type: 'transfer',
            amount: 500000,
            category: 'transfer',
            walletId: 'wallet-1',
            walletTargetId: 'wallet-2',
            date: getDate(10),
            description: 'Top up GoPay',
            createdAt: new Date(now.getTime() - 10 * 86400000).toISOString(),
        },
        // 14 days ago
        {
            id: 'tx-10',
            type: 'expense',
            amount: 2500000,
            category: 'shopping',
            walletId: 'wallet-1',
            date: getDate(14),
            description: 'Beli baju di Uniqlo',
            createdAt: new Date(now.getTime() - 14 * 86400000).toISOString(),
        },
    ];

    const budgets = [
        {
            id: 'budget-1',
            category: 'food',
            monthlyLimit: 3000000,
            month: currentMonth,
            icon: 'restaurant',
            color: 'orange',
            createdAt: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
        },
        {
            id: 'budget-2',
            category: 'transport',
            monthlyLimit: 1500000,
            month: currentMonth,
            icon: 'directions_car',
            color: 'blue',
            createdAt: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
        },
        {
            id: 'budget-3',
            category: 'entertainment',
            monthlyLimit: 500000,
            month: currentMonth,
            icon: 'movie',
            color: 'purple',
            createdAt: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
        },
        {
            id: 'budget-4',
            category: 'shopping',
            monthlyLimit: 2000000,
            month: currentMonth,
            icon: 'shopping_bag',
            color: 'pink',
            createdAt: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
        },
        {
            id: 'budget-5',
            category: 'bills',
            monthlyLimit: 1500000,
            month: currentMonth,
            icon: 'receipt',
            color: 'red',
            createdAt: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
        },
    ];

    const goals = [
        {
            id: 'goal-1',
            name: 'Dana Darurat',
            targetAmount: 30000000,
            currentAmount: 8450000,
            deadline: new Date(now.getFullYear() + 1, 11, 31).toISOString().split('T')[0],
            notes: 'Target 6 bulan pengeluaran',
            icon: 'savings',
            color: 'green',
            createdAt: new Date(now.getFullYear(), 0, 1).toISOString(),
        },
        {
            id: 'goal-2',
            name: 'Liburan ke Jepang',
            targetAmount: 25000000,
            currentAmount: 5000000,
            deadline: new Date(now.getFullYear() + 1, 5, 30).toISOString().split('T')[0],
            notes: 'Liburan tahun depan',
            icon: 'flight',
            color: 'blue',
            createdAt: new Date(now.getFullYear(), 0, 1).toISOString(),
        },
        {
            id: 'goal-3',
            name: 'iPhone Baru',
            targetAmount: 20000000,
            currentAmount: 12000000,
            deadline: new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0],
            notes: 'Upgrade dari iPhone lama',
            icon: 'smartphone',
            color: 'purple',
            createdAt: new Date(now.getFullYear(), 3, 1).toISOString(),
        },
    ];

    const subscriptions = [
        {
            id: 'sub-1',
            name: 'Netflix Premium',
            amount: 186000,
            cycle: 'monthly',
            nextDueDate: getNextDueDate(25),
            walletId: 'wallet-1',
            status: 'active',
            icon: 'movie',
            color: 'red',
            createdAt: new Date(now.getFullYear(), 0, 1).toISOString(),
        },
        {
            id: 'sub-2',
            name: 'Spotify Premium',
            amount: 55000,
            cycle: 'monthly',
            nextDueDate: getNextDueDate(15),
            walletId: 'wallet-2',
            status: 'active',
            icon: 'graphic_eq',
            color: 'green',
            createdAt: new Date(now.getFullYear(), 0, 1).toISOString(),
        },
        {
            id: 'sub-3',
            name: 'IndiHome Fiber',
            amount: 375000,
            cycle: 'monthly',
            nextDueDate: getNextDueDate(20),
            walletId: 'wallet-1',
            status: 'active',
            icon: 'wifi',
            color: 'red',
            createdAt: new Date(now.getFullYear(), 0, 1).toISOString(),
        },
    ];

    return {
        wallets,
        assets,
        transactions,
        budgets,
        goals,
        subscriptions,
    };
}

/**
 * Get next due date for a given day of month
 * @param {number} dayOfMonth 
 * @returns {string} - YYYY-MM-DD
 */
function getNextDueDate(dayOfMonth) {
    const now = new Date();
    let dueDate = new Date(now.getFullYear(), now.getMonth(), dayOfMonth);

    if (dueDate <= now) {
        dueDate = new Date(now.getFullYear(), now.getMonth() + 1, dayOfMonth);
    }

    return dueDate.toISOString().split('T')[0];
}
