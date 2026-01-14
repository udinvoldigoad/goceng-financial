import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import useStore from '../store/useStore';
import { formatCurrency, formatCompactCurrency, getCurrentMonth, calculatePercentage } from '../services/formatters';
import { getMonthlyIncome, getMonthlyExpense, getDailyIncome, getDailyExpense, getWeeklyBreakdown, getBudgetSpent } from '../services/calculations';
import { getCategoryById } from '../models/categories';
import FormattedNumberInput from '../components/ui/FormattedNumberInput';

export default function Dashboard() {
    const {
        wallets,
        assets,
        transactions,
        budgets,
        subscriptions,
        getTotalAssets,
        getRecentTransactions,
        getUpcomingSubscriptions,
        getBudgetsForMonth,
    } = useStore();

    const currentMonth = getCurrentMonth();
    const today = new Date().toISOString().split('T')[0];

    // Calculations
    const totalAssets = getTotalAssets();
    const recentTransactions = getRecentTransactions(5);
    const upcomingBills = getUpcomingSubscriptions(7);

    const monthlyIncome = getMonthlyIncome(transactions, currentMonth);
    const monthlyExpense = getMonthlyExpense(transactions, currentMonth);
    const dailyIncome = getDailyIncome(transactions, today);
    const dailyExpense = getDailyExpense(transactions, today);

    const weeklyData = useMemo(() => {
        const data = getWeeklyBreakdown(transactions, currentMonth);
        // Transform for Recharts
        return data.map(d => ({
            name: d.week,
            amount: d.amount,
            fullDate: d.startDate
        }));
    }, [transactions, currentMonth]);

    // Budget data
    const currentBudgets = getBudgetsForMonth(currentMonth);
    const totalBudgetLimit = currentBudgets.reduce((sum, b) => sum + b.monthlyLimit, 0);
    const totalBudgetSpent = currentBudgets.reduce((sum, b) => sum + getBudgetSpent(transactions, b.category, currentMonth), 0);
    const budgetPercentage = calculatePercentage(totalBudgetSpent, totalBudgetLimit || 1);

    const getWalletById = (id) => wallets.find(w => w.id === id);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-surface-dark border border-border-dark rounded-lg p-3 shadow-lg">
                    <p className="text-white font-medium mb-1">{label}</p>
                    <p className="text-primary font-bold">{formatCurrency(payload[0].value)}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Halo, Admin 👋</h1>
                    <p className="mt-2 text-base text-text-muted">Selamat datang kembali! Berikut ringkasan keuanganmu.</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="space-y-6">
                {/* Total Assets Card */}
                <div className="relative overflow-hidden rounded-2xl bg-surface-dark p-8 shadow-sm ring-1 ring-white/5 transition-all">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-text-muted">Total Aset</p>
                            </div>
                            <h3 className="text-4xl lg:text-5xl font-bold tracking-tight text-white">
                                {formatCurrency(totalAssets)}
                            </h3>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-sm text-text-muted">
                                    {wallets.length} wallet • {assets.length} aset
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row lg:items-center gap-8 lg:border-l lg:border-white/10 lg:pl-10">
                            <div className="min-w-[180px]">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-medium text-text-muted">Pemasukan Harian</p>
                                    <span className="material-symbols-outlined text-green-500 text-sm">arrow_downward</span>
                                </div>
                                <h3 className="mt-1 text-xl font-bold tracking-tight text-white">
                                    +{formatCurrency(dailyIncome)}
                                </h3>
                            </div>
                            <div className="min-w-[180px]">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-medium text-text-muted">Pengeluaran Harian</p>
                                    <span className="material-symbols-outlined text-red-500 text-sm">arrow_upward</span>
                                </div>
                                <h3 className="mt-1 text-xl font-bold tracking-tight text-white">
                                    -{formatCurrency(dailyExpense)}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Monthly Income/Expense Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="group relative overflow-hidden rounded-2xl bg-surface-dark p-6 shadow-sm ring-1 ring-white/5 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-text-muted">Pemasukan Bulan Ini</p>
                                <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">
                                    +{formatCurrency(monthlyIncome)}
                                </h3>
                            </div>
                            <div className="rounded-lg bg-green-900/20 p-2 text-green-400">
                                <span className="material-symbols-outlined">calendar_month</span>
                            </div>
                        </div>
                    </div>
                    <div className="group relative overflow-hidden rounded-2xl bg-surface-dark p-6 shadow-sm ring-1 ring-white/5 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-text-muted">Pengeluaran Bulan Ini</p>
                                <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">
                                    -{formatCurrency(monthlyExpense)}
                                </h3>
                            </div>
                            <div className="rounded-lg bg-red-900/20 p-2 text-red-400">
                                <span className="material-symbols-outlined">credit_score</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Budget Realization & Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Budget Chart */}
                <div className="col-span-1 lg:col-span-2 rounded-2xl bg-surface-dark p-6 shadow-sm ring-1 ring-white/5 flex flex-col">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-white">Realisasi Anggaran</h3>
                            <p className="text-sm text-text-muted">
                                {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-text-muted mb-1">Terpakai</p>
                            <div className="flex items-baseline gap-1 justify-end">
                                <span className={`text-xl font-bold ${budgetPercentage >= 90 ? 'text-red-400' : 'text-white'}`}>
                                    {formatCompactCurrency(totalBudgetSpent)}
                                </span>
                                <span className="text-sm text-gray-500">
                                    / {formatCompactCurrency(totalBudgetLimit || monthlyExpense)}
                                </span>
                            </div>
                            <div className="mt-1 w-full bg-surface-highlight rounded-full h-1.5 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${budgetPercentage >= 100 ? 'bg-red-500' :
                                            budgetPercentage >= 80 ? 'bg-orange-500' :
                                                'bg-primary'
                                        }`}
                                    style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 min-h-[300px] w-full">
                        {weeklyData.length > 0 && weeklyData.some(d => d.amount > 0) ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e343d" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#8ca3ad"
                                        fontSize={12}
                                        axisLine={false}
                                        tickLine={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        stroke="#8ca3ad"
                                        fontSize={12}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(value) => formatCompactCurrency(value)}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#1e343d', opacity: 0.4 }}
                                        content={<CustomTooltip />}
                                    />
                                    <Bar dataKey="amount" radius={[4, 4, 0, 0]} maxBarSize={50}>
                                        {weeklyData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={index === weeklyData.length - 1 ? '#3399FF' : '#3399FF80'}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-text-muted">
                                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">bar_chart</span>
                                <p>Belum ada data pengeluaran minggu ini</p>
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-center text-text-muted mt-4">
                        Grafik menunjukkan pengeluaran per minggu di bulan ini
                    </p>
                </div>

                {/* Recent Transactions */}
                <div className="col-span-1 rounded-2xl bg-surface-dark p-6 shadow-sm ring-1 ring-white/5 flex flex-col h-full max-h-[500px]">
                    <div className="mb-6 flex items-center justify-between shrink-0">
                        <h3 className="text-lg font-bold text-white">Transaksi Terakhir</h3>
                        <Link className="text-sm font-medium text-primary hover:text-primary/80" to="/transactions">
                            Lihat Semua
                        </Link>
                    </div>
                    <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                        {recentTransactions.length === 0 ? (
                            <div className="text-center py-8 text-text-muted">
                                <span className="material-symbols-outlined text-3xl mb-2">receipt_long</span>
                                <p className="text-sm">Belum ada transaksi</p>
                            </div>
                        ) : (
                            recentTransactions.map((tx) => {
                                const category = getCategoryById(tx.category);
                                return (
                                    <div key={tx.id} className="flex items-center justify-between gap-3 p-2 hover:bg-surface-highlight rounded-lg transition-colors cursor-default">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-${category?.color || 'gray'}-900/20 text-${category?.color || 'gray'}-400`}>
                                                <span className="material-symbols-outlined text-[20px]">
                                                    {tx.type === 'transfer' ? 'swap_horiz' : category?.icon || 'receipt'}
                                                </span>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-semibold text-white truncate">
                                                    {tx.description || category?.name || 'Transaksi'}
                                                </p>
                                                <p className="text-xs text-text-muted truncate">
                                                    {category?.name || tx.category} • {new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`text-sm font-semibold shrink-0 ${tx.type === 'income' ? 'text-green-400' :
                                                tx.type === 'transfer' ? 'text-blue-400' : 'text-white'
                                            }`}>
                                            {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* Bills Section */}
            {upcomingBills.length > 0 && (
                <div className="w-full rounded-2xl bg-surface-dark p-6 shadow-sm ring-1 ring-white/5 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white">Rincian Tagihan</h3>
                        <span className="text-sm font-medium text-text-muted">
                            Total Tagihan: <span className="text-white font-bold">
                                {formatCurrency(upcomingBills.reduce((sum, b) => sum + b.amount, 0))}
                            </span>
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {upcomingBills.slice(0, 4).map((bill) => {
                            const wallet = getWalletById(bill.walletId);
                            const dueDate = new Date(bill.nextDueDate);
                            const today = new Date();
                            const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                            const dueText = diffDays === 0 ? 'Hari ini' : diffDays === 1 ? 'Besok' : `${diffDays} hari lagi`;

                            return (
                                <div key={bill.id} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-surface-highlight/20 transition-all hover:border-primary/20">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-12 w-12 rounded-full bg-${bill.color || 'cyan'}-900/30 flex items-center justify-center text-${bill.color || 'cyan'}-400`}>
                                            <span className="material-symbols-outlined text-[24px]">{bill.icon || 'receipt'}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-white text-base">{bill.name}</h4>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-xs text-text-muted">{wallet?.name || 'Auto-debit'}</span>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${diffDays <= 2 ? 'bg-red-900/30 text-red-400' : 'bg-yellow-900/30 text-yellow-400'
                                                    }`}>
                                                    {dueText}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="font-bold text-white text-lg">{formatCurrency(bill.amount)}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Empty State for new users */}
            {wallets.length === 0 && transactions.length === 0 && (
                <div className="rounded-2xl bg-surface-dark p-8 text-center ring-1 ring-white/5">
                    <span className="material-symbols-outlined text-5xl text-text-muted mb-4">rocket_launch</span>
                    <h3 className="text-xl font-bold text-white mb-2">Mulai Perjalanan Keuanganmu</h3>
                    <p className="text-text-muted mb-6 max-w-md mx-auto">
                        Tambahkan wallet pertamamu untuk mulai melacak keuangan. Atau muat data demo untuk melihat tampilan aplikasi.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            to="/assets"
                            className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Tambah Wallet
                        </Link>
                        <Link
                            to="/settings"
                            className="px-6 py-2.5 bg-surface-highlight text-white font-medium rounded-lg hover:bg-surface-highlight/80 transition-colors"
                        >
                            Muat Demo Data
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
