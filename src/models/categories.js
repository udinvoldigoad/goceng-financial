/**
 * Transaction and budget categories with icons and colors
 */

export const EXPENSE_CATEGORIES = [
    { id: 'food', name: 'Makanan & Minuman', icon: 'restaurant', color: 'orange' },
    { id: 'transport', name: 'Transportasi', icon: 'directions_car', color: 'blue' },
    { id: 'shopping', name: 'Belanja', icon: 'shopping_bag', color: 'pink' },
    { id: 'entertainment', name: 'Hiburan', icon: 'movie', color: 'purple' },
    { id: 'bills', name: 'Tagihan', icon: 'receipt', color: 'red' },
    { id: 'health', name: 'Kesehatan', icon: 'medical_services', color: 'green' },
    { id: 'education', name: 'Pendidikan', icon: 'school', color: 'indigo' },
    { id: 'personal', name: 'Pribadi', icon: 'person', color: 'teal' },
    { id: 'other', name: 'Lainnya', icon: 'more_horiz', color: 'gray' },
];

export const INCOME_CATEGORIES = [
    { id: 'salary', name: 'Gaji', icon: 'work', color: 'green' },
    { id: 'freelance', name: 'Freelance', icon: 'laptop', color: 'blue' },
    { id: 'investment', name: 'Investasi', icon: 'trending_up', color: 'purple' },
    { id: 'gift', name: 'Hadiah', icon: 'redeem', color: 'pink' },
    { id: 'refund', name: 'Refund', icon: 'replay', color: 'orange' },
    { id: 'other_income', name: 'Pendapatan Lain', icon: 'more_horiz', color: 'gray' },
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export const WALLET_TYPES = [
    { id: 'bank', name: 'Rekening Bank', icon: 'account_balance', color: 'blue' },
    { id: 'ewallet', name: 'E-Wallet', icon: 'account_balance_wallet', color: 'cyan' },
    { id: 'cash', name: 'Tunai', icon: 'payments', color: 'green' },
    { id: 'savings', name: 'Tabungan', icon: 'savings', color: 'orange' },
    { id: 'investment', name: 'Investasi', icon: 'trending_up', color: 'purple' },
];

export const ASSET_CATEGORIES = [
    { id: 'property', name: 'Properti', icon: 'home', color: 'blue' },
    { id: 'vehicle', name: 'Kendaraan', icon: 'directions_car', color: 'orange' },
    { id: 'electronics', name: 'Elektronik', icon: 'devices', color: 'purple' },
    { id: 'jewelry', name: 'Perhiasan', icon: 'diamond', color: 'pink' },
    { id: 'collectibles', name: 'Koleksi', icon: 'collections', color: 'teal' },
    { id: 'other_asset', name: 'Aset Lain', icon: 'inventory_2', color: 'gray' },
];

export const SUBSCRIPTION_CYCLES = [
    { id: 'weekly', name: 'Mingguan' },
    { id: 'monthly', name: 'Bulanan' },
    { id: 'yearly', name: 'Tahunan' },
];

/**
 * Get category by ID
 * @param {string} categoryId 
 * @returns {Object|undefined}
 */
export function getCategoryById(categoryId) {
    return ALL_CATEGORIES.find(c => c.id === categoryId);
}

/**
 * Get wallet type by ID
 * @param {string} typeId 
 * @returns {Object|undefined}
 */
export function getWalletTypeById(typeId) {
    return WALLET_TYPES.find(t => t.id === typeId);
}
