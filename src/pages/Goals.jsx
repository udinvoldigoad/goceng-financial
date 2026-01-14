import { useState } from 'react';
import useStore from '../store/useStore';
import { formatCurrency, formatDate, calculatePercentage } from '../services/formatters';
import GoalForm from '../components/forms/GoalForm';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { toast } from '../components/ui/Toast';

export default function Goals() {
    const { goals, deleteGoal, addGoalContribution } = useStore();
    const [showAddGoal, setShowAddGoal] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    const [deletingGoal, setDeletingGoal] = useState(null);
    const [contributingGoal, setContributingGoal] = useState(null);
    const [contributionAmount, setContributionAmount] = useState('');

    const handleDelete = () => {
        if (deletingGoal) {
            deleteGoal(deletingGoal.id);
            toast.success('Goal berhasil dihapus');
            setDeletingGoal(null);
        }
    };

    const handleContribute = () => {
        const amount = parseFloat(contributionAmount);
        if (!amount || amount <= 0) {
            toast.error('Masukkan jumlah yang valid');
            return;
        }

        addGoalContribution(contributingGoal.id, amount);
        toast.success(`Berhasil menambah Rp ${amount.toLocaleString('id-ID')} ke ${contributingGoal.name}`);
        setContributingGoal(null);
        setContributionAmount('');
    };

    const getDeadlineStatus = (deadline) => {
        if (!deadline) return null;
        const deadlineDate = new Date(deadline);
        const today = new Date();
        const diffDays = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return { text: 'Terlewat', color: 'red' };
        if (diffDays <= 30) return { text: `${diffDays} hari lagi`, color: 'orange' };
        if (diffDays <= 90) return { text: `${Math.ceil(diffDays / 30)} bulan lagi`, color: 'yellow' };
        return { text: formatDate(deadline, 'medium'), color: 'green' };
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Goals</h1>
                    <p className="text-text-muted mt-1">Tetapkan dan lacak target keuangan Anda.</p>
                </div>
                <button
                    onClick={() => setShowAddGoal(true)}
                    className="flex items-center gap-2 cursor-pointer justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-bold tracking-wide shadow-lg shadow-primary/20"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    <span>Buat Goal Baru</span>
                </button>
            </div>

            {/* Goals Grid */}
            {goals.length === 0 ? (
                <EmptyState
                    icon="flag"
                    title="Belum ada goal"
                    description="Tetapkan target keuangan pertama Anda untuk mulai menabung dengan tujuan yang jelas."
                    actionLabel="Buat Goal"
                    onAction={() => setShowAddGoal(true)}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.map((goal) => {
                        const percentage = calculatePercentage(goal.currentAmount, goal.targetAmount);
                        const remaining = goal.targetAmount - goal.currentAmount;
                        const deadlineStatus = getDeadlineStatus(goal.deadline);
                        const isCompleted = goal.currentAmount >= goal.targetAmount;

                        return (
                            <div
                                key={goal.id}
                                className={`bg-surface-dark border rounded-2xl p-6 relative group transition-all ${isCompleted ? 'border-green-500/50' : 'border-border-dark hover:border-primary/30'
                                    }`}
                            >
                                {isCompleted && (
                                    <div className="absolute top-4 right-4">
                                        <span className="material-symbols-outlined text-green-400 text-2xl">task_alt</span>
                                    </div>
                                )}

                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`h-12 w-12 rounded-xl bg-${goal.color || 'green'}-500/20 flex items-center justify-center text-${goal.color || 'green'}-400`}>
                                        <span className="material-symbols-outlined text-2xl">{goal.icon || 'flag'}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-white truncate">{goal.name}</h3>
                                        {goal.notes && (
                                            <p className="text-xs text-text-muted truncate">{goal.notes}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-bold text-white">{formatCurrency(goal.currentAmount)}</span>
                                        <span className="text-sm text-text-muted">dari {formatCurrency(goal.targetAmount)}</span>
                                    </div>
                                    <div className="w-full bg-surface-highlight rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`h-3 rounded-full transition-all ${isCompleted ? 'bg-green-500' : 'bg-primary'
                                                }`}
                                            style={{ width: `${Math.min(percentage, 100)}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className={`text-sm font-bold ${isCompleted ? 'text-green-400' : 'text-primary'}`}>
                                            {percentage}%
                                        </span>
                                        {!isCompleted && (
                                            <span className="text-xs text-text-muted">
                                                Kurang {formatCurrency(remaining)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {deadlineStatus && (
                                    <div className={`mb-4 flex items-center gap-2 text-xs text-${deadlineStatus.color}-400`}>
                                        <span className="material-symbols-outlined text-sm">schedule</span>
                                        <span>{deadlineStatus.text}</span>
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    {!isCompleted && (
                                        <button
                                            onClick={() => setContributingGoal(goal)}
                                            className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
                                        >
                                            Tambah Dana
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setEditingGoal(goal)}
                                        className="py-2 px-3 rounded-lg bg-surface-highlight text-text-muted hover:text-white transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                    </button>
                                    <button
                                        onClick={() => setDeletingGoal(goal)}
                                        className="py-2 px-3 rounded-lg bg-surface-highlight text-text-muted hover:text-red-400 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {/* Add Goal Card */}
                    <div
                        onClick={() => setShowAddGoal(true)}
                        className="bg-surface-dark border border-dashed border-border-dark rounded-2xl p-6 flex flex-col items-center justify-center min-h-[280px] cursor-pointer hover:border-primary/50 hover:bg-surface-highlight/30 transition-all group"
                    >
                        <div className="h-14 w-14 rounded-full bg-surface-highlight flex items-center justify-center text-text-muted group-hover:text-primary transition-colors mb-4">
                            <span className="material-symbols-outlined text-3xl">add</span>
                        </div>
                        <p className="text-text-muted font-medium group-hover:text-white transition-colors">Buat Goal Baru</p>
                    </div>
                </div>
            )}

            {/* Goal Form Modal */}
            <GoalForm
                isOpen={showAddGoal || !!editingGoal}
                onClose={() => {
                    setShowAddGoal(false);
                    setEditingGoal(null);
                }}
                goal={editingGoal}
            />

            {/* Contribution Modal */}
            <Modal
                isOpen={!!contributingGoal}
                onClose={() => {
                    setContributingGoal(null);
                    setContributionAmount('');
                }}
                title={`Tambah Dana ke ${contributingGoal?.name}`}
                size="sm"
            >
                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-surface-highlight">
                        <p className="text-xs text-text-muted mb-1">Progress saat ini</p>
                        <p className="text-lg font-bold text-white">
                            {formatCurrency(contributingGoal?.currentAmount || 0)} / {formatCurrency(contributingGoal?.targetAmount || 0)}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1.5">
                            Jumlah Kontribusi
                        </label>
                        <input
                            type="number"
                            value={contributionAmount}
                            onChange={(e) => setContributionAmount(e.target.value)}
                            className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-lg text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="e.g. 500000"
                            autoFocus
                        />
                    </div>
                    <button
                        onClick={handleContribute}
                        className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Tambah Dana
                    </button>
                </div>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={!!deletingGoal}
                onClose={() => setDeletingGoal(null)}
                onConfirm={handleDelete}
                title="Hapus Goal"
                message={`Apakah Anda yakin ingin menghapus goal "${deletingGoal?.name}"?`}
                confirmLabel="Ya, Hapus"
                danger
            />
        </div>
    );
}
