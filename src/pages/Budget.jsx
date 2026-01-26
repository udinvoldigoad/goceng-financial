import { useState, useMemo } from 'react';
import useStore from '../store/useStore';
import { formatCurrency, getCurrentMonth, formatMonth, calculatePercentage } from '../services/formatters';
import { getBudgetSpent } from '../services/calculations';
import { getCategoryById, EXPENSE_CATEGORIES } from '../models/categories';
import BudgetForm from '../components/forms/BudgetForm';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { toast } from '../components/ui/Toast';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { getIconContainerClasses } from '../services/colorUtils';

export default function Budget() {
    const { budgets, transactions, deleteBudget, getBudgetsForMonth } = useStore();
    const { requireAuth } = useRequireAuth();
    const [showAddBudget, setShowAddBudget] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);
    const [deletingBudget, setDeletingBudget] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

    // Auth-protected action handlers
    const handleAddBudget = () => requireAuth(() => setShowAddBudget(true));
    const handleEditBudget = (budget) => requireAuth(() => setEditingBudget(budget));
    const handleDeleteBudgetClick = (budget) => requireAuth(() => setDeletingBudget(budget));

    const currentBudgets = useMemo(() => {
        return getBudgetsForMonth(selectedMonth);
    }, [budgets, selectedMonth]);

    const budgetsWithSpent = useMemo(() => {
        return currentBudgets.map(budget => {
            const spent = getBudgetSpent(transactions, budget.category, budget.month);
            const percentage = calculatePercentage(spent, budget.monthlyLimit);
            const remaining = budget.monthlyLimit - spent;
            return { ...budget, spent, percentage, remaining };
        });
    }, [currentBudgets, transactions]);

    const totalBudget = budgetsWithSpent.reduce((sum, b) => sum + b.monthlyLimit, 0);
    const totalSpent = budgetsWithSpent.reduce((sum, b) => sum + b.spent, 0);

    const handleDelete = () => {
        if (deletingBudget) {
            deleteBudget(deletingBudget.id);
            toast.success('Anggaran berhasil dihapus');
            setDeletingBudget(null);
        }
    };

    const getProgressColor = (percentage) => {
        if (percentage >= 100) return 'bg-red-500';
        if (percentage >= 90) return 'bg-red-500';
        if (percentage >= 70) return 'bg-orange-500';
        if (percentage >= 50) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    // Generate month options
    const monthOptions = [];
    const now = new Date();
    for (let i = -6; i <= 6; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
        const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const label = d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
        monthOptions.push({ value, label });
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-8 animate-stagger-in" style={{ animationDelay: '0s' }}>
                <div className="flex flex-col gap-2">
                    <h1 className="text-xl md:text-2xl font-bold text-white">Anggaran</h1>
                    <div className="flex items-center gap-4">
                        <div>
                            <p className="text-text-muted text-xs md:text-sm">Total Anggaran Bulan Ini</p>
                            <div className="flex items-baseline gap-3">
                                <span className="text-2xl md:text-4xl font-black text-white">{formatCurrency(totalBudget)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="px-4 py-2.5 rounded-lg bg-surface-dark border border-border-dark text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-auto cursor-pointer"
                    >
                        {monthOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleAddBudget}
                        className="flex items-center gap-2 justify-center rounded-lg h-10 px-5 bg-primary text-white hover:bg-primary/90 transition-all text-sm font-bold tracking-wide shadow-lg shadow-primary/20 active:scale-95 touch-manipulation"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span>Atur Anggaran</span>
                    </button>
                </div>
            </div>

            {/* Summary Card */}
            {budgetsWithSpent.length > 0 && (
                <div className="bg-surface-dark border border-border-dark rounded-2xl p-4 md:p-6 mb-8 animate-stagger-in" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-white text-sm md:text-base">Ringkasan {formatMonth(selectedMonth)}</h3>
                        <span className={`text-xs md:text-sm font-bold ${totalSpent > totalBudget ? 'text-red-400' : 'text-green-400'}`}>
                            {calculatePercentage(totalSpent, totalBudget)}% terpakai
                        </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                        <div className="p-3 bg-background-dark/50 rounded-xl border border-white/5">
                            <p className="text-text-muted text-[10px] md:text-xs uppercase mb-1">Total Anggaran</p>
                            <p className="text-lg md:text-xl font-bold text-white">{formatCurrency(totalBudget)}</p>
                        </div>
                        <div className="p-3 bg-background-dark/50 rounded-xl border border-white/5">
                            <p className="text-text-muted text-[10px] md:text-xs uppercase mb-1">Terpakai</p>
                            <p className="text-lg md:text-xl font-bold text-red-400">{formatCurrency(totalSpent)}</p>
                        </div>
                        <div className="p-3 bg-background-dark/50 rounded-xl border border-white/5">
                            <p className="text-text-muted text-[10px] md:text-xs uppercase mb-1">Sisa</p>
                            <p className={`text-lg md:text-xl font-bold ${totalBudget - totalSpent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {formatCurrency(Math.max(totalBudget - totalSpent, 0))}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Budget Cards */}
            {budgetsWithSpent.length === 0 ? (
                <EmptyState
                    icon="pie_chart"
                    title="Belum ada anggaran"
                    description={`Atur anggaran bulanan untuk ${formatMonth(selectedMonth)} agar pengeluaran tetap terkontrol.`}
                    actionLabel="Atur Anggaran"
                    onAction={handleAddBudget}
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 animate-stagger-in" style={{ animationDelay: '0.2s' }}>
                    {budgetsWithSpent.map((budget) => {
                        const category = getCategoryById(budget.category);
                        return (
                            <div key={budget.id} className="bg-surface-dark border border-border-dark rounded-2xl p-4 relative group hover:border-border-dark/80 transition-all shadow-sm">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${getIconContainerClasses(budget.color, 'blue', 'light')}`}>
                                            <span className="material-symbols-outlined text-[24px]">{budget.icon || category?.icon || 'pie_chart'}</span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-bold text-white text-base truncate">{category?.name || budget.category}</h3>
                                            <p className="text-xs text-text-muted truncate">{formatMonth(budget.month)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleEditBudget(budget)}
                                            className="text-text-muted hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-lg"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteBudgetClick(budget)}
                                            className="text-text-muted hover:text-red-400 transition-colors p-1.5 hover:bg-white/5 rounded-lg"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-text-muted">Terpakai</span>
                                    <span className={`text-sm font-bold ${budget.percentage >= 90 ? 'text-red-400' : 'text-white'}`}>
                                        {budget.percentage}%
                                    </span>
                                </div>

                                <div className="w-full bg-surface-highlight rounded-full h-2 mb-4 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all ${getProgressColor(budget.percentage)}`}
                                        style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                                    ></div>
                                </div>

                                {budget.percentage >= 90 && (
                                    <div className="mb-4 p-2 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-red-400 text-[16px]">warning</span>
                                        <p className="text-xs text-red-400 font-medium truncate">
                                            {budget.percentage >= 100 ? 'Anggaran terlampaui!' : 'Hampir habis!'}
                                        </p>
                                    </div>
                                )}

                                <div className="flex justify-between items-end pt-2 border-t border-white/5">
                                    <div className="min-w-0 pr-2">
                                        <p className="text-text-muted text-[10px] uppercase tracking-wider mb-0.5">Sisa</p>
                                        <p className={`font-bold truncate text-lg ${budget.remaining <= 0 ? 'text-red-400' : 'text-green-400'}`}>
                                            {formatCurrency(Math.max(budget.remaining, 0))}
                                        </p>
                                    </div>
                                    <div className="text-right min-w-0">
                                        <p className="text-text-muted text-[10px] uppercase tracking-wider mb-0.5">Limit</p>
                                        <p className="font-medium text-white truncate text-base">{formatCurrency(budget.monthlyLimit)}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Add Category Card */}
                    <button
                        onClick={handleAddBudget}
                        className="bg-surface-dark border border-dashed border-border-dark rounded-2xl p-4 flex flex-col items-center justify-center min-h-[180px] cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group active:scale-95 touch-manipulation"
                    >
                        <div className="h-12 w-12 rounded-full bg-surface-highlight group-hover:bg-primary/20 flex items-center justify-center text-text-muted group-hover:text-primary transition-colors mb-3">
                            <span className="material-symbols-outlined text-2xl">add</span>
                        </div>
                        <p className="text-text-muted font-medium text-sm group-hover:text-primary transition-colors">Tambah Kategori</p>
                    </button>
                </div>
            )}

            {/* Budget Form Modal */}
            <BudgetForm
                isOpen={showAddBudget || !!editingBudget}
                onClose={() => {
                    setShowAddBudget(false);
                    setEditingBudget(null);
                }}
                budget={editingBudget}
            />

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={!!deletingBudget}
                onClose={() => setDeletingBudget(null)}
                onConfirm={handleDelete}
                title="Hapus Anggaran"
                message={`Apakah Anda yakin ingin menghapus anggaran "${getCategoryById(deletingBudget?.category)?.name || deletingBudget?.category}"?`}
                confirmLabel="Ya, Hapus"
                danger
            />
        </div>
    );
}
