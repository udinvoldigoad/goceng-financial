import { useState } from 'react';

export default function Transactions() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddTransaction, setShowAddTransaction] = useState(false);

    const formatCurrency = (amount) => {
        return `Rp ${Math.abs(amount).toLocaleString('id-ID')}`;
    };

    const transactions = {
        today: [
            { id: 1, name: 'Netflix Subscription', category: 'Hiburan', wallet: 'BCA Digital', amount: -186000, time: '10:30 WIB', icon: 'movie', color: 'red' },
            { id: 2, name: 'Gaji Bulanan', category: 'Pendapatan', wallet: 'Jago Syariah', amount: 15000000, time: '09:00 WIB', icon: 'work', color: 'green' },
            { id: 3, name: 'Kopi Kenangan', category: 'F&B', wallet: 'GoPay', amount: -25000, time: '08:15 WIB', icon: 'coffee', color: 'orange' },
        ],
        yesterday: [
            { id: 4, name: 'Superindo Belanja', category: 'Belanja', wallet: 'BCA Digital', amount: -450000, time: '19:30 WIB', icon: 'shopping_cart', color: 'blue' },
            { id: 5, name: 'Isi Bensin', category: 'Transportasi', wallet: 'Cash', amount: -300000, time: '17:45 WIB', icon: 'local_gas_station', color: 'purple' },
        ],
        thisWeek: [
            { id: 6, name: 'Internet & TV', category: 'Tagihan', wallet: 'BCA Digital', amount: -350000, time: '21 Okt', icon: 'wifi', color: 'teal' },
            { id: 7, name: 'Token Listrik', category: 'Tagihan', wallet: 'GoPay', amount: -500000, time: '20 Okt', icon: 'bolt', color: 'yellow' },
        ],
    };

    const TransactionItem = ({ tx }) => (
        <div className="p-4 flex items-center justify-between hover:bg-surface-highlight transition-colors border-b border-border-dark last:border-0 cursor-pointer">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-${tx.color}-900/20 flex items-center justify-center text-${tx.color}-400`}>
                    <span className="material-symbols-outlined">{tx.icon}</span>
                </div>
                <div>
                    <h4 className="font-bold text-base text-white">{tx.name}</h4>
                    <p className="text-xs text-text-muted">{tx.category} • {tx.wallet}</p>
                </div>
            </div>
            <div className="text-right">
                <span className={`block font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.amount > 0 ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
                <span className="text-xs text-text-muted">{tx.time}</span>
            </div>
        </div>
    );

    return (
        <div className="relative">
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
                            <span className="text-sm font-medium text-text-muted">Pemasukan (Oktober)</span>
                        </div>
                        <h3 className="text-3xl font-bold text-green-400 tracking-tight">Rp 15.500.000</h3>
                        <div className="mt-2 flex items-center text-xs font-medium text-green-400">
                            <span className="flex items-center">
                                <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
                                +12%
                            </span>
                            <span className="ml-2 text-text-muted">vs bulan lalu</span>
                        </div>
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
                            <span className="text-sm font-medium text-text-muted">Pengeluaran (Oktober)</span>
                        </div>
                        <h3 className="text-3xl font-bold text-red-400 tracking-tight">Rp 8.650.000</h3>
                        <div className="mt-2 flex items-center text-xs font-medium text-red-400">
                            <span className="flex items-center">
                                <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
                                +5%
                            </span>
                            <span className="ml-2 text-text-muted">vs bulan lalu</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">search</span>
                    <input
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-dark border border-border-dark focus:outline-none focus:ring-2 focus:ring-primary text-sm placeholder-text-muted text-white"
                        placeholder="Cari transaksi..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-3">
                    <select className="px-4 py-3 pr-8 rounded-xl bg-surface-dark border border-border-dark focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium text-white appearance-none cursor-pointer">
                        <option>Semua Kategori</option>
                        <option>Makanan & Minuman</option>
                        <option>Transportasi</option>
                        <option>Belanja</option>
                        <option>Hiburan</option>
                    </select>
                    <select className="px-4 py-3 pr-8 rounded-xl bg-surface-dark border border-border-dark focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium text-white appearance-none cursor-pointer">
                        <option>Terbaru</option>
                        <option>Terlama</option>
                        <option>Tertinggi</option>
                        <option>Terendah</option>
                    </select>
                    <button className="px-4 py-3 rounded-xl bg-surface-dark border border-border-dark hover:bg-surface-highlight transition-colors text-primary">
                        <span className="material-symbols-outlined">filter_list</span>
                    </button>
                </div>
            </div>

            {/* Transaction List */}
            <div className="space-y-6">
                {/* Today */}
                <div>
                    <h3 className="text-sm font-semibold text-text-muted mb-3 uppercase tracking-wider ml-1">Hari Ini</h3>
                    <div className="bg-surface-dark rounded-2xl border border-border-dark overflow-hidden">
                        {transactions.today.map((tx) => (
                            <TransactionItem key={tx.id} tx={tx} />
                        ))}
                    </div>
                </div>

                {/* Yesterday */}
                <div>
                    <h3 className="text-sm font-semibold text-text-muted mb-3 uppercase tracking-wider ml-1">Kemarin</h3>
                    <div className="bg-surface-dark rounded-2xl border border-border-dark overflow-hidden">
                        {transactions.yesterday.map((tx) => (
                            <TransactionItem key={tx.id} tx={tx} />
                        ))}
                    </div>
                </div>

                {/* This Week */}
                <div>
                    <h3 className="text-sm font-semibold text-text-muted mb-3 uppercase tracking-wider ml-1">Minggu Ini</h3>
                    <div className="bg-surface-dark rounded-2xl border border-border-dark overflow-hidden">
                        {transactions.thisWeek.map((tx) => (
                            <TransactionItem key={tx.id} tx={tx} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Load More */}
            <div className="mt-8 flex justify-center pb-8">
                <button className="px-6 py-2.5 rounded-full bg-surface-dark border border-border-dark text-sm font-medium hover:bg-surface-highlight transition-colors text-text-muted">
                    Muat Lebih Banyak
                </button>
            </div>

            {/* FAB - Add Transaction */}
            <button
                onClick={() => setShowAddTransaction(true)}
                className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/40 flex items-center justify-center hover:bg-blue-600 transition-colors transform hover:scale-105 active:scale-95 z-50"
            >
                <span className="material-symbols-outlined text-3xl">add</span>
            </button>

            {/* Add Transaction Modal */}
            {showAddTransaction && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowAddTransaction(false)}>
                    <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">Tambah Transaksi</h3>
                            <button onClick={() => setShowAddTransaction(false)} className="text-text-muted hover:text-white">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form className="space-y-4">
                            <div className="flex gap-2 mb-4">
                                <button type="button" className="flex-1 py-2.5 rounded-lg bg-red-500/20 text-red-400 font-medium border border-red-500/30">Pengeluaran</button>
                                <button type="button" className="flex-1 py-2.5 rounded-lg bg-surface-highlight text-text-muted font-medium border border-border-dark hover:border-green-500/30 hover:bg-green-500/20 hover:text-green-400 transition-colors">Pemasukan</button>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-1.5">Nama Transaksi</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-lg text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="e.g. Makan Siang"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-1.5">Jumlah</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-lg text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-1.5">Kategori</label>
                                <select className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option value="">Pilih Kategori</option>
                                    <option value="food">Makanan & Minuman</option>
                                    <option value="transport">Transportasi</option>
                                    <option value="shopping">Belanja</option>
                                    <option value="entertainment">Hiburan</option>
                                    <option value="bills">Tagihan</option>
                                    <option value="income">Pendapatan</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-1.5">Dari Wallet</label>
                                <select className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option value="">Pilih Wallet</option>
                                    <option value="bca">BCA Digital</option>
                                    <option value="gopay">GoPay</option>
                                    <option value="jago">Jago Syariah</option>
                                    <option value="cash">Cash</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition-colors mt-6"
                            >
                                Simpan Transaksi
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
