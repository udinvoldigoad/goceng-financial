import { useState } from 'react';
import useStore from '../store/useStore';
import { formatCurrency, formatDate, calculatePercentage } from '../services/formatters';
import GoalForm from '../components/forms/GoalForm';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { toast } from '../components/ui/Toast';
import FormattedNumberInput from '../components/ui/FormattedNumberInput';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { getIconContainerClasses, getTextColor } from '../services/colorUtils';

export default function Goals() {
    const { goals, deleteGoal, addGoalContribution } = useStore();
    const { requireAuth } = useRequireAuth();
    const [showAddGoal, setShowAddGoal] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    const [deletingGoal, setDeletingGoal] = useState(null);
    const [contributingGoal, setContributingGoal] = useState(null);
    const [contributionAmount, setContributionAmount] = useState('');

    // Auth-protected action handlers
    const handleAddGoal = () => requireAuth(() => setShowAddGoal(true));
    const handleEditGoal = (goal) => requireAuth(() => setEditingGoal(goal));
    const handleDeleteGoalClick = (goal) => requireAuth(() => setDeletingGoal(goal));
    const handleContributeClick = (goal) => requireAuth(() => setContributingGoal(goal));

    const handleDelete = () => {
        if (deletingGoal) {
            deleteGoal(deletingGoal.id);
            toast.success('Goal berhasil dihapus');
            setDeletingGoal(null);
        }
    };

    const handleContribute = () => {
        const amount = typeof contributionAmount === 'string' ? parseFloat(contributionAmount) : contributionAmount;
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
                    onClick={handleAddGoal}
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
                    onAction={handleAddGoal}
                />
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                    {goals.map((goal) => {
                        const percentage = calculatePercentage(goal.currentAmount, goal.targetAmount);
                        const remaining = goal.targetAmount - goal.currentAmount;
                        const deadlineStatus = getDeadlineStatus(goal.deadline);
                        const isCompleted = goal.currentAmount >= goal.targetAmount;

                        return (
                            <div
                                key={goal.id}
                                className={`bg-surface-dark border rounded-2xl p-3 md:p-6 relative group transition-all ${isCompleted ? 'border-green-500/50' : 'border-border-dark hover:border-primary/30'
                                    }`}
                            >
                                {isCompleted && (
                                    <div className="absolute top-2 right-2 md:top-4 md:right-4">
                                        <span className="material-symbols-outlined text-green-400 text-lg md:text-2xl">task_alt</span>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                                    <div className={`h-8 w-8 md:h-12 md:w-12 rounded-xl flex items-center justify-center shrink-0 ${getIconContainerClasses(goal.color, 'green', 'light')}`}>
                                        <span className="material-symbols-outlined text-lg md:text-2xl">{goal.icon || 'flag'}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-white text-xs md:text-base truncate">{goal.name}</h3>
                                        {goal.notes && (
                                            <p className="text-[10px] md:text-xs text-text-muted truncate">{goal.notes}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-3 md:mb-4">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-1 md:mb-2 gap-0 md:gap-2">
                                        <span className="text-xs md:text-base font-bold text-white truncate">{formatCurrency(goal.currentAmount)}</span>
                                        <span className="text-[10px] md:text-sm text-text-muted truncate">dari {formatCurrency(goal.targetAmount)}</span>
                                    </div>
                                    <div className="w-full bg-surface-highlight rounded-full h-1.5 md:h-3 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${isCompleted ? 'bg-green-500' : 'bg-primary'
                                                }`}
                                            style={{ width: `${Math.min(percentage, 100)}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex items-center justify-between mt-1 md:mt-2">
                                        <span className={`text-xs md:text-sm font-bold ${isCompleted ? 'text-green-400' : 'text-primary'}`}>
                                            {percentage}%
                                        </span>
                                        {!isCompleted && (
                                            <span className="text-[10px] md:text-xs text-text-muted truncate max-w-[80px] md:max-w-none">
                                                -{formatCurrency(remaining)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {deadlineStatus && (
                                    <div className={`mb-3 md:mb-4 flex items-center gap-1 md:gap-2 text-[10px] md:text-xs ${getTextColor(deadlineStatus.color)}`}>
                                        <span className="material-symbols-outlined text-xs md:text-sm">schedule</span>
                                        <span className="truncate">{deadlineStatus.text}</span>
                                    </div>
                                )}

                                <div className="flex gap-1 md:gap-2">
                                    {!isCompleted && (
                                        <button
                                            onClick={() => handleContributeClick(goal)}
                                            className="flex-1 py-1.5 md:py-2 rounded-lg bg-primary text-white text-[10px] md:text-sm font-medium hover:bg-primary/90 transition-colors"
                                        >
                                            <span className="md:hidden">+ Dana</span>
                                            <span className="hidden md:inline">Tambah Dana</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleEditGoal(goal)}
                                        className="py-1.5 px-2 md:py-2 md:px-3 rounded-lg bg-surface-highlight text-text-muted hover:text-white transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[16px] md:text-[20px]">edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteGoalClick(goal)}
                                        className="py-1.5 px-2 md:py-2 md:px-3 rounded-lg bg-surface-highlight text-text-muted hover:text-red-400 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[16px] md:text-[20px]">delete</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {/* Add Goal Card */}
                    <div
                        onClick={handleAddGoal}
                        className="bg-surface-dark border border-dashed border-border-dark rounded-2xl p-3 md:p-6 flex flex-col items-center justify-center min-h-[180px] md:min-h-[280px] cursor-pointer hover:border-primary/50 hover:bg-surface-highlight/30 transition-all group"
                    >
                        <div className="h-10 w-10 md:h-14 md:w-14 rounded-full bg-surface-highlight flex items-center justify-center text-text-muted group-hover:text-primary transition-colors mb-2 md:mb-4">
                            <span className="material-symbols-outlined text-xl md:text-3xl">add</span>
                        </div>
                        <p className="text-text-muted font-medium text-xs md:text-base group-hover:text-white transition-colors text-center">Buat Goal Baru</p>
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
                        <FormattedNumberInput
                            value={contributionAmount}
                            onChange={(val) => setContributionAmount(val)}
                            className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-lg text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="e.g. 500.000"
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
