import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EXPENSE_CATEGORIES } from '../../models/categories';
import useStore from '../../store/useStore';
import Modal from '../ui/Modal';
import { toast } from '../ui/Toast';
import { getCurrentMonth } from '../../services/formatters';
import FormattedNumberInput from '../ui/FormattedNumberInput';

const budgetSchema = z.object({
    category: z.string().min(1, 'Kategori wajib dipilih'),
    monthlyLimit: z.coerce.number().positive('Limit harus lebih dari 0'),
    month: z.string().min(1, 'Bulan wajib dipilih'),
});

/**
 * Budget form component
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {function} props.onClose
 * @param {Object} [props.budget] - Existing budget for edit mode
 */
export default function BudgetForm({ isOpen, onClose, budget = null }) {
    const { addBudget, updateBudget, budgets } = useStore();
    const isEdit = !!budget;

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(budgetSchema),
        defaultValues: budget || {
            category: '',
            monthlyLimit: '',
            month: getCurrentMonth(),
        },
    });

    // Get categories that don't already have a budget for the current month
    const usedCategories = budgets
        .filter(b => b.month === getCurrentMonth() && (!budget || b.id !== budget.id))
        .map(b => b.category);

    const availableCategories = EXPENSE_CATEGORIES.filter(
        cat => !usedCategories.includes(cat.id) || (budget && budget.category === cat.id)
    );

    const onSubmit = (data) => {
        const category = EXPENSE_CATEGORIES.find(c => c.id === data.category);

        const budgetData = {
            ...data,
            icon: category?.icon || 'pie_chart',
            color: category?.color || 'blue',
        };

        if (isEdit) {
            updateBudget(budget.id, budgetData);
            toast.success('Anggaran berhasil diperbarui!');
        } else {
            addBudget(budgetData);
            toast.success('Anggaran berhasil ditambahkan!');
        }

        reset();
        onClose();
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    // Generate month options (current + next 11 months)
    const monthOptions = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
        const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const label = d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
        monthOptions.push({ value, label });
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={isEdit ? 'Edit Anggaran' : 'Atur Anggaran Baru'}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-text-muted mb-1.5">
                        Kategori
                    </label>
                    <select
                        {...register('category')}
                        className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="">Pilih Kategori</option>
                        {availableCategories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    {errors.category && (
                        <p className="mt-1 text-sm text-red-400">{errors.category.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-muted mb-1.5">
                        Periode
                    </label>
                    <select
                        {...register('month')}
                        className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        {monthOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-muted mb-1.5">
                        Limit Anggaran
                    </label>
                    <Controller
                        name="monthlyLimit"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <FormattedNumberInput
                                value={value}
                                onChange={onChange}
                                className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-lg text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="e.g. 3.000.000"
                            />
                        )}
                    />
                    {errors.monthlyLimit && (
                        <p className="mt-1 text-sm text-red-400">{errors.monthlyLimit.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors mt-6 disabled:opacity-50"
                >
                    {isSubmitting ? 'Menyimpan...' : isEdit ? 'Update Anggaran' : 'Simpan Anggaran'}
                </button>
            </form>
        </Modal>
    );
}
