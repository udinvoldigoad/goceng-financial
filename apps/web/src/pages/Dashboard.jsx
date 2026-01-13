export default function Dashboard() {
    const transactions = [
        { id: 1, name: 'Netflix Subscription', category: 'Hiburan', date: '23 Okt', amount: -180000, icon: 'movie', color: 'red' },
        { id: 2, name: 'Gaji Bulanan', category: 'Pendapatan', date: '20 Okt', amount: 15000000, icon: 'payments', color: 'green' },
        { id: 3, name: 'Kopi Kenangan', category: 'F&B', date: '19 Okt', amount: -25000, icon: 'coffee', color: 'orange' },
        { id: 4, name: 'Superindo Groceries', category: 'Belanja', date: '18 Okt', amount: -450000, icon: 'shopping_cart', color: 'blue' },
        { id: 5, name: 'Isi Bensin', category: 'Transportasi', date: '18 Okt', amount: -300000, icon: 'directions_car', color: 'purple' },
    ];

    const formatCurrency = (amount) => {
        const absAmount = Math.abs(amount);
        return `Rp ${absAmount.toLocaleString('id-ID')}`;
    };

    const weeklyData = [
        { week: 'Minggu 1', amount: 2100000, percentage: 60 },
        { week: 'Minggu 2', amount: 3400000, percentage: 85 },
        { week: 'Minggu 3', amount: 1200000, percentage: 30 },
        { week: 'Minggu 4', amount: 1800000, percentage: 55 },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Halo, Udin 👋</h1>
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
                            <h3 className="text-4xl lg:text-5xl font-bold tracking-tight text-white">Rp 120.000.000</h3>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="flex items-center text-sm font-medium text-green-400">
                                    <span className="material-symbols-outlined text-sm">trending_up</span>
                                    +2.5%
                                </span>
                                <span className="text-sm text-gray-500">vs bulan lalu</span>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row lg:items-center gap-8 lg:border-l lg:border-white/10 lg:pl-10">
                            <div className="min-w-[180px]">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-medium text-text-muted">Pemasukan Harian</p>
                                    <span className="material-symbols-outlined text-green-500 text-sm">arrow_downward</span>
                                </div>
                                <h3 className="mt-1 text-xl font-bold tracking-tight text-white">+Rp 500.000</h3>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="flex items-center text-xs font-medium text-green-400">+10%</span>
                                    <span className="text-xs text-gray-500">vs kemarin</span>
                                </div>
                            </div>
                            <div className="min-w-[180px]">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-medium text-text-muted">Pengeluaran Harian</p>
                                    <span className="material-symbols-outlined text-red-500 text-sm">arrow_upward</span>
                                </div>
                                <h3 className="mt-1 text-xl font-bold tracking-tight text-white">-Rp 150.000</h3>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="flex items-center text-xs font-medium text-text-muted">0%</span>
                                    <span className="text-xs text-gray-500">stabil</span>
                                </div>
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
                                <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">+Rp 15.000.000</h3>
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
                                <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">-Rp 8.500.000</h3>
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
                <div className="col-span-1 lg:col-span-2 rounded-2xl bg-surface-dark p-6 shadow-sm ring-1 ring-white/5">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-white">Realisasi Anggaran</h3>
                            <p className="text-sm text-text-muted">Oktober 2023</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-text-muted mb-1">Terpakai</p>
                            <div className="flex items-baseline gap-1 justify-end">
                                <span className="text-xl font-bold text-white">Rp 8.5jt</span>
                                <span className="text-sm text-gray-500">/ 10jt</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative h-[240px] w-full pt-8">
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between text-xs text-gray-600">
                            <div className="border-b border-dashed border-gray-700 w-full h-0"></div>
                            <div className="border-b border-dashed border-gray-700 w-full h-0"></div>
                            <div className="border-b border-dashed border-gray-700 w-full h-0"></div>
                            <div className="border-b border-dashed border-gray-700 w-full h-0"></div>
                            <div className="border-b border-gray-700 w-full h-0"></div>
                        </div>
                        {/* Bars */}
                        <div className="absolute inset-0 flex items-end justify-around px-4 pb-0">
                            {weeklyData.map((data, index) => (
                                <div key={index} className="flex flex-col items-center gap-2 group w-full">
                                    <div
                                        className="relative w-12 rounded-t-lg bg-primary/20 transition-all hover:bg-primary/30 flex items-end justify-center"
                                        style={{ height: `${data.percentage}%` }}
                                    >
                                        <div className="w-full bg-primary rounded-t-lg" style={{ height: '70%' }}></div>
                                        <div className="absolute -top-10 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                            {formatCurrency(data.amount)}
                                        </div>
                                    </div>
                                    <span className={`text-xs font-medium ${index === weeklyData.length - 1 ? 'text-white font-bold' : 'text-text-muted'}`}>
                                        {data.week}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="col-span-1 rounded-2xl bg-surface-dark p-6 shadow-sm ring-1 ring-white/5 flex flex-col h-full">
                    <div className="mb-6 flex items-center justify-between shrink-0">
                        <h3 className="text-lg font-bold text-white">Transaksi Terakhir</h3>
                        <a className="text-sm font-medium text-primary hover:text-primary/80" href="/transactions">Lihat Semua</a>
                    </div>
                    <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                        {transactions.map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-${tx.color}-900/20 text-${tx.color}-400`}>
                                        <span className="material-symbols-outlined text-[20px]">{tx.icon}</span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-white truncate">{tx.name}</p>
                                        <p className="text-xs text-text-muted truncate">{tx.category} • {tx.date}</p>
                                    </div>
                                </div>
                                <span className={`text-sm font-semibold shrink-0 ${tx.amount > 0 ? 'text-green-400' : 'text-white'}`}>
                                    {tx.amount > 0 ? '+' : '-'}{formatCurrency(tx.amount)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bills Section */}
            <div className="w-full rounded-2xl bg-surface-dark p-6 shadow-sm ring-1 ring-white/5 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Rincian Tagihan</h3>
                    <span className="text-sm font-medium text-text-muted">Total Tagihan: <span className="text-white font-bold">Rp 850.000</span></span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Internet Bill */}
                    <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-surface-highlight/20 transition-all hover:border-primary/20">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-cyan-900/30 flex items-center justify-center text-cyan-400">
                                <span className="material-symbols-outlined text-[24px]">wifi</span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white text-base">Internet & TV</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs text-text-muted">IndiHome Fiber</span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-900/30 text-red-400 font-medium">Jatuh tempo 25 Okt</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className="font-bold text-white text-lg">Rp 350.000</span>
                            <button className="px-5 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-sky-400 transition-colors shadow-sm shadow-primary/20">Bayar</button>
                        </div>
                    </div>
                    {/* Electricity Bill */}
                    <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-surface-highlight/20 transition-all hover:border-primary/20">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-yellow-900/30 flex items-center justify-center text-yellow-400">
                                <span className="material-symbols-outlined text-[24px]">bolt</span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white text-base">Listrik PLN</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs text-text-muted">Token Listrik</span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-900/30 text-red-400 font-medium">Jatuh tempo 25 Okt</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className="font-bold text-white text-lg">Rp 500.000</span>
                            <button className="px-5 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-sky-400 transition-colors shadow-sm shadow-primary/20">Bayar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
