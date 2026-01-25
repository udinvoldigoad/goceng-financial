import { useState } from 'react';
import useStore from '../store/useStore';
import { formatCurrency } from '../services/formatters';
import { getWalletTypeById, WALLET_TYPES } from '../models/categories';
import WalletForm from '../components/forms/WalletForm';
import TransferForm from '../components/forms/TransferForm';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { toast } from '../components/ui/Toast';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { getIconContainerClasses } from '../services/colorUtils';

export default function Assets() {
    const { wallets, subscriptions, deleteWallet, getUpcomingSubscriptions } = useStore();
    const { requireAuth } = useRequireAuth();
    const [showAddWallet, setShowAddWallet] = useState(false);
    const [showTransfer, setShowTransfer] = useState(false);
    const [editingWallet, setEditingWallet] = useState(null);
    const [deletingWallet, setDeletingWallet] = useState(null);
    const [showBalance, setShowBalance] = useState(true);

    const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);
    const upcomingPayments = getUpcomingSubscriptions(14);

    // Auth-protected action handlers
    const handleAddWallet = () => requireAuth(() => setShowAddWallet(true));
    const handleTransfer = () => requireAuth(() => setShowTransfer(true));
    const handleEditWallet = (wallet) => requireAuth(() => setEditingWallet(wallet));
    const handleDeleteWalletClick = (wallet) => requireAuth(() => setDeletingWallet(wallet));

    const handleDeleteWallet = () => {
        if (deletingWallet) {
            deleteWallet(deletingWallet.id);
            toast.success('Wallet berhasil dihapus');
            setDeletingWallet(null);
        }
    };

    const formatDueDate = (dateStr) => {
        const date = new Date(dateStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        if (date.toDateString() === today.toDateString()) return 'Hari Ini';
        if (date.toDateString() === tomorrow.toDateString()) return 'Besok';

        const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
        return `${diffDays} hari lagi`;
    };

    // Separate primary and other wallets
    const primaryWallet = wallets.find(w => w.isPrimary);
    const otherWallets = wallets.filter(w => !w.isPrimary);

    return (
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <p className="text-text-muted text-sm font-medium uppercase tracking-wider">Total Balance</p>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                            {showBalance ? formatCurrency(totalBalance) : '••••••••'}
                        </h1>
                        <button
                            onClick={() => setShowBalance(!showBalance)}
                            className="text-text-muted hover:text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined">
                                {showBalance ? 'visibility' : 'visibility_off'}
                            </span>
                        </button>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleAddWallet}
                        className="flex items-center gap-2 cursor-pointer justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-bold tracking-wide shadow-lg shadow-primary/20"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span>Add New Wallet</span>
                    </button>
                    <button
                        onClick={handleTransfer}
                        disabled={wallets.length < 2}
                        className="flex items-center gap-2 cursor-pointer justify-center overflow-hidden rounded-lg h-10 px-5 bg-surface-dark text-white hover:bg-surface-highlight transition-colors text-sm font-bold tracking-wide border border-border-dark disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
                        <span>Transfer</span>
                    </button>
                </div>
            </div>

            {/* Wallets Section */}
            {wallets.length === 0 ? (
                <EmptyState
                    icon="account_balance_wallet"
                    title="Belum ada wallet"
                    description="Tambahkan wallet pertama Anda untuk mulai melacak keuangan."
                    actionLabel="Tambah Wallet"
                    onAction={handleAddWallet}
                />
            ) : (
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-white">Your Accounts</h2>
                        <span className="text-sm text-text-muted">{wallets.length} wallet</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                        {/* Primary Card */}
                        {primaryWallet && (
                            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#005c97] to-[#363795] p-4 md:p-6 shadow-xl transition-transform hover:-translate-y-1 col-span-2 md:col-span-1">
                                <div className="absolute right-[-20px] top-[-20px] h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
                                <div className="flex flex-col justify-between h-40 md:h-48">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col">
                                            <p className="text-white/80 text-[10px] md:text-sm font-medium">
                                                {getWalletTypeById(primaryWallet.type)?.name || 'Account'}
                                            </p>
                                            <h3 className="text-white text-base md:text-xl font-bold mt-1 truncate max-w-[150px]">{primaryWallet.name}</h3>
                                        </div>
                                        <div className="flex items-center gap-1 md:gap-2">
                                            <button
                                                onClick={() => handleEditWallet(primaryWallet)}
                                                className="text-white/70 hover:text-white transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[18px] md:text-[20px]">edit</span>
                                            </button>
                                            <div className="h-6 w-10 md:h-8 md:w-12 bg-white/20 rounded-md flex items-center justify-center backdrop-blur-sm">
                                                <span className="material-symbols-outlined text-white text-[16px] md:text-[24px]">contactless</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 md:gap-4">
                                        {primaryWallet.accountNumber && (
                                            <p className="text-white/70 text-xs md:text-lg tracking-widest font-mono">
                                                **** {primaryWallet.accountNumber.slice(-4)}
                                            </p>
                                        )}
                                        <div className="flex justify-between items-end">
                                            <div className="flex flex-col">
                                                <p className="text-white/60 text-[10px] md:text-xs uppercase">Balance</p>
                                                <p className="text-white text-xl md:text-2xl font-bold truncate">
                                                    {showBalance ? formatCurrency(primaryWallet.balance) : '••••••••'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Other Wallet Cards */}
                        {(primaryWallet ? otherWallets : wallets).map((wallet) => {
                            const walletType = getWalletTypeById(wallet.type);
                            return (
                                <div key={wallet.id} className="group relative overflow-hidden rounded-2xl bg-surface-dark border border-border-dark p-3 md:p-6 shadow-lg transition-transform hover:-translate-y-1">
                                    <div className="flex flex-col justify-between h-36 md:h-48">
                                        <div className="flex justify-between items-start md:items-center">
                                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 min-w-0">
                                                <div className={`h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center shrink-0 ${getIconContainerClasses(wallet.color, 'cyan', 'light')}`}>
                                                    <span className="material-symbols-outlined text-[18px] md:text-[24px]">{wallet.icon || walletType?.icon || 'account_balance_wallet'}</span>
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="text-white font-bold text-xs md:text-base truncate">{wallet.name}</h3>
                                                    <p className="text-text-muted text-[10px] md:text-xs truncate">{walletType?.name || wallet.type}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-0 md:gap-1 absolute top-3 right-3 md:relative md:top-0 md:right-0 bg-surface-dark/50 md:bg-transparent rounded-lg backdrop-blur-sm md:backdrop-filter-none">
                                                <button
                                                    onClick={() => handleEditWallet(wallet)}
                                                    className="text-text-muted hover:text-white transition-colors p-1"
                                                >
                                                    <span className="material-symbols-outlined text-[16px] md:text-[20px]">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteWalletClick(wallet)}
                                                    className="text-text-muted hover:text-red-400 transition-colors p-1"
                                                >
                                                    <span className="material-symbols-outlined text-[16px] md:text-[20px]">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="my-2 md:my-4 border-t border-dashed border-border-dark"></div>
                                        <div className="flex flex-col gap-0 md:gap-1">
                                            <p className="text-text-muted text-[10px] md:text-xs uppercase">Available</p>
                                            <p className="text-white text-base md:text-2xl font-bold truncate">
                                                {showBalance ? formatCurrency(wallet.balance) : '••••••••'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Add Wallet Card */}
                        <div
                            onClick={handleAddWallet}
                            className="group relative rounded-2xl bg-surface-dark border border-dashed border-border-dark p-3 md:p-6 flex flex-col items-center justify-center min-h-[160px] md:min-h-[200px] cursor-pointer hover:border-primary/50 hover:bg-surface-highlight/30 transition-all"
                        >
                            <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-surface-highlight flex items-center justify-center text-text-muted group-hover:text-primary transition-colors mb-2 md:mb-3">
                                <span className="material-symbols-outlined text-2xl">add</span>
                            </div>
                            <p className="text-text-muted font-medium text-xs md:text-base group-hover:text-white transition-colors text-center">Tambah Wallet</p>
                        </div>
                    </div>
                </section>
            )}

            {/* Upcoming Payments & Emergency Fund */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white">Upcoming Payments</h2>
                        {upcomingPayments.length > 0 && (
                            <span className="text-sm text-text-muted">{upcomingPayments.length} tagihan</span>
                        )}
                    </div>
                    {upcomingPayments.length === 0 ? (
                        <div className="bg-surface-dark rounded-xl border border-border-dark p-8 text-center">
                            <span className="material-symbols-outlined text-3xl text-text-muted mb-2">event_available</span>
                            <p className="text-text-muted">Tidak ada tagihan dalam 14 hari ke depan</p>
                        </div>
                    ) : (
                        <div className="bg-surface-dark rounded-xl border border-border-dark overflow-hidden">
                            {upcomingPayments.map((payment, index) => {
                                const wallet = wallets.find(w => w.id === payment.walletId);
                                return (
                                    <div
                                        key={payment.id}
                                        className={`flex items-center justify-between p-4 hover:bg-surface-highlight transition-colors cursor-pointer ${index !== upcomingPayments.length - 1 ? 'border-b border-border-dark' : ''}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`rounded-lg size-12 flex items-center justify-center shrink-0 ${getIconContainerClasses(payment.color, 'red', 'light')}`}>
                                                <span className="material-symbols-outlined text-[24px]">{payment.icon || 'receipt'}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="font-bold text-white">{payment.name}</p>
                                                <p className="text-xs text-text-muted">
                                                    {formatDueDate(payment.nextDueDate)} • {wallet?.name || 'Unknown'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <p className="font-bold text-white">- {formatCurrency(payment.amount)}</p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${payment.status === 'active' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-slate-500/10 text-slate-400'
                                                }`}>
                                                {payment.status === 'active' ? 'Pending' : payment.status}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Quick Stats */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-bold text-white">Ringkasan</h2>
                    <div className="bg-gradient-to-b from-surface-dark to-background-dark p-6 rounded-xl border border-border-dark flex flex-col gap-4 h-full">
                        <div className="flex items-center justify-between">
                            <p className="text-text-muted text-sm">Total Wallet</p>
                            <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded font-bold">{wallets.length}</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white">{formatCurrency(totalBalance)}</h3>
                            <p className="text-xs text-text-muted">Total saldo semua wallet</p>
                        </div>
                        {subscriptions.filter(s => s.status === 'active').length > 0 && (
                            <>
                                <div className="border-t border-border-dark pt-4">
                                    <p className="text-text-muted text-sm mb-2">Tagihan Bulanan</p>
                                    <p className="text-xl font-bold text-white">
                                        {formatCurrency(
                                            subscriptions
                                                .filter(s => s.status === 'active' && s.cycle === 'monthly')
                                                .reduce((sum, s) => sum + s.amount, 0)
                                        )}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Wallet Form Modal */}
            <WalletForm
                isOpen={showAddWallet || !!editingWallet}
                onClose={() => {
                    setShowAddWallet(false);
                    setEditingWallet(null);
                }}
                wallet={editingWallet}
            />

            {/* Transfer Modal */}
            <TransferForm
                isOpen={showTransfer}
                onClose={() => setShowTransfer(false)}
            />

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={!!deletingWallet}
                onClose={() => setDeletingWallet(null)}
                onConfirm={handleDeleteWallet}
                title="Hapus Wallet"
                message={`Apakah Anda yakin ingin menghapus wallet "${deletingWallet?.name}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmLabel="Ya, Hapus"
                danger
            />

        </div>
    );
}
