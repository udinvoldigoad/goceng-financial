/**
 * Calculate total assets (wallets + physical assets)
 * @param {Array} wallets 
 * @param {Array} assets 
 * @returns {number}
 */
export function getTotalAssets(wallets, assets) {
    const walletTotal = wallets.reduce((sum, w) => sum + w.balance, 0);
    const assetTotal = assets.reduce((sum, a) => sum + a.value, 0);
    return walletTotal + assetTotal;
}

/**
 * Get monthly income
 * @param {Array} transactions 
 * @param {string} month - YYYY-MM format
 * @returns {number}
 */
export function getMonthlyIncome(transactions, month) {
    return transactions
        .filter(t => t.type === 'income' && t.date.startsWith(month))
        .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Get monthly expense
 * @param {Array} transactions 
 * @param {string} month - YYYY-MM format
 * @returns {number}
 */
export function getMonthlyExpense(transactions, month) {
    return transactions
        .filter(t => t.type === 'expense' && t.date.startsWith(month))
        .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Get daily income
 * @param {Array} transactions 
 * @param {string} date - YYYY-MM-DD format
 * @returns {number}
 */
export function getDailyIncome(transactions, date) {
    return transactions
        .filter(t => t.type === 'income' && t.date.startsWith(date))
        .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Get daily expense
 * @param {Array} transactions 
 * @param {string} date - YYYY-MM-DD format
 * @returns {number}
 */
export function getDailyExpense(transactions, date) {
    return transactions
        .filter(t => t.type === 'expense' && t.date.startsWith(date))
        .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Get budget spent for a category in a month
 * @param {Array} transactions 
 * @param {string} category 
 * @param {string} month - YYYY-MM format
 * @returns {number}
 */
export function getBudgetSpent(transactions, category, month) {
    return transactions
        .filter(
            t =>
                t.type === 'expense' &&
                t.category === category &&
                t.date.startsWith(month)
        )
        .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Get category breakdown for expenses in a month
 * @param {Array} transactions 
 * @param {string} month - YYYY-MM format
 * @returns {Array<{category: string, amount: number}>}
 */
export function getCategoryBreakdown(transactions, month) {
    const expenses = transactions.filter(
        t => t.type === 'expense' && t.date.startsWith(month)
    );

    const breakdown = {};
    expenses.forEach(t => {
        breakdown[t.category] = (breakdown[t.category] || 0) + t.amount;
    });

    return Object.entries(breakdown)
        .map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => b.amount - a.amount);
}

/**
 * Get monthly trend data for the last N months
 * @param {Array} transactions 
 * @param {number} months - Number of months to include
 * @returns {Array<{month: string, income: number, expense: number}>}
 */
export function getMonthlyTrend(transactions, months = 6) {
    const result = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        result.push({
            month,
            income: getMonthlyIncome(transactions, month),
            expense: getMonthlyExpense(transactions, month),
        });
    }

    return result;
}

/**
 * Get weekly breakdown for current month
 * @param {Array} transactions 
 * @param {string} month - YYYY-MM format
 * @returns {Array<{week: string, amount: number}>}
 */
export function getWeeklyBreakdown(transactions, month) {
    const year = parseInt(month.split('-')[0]);
    const monthNum = parseInt(month.split('-')[1]) - 1;

    const weeks = [];
    const firstDay = new Date(year, monthNum, 1);
    const lastDay = new Date(year, monthNum + 1, 0);

    let weekStart = new Date(firstDay);
    let weekNum = 1;

    while (weekStart <= lastDay) {
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        if (weekEnd > lastDay) weekEnd.setTime(lastDay.getTime());

        const startStr = weekStart.toISOString().split('T')[0];
        const endStr = weekEnd.toISOString().split('T')[0];

        const weekExpenses = transactions
            .filter(t =>
                t.type === 'expense' &&
                t.date >= startStr &&
                t.date <= endStr
            )
            .reduce((sum, t) => sum + t.amount, 0);

        weeks.push({
            week: `Minggu ${weekNum}`,
            amount: weekExpenses,
        });

        weekStart.setDate(weekStart.getDate() + 7);
        weekNum++;
    }

    return weeks;
}

/**
 * Calculate savings rate
 * @param {number} income 
 * @param {number} expense 
 * @returns {number} - Percentage (0-100)
 */
export function calculateSavingsRate(income, expense) {
    if (income === 0) return 0;
    const savings = income - expense;
    return Math.round((savings / income) * 100);
}

/**
 * Group transactions by date
 * @param {Array} transactions 
 * @returns {Object} - { [dateKey]: transactions[] }
 */
export function groupTransactionsByDate(transactions) {
    const groups = {};

    const sorted = [...transactions].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );

    sorted.forEach(t => {
        const dateKey = t.date.split('T')[0];
        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(t);
    });

    return groups;
}
