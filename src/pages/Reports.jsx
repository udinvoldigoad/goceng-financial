import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import useStore from '../store/useStore';
import { formatCurrency, formatCompactCurrency, getCurrentMonth, formatMonth, calculatePercentage } from '../services/formatters';
import { getMonthlyIncome, getMonthlyExpense, getCategoryBreakdown, getMonthlyTrend, calculateSavingsRate } from '../services/calculations';
import { getCategoryById, EXPENSE_CATEGORIES } from '../models/categories';
import { exportTransactionsCsv } from '../services/exportCsv';
import { toast } from '../components/ui/Toast';

const COLORS = ['#3399FF', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export default function Reports() {
    const { transactions, wallets } = useStore();
    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

    // Generate month options (last 12 months)
    const monthOptions = useMemo(() => {
        const options = [];
        const now = new Date();
        for (let i = 0; i < 12; i++) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const label = d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
            options.push({ value, label });
        }
        return options;
    }, []);

    // Calculations for selected month
    const monthlyIncome = getMonthlyIncome(transactions, selectedMonth);
    const monthlyExpense = getMonthlyExpense(transactions, selectedMonth);
    const netIncome = monthlyIncome - monthlyExpense;
    const savingsRate = calculateSavingsRate(monthlyIncome, monthlyExpense);

    // Category breakdown for pie chart
    const categoryBreakdown = useMemo(() => {
        const breakdown = getCategoryBreakdown(transactions, selectedMonth);
        return breakdown.map(item => {
            const category = getCategoryById(item.category);
            return {
                ...item,
                name: category?.name || item.category,
                color: category?.color || 'gray',
            };
        });
    }, [transactions, selectedMonth]);

    // Monthly trend for line chart
    const monthlyTrend = useMemo(() => {
        return getMonthlyTrend(transactions, 6).map(item => ({
            ...item,
            monthLabel: new Date(item.month + '-01').toLocaleDateString('id-ID', { month: 'short' }),
        }));
    }, [transactions]);

    // Filter transactions for selected month for export
    const monthTransactions = useMemo(() => {
        return transactions.filter(t => t.date.startsWith(selectedMonth));
    }, [transactions, selectedMonth]);

    const handleExportCsv = () => {
        if (monthTransactions.length === 0) {
            toast.error('Tidak ada transaksi untuk diekspor');
            return;
        }
        exportTransactionsCsv(monthTransactions, wallets, `transaksi-${selectedMonth}`);
        toast.success('File CSV berhasil didownload!');
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-surface-dark border border-border-dark rounded-lg p-3 shadow-lg">
                    <p className="text-white font-medium">{payload[0].name}</p>
                    <p className="text-text-muted text-sm">{formatCurrency(payload[0].value)}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Laporan Keuangan</h1>
                    <p className="text-text-muted mt-1">Analisis dan pantau perkembangan keuanganmu.</p>
                </div>
                <div className="flex items-center gap-4">
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="px-4 py-2 rounded-lg bg-surface-dark border border-border-dark text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        {monthOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleExportCsv}
                        className="flex items-center gap-2 px-4 py-2 bg-surface-dark border border-border-dark rounded-lg text-white text-sm font-medium hover:bg-surface-highlight transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">download</span>
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
                <div className="bg-surface-dark border border-border-dark rounded-2xl p-3 sm:p-5">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="p-1.5 sm:p-2 rounded-lg bg-green-500/10 text-green-400">
                            <span className="material-symbols-outlined text-[18px] sm:text-[24px]">arrow_downward</span>
                        </div>
                        <span className="text-[10px] sm:text-sm text-text-muted">Total Pemasukan</span>
                    </div>
                    <p className="text-base sm:text-2xl font-bold text-green-400 truncate">{formatCurrency(monthlyIncome)}</p>
                </div>

                <div className="bg-surface-dark border border-border-dark rounded-2xl p-3 sm:p-5">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="p-1.5 sm:p-2 rounded-lg bg-red-500/10 text-red-400">
                            <span className="material-symbols-outlined text-[18px] sm:text-[24px]">arrow_upward</span>
                        </div>
                        <span className="text-[10px] sm:text-sm text-text-muted">Total Pengeluaran</span>
                    </div>
                    <p className="text-base sm:text-2xl font-bold text-red-400 truncate">{formatCurrency(monthlyExpense)}</p>
                </div>

                <div className="bg-surface-dark border border-border-dark rounded-2xl p-3 sm:p-5">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className={`p-1.5 sm:p-2 rounded-lg ${netIncome >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                            <span className="material-symbols-outlined text-[18px] sm:text-[24px]">account_balance</span>
                        </div>
                        <span className="text-[10px] sm:text-sm text-text-muted">Saldo Bersih</span>
                    </div>
                    <p className={`text-base sm:text-2xl font-bold truncate ${netIncome >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {netIncome >= 0 ? '+' : ''}{formatCurrency(netIncome)}
                    </p>
                </div>

                <div className="bg-surface-dark border border-border-dark rounded-2xl p-3 sm:p-5">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className={`p-1.5 sm:p-2 rounded-lg ${savingsRate >= 20 ? 'bg-green-500/10 text-green-400' : savingsRate >= 0 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'}`}>
                            <span className="material-symbols-outlined text-[18px] sm:text-[24px]">savings</span>
                        </div>
                        <span className="text-[10px] sm:text-sm text-text-muted">Rasio Tabungan</span>
                    </div>
                    <p className={`text-base sm:text-2xl font-bold ${savingsRate >= 20 ? 'text-green-400' : savingsRate >= 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {savingsRate}%
                    </p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Category Breakdown Pie Chart */}
                <div className="bg-surface-dark border border-border-dark rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Pengeluaran per Kategori</h3>
                    {categoryBreakdown.length === 0 ? (
                        <div className="h-[300px] flex items-center justify-center text-text-muted">
                            <div className="text-center">
                                <span className="material-symbols-outlined text-4xl mb-2">pie_chart</span>
                                <p>Belum ada data pengeluaran</p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryBreakdown}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={2}
                                        dataKey="amount"
                                    >
                                        {categoryBreakdown.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                    {categoryBreakdown.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {categoryBreakdown.slice(0, 5).map((item, index) => (
                                <div key={item.category} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                        ></div>
                                        <span className="text-text-muted">{item.name}</span>
                                    </div>
                                    <span className="text-white font-medium">{formatCurrency(item.amount)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Monthly Trend Line Chart */}
                <div className="bg-surface-dark border border-border-dark rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Tren Bulanan</h3>
                    {transactions.length === 0 ? (
                        <div className="h-[300px] flex items-center justify-center text-text-muted">
                            <div className="text-center">
                                <span className="material-symbols-outlined text-4xl mb-2">show_chart</span>
                                <p>Belum ada data transaksi</p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyTrend}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e343d" />
                                    <XAxis
                                        dataKey="monthLabel"
                                        stroke="#8ca3ad"
                                        fontSize={12}
                                    />
                                    <YAxis
                                        stroke="#8ca3ad"
                                        fontSize={12}
                                        tickFormatter={(value) => formatCompactCurrency(value)}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#18282f',
                                            border: '1px solid #1e343d',
                                            borderRadius: '8px',
                                        }}
                                        formatter={(value) => formatCurrency(value)}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="income"
                                        name="Pemasukan"
                                        stroke="#22c55e"
                                        strokeWidth={2}
                                        dot={{ fill: '#22c55e', strokeWidth: 2 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="expense"
                                        name="Pengeluaran"
                                        stroke="#ef4444"
                                        strokeWidth={2}
                                        dot={{ fill: '#ef4444', strokeWidth: 2 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>

            {/* Transaction Summary */}
            <div className="bg-surface-dark border border-border-dark rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">Ringkasan {formatMonth(selectedMonth)}</h3>
                    <span className="text-sm text-text-muted">{monthTransactions.length} transaksi</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                        <p className="text-text-muted text-xs uppercase mb-1">Total Transaksi</p>
                        <p className="text-xl font-bold text-white">{monthTransactions.length}</p>
                    </div>
                    <div>
                        <p className="text-text-muted text-xs uppercase mb-1">Pemasukan</p>
                        <p className="text-xl font-bold text-white">
                            {monthTransactions.filter(t => t.type === 'income').length}
                        </p>
                    </div>
                    <div>
                        <p className="text-text-muted text-xs uppercase mb-1">Pengeluaran</p>
                        <p className="text-xl font-bold text-white">
                            {monthTransactions.filter(t => t.type === 'expense').length}
                        </p>
                    </div>
                    <div>
                        <p className="text-text-muted text-xs uppercase mb-1">Transfer</p>
                        <p className="text-xl font-bold text-white">
                            {monthTransactions.filter(t => t.type === 'transfer').length}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
