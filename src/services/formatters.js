/**
 * Format amount as Indonesian Rupiah
 * @param {number} amount 
 * @param {boolean} showSign - Whether to show + or - sign
 * @returns {string}
 */
export function formatCurrency(amount, showSign = false) {
    const absAmount = Math.abs(amount);
    const formatted = `Rp ${absAmount.toLocaleString('id-ID')}`;

    if (showSign) {
        return amount >= 0 ? `+${formatted}` : `-${formatted}`;
    }

    return formatted;
}

/**
 * Format date in Indonesian locale
 * @param {string|Date} date 
 * @param {'full'|'long'|'medium'|'short'} format 
 * @returns {string}
 */
export function formatDate(date, format = 'medium') {
    const d = new Date(date);

    const options = {
        full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
        long: { year: 'numeric', month: 'long', day: 'numeric' },
        medium: { day: 'numeric', month: 'short', year: 'numeric' },
        short: { day: 'numeric', month: 'short' },
    };

    return d.toLocaleDateString('id-ID', options[format]);
}

/**
 * Get relative date string (Hari ini, Kemarin, etc.)
 * @param {string|Date} date 
 * @returns {string}
 */
export function formatRelativeDate(date) {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = d.toDateString() === today.toDateString();
    const isYesterday = d.toDateString() === yesterday.toDateString();

    if (isToday) return 'Hari Ini';
    if (isYesterday) return 'Kemarin';

    // Check if same week
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    if (d >= startOfWeek) return 'Minggu Ini';

    // Check if same month
    if (d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()) {
        return 'Bulan Ini';
    }

    return formatDate(date, 'medium');
}

/**
 * Format month for display
 * @param {string} month - YYYY-MM format
 * @returns {string}
 */
export function formatMonth(month) {
    const [year, monthNum] = month.split('-');
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
}

/**
 * Get current month in YYYY-MM format
 * @returns {string}
 */
export function getCurrentMonth() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string}
 */
export function getToday() {
    return new Date().toISOString().split('T')[0];
}

/**
 * Format compact number (e.g., 1.5jt, 500rb)
 * @param {number} amount 
 * @returns {string}
 */
export function formatCompactCurrency(amount) {
    const absAmount = Math.abs(amount);

    if (absAmount >= 1000000000) {
        return `Rp ${(absAmount / 1000000000).toFixed(1)}M`;
    }
    if (absAmount >= 1000000) {
        return `Rp ${(absAmount / 1000000).toFixed(1)}jt`;
    }
    if (absAmount >= 1000) {
        return `Rp ${(absAmount / 1000).toFixed(0)}rb`;
    }

    return `Rp ${absAmount}`;
}

/**
 * Calculate percentage
 * @param {number} value 
 * @param {number} total 
 * @returns {number}
 */
export function calculatePercentage(value, total) {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
}
