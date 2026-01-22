import { useState, useMemo } from 'react';
import useStore from '../store/useStore';
import { formatCurrency, formatRelativeDate, getToday, getCurrentMonth } from '../services/formatters';
import { getCategoryById, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../models/categories';
import { getMonthlyIncome, getMonthlyExpense, groupTransactionsByDate } from '../services/calculations';
import TransactionForm from '../components/forms/TransactionForm';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { toast } from '../components/ui/Toast';

export default function Transactions() {
    const { transactions, wallets, deleteTransaction } = useStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddTransaction, setShowAddTransaction] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [deletingTransaction, setDeletingTransaction] = useState(null);
    const [filterCategory, setFilterCategory] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterWallet, setFilterWallet] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');

    const currentMonth = getCurrentMonth();
    const monthlyIncome = getMonthlyIncome(transactions, currentMonth);
    const monthlyExpense = getMonthlyExpense(transactions, currentMonth);

    // Filter and sort transactions
    const filteredTransactions = useMemo(() => {
        let result = [...transactions];

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
    }, [transactions, searchQuery, filterCategory, filterType, filterWallet, sortOrder]);

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
                onClick={() => setEditingTransaction(tx)}
            >
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-${category?.color || 'gray'}-900/20 flex items-center justify-center text-${category?.color || 'gray'}-400`}>
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
                            setDeletingTransaction(tx);
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
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white">Riwayat Transaksi</h2>
                    <p className="text-text-muted mt-1">Kelola dan pantau arus kas keuanganmu.</p>
                </div>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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

            {/* Filters */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">search</span>
                    <input
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-dark border border-border-dark focus:outline-none focus:ring-2 focus:ring-primary text-sm placeholder-text-muted text-white"
                        placeholder="Cari transaksi..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
                    <select
                        className="w-full sm:w-auto px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-surface-dark border border-border-dark focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm font-medium text-white appearance-none cursor-pointer"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="">Semua Kategori</option>
                        {allCategories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <select
                        className="w-full sm:w-auto px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-surface-dark border border-border-dark focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm font-medium text-white appearance-none cursor-pointer"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="">Semua Tipe</option>
                        <option value="income">Pemasukan</option>
                        <option value="expense">Pengeluaran</option>
                        <option value="transfer">Transfer</option>
                    </select>
                    <select
                        className="w-full sm:w-auto px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-surface-dark border border-border-dark focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm font-medium text-white appearance-none cursor-pointer"
                        value={filterWallet}
                        onChange={(e) => setFilterWallet(e.target.value)}
                    >
                        <option value="">Semua Wallet</option>
                        {wallets.map(w => (
                            <option key={w.id} value={w.id}>{w.name}</option>
                        ))}
                    </select>
                    <select
                        className="w-full sm:w-auto px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-surface-dark border border-border-dark focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm font-medium text-white appearance-none cursor-pointer"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="newest">Terbaru</option>
                        <option value="oldest">Terlama</option>
                        <option value="highest">Tertinggi</option>
                        <option value="lowest">Terendah</option>
                    </select>
                </div>
            </div>

            {/* Transaction List */}
            {transactions.length === 0 ? (
                <EmptyState
                    icon="receipt_long"
                    title="Belum ada transaksi"
                    description="Tambahkan transaksi pertama Anda untuk mulai melacak keuangan."
                    actionLabel="Tambah Transaksi"
                    onAction={() => setShowAddTransaction(true)}
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

            {/* FAB - Add Transaction */}
            <button
                onClick={() => setShowAddTransaction(true)}
                className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/40 flex items-center justify-center hover:bg-blue-600 transition-colors transform hover:scale-105 active:scale-95 z-50"
            >
                <span className="material-symbols-outlined text-3xl">add</span>
            </button>

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
