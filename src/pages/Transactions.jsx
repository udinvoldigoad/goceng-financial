import { useState, useMemo } from 'react';
import useStore from '../store/useStore';
import { formatCurrency, formatRelativeDate, getToday, getCurrentMonth } from '../services/formatters';
import { getCategoryById, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../models/categories';
import { getMonthlyIncome, getMonthlyExpense, groupTransactionsByDate } from '../services/calculations';
import TransactionForm from '../components/forms/TransactionForm';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { toast } from '../components/ui/Toast';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { getIconContainerClasses } from '../services/colorUtils';

export default function Transactions() {
    const { transactions, wallets, deleteTransaction } = useStore();
    const { requireAuth } = useRequireAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddTransaction, setShowAddTransaction] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [deletingTransaction, setDeletingTransaction] = useState(null);
    const [filterCategory, setFilterCategory] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterWallet, setFilterWallet] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');
    const [dateFilter, setDateFilter] = useState('all'); // all, today, week, month
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    // Auth-protected action handlers
    const handleAddTransaction = () => requireAuth(() => setShowAddTransaction(true));
    const handleEditTransaction = (tx) => requireAuth(() => setEditingTransaction(tx));
    const handleDeleteTransactionClick = (tx) => requireAuth(() => setDeletingTransaction(tx));

    const currentMonth = getCurrentMonth();
    const monthlyIncome = getMonthlyIncome(transactions, currentMonth);
    const monthlyExpense = getMonthlyExpense(transactions, currentMonth);

    // Filter and sort transactions
    const filteredTransactions = useMemo(() => {
        let result = [...transactions];

        // Date filter
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dateFilter === 'today') {
            result = result.filter(t => {
                const txDate = new Date(t.date);
                txDate.setHours(0, 0, 0, 0);
                return txDate.getTime() === today.getTime();
            });
        } else if (dateFilter === 'week') {
            const weekAgo = new Date(today);
            weekAgo.setDate(today.getDate() - 7);
            result = result.filter(t => new Date(t.date) >= weekAgo);
        } else if (dateFilter === 'month') {
            const monthAgo = new Date(today);
            monthAgo.setMonth(today.getMonth() - 1);
            result = result.filter(t => new Date(t.date) >= monthAgo);
        }

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(t =>
                t.description?.toLowerCase().includes(query) ||
                getCategoryById(t.category)?.name.toLowerCase().includes(query)
            );
        }

        // Category filter
        if (filterCategory) {
            result = result.filter(t => t.category === filterCategory);
        }

        // Type filter
        if (filterType) {
            result = result.filter(t => t.type === filterType);
        }

        // Wallet filter
        if (filterWallet) {
            result = result.filter(t => t.walletId === filterWallet || t.walletTargetId === filterWallet);
        }

        // Sort
        result.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);

            switch (sortOrder) {
                case 'oldest':
                    return dateA - dateB;
                case 'highest':
                    return b.amount - a.amount;
                case 'lowest':
                    return a.amount - b.amount;
                default: // newest
                    return dateB - dateA;
            }
        });

        return result;
    }, [transactions, searchQuery, filterCategory, filterType, filterWallet, sortOrder, dateFilter]);

    // Group by date
    const groupedTransactions = useMemo(() => {
        return groupTransactionsByDate(filteredTransactions);
    }, [filteredTransactions]);

    const handleDelete = () => {
        if (deletingTransaction) {
            deleteTransaction(deletingTransaction.id);
            toast.success('Transaksi berhasil dihapus');
            setDeletingTransaction(null);
        }
    };

    const getWalletName = (walletId) => {
        const wallet = wallets.find(w => w.id === walletId);
        return wallet?.name || 'Unknown';
    };

    const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

    const TransactionItem = ({ tx }) => {
        const category = getCategoryById(tx.category);
        const wallet = wallets.find(w => w.id === tx.walletId);

        return (
            <div
                className="p-4 flex items-center justify-between hover:bg-surface-highlight transition-colors border-b border-border-dark last:border-0 cursor-pointer group"
                onClick={() => handleEditTransaction(tx)}
            >
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getIconContainerClasses(category?.color, 'gray')}`}>
                        <span className="material-symbols-outlined">
                            {tx.type === 'transfer' ? 'swap_horiz' : category?.icon || 'receipt'}
                        </span>
                    </div>
                    <div>
                        <h4 className="font-bold text-base text-white">
                            {tx.description || category?.name || 'Transaksi'}
                        </h4>
                        <p className="text-xs text-text-muted">
                            {tx.type === 'transfer'
                                ? `${getWalletName(tx.walletId)} → ${getWalletName(tx.walletTargetId)}`
                                : `${category?.name || tx.category} • ${wallet?.name || 'Unknown'}`
                            }
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <span className={`block font-bold ${tx.type === 'income' ? 'text-green-400' :
                            tx.type === 'transfer' ? 'text-blue-400' : 'text-red-400'
                            }`}>
                            {tx.type === 'income' ? '+' : tx.type === 'expense' ? '-' : ''}
                            {formatCurrency(tx.amount)}
                        </span>
                        <span className="text-xs text-text-muted capitalize">{tx.type}</span>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTransactionClick(tx);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-red-400 transition-all p-1"
                    >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="relative max-w-6xl mx-auto">
            {/* Header */}
            <header className="flex justify-between items-center mb-8 animate-stagger-in" style={{ animationDelay: '0s' }}>
                <div>
                    <h2 className="text-2xl font-bold text-white">Riwayat Transaksi</h2>
                    <p className="text-text-muted mt-1">Kelola dan pantau arus kas keuanganmu.</p>
                </div>
                <button
                    onClick={handleAddTransaction}
                    className="flex items-center gap-2 cursor-pointer justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-bold tracking-wide"
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    <span>Tambah Transaksi</span>
                </button>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-stagger-in" style={{ animationDelay: '0.1s' }}>
                <div className="p-6 rounded-2xl bg-surface-dark border border-border-dark shadow-sm relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-9xl text-green-500">trending_up</span>
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
                                <span className="material-symbols-outlined">arrow_downward</span>
                            </div>
                            <span className="text-sm font-medium text-text-muted">Pemasukan Bulan Ini</span>
                        </div>
                        <h3 className="text-3xl font-bold text-green-400 tracking-tight">
                            {formatCurrency(monthlyIncome)}
                        </h3>
                    </div>
                </div>
                <div className="p-6 rounded-2xl bg-surface-dark border border-border-dark shadow-sm relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-9xl text-red-500">trending_down</span>
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                                <span className="material-symbols-outlined">arrow_upward</span>
                            </div>
                            <span className="text-sm font-medium text-text-muted">Pengeluaran Bulan Ini</span>
                        </div>
                        <h3 className="text-3xl font-bold text-red-400 tracking-tight">
                            {formatCurrency(monthlyExpense)}
                        </h3>
                    </div>
                </div>
            </div>

            {/* New Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-3 mb-6 animate-stagger-in" style={{ animationDelay: '0.2s' }}>
                {/* Search Bar */}
                <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[20px]">search</span>
                    <input
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-dark border border-border-dark focus:outline-none focus:ring-2 focus:ring-primary text-sm placeholder-text-muted text-white"
                        placeholder="Search"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Quick Date Filters */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setDateFilter('all')}
                        className={`px-5 py-3 rounded-xl text-sm font-medium transition-all ${dateFilter === 'all'
                            ? 'bg-primary text-white'
                            : 'bg-surface-dark text-text-muted hover:text-white border border-border-dark'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setDateFilter('today')}
                        className={`px-5 py-3 rounded-xl text-sm font-medium transition-all ${dateFilter === 'today'
                            ? 'bg-primary text-white'
                            : 'bg-surface-dark text-text-muted hover:text-white border border-border-dark'
                            }`}
                    >
                        Today
                    </button>
                    <button
                        onClick={() => setDateFilter('week')}
                        className={`px-5 py-3 rounded-xl text-sm font-medium transition-all ${dateFilter === 'week'
                            ? 'bg-primary text-white'
                            : 'bg-surface-dark text-text-muted hover:text-white border border-border-dark'
                            }`}
                    >
                        This Week
                    </button>
                    <button
                        onClick={() => setDateFilter('month')}
                        className={`px-5 py-3 rounded-xl text-sm font-medium transition-all ${dateFilter === 'month'
                            ? 'bg-primary text-white'
                            : 'bg-surface-dark text-text-muted hover:text-white border border-border-dark'
                            }`}
                    >
                        This Month
                    </button>

                    {/* Filter Dropdown Button */}
                    <div className="relative">
                        <button
                            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium bg-surface-dark text-text-muted hover:text-white border border-border-dark transition-all"
                        >
                            <span className="material-symbols-outlined text-[18px]">filter_list</span>
                            <span>Filter</span>
                            <span className="material-symbols-outlined text-[16px]">
                                {showFilterDropdown ? 'expand_less' : 'expand_more'}
                            </span>
                        </button>

                        {/* Filter Dropdown */}
                        {showFilterDropdown && (
                            <div className="absolute right-0 top-14 w-80 bg-surface-dark border border-border-dark rounded-xl shadow-2xl p-4 z-50 space-y-3">
                                <div>
                                    <label className="block text-xs text-text-muted mb-2">Kategori</label>
                                    <select
                                        className="w-full px-3 py-2.5 rounded-lg bg-surface-highlight border border-border-dark focus:outline-none focus:ring-2 focus:ring-primary text-sm text-white"
                                        value={filterCategory}
                                        onChange={(e) => setFilterCategory(e.target.value)}
                                    >
                                        <option value="">Semua Kategori</option>
                                        {allCategories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs text-text-muted mb-2">Tipe</label>
                                    <select
                                        className="w-full px-3 py-2.5 rounded-lg bg-surface-highlight border border-border-dark focus:outline-none focus:ring-2 focus:ring-primary text-sm text-white"
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value)}
                                    >
                                        <option value="">Semua Tipe</option>
                                        <option value="income">Pemasukan</option>
                                        <option value="expense">Pengeluaran</option>
                                        <option value="transfer">Transfer</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs text-text-muted mb-2">Wallet</label>
                                    <select
                                        className="w-full px-3 py-2.5 rounded-lg bg-surface-highlight border border-border-dark focus:outline-none focus:ring-2 focus:ring-primary text-sm text-white"
                                        value={filterWallet}
                                        onChange={(e) => setFilterWallet(e.target.value)}
                                    >
                                        <option value="">Semua Wallet</option>
                                        {wallets.map(w => (
                                            <option key={w.id} value={w.id}>{w.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs text-text-muted mb-2">Urutkan</label>
                                    <select
                                        className="w-full px-3 py-2.5 rounded-lg bg-surface-highlight border border-border-dark focus:outline-none focus:ring-2 focus:ring-primary text-sm text-white"
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value)}
                                    >
                                        <option value="newest">Terbaru</option>
                                        <option value="oldest">Terlama</option>
                                        <option value="highest">Tertinggi</option>
                                        <option value="lowest">Terendah</option>
                                    </select>
                                </div>

                                <button
                                    onClick={() => {
                                        setFilterCategory('');
                                        setFilterType('');
                                        setFilterWallet('');
                                        setSortOrder('newest');
                                        setShowFilterDropdown(false);
                                    }}
                                    className="w-full py-2 text-sm text-primary hover:text-primary/80 font-medium"
                                >
                                    Reset Semua Filter
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Transaction List */}
            {transactions.length === 0 ? (
                <EmptyState
                    icon="receipt_long"
                    title="Belum ada transaksi"
                    description="Tambahkan transaksi pertama Anda untuk mulai melacak keuangan."
                    actionLabel="Tambah Transaksi"
                    onAction={handleAddTransaction}
                />
            ) : filteredTransactions.length === 0 ? (
                <div className="text-center py-16">
                    <span className="material-symbols-outlined text-4xl text-text-muted mb-4">search_off</span>
                    <p className="text-text-muted">Tidak ada transaksi yang cocok dengan filter.</p>
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setFilterCategory('');
                            setFilterType('');
                            setFilterWallet('');
                            setDateFilter('all');
                        }}
                        className="mt-4 text-primary hover:underline"
                    >
                        Reset Filter
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(groupedTransactions).map(([dateKey, txList]) => (
                        <div key={dateKey}>
                            <h3 className="text-sm font-semibold text-text-muted mb-3 uppercase tracking-wider ml-1">
                                {formatRelativeDate(dateKey)}
                            </h3>
                            <div className="bg-surface-dark rounded-2xl border border-border-dark overflow-hidden">
                                {txList.map((tx) => (
                                    <TransactionItem key={tx.id} tx={tx} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}



            {/* Transaction Form Modal */}
            <TransactionForm
                isOpen={showAddTransaction || !!editingTransaction}
                onClose={() => {
                    setShowAddTransaction(false);
                    setEditingTransaction(null);
                }}
                transaction={editingTransaction}
            />

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={!!deletingTransaction}
                onClose={() => setDeletingTransaction(null)}
                onConfirm={handleDelete}
                title="Hapus Transaksi"
                message={`Apakah Anda yakin ingin menghapus transaksi ini? Saldo wallet akan dikembalikan.`}
                confirmLabel="Ya, Hapus"
                danger
            />
        </div>
    );
}
