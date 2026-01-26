import { useState } from 'react';
import useStore from '../store/useStore';
import { formatCurrency } from '../services/formatters';
import { getWalletTypeById, WALLET_COLORS } from '../models/categories';
import WalletForm from '../components/forms/WalletForm';
import TransferForm from '../components/forms/TransferForm';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { toast } from '../components/ui/Toast';
import { useRequireAuth } from '../hooks/useRequireAuth';

export default function Assets() {
    const { wallets, deleteWallet } = useStore();
    const { requireAuth } = useRequireAuth();
    const [showAddWallet, setShowAddWallet] = useState(false);
    const [showTransfer, setShowTransfer] = useState(false);
    const [editingWallet, setEditingWallet] = useState(null);
    const [deletingWallet, setDeletingWallet] = useState(null);
    const [activeTab, setActiveTab] = useState('wallets');
    const [openMenuId, setOpenMenuId] = useState(null);

    const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

    // Auth-protected action handlers
    const handleAddWallet = () => requireAuth(() => setShowAddWallet(true));
    const handleTransfer = () => requireAuth(() => setShowTransfer(true));
    const handleEditWallet = (wallet) => {
        setOpenMenuId(null);
        requireAuth(() => setEditingWallet(wallet));
    };
    const handleDeleteWalletClick = (wallet) => {
        setOpenMenuId(null);
        requireAuth(() => setDeletingWallet(wallet));
    };

    const handleDeleteWallet = () => {
        if (deletingWallet) {
            deleteWallet(deletingWallet.id);
            toast.success('Wallet berhasil dihapus');
            setDeletingWallet(null);
        }
    };

    // Get wallet color from WALLET_COLORS
    const getWalletColor = (colorId) => {
        const colorObj = WALLET_COLORS.find(c => c.id === colorId);
        return colorObj?.color || '#3B82F6';
    };

    // Toggle menu
    const toggleMenu = (walletId) => {
        setOpenMenuId(openMenuId === walletId ? null : walletId);
    };

    return (
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 animate-stagger-in" style={{ animationDelay: '0s' }}>
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">Dompet</h1>
                    <p className="text-sm text-text-muted">Total Saldo</p>
                </div>
                <div className="flex items-center gap-3">

                    <button
                        onClick={handleAddWallet}
                        className="flex items-center gap-2 cursor-pointer justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-bold tracking-wide"
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        <span>Tambah Dompet</span>
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 animate-stagger-in" style={{ animationDelay: '0.1s' }}>
                <button
                    onClick={() => setActiveTab('wallets')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'wallets'
                        ? 'bg-surface-highlight text-white border border-border-dark'
                        : 'text-text-muted hover:text-white hover:bg-surface-dark'
                        }`}
                >
                    <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                    <span>Dompet ({wallets.length})</span>
                </button>
                <button
                    onClick={() => setActiveTab('credits')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'credits'
                        ? 'bg-surface-highlight text-white border border-border-dark'
                        : 'text-text-muted hover:text-white hover:bg-surface-dark'
                        }`}
                >
                    <span className="material-symbols-outlined text-[18px]">credit_card</span>
                    <span>Kartu Kredit & Cicilan</span>
                </button>
            </div>

            {/* Total Saldo Card */}
            <div className="bg-surface-dark rounded-2xl p-5 border border-border-dark flex items-center gap-4 transition-all duration-300 hover:scale-[1.01] hover:bg-surface-highlight/20 hover:border-primary/30 hover:shadow-lg cursor-default animate-stagger-in" style={{ animationDelay: '0.2s' }}>
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[24px]">account_balance_wallet</span>
                </div>
                <div>
                    <p className="text-xs text-text-muted mb-1">Total Saldo</p>
                    <h2 className="text-2xl md:text-3xl font-bold text-primary">{formatCurrency(totalBalance)}</h2>
                </div>
            </div>

            {/* Wallets Grid */}
            {wallets.length === 0 ? (
                <EmptyState
                    icon="account_balance_wallet"
                    title="Belum ada wallet"
                    description="Tambahkan wallet pertama Anda untuk mulai melacak keuangan."
                    actionLabel="Tambah Wallet"
                    onAction={handleAddWallet}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-stagger-in" style={{ animationDelay: '0.3s' }}>
                    {wallets.map((wallet) => {
                        const walletType = getWalletTypeById(wallet.type);
                        const walletColor = getWalletColor(wallet.color);

                        return (
                            <div
                                key={wallet.id}
                                className="bg-surface-dark rounded-2xl p-5 border border-border-dark relative group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/50 hover:bg-surface-highlight/10"
                            >
                                {/* 3-dot Menu Button */}
                                <button
                                    onClick={() => toggleMenu(wallet.id)}
                                    className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors p-1"
                                >
                                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                </button>

                                {/* Dropdown Menu */}
                                {openMenuId === wallet.id && (
                                    <div className="absolute top-12 right-4 w-40 bg-surface-highlight border border-border-dark rounded-xl shadow-xl overflow-hidden z-10">
                                        <button
                                            onClick={() => handleEditWallet(wallet)}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-text-muted hover:bg-surface-dark hover:text-white transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                            <span className="text-sm">Edit</span>
                                        </button>
                                        <button
                                            onClick={handleTransfer}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-text-muted hover:bg-surface-dark hover:text-white transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
                                            <span className="text-sm">Transfer</span>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteWalletClick(wallet)}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                            <span className="text-sm">Hapus</span>
                                        </button>
                                    </div>
                                )}

                                {/* Wallet Icon */}
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                                    style={{ backgroundColor: walletColor }}
                                >
                                    <span className="material-symbols-outlined text-white text-[24px]">
                                        {wallet.icon || walletType?.icon || 'account_balance_wallet'}
                                    </span>
                                </div>

                                {/* Wallet Info */}
                                <h3 className="text-base font-bold text-white mb-1 truncate pr-8">{wallet.name}</h3>
                                <p className="text-xs text-text-muted mb-3">{walletType?.name || wallet.type}</p>

                                {/* Balance */}
                                <p className="text-xl font-bold" style={{ color: walletColor }}>
                                    {formatCurrency(wallet.balance)}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}

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
