import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import useStore from '../store/useStore';
import { formatCurrency, formatCompactCurrency } from '../services/formatters';
import { getMonthlyIncome, getMonthlyExpense, getCategoryBreakdown, getWeeklyBreakdown } from '../services/calculations';
import TransactionForm from '../components/forms/TransactionForm';

export default function Dashboard() {
    const {
        user,
        wallets,
        transactions,
        budgets,
        getTotalAssets,
        getRecentTransactions,
        getBudgetsForMonth,
        getUpcomingSubscriptions,
    } = useStore();

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [showTransactionForm, setShowTransactionForm] = useState(false);
    const [showAssets, setShowAssets] = useState(true);

    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    const formatMonthYear = (date) => {
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const currentMonthStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;

    // Calculations
    const totalAssets = getTotalAssets();
    const recentTransactions = getRecentTransactions(5);
    const monthlyBudgets = getBudgetsForMonth(currentMonthStr);
    const upcomingBills = getUpcomingSubscriptions(30); // next 30 days

    const monthlyIncome = getMonthlyIncome(transactions, currentMonthStr);
    const monthlyExpense = getMonthlyExpense(transactions, currentMonthStr);
    const netSavings = monthlyIncome - monthlyExpense;
    const savingsRate = monthlyIncome > 0 ? Math.round((netSavings / monthlyIncome) * 100) : 0;

    // Weekly breakdown for bar chart
    const weeklyData = useMemo(() => {
        const data = getWeeklyBreakdown(transactions, currentMonthStr);
        return data.map(d => ({
            name: d.week,
            amount: d.amount,
        }));
    }, [transactions, currentMonthStr]);

    // Category breakdown for pie chart
    const categoryData = useMemo(() => {
        const breakdown = getCategoryBreakdown(transactions, currentMonthStr);
        return breakdown.slice(0, 5);
    }, [transactions, currentMonthStr]);

    const COLORS = ['#3399FF', '#22C55E', '#EAB308', '#EF4444', '#A855F7'];

    // Gamification - Level System
    const calculateLevel = (totalAssets) => {
        if (totalAssets >= 100000000) return { level: 10, title: 'Master', nextThreshold: null };
        if (totalAssets >= 50000000) return { level: 9, title: 'Expert', nextThreshold: 100000000 };
        if (totalAssets >= 25000000) return { level: 8, title: 'Advanced', nextThreshold: 50000000 };
        if (totalAssets >= 10000000) return { level: 7, title: 'Intermediate', nextThreshold: 25000000 };
        if (totalAssets >= 5000000) return { level: 6, title: 'Established', nextThreshold: 10000000 };
        if (totalAssets >= 2000000) return { level: 5, title: 'Growing', nextThreshold: 5000000 };
        if (totalAssets >= 1000000) return { level: 4, title: 'Builder', nextThreshold: 2000000 };
        if (totalAssets >= 500000) return { level: 3, title: 'Saver', nextThreshold: 1000000 };
        if (totalAssets >= 100000) return { level: 2, title: 'Starter', nextThreshold: 500000 };
        return { level: 1, title: 'Beginner', nextThreshold: 100000 };
    };

    // Get icon based on level
    const getLevelIcon = (level) => {
        const icons = {
            1: { icon: 'eco', color: 'text-gray-400', bg: 'bg-gray-500/20' },           // Beginner - seedling
            2: { icon: 'rocket_launch', color: 'text-blue-400', bg: 'bg-blue-500/20' }, // Starter - rocket
            3: { icon: 'savings', color: 'text-green-400', bg: 'bg-green-500/20' },     // Saver - piggy bank
            4: { icon: 'construction', color: 'text-yellow-400', bg: 'bg-yellow-500/20' }, // Builder - construction
            5: { icon: 'trending_up', color: 'text-lime-400', bg: 'bg-lime-500/20' },   // Growing - growth
            6: { icon: 'apartment', color: 'text-cyan-400', bg: 'bg-cyan-500/20' },     // Established - building
            7: { icon: 'school', color: 'text-indigo-400', bg: 'bg-indigo-500/20' },    // Intermediate - graduate
            8: { icon: 'military_tech', color: 'text-purple-400', bg: 'bg-purple-500/20' }, // Advanced - medal
            9: { icon: 'diamond', color: 'text-pink-400', bg: 'bg-pink-500/20' },       // Expert - diamond
            10: { icon: 'workspace_premium', color: 'text-amber-400', bg: 'bg-amber-500/20' }, // Master - crown
        };
        return icons[level] || icons[1];
    };

    const levelData = calculateLevel(totalAssets);
    const progressToNext = levelData.nextThreshold
        ? Math.min((totalAssets / levelData.nextThreshold) * 100, 100)
        : 100;
    const amountToNext = levelData.nextThreshold ? levelData.nextThreshold - totalAssets : 0;

    // Runway Calculation - based on current month expenses
    const lastMonthExpense = monthlyExpense; // Use current month's expenses for runway calculation

    // Fixed runway calculation - show infinity properly
    const runwayDays = lastMonthExpense > 0 ? Math.floor((totalAssets / lastMonthExpense) * 30) : null;
    const runwayStatus = runwayDays === null ? 'BELUM ADA DATA' :
        runwayDays >= 180 ? 'SANGAT BAIK' :
            runwayDays >= 90 ? 'BAIK' :
                runwayDays >= 30 ? 'PERLU PERHATIAN' : 'KRITIS';

    const dailyRate = lastMonthExpense / 30;

    // Custom tooltip for chart
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
        <div className="max-w-6xl mx-auto space-y-6 pb-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-stagger-in" style={{ animationDelay: '0s' }}>
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-white">
                        Selamat datang, {user?.name ? user.name.split(' ')[0] : 'User'} 👋
                    </h1>
                    <p className="text-sm text-text-muted">Bulan Ini</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex-1 md:flex-none flex items-center gap-2 bg-surface-dark rounded-lg px-3 py-2 border border-border-dark justify-between md:justify-center">
                        <button onClick={prevMonth} className="text-text-muted hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                        </button>
                        <div className="flex items-center gap-2 min-w-[140px] justify-center">
                            <span className="material-symbols-outlined text-[18px] text-text-muted">calendar_today</span>
                            <span className="text-sm font-medium text-white">{formatMonthYear(currentMonth)}</span>
                        </div>
                        <button onClick={nextMonth} className="text-text-muted hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                        </button>
                    </div>
                    <button
                        onClick={() => setShowTransactionForm(true)}
                        className="hidden md:flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span className="text-sm">Tambah Transaksi</span>
                    </button>
                </div>
            </div>

            {/* Row 1: Assets & Runway */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-stagger-in" style={{ animationDelay: '0.1s' }}>
                {/* Total Aset Card with Gamification */}
                <div className="lg:col-span-2 bg-surface-dark rounded-2xl p-5 border border-transparent shadow-[0_0_25px_rgba(59,130,246,0.15)] relative overflow-hidden">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-surface-highlight flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-[18px]">account_balance</span>
                            </div>
                            <span className="text-sm font-medium text-text-muted">Total Aset</span>
                            <span
                                className="material-symbols-outlined text-text-muted text-[16px] cursor-pointer hover:text-white"
                                onClick={() => setShowAssets(!showAssets)}
                            >
                                {showAssets ? 'visibility' : 'visibility_off'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-highlight rounded-lg border border-border-dark">
                            <span className="material-symbols-outlined text-primary text-[16px]">emoji_events</span>
                            <span className="text-xs font-medium text-white">Level {levelData.level}</span>
                        </div>
                    </div>

                    <div className="mb-4">
                        <p className="text-xs text-text-muted mb-1">Total Aset</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-2 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                            {showAssets ? formatCurrency(totalAssets) : '••••••••'}
                            <span className="material-symbols-outlined text-primary text-[24px]">trending_up</span>
                        </h2>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                        <div className={`w-8 h-8 rounded-full ${getLevelIcon(levelData.level).bg} flex items-center justify-center`}>
                            <span className={`material-symbols-outlined ${getLevelIcon(levelData.level).color} text-[16px]`}>{getLevelIcon(levelData.level).icon}</span>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">{levelData.title}</p>
                            <p className="text-xs text-text-muted">Level {levelData.level} / 10</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-text-muted">Menuju Level Berikutnya</span>
                            <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary font-medium">
                                {levelData.title}
                            </span>
                        </div>
                        <div className="relative h-2 bg-surface-highlight rounded-full overflow-hidden">
                            <div
                                className="absolute left-0 top-0 h-full bg-gradient-to-r from-white to-primary rounded-full transition-all duration-500"
                                style={{ width: `${progressToNext}%` }}
                            />
                        </div>
                        <div className="flex items-center justify-between text-xs text-text-muted">
                            <span>Rp 0</span>
                            <span>{formatCompactCurrency(amountToNext)} lagi</span>
                            <span>{levelData.nextThreshold ? formatCompactCurrency(levelData.nextThreshold) : 'MAX'}</span>
                        </div>
                    </div>
                </div>

                {/* Runway Keuangan Card */}
                <div className="bg-surface-dark rounded-2xl p-5 border border-border-dark">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-semibold text-white">Runway Keuangan</h3>
                            <p className="text-xs text-text-muted">Berdasarkan pengeluaran 1 bulan terakhir</p>
                        </div>
                        <span className="material-symbols-outlined text-text-muted text-[20px] cursor-pointer hover:text-white">timeline</span>
                    </div>

                    <div className="bg-surface-highlight rounded-xl p-4 mb-4">
                        <p className={`text-xs font-bold mb-2 ${runwayStatus === 'BELUM ADA DATA' ? 'text-text-muted' :
                            runwayStatus === 'SANGAT BAIK' ? 'text-green-400' :
                                runwayStatus === 'BAIK' ? 'text-primary' :
                                    runwayStatus === 'PERLU PERHATIAN' ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                            {runwayStatus}
                        </p>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="material-symbols-outlined text-primary text-[24px]">
                                {runwayDays === null ? 'all_inclusive' : 'calendar_today'}
                            </span>
                            <span className="text-2xl font-bold text-white">
                                {runwayDays === null ? 'hari lagi' : `${runwayDays} hari`}
                            </span>
                        </div>
                        <p className="text-xs text-text-muted">
                            {runwayDays === null
                                ? 'Belum ada data pengeluaran untuk menghitung runway'
                                : 'Estimasi ketahanan finansial'
                            }
                        </p>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-xs text-text-muted">Rata-rata Harian</span>
                        <span className="text-sm font-bold text-primary">
                            {lastMonthExpense > 0 ? `Rp ${Math.round(dailyRate).toLocaleString('id-ID')}` : '-'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Row 2: 4-Column Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-stagger-in" style={{ animationDelay: '0.2s' }}>
                {/* Pemasukan */}
                <div className="bg-surface-dark rounded-2xl p-4 border border-border-dark">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-text-muted">Pemasukan</span>
                        <span className="material-symbols-outlined text-green-400 text-[18px]">trending_up</span>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-white">
                        Rp {monthlyIncome.toLocaleString('id-ID')}
                    </h3>
                </div>

                {/* Pengeluaran */}
                <div className="bg-surface-dark rounded-2xl p-4 border border-border-dark">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-text-muted">Pengeluaran</span>
                        <span className="material-symbols-outlined text-red-400 text-[18px]">trending_down</span>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-white">
                        Rp {monthlyExpense.toLocaleString('id-ID')}
                    </h3>
                </div>

                {/* Saldo */}
                <div className="bg-surface-dark rounded-2xl p-4 border border-border-dark">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-text-muted">Saldo</span>
                        <span className="material-symbols-outlined text-primary text-[18px]">account_balance_wallet</span>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-white">
                        {formatCurrency(totalAssets)}
                    </h3>
                </div>

                {/* Savings Rate */}
                <div className="bg-surface-dark rounded-2xl p-4 border border-border-dark">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-text-muted">Savings Rate</span>
                        <span className="material-symbols-outlined text-green-400 text-[18px]">savings</span>
                    </div>
                    <h3 className={`text-lg md:text-xl font-bold ${savingsRate >= 20 ? 'text-green-400' : savingsRate >= 0 ? 'text-white' : 'text-red-400'}`}>
                        {savingsRate}%
                    </h3>
                </div>
            </div>

            {/* Row 3: Ringkasan (CHART) & Pengeluaran per Kategori */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-stagger-in" style={{ animationDelay: '0.3s' }}>
                {/* Ringkasan - Bar Chart */}
                <div className="bg-surface-dark rounded-2xl p-5 border border-border-dark min-h-[280px] flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-4">Ringkasan</h3>
                    {weeklyData.length === 0 || weeklyData.every(d => d.amount === 0) ? (
                        <div className="flex-1 flex items-center justify-center text-text-muted">
                            <p className="text-sm">Belum ada transaksi</p>
                        </div>
                    ) : (
                        <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false} />
                                    <XAxis dataKey="name" stroke="#888888" fontSize={12} axisLine={false} tickLine={false} dy={10} />
                                    <YAxis stroke="#888888" fontSize={12} axisLine={false} tickLine={false} tickFormatter={(value) => formatCompactCurrency(value)} />
                                    <Tooltip cursor={{ fill: '#2A2A2A', opacity: 0.4 }} content={<CustomTooltip />} />
                                    <Bar dataKey="amount" radius={[4, 4, 0, 0]} maxBarSize={50} fill="#3399FF" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* Pengeluaran per Kategori */}
                <div className="bg-surface-dark rounded-2xl p-5 border border-border-dark min-h-[280px]">
                    <h3 className="text-lg font-bold text-white mb-6">Pengeluaran per Kategori</h3>
                    {categoryData.length === 0 ? (
                        <div className="flex items-center justify-center h-32 text-text-muted">
                            <p className="text-sm">Tidak ada data pengeluaran</p>
                        </div>
                    ) : (
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={25}
                                            outerRadius={40}
                                            dataKey="amount"
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex-1 space-y-2">
                                {categoryData.map((cat, index) => (
                                    <div key={cat.category} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                            <span className="text-xs text-text-muted">{cat.category}</span>
                                        </div>
                                        <span className="text-xs font-medium text-white">{formatCompactCurrency(cat.amount)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Row 4: Transaksi Terbaru & Progress Anggaran */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-stagger-in" style={{ animationDelay: '0.4s' }}>
                {/* Transaksi Terbaru */}
                <div className="bg-surface-dark rounded-2xl p-5 border border-border-dark">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Transaksi Terbaru</h3>
                        <Link to="/transactions" className="text-sm font-medium text-primary hover:text-primary/80">Lihat Semua</Link>
                    </div>
                    {recentTransactions.length === 0 ? (
                        <div className="flex items-center justify-center h-32 text-text-muted">
                            <p className="text-sm">Belum ada transaksi</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentTransactions.slice(0, 4).map((tx) => (
                                <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-highlight/50 hover:bg-surface-highlight transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-green-500/20 text-green-400' :
                                            tx.type === 'transfer' ? 'bg-blue-500/20 text-blue-400' :
                                                'bg-red-500/20 text-red-400'
                                            }`}>
                                            <span className="material-symbols-outlined text-[20px]">
                                                {tx.type === 'income' ? 'arrow_downward' : tx.type === 'transfer' ? 'swap_horiz' : 'arrow_upward'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">{tx.description || tx.category}</p>
                                            <p className="text-xs text-text-muted">
                                                {new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`text-sm font-bold ${tx.type === 'income' ? 'text-green-400' :
                                        tx.type === 'transfer' ? 'text-blue-400' : 'text-white'
                                        }`}>
                                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Progress Anggaran */}
                <div className="bg-surface-dark rounded-2xl p-5 border border-border-dark">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Progress Anggaran</h3>
                        <Link to="/budget" className="text-sm font-medium text-primary hover:text-primary/80">Lihat Semua</Link>
                    </div>
                    {monthlyBudgets.length === 0 ? (
                        <div className="flex items-center justify-center h-32 text-text-muted">
                            <p className="text-sm">Belum ada anggaran bulan ini</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {monthlyBudgets.slice(0, 3).map((budget) => {
                                const spent = transactions
                                    .filter(t => t.type === 'expense' && t.category === budget.category && t.date.startsWith(currentMonthStr))
                                    .reduce((sum, t) => sum + t.amount, 0);
                                const percentage = Math.min((spent / budget.amount) * 100, 100);
                                return (
                                    <div key={budget.id} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-white">{budget.category}</span>
                                            <span className="text-xs text-text-muted">{formatCompactCurrency(spent)} / {formatCompactCurrency(budget.amount)}</span>
                                        </div>
                                        <div className="relative h-2 bg-surface-highlight rounded-full overflow-hidden">
                                            <div
                                                className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${percentage >= 100 ? 'bg-red-500' : percentage >= 80 ? 'bg-yellow-500' : 'bg-primary'}`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Row 5: Hutang & Piutang */}
            <div className="bg-surface-dark rounded-2xl p-5 border border-border-dark animate-stagger-in" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[20px]">currency_exchange</span>
                        <h3 className="text-lg font-bold text-white">Hutang & Piutang</h3>
                    </div>
                    <Link to="/debts" className="text-sm font-medium text-primary hover:text-primary/80">Lihat Semua</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Hutang Saya */}
                    <div className="bg-surface-highlight rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-red-400 text-[18px]">south_west</span>
                            <span className="text-xs text-text-muted">Hutang Saya</span>
                        </div>
                        <p className="text-xl font-bold text-red-400 mb-1">Rp 0</p>
                        <p className="text-xs text-text-muted">0 belum lunas</p>
                    </div>

                    {/* Piutang Saya */}
                    <div className="bg-surface-highlight rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-green-400 text-[18px]">north_east</span>
                            <span className="text-xs text-text-muted">Piutang Saya</span>
                        </div>
                        <p className="text-xl font-bold text-green-400 mb-1">Rp 0</p>
                        <p className="text-xs text-text-muted">0 unpaid</p>
                    </div>
                </div>
            </div>

            {/* Row 6: Tagihan Mendatang (from Subscriptions) */}
            <div className="bg-surface-dark rounded-2xl p-5 border border-border-dark">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-yellow-400 text-[20px]">receipt_long</span>
                        <h3 className="text-lg font-bold text-white">Tagihan Mendatang</h3>
                    </div>
                    <Link to="/subscriptions" className="text-sm font-medium text-primary hover:text-primary/80">Lihat Semua</Link>
                </div>
                {upcomingBills.length === 0 ? (
                    <div className="flex items-center justify-center h-20 text-text-muted">
                        <p className="text-sm">Tidak ada tagihan dalam 30 hari ke depan</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {upcomingBills.slice(0, 5).map((bill) => (
                            <div key={bill.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-highlight/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                                        <span className="material-symbols-outlined text-[20px]">event</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">{bill.name}</p>
                                        <p className="text-xs text-text-muted">
                                            Jatuh tempo: {new Date(bill.nextDueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-white">{formatCurrency(bill.amount)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Transaction Form Modal */}
            <TransactionForm
                isOpen={showTransactionForm}
                onClose={() => setShowTransactionForm(false)}
            />
        </div>
    );
}
