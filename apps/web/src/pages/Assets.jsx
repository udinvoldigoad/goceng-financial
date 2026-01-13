import { useState } from 'react';

export default function Assets() {
    const [showAddWallet, setShowAddWallet] = useState(false);

    const wallets = [
        {
            id: 1,
            name: 'BCA Digital',
            type: 'Main Account',
            balance: 15000000,
            cardNumber: '4829',
            isPrimary: true,
        },
        {
            id: 2,
            name: 'GoPay',
            type: 'E-Wallet',
            balance: 450000,
            icon: 'account_balance_wallet',
            color: 'cyan',
        },
        {
            id: 3,
            name: 'Jago Syariah',
            type: 'Savings',
            balance: 2300000,
            icon: 'savings',
            color: 'orange',
        },
    ];

    const upcomingPayments = [
        { id: 1, name: 'Netflix Subscription', due: 'Due Tomorrow', info: 'Auto-debit', amount: 186000, status: 'Pending', color: 'bg-black', icon: 'N' },
        { id: 2, name: 'Spotify Premium', due: 'Due in 3 days', info: '', amount: 55000, status: 'Scheduled', color: 'bg-[#1DB954]', iconType: 'material', icon: 'graphic_eq' },
        { id: 3, name: 'Biznet Home', due: 'Due in 5 days', info: '', amount: 375000, status: 'Scheduled', color: 'bg-[#F20F0F]', iconType: 'material', icon: 'wifi' },
    ];

    const formatCurrency = (amount) => {
        return `Rp ${amount.toLocaleString('id-ID')}`;
    };

    const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

    return (
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <p className="text-text-muted text-sm font-medium uppercase tracking-wider">Total Balance</p>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">{formatCurrency(totalBalance)}</h1>
                        <button className="text-text-muted hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">visibility</span>
                        </button>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowAddWallet(true)}
                        className="flex items-center gap-2 cursor-pointer justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-bold tracking-wide shadow-lg shadow-primary/20"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span>Add New Wallet</span>
                    </button>
                    <button className="flex items-center gap-2 cursor-pointer justify-center overflow-hidden rounded-lg h-10 px-5 bg-surface-dark text-white hover:bg-surface-highlight transition-colors text-sm font-bold tracking-wide border border-border-dark">
                        <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
                        <span>Transfer</span>
                    </button>
                </div>
            </div>

            {/* Wallets Section */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white">Your Accounts</h2>
                    <a className="text-sm font-medium text-primary hover:text-primary/80" href="#">Manage all</a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Primary Card */}
                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#005c97] to-[#363795] p-6 shadow-xl transition-transform hover:-translate-y-1">
                        <div className="absolute right-[-20px] top-[-20px] h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
                        <div className="flex flex-col justify-between h-48">
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col">
                                    <p className="text-white/80 text-sm font-medium">Main Account</p>
                                    <h3 className="text-white text-xl font-bold mt-1">BCA Digital</h3>
                                </div>
                                <div className="h-8 w-12 bg-white/20 rounded-md flex items-center justify-center backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-white">contactless</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <p className="text-white/70 text-lg tracking-widest font-mono">**** **** **** 4829</p>
                                <div className="flex justify-between items-end">
                                    <div className="flex flex-col">
                                        <p className="text-white/60 text-xs uppercase">Balance</p>
                                        <p className="text-white text-2xl font-bold">{formatCurrency(15000000)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* E-Wallet Cards */}
                    {wallets.filter(w => !w.isPrimary).map((wallet) => (
                        <div key={wallet.id} className="group relative overflow-hidden rounded-2xl bg-surface-dark border border-border-dark p-6 shadow-lg transition-transform hover:-translate-y-1">
                            <div className="flex flex-col justify-between h-48">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-10 w-10 rounded-full bg-${wallet.color}-500/20 flex items-center justify-center text-${wallet.color}-400`}>
                                            <span className="material-symbols-outlined">{wallet.icon}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold">{wallet.name}</h3>
                                            <p className="text-text-muted text-xs">{wallet.type}</p>
                                        </div>
                                    </div>
                                    <button className="text-text-muted hover:text-white transition-colors">
                                        <span className="material-symbols-outlined">more_vert</span>
                                    </button>
                                </div>
                                <div className="my-4 border-t border-dashed border-border-dark"></div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-text-muted text-xs uppercase">Available Balance</p>
                                    <p className="text-white text-2xl font-bold">{formatCurrency(wallet.balance)}</p>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <button className="flex-1 py-2 rounded-md bg-surface-highlight text-text-muted text-xs font-bold hover:bg-primary hover:text-white transition-colors">
                                        {wallet.type === 'E-Wallet' ? 'Top Up' : 'Add Funds'}
                                    </button>
                                    <button className="flex-1 py-2 rounded-md bg-surface-highlight text-text-muted text-xs font-bold hover:bg-primary hover:text-white transition-colors">
                                        {wallet.type === 'E-Wallet' ? 'History' : 'Details'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Upcoming Payments & Emergency Fund */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white">Upcoming Payments</h2>
                        <button className="text-sm text-primary font-medium hover:underline">View Calendar</button>
                    </div>
                    <div className="bg-surface-dark rounded-xl border border-border-dark overflow-hidden">
                        {upcomingPayments.map((payment, index) => (
                            <div
                                key={payment.id}
                                className={`flex items-center justify-between p-4 hover:bg-surface-highlight transition-colors cursor-pointer group ${index !== upcomingPayments.length - 1 ? 'border-b border-border-dark' : ''}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`${payment.color} text-white rounded-lg size-12 flex items-center justify-center shrink-0 font-bold text-xs`}>
                                        {payment.iconType === 'material' ? (
                                            <span className="material-symbols-outlined text-[24px]">{payment.icon}</span>
                                        ) : (
                                            payment.icon
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="font-bold text-white">{payment.name}</p>
                                        <p className="text-xs text-text-muted">{payment.due}{payment.info ? ` • ${payment.info}` : ''}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <p className="font-bold text-white">- {formatCurrency(payment.amount)}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${payment.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-slate-500/10 text-slate-400'}`}>
                                        {payment.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Emergency Fund */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white">Dana Darurat</h2>
                    </div>
                    <div className="bg-gradient-to-b from-surface-dark to-background-dark p-6 rounded-xl border border-border-dark flex flex-col gap-4 h-full">
                        <div className="flex items-center justify-between">
                            <p className="text-text-muted text-sm">Terkumpul</p>
                            <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded font-bold">65%</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white">Rp 8.450.000</h3>
                            <p className="text-xs text-text-muted">dari target Rp 12.000.000</p>
                        </div>
                        <div className="w-full bg-background-dark rounded-full h-2.5 mt-2 overflow-hidden border border-border-dark">
                            <div className="bg-primary h-2.5 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <p className="text-xs text-text-muted leading-relaxed mt-2">
                            Dana darurat Anda aman untuk menutupi pengeluaran selama <span className="text-white font-medium">3 bulan</span> ke depan.
                        </p>
                        <button className="mt-auto w-full py-2.5 rounded-lg border border-border-dark text-text-muted text-sm font-medium hover:bg-surface-highlight hover:text-white transition-colors">
                            Tambah Dana
                        </button>
                    </div>
                </div>
            </section>

            {/* Add Wallet Modal */}
            {showAddWallet && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowAddWallet(false)}>
                    <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">Add New Wallet</h3>
                            <button onClick={() => setShowAddWallet(false)} className="text-text-muted hover:text-white">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-1.5">Wallet Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-lg text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="e.g. Savings Account"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-1.5">Wallet Type</label>
                                <select className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option value="bank">Bank Account</option>
                                    <option value="ewallet">E-Wallet</option>
                                    <option value="cash">Cash</option>
                                    <option value="savings">Savings</option>
                                    <option value="investment">Investment</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-1.5">Initial Balance</label>
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
                                Add Wallet
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="mt-16 text-center pb-8">
                <p className="text-text-muted text-xs">© 2023 Goceng Financial. Protected by 256-bit SSL encryption.</p>
            </footer>
        </div>
    );
}
