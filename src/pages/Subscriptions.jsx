import { useState } from 'react';
import useStore from '../store/useStore';
import { formatCurrency } from '../services/formatters';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import SubscriptionForm from '../components/forms/SubscriptionForm';
import { toast } from '../components/ui/Toast';
import { getIconContainerClasses } from '../services/colorUtils';

const SUBSCRIPTION_ICONS = [
    { id: 'subscriptions', icon: 'subscriptions', color: 'red' },
    { id: 'music_note', icon: 'music_note', color: 'green' },
    { id: 'movie', icon: 'movie', color: 'purple' },
    { id: 'cloud', icon: 'cloud', color: 'blue' },
    { id: 'videogame_asset', icon: 'videogame_asset', color: 'orange' },
    { id: 'fitness_center', icon: 'fitness_center', color: 'pink' },
    { id: 'newspaper', icon: 'newspaper', color: 'gray' },
    { id: 'wifi', icon: 'wifi', color: 'cyan' },
    { id: 'phone_android', icon: 'phone_android', color: 'teal' },
    { id: 'credit_card', icon: 'credit_card', color: 'yellow' },
];

export default function Subscriptions() {
    const {
        subscriptions,
        wallets,
        deleteSubscription,
        markSubscriptionPaid,
    } = useStore();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingSubscription, setEditingSubscription] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const getWalletName = (walletId) => {
        const wallet = wallets.find(w => w.id === walletId);
        return wallet?.name || 'Unknown';
    };

    const handleEdit = (sub) => {
        setEditingSubscription(sub);
        setIsFormOpen(true);
    };

    const handleDelete = (id) => {
        deleteSubscription(id);
        toast.success('Langganan berhasil dihapus!');
        setDeleteConfirm(null);
    };

    const handleMarkPaid = (sub) => {
        const result = markSubscriptionPaid(sub.id);
        if (result.success) {
            toast.success(`${sub.name} dibayar! Transaksi senilai ${formatCurrency(sub.amount)} tercatat.`);
        } else if (result.error === 'insufficient_balance') {
            toast.error(`Saldo ${result.walletName} tidak cukup untuk membayar ${sub.name}`);
        } else {
            toast.error('Gagal memproses pembayaran');
        }
    };

    const getCycleLabel = (cycle) => {
        switch (cycle) {
            case 'weekly': return 'Mingguan';
            case 'monthly': return 'Bulanan';
            case 'yearly': return 'Tahunan';
            default: return cycle;
        }
    };

    const getDaysUntilDue = (dueDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);
        const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const getDueText = (dueDate) => {
        const days = getDaysUntilDue(dueDate);
        if (days < 0) return 'Terlambat';
        if (days === 0) return 'Hari ini';
        if (days === 1) return 'Besok';
        return `${days} hari lagi`;
    };

    const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
    const totalMonthly = activeSubscriptions.reduce((sum, sub) => {
        if (sub.cycle === 'monthly') return sum + sub.amount;
        if (sub.cycle === 'yearly') return sum + (sub.amount / 12);
        if (sub.cycle === 'weekly') return sum + (sub.amount * 4);
        return sum;
    }, 0);

    const upcomingThisWeek = activeSubscriptions.filter(s => {
        const days = getDaysUntilDue(s.nextDueDate);
        return days >= 0 && days <= 7;
    });

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Langganan</h1>
                    <p className="text-text-muted mt-1">Kelola tagihan berulang dan subscriptions</p>
                </div>
                <button
                    onClick={() => {
                        setEditingSubscription(null);
                        setIsFormOpen(true);
                    }}
                    className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 self-start md:self-auto"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    Tambah Langganan
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-4 mb-6">
                <div className="bg-surface-dark border border-border-dark rounded-xl md:rounded-2xl p-3 md:p-5">
                    <div className="flex flex-col md:flex-row items-center md:items-center gap-1 md:gap-3 mb-2 md:mb-3">
                        <div className="p-1.5 md:p-2 rounded-lg bg-primary/10 text-primary">
                            <span className="material-symbols-outlined text-[18px] md:text-[24px]">subscriptions</span>
                        </div>
                        <span className="text-[10px] md:text-sm text-text-muted text-center md:text-left">Total</span>
                    </div>
                    <p className="text-lg md:text-2xl font-bold text-white text-center md:text-left">{subscriptions.length}</p>
                    <p className="text-[10px] md:text-xs text-text-muted mt-0.5 md:mt-1 text-center md:text-left">{activeSubscriptions.length} aktif</p>
                </div>

                <div className="bg-surface-dark border border-border-dark rounded-xl md:rounded-2xl p-3 md:p-5">
                    <div className="flex flex-col md:flex-row items-center md:items-center gap-1 md:gap-3 mb-2 md:mb-3">
                        <div className="p-1.5 md:p-2 rounded-lg bg-red-500/10 text-red-400">
                            <span className="material-symbols-outlined text-[18px] md:text-[24px]">payments</span>
                        </div>
                        <span className="text-[10px] md:text-sm text-text-muted text-center md:text-left">Bulanan</span>
                    </div>
                    <p className="text-sm md:text-2xl font-bold text-white text-center md:text-left truncate">{formatCurrency(totalMonthly)}</p>
                    <p className="text-[10px] md:text-xs text-text-muted mt-0.5 md:mt-1 text-center md:text-left">Per bulan</p>
                </div>

                <div className="bg-surface-dark border border-border-dark rounded-xl md:rounded-2xl p-3 md:p-5">
                    <div className="flex flex-col md:flex-row items-center md:items-center gap-1 md:gap-3 mb-2 md:mb-3">
                        <div className="p-1.5 md:p-2 rounded-lg bg-yellow-500/10 text-yellow-400">
                            <span className="material-symbols-outlined text-[18px] md:text-[24px]">schedule</span>
                        </div>
                        <span className="text-[10px] md:text-sm text-text-muted text-center md:text-left">Jatuh Tempo</span>
                    </div>
                    <p className="text-lg md:text-2xl font-bold text-white text-center md:text-left">{upcomingThisWeek.length}</p>
                    <p className="text-[10px] md:text-xs text-text-muted mt-0.5 md:mt-1 text-center md:text-left">
                        {upcomingThisWeek.length > 0
                            ? `${formatCurrency(upcomingThisWeek.reduce((s, sub) => s + sub.amount, 0))}`
                            : 'Tidak ada'
                        }
                    </p>
                </div>
            </div>

            {/* Subscriptions List */}
            {subscriptions.length === 0 ? (
                <div className="bg-surface-dark border border-border-dark rounded-2xl p-12 text-center">
                    <span className="material-symbols-outlined text-5xl text-text-muted mb-4">subscriptions</span>
                    <h3 className="text-xl font-bold text-white mb-2">Belum Ada Langganan</h3>
                    <p className="text-text-muted mb-6">Tambahkan langganan seperti Netflix, Spotify, atau tagihan bulanan lainnya.</p>
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Tambah Langganan Pertama
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {subscriptions.map((sub) => {
                        const daysUntil = getDaysUntilDue(sub.nextDueDate);
                        const isOverdue = daysUntil < 0;
                        const isUrgent = daysUntil >= 0 && daysUntil <= 3;

                        return (
                            <div
                                key={sub.id}
                                className={`bg-surface-dark border rounded-2xl p-4 md:p-5 ${isOverdue
                                    ? 'border-red-500/50'
                                    : 'border-border-dark'
                                    }`}
                            >
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    {/* Icon & Info */}
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getIconContainerClasses(sub.color, 'cyan', 'dark30')}`}>
                                            <span className="material-symbols-outlined text-[24px]">{sub.icon || 'subscriptions'}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-white">{sub.name}</h3>
                                            <div className="flex items-center gap-3 mt-1 text-sm text-text-muted">
                                                <span>{getCycleLabel(sub.cycle)}</span>
                                                <span>•</span>
                                                <span>{getWalletName(sub.walletId)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Amount & Due Date */}
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="font-bold text-white text-lg">{formatCurrency(sub.amount)}</p>
                                            <p className={`text-xs ${isOverdue ? 'text-red-400' : isUrgent ? 'text-yellow-400' : 'text-text-muted'}`}>
                                                {getDueText(sub.nextDueDate)}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleMarkPaid(sub)}
                                                className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                                                title="Tandai Sudah Dibayar"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">check</span>
                                            </button>
                                            <button
                                                onClick={() => handleEdit(sub)}
                                                className="p-2 rounded-lg bg-surface-highlight text-text-muted hover:text-white transition-colors"
                                                title="Edit"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(sub)}
                                                className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                                title="Hapus"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Subscription Form Modal */}
            <SubscriptionForm
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditingSubscription(null);
                }}
                subscription={editingSubscription}
            />

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                onConfirm={() => handleDelete(deleteConfirm?.id)}
                title="Hapus Langganan?"
                message={`Apakah kamu yakin ingin menghapus langganan "${deleteConfirm?.name}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmLabel="Ya, Hapus"
                danger
            />
        </div>
    );
}
