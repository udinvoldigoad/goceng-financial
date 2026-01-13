import { useState } from 'react';

export default function Budget() {
    const [showAddBudget, setShowAddBudget] = useState(false);

    const formatCurrency = (amount) => {
        return `Rp ${amount.toLocaleString('id-ID')}`;
    };

    const budgets = [
        { id: 1, name: 'Makan & Minum', type: 'Harian', used: 3750000, total: 5000000, icon: 'restaurant', color: 'orange' },
        { id: 2, name: 'Transportasi', type: 'Bulanan', used: 1350000, total: 3000000, icon: 'directions_bus', color: 'blue' },
        { id: 3, name: 'Hiburan', type: 'Opsional', used: 1800000, total: 2000000, icon: 'movie', color: 'purple' },
        { id: 4, name: 'Belanja Bulanan', type: 'Wajib', used: 400000, total: 2000000, icon: 'shopping_bag', color: 'green' },
        { id: 5, name: 'Tagihan & Utilitas', type: 'Rumah', used: 500000, total: 500000, icon: 'bolt', color: 'yellow' },
    ];

    const totalBudget = budgets.reduce((sum, b) => sum + b.total, 0);
    const totalUsed = budgets.reduce((sum, b) => sum + b.used, 0);

    const getPercentage = (used, total) => Math.round((used / total) * 100);
    const getProgressColor = (percentage) => {
        if (percentage >= 90) return 'bg-red-500';
        if (percentage >= 70) return 'bg-orange-500';
        if (percentage >= 50) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold text-white">Anggaran</h1>
                    <div className="flex items-center gap-4">
                        <div>
                            <p className="text-text-muted text-sm">Total Anggaran Bulan Ini</p>
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-black text-white">{formatCurrency(totalBudget)}</span>
                                <span className="text-sm text-green-400 font-medium">+5% vs lalu</span>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setShowAddBudget(true)}
                    className="flex items-center gap-2 cursor-pointer justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-bold tracking-wide shadow-lg shadow-primary/20"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    <span>Atur Anggaran Baru</span>
                </button>
            </div>

            {/* Budget Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {budgets.map((budget) => {
                    const percentage = getPercentage(budget.used, budget.total);
                    const remaining = budget.total - budget.used;
                    return (
                        <div key={budget.id} className="bg-surface-dark border border-border-dark rounded-2xl p-5 relative group hover:border-border-dark/80 transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`h-10 w-10 rounded-xl bg-${budget.color}-500/20 flex items-center justify-center text-${budget.color}-400`}>
                                        <span className="material-symbols-outlined">{budget.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">{budget.name}</h3>
                                        <p className="text-xs text-text-muted">{budget.type}</p>
                                    </div>
                                </div>
                                <button className="text-text-muted hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                </button>
                            </div>

                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-text-muted">Terpakai</span>
                                <span className={`text-sm font-bold ${percentage >= 90 ? 'text-red-400' : 'text-white'}`}>{percentage}%</span>
                            </div>

                            <div className="w-full bg-surface-highlight rounded-full h-2 mb-4 overflow-hidden">
                                <div
                                    className={`h-2 rounded-full transition-all ${getProgressColor(percentage)}`}
                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                ></div>
                            </div>

                            <div className="flex justify-between text-sm">
                                <div>
                                    <p className="text-text-muted text-xs">Sisa Anggaran</p>
                                    <p className={`font-bold ${remaining <= 0 ? 'text-red-400' : 'text-white'}`}>
                                        {formatCurrency(Math.max(remaining, 0))}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-text-muted text-xs">Total Limit</p>
                                    <p className="font-medium text-text-muted">{formatCurrency(budget.total)}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Add Category Card */}
                <div
                    onClick={() => setShowAddBudget(true)}
                    className="bg-surface-dark border border-dashed border-border-dark rounded-2xl p-5 flex flex-col items-center justify-center min-h-[200px] cursor-pointer hover:border-primary/50 hover:bg-surface-highlight/30 transition-all group"
                >
                    <div className="h-12 w-12 rounded-full bg-surface-highlight flex items-center justify-center text-text-muted group-hover:text-primary transition-colors mb-3">
                        <span className="material-symbols-outlined text-2xl">add</span>
                    </div>
                    <p className="text-text-muted font-medium group-hover:text-white transition-colors">Tambah Kategori</p>
                </div>
            </div>

            {/* Quick Analysis */}
            <div className="mb-8">
                <h2 className="text-lg font-bold text-white mb-4">Analisa Cepat</h2>
                <div className="bg-surface-dark border border-border-dark rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                                <span className="material-symbols-outlined">trending_up</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-white">Pengeluaran Hiburan Meningkat</h4>
                                <p className="text-sm text-text-muted">Kamu telah menggunakan 90% dari budget hiburanmu bulan ini. Cobalah kurangi nonton bioskop minggu ini.</p>
                            </div>
                        </div>
                        <button className="text-primary font-medium text-sm hover:underline whitespace-nowrap">Lihat Detail</button>
                    </div>
                </div>
            </div>

            {/* Add Budget Modal */}
            {showAddBudget && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowAddBudget(false)}>
                    <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">Atur Anggaran Baru</h3>
                            <button onClick={() => setShowAddBudget(false)} className="text-text-muted hover:text-white">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-1.5">Nama Kategori</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-lg text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="e.g. Olahraga"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-1.5">Tipe</label>
                                <select className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option value="daily">Harian</option>
                                    <option value="weekly">Mingguan</option>
                                    <option value="monthly">Bulanan</option>
                                    <option value="optional">Opsional</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-1.5">Limit Anggaran</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-lg text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="0"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition-colors mt-6"
                            >
                                Simpan Anggaran
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
