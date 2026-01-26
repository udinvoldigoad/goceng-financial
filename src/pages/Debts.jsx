import { useState, useMemo } from 'react';
import useStore from '../store/useStore';
import { formatCurrency } from '../services/formatters';
import EmptyState from '../components/ui/EmptyState';
import DebtForm from '../components/forms/DebtForm';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { toast } from '../components/ui/Toast';
import { useRequireAuth } from '../hooks/useRequireAuth';

export default function Debts() {
    const { debts, wallets, deleteDebt, markDebtPaid } = useStore();
    const { requireAuth } = useRequireAuth();
    const [showAddDebt, setShowAddDebt] = useState(false);
    const [editingDebt, setEditingDebt] = useState(null);
    const [deletingDebt, setDeletingDebt] = useState(null);
    const [filter, setFilter] = useState('all'); // all, debt, receivable

    // Auth-protected action handlers
    const handleAddDebt = () => requireAuth(() => setShowAddDebt(true));
    const handleEditDebt = (debt) => requireAuth(() => setEditingDebt(debt));
    const handleDeleteDebtClick = (debt) => requireAuth(() => setDeletingDebt(debt));
    const handleMarkPaid = (debt) => requireAuth(() => {
        markDebtPaid(debt.id);
        toast.success(`${debt.type === 'debt' ? 'Hutang' : 'Piutang'} berhasil ditandai lunas!`);
    });

    const handleDelete = () => {
        if (deletingDebt) {
            deleteDebt(deletingDebt.id);
            toast.success('Catatan berhasil dihapus');
            setDeletingDebt(null);
        }
    };

    // Calculate stats
    const stats = useMemo(() => {
        const unpaidDebts = debts.filter(d => d.type === 'debt' && d.status === 'unpaid');
        const unpaidReceivables = debts.filter(d => d.type === 'receivable' && d.status === 'unpaid');

        const totalDebt = unpaidDebts.reduce((sum, d) => sum + d.amount, 0);
        const totalReceivable = unpaidReceivables.reduce((sum, d) => sum + d.amount, 0);

        // Calculate overdue
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const overdue = debts.filter(d => {
            if (d.status === 'paid' || !d.dueDate) return false;
            const dueDate = new Date(d.dueDate);
            return dueDate < today;
        });

        return {
            totalDebt,
            totalReceivable,
            unpaidDebtCount: unpaidDebts.length,
            unpaidReceivableCount: unpaidReceivables.length,
            overdueCount: overdue.length,
        };
    }, [debts]);

    // Filtered debts
    const filteredDebts = useMemo(() => {
        let result = debts;
        if (filter === 'debt') result = debts.filter(d => d.type === 'debt');
        else if (filter === 'receivable') result = debts.filter(d => d.type === 'receivable');

        // Sort by created date (newest first), unpaid first
        return result.sort((a, b) => {
            if (a.status !== b.status) return a.status === 'unpaid' ? -1 : 1;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
    }, [debts, filter]);

    const getWalletName = (walletId) => {
        const wallet = wallets.find(w => w.id === walletId);
        return wallet?.name || 'Tidak diketahui';
    };

    const isOverdue = (dueDate) => {
        if (!dueDate) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(dueDate) < today;
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-stagger-in" style={{ animationDelay: '0s' }}>
                <div>
                    <h1 className="text-2xl font-bold text-white">Hutang & Piutang</h1>
                    <p className="text-text-muted text-sm mt-1">Kelola catatan uang yang dipinjam dan dipinjamkan</p>
                </div>
                <button
                    onClick={handleAddDebt}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    <span>Tambah Catatan</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-stagger-in" style={{ animationDelay: '0.1s' }}>
                <div className="bg-surface-dark rounded-2xl p-4 md:p-5 border border-border-dark">
                    <span className="text-xs md:text-sm text-text-muted">Total Hutang</span>
                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-red-400 mt-1">{formatCurrency(stats.totalDebt)}</h3>
                    <span className="text-xs text-text-muted">{stats.unpaidDebtCount} belum lunas</span>
                </div>
                <div className="bg-surface-dark rounded-2xl p-4 md:p-5 border border-border-dark">
                    <span className="text-xs md:text-sm text-text-muted">Total Piutang</span>
                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-green-400 mt-1">{formatCurrency(stats.totalReceivable)}</h3>
                    <span className="text-xs text-text-muted">{stats.unpaidReceivableCount} belum lunas</span>
                </div>
                <div className="bg-surface-dark rounded-2xl p-4 md:p-5 border border-border-dark">
                    <span className="text-xs md:text-sm text-text-muted">Telat</span>
                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-orange-400 mt-1">{stats.overdueCount}</h3>
                    <span className="text-xs text-text-muted">melewati jatuh tempo</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-surface-dark rounded-xl border border-border-dark w-fit animate-stagger-in" style={{ animationDelay: '0.2s' }}>
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${filter === 'all' ? 'bg-primary text-white' : 'text-text-muted hover:text-white hover:bg-surface-highlight'
                        }`}
                >
                    Semua
                </button>
                <button
                    onClick={() => setFilter('debt')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === 'debt' ? 'bg-red-500 text-white' : 'text-text-muted hover:text-white hover:bg-surface-highlight'
                        }`}
                >
                    Hutang
                </button>
                <button
                    onClick={() => setFilter('receivable')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === 'receivable' ? 'bg-green-500 text-white' : 'text-text-muted hover:text-white hover:bg-surface-highlight'
                        }`}
                >
                    Piutang
                </button>
            </div>

            {/* Debt List */}
            {filteredDebts.length === 0 ? (
                <EmptyState
                    icon="swap_horiz"
                    title="Belum Ada Catatan"
                    description="Catat hutang dan piutangmu agar tidak lupa. Klik tombol di atas untuk menambahkan catatan baru."
                    actionLabel="Tambah Catatan"
                    onAction={handleAddDebt}
                />
            ) : (
                <div className="space-y-3 animate-stagger-in" style={{ animationDelay: '0.3s' }}>
                    {filteredDebts.map((debt) => (
                        <div
                            key={debt.id}
                            className={`bg-surface-dark rounded-2xl p-4 border transition-all group ${debt.status === 'paid' ? 'border-border-dark opacity-60' :
                                isOverdue(debt.dueDate) ? 'border-orange-500/50' : 'border-border-dark hover:border-primary/30'
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${debt.type === 'debt' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                                        }`}>
                                        <span className="material-symbols-outlined text-[20px]">{debt.icon || 'person'}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">{debt.personName}</h3>
                                        <div className="flex items-center gap-2 text-xs text-text-muted">
                                            <span>{debt.type === 'debt' ? 'Hutang ke' : 'Piutang dari'}</span>
                                            <span>•</span>
                                            <span>{getWalletName(debt.walletId)}</span>
                                        </div>
                                        {debt.description && (
                                            <p className="text-xs text-text-muted mt-1">{debt.description}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-lg font-bold ${debt.type === 'debt' ? 'text-red-400' : 'text-green-400'}`}>
                                        {debt.type === 'debt' ? '-' : '+'}{formatCurrency(debt.amount)}
                                    </p>
                                    {debt.dueDate && (
                                        <p className={`text-xs ${isOverdue(debt.dueDate) ? 'text-orange-400' : 'text-text-muted'}`}>
                                            {isOverdue(debt.dueDate) ? '⚠️ ' : ''}Jatuh tempo: {new Date(debt.dueDate).toLocaleDateString('id-ID')}
                                        </p>
                                    )}
                                    {debt.status === 'paid' && (
                                        <span className="inline-flex items-center gap-1 text-xs text-green-400 mt-1">
                                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                            Lunas
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border-dark">
                                {debt.status === 'unpaid' && (
                                    <button
                                        onClick={() => handleMarkPaid(debt)}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-green-500/10 text-green-400 text-xs font-medium rounded-lg hover:bg-green-500/20 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">check</span>
                                        Tandai Lunas
                                    </button>
                                )}
                                <button
                                    onClick={() => handleEditDebt(debt)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-surface-highlight text-text-muted text-xs font-medium rounded-lg hover:text-white transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[16px]">edit</span>
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteDebtClick(debt)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-surface-highlight text-text-muted text-xs font-medium rounded-lg hover:text-red-400 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[16px]">delete</span>
                                    Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Debt Form Modal */}
            <DebtForm
                isOpen={showAddDebt || !!editingDebt}
                onClose={() => {
                    setShowAddDebt(false);
                    setEditingDebt(null);
                }}
                debt={editingDebt}
            />

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={!!deletingDebt}
                onClose={() => setDeletingDebt(null)}
                onConfirm={handleDelete}
                title="Hapus Catatan"
                message={`Apakah Anda yakin ingin menghapus catatan "${deletingDebt?.personName}"?`}
                confirmLabel="Ya, Hapus"
                danger
            />
        </div>
    );
}
