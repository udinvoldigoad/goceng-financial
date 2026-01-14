import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useStore from '../../store/useStore';
import Modal from '../ui/Modal';
import { toast } from '../ui/Toast';
import FormattedNumberInput from '../ui/FormattedNumberInput';

const goalSchema = z.object({
    name: z.string().min(1, 'Nama goal wajib diisi'),
    targetAmount: z.coerce.number().positive('Target harus lebih dari 0'),
    currentAmount: z.coerce.number().min(0, 'Jumlah tidak boleh negatif').optional(),
    deadline: z.string().optional(),
    notes: z.string().optional(),
});

const GOAL_ICONS = [
    { id: 'savings', icon: 'savings', label: 'Tabungan' },
    { id: 'flight', icon: 'flight', label: 'Liburan' },
    { id: 'home', icon: 'home', label: 'Rumah' },
    { id: 'directions_car', icon: 'directions_car', label: 'Kendaraan' },
    { id: 'smartphone', icon: 'smartphone', label: 'Gadget' },
    { id: 'school', icon: 'school', label: 'Pendidikan' },
    { id: 'celebration', icon: 'celebration', label: 'Event' },
    { id: 'medical_services', icon: 'medical_services', label: 'Kesehatan' },
    { id: 'flag', icon: 'flag', label: 'Lainnya' },
];

/**
 * Goal form component
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {function} props.onClose
 * @param {Object} [props.goal] - Existing goal for edit mode
 */
export default function GoalForm({ isOpen, onClose, goal = null }) {
    const { addGoal, updateGoal } = useStore();
    const isEdit = !!goal;

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(goalSchema),
        defaultValues: goal || {
            name: '',
            targetAmount: '',
            currentAmount: 0,
            deadline: '',
            notes: '',
            icon: 'savings',
            color: 'green',
        },
    });

    const selectedIcon = watch('icon') || 'savings';

    const onSubmit = (data) => {
        const goalData = {
            ...data,
            icon: selectedIcon,
            color: 'green',
        };

        if (isEdit) {
            updateGoal(goal.id, goalData);
            toast.success('Goal berhasil diperbarui!');
        } else {
            addGoal(goalData);
            toast.success('Goal berhasil ditambahkan!');
        }

        reset();
        onClose();
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={isEdit ? 'Edit Goal' : 'Buat Goal Baru'}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-text-muted mb-1.5">
                        Nama Goal
                    </label>
                    <input
                        type="text"
                        {...register('name')}
                        className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-lg text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="e.g. Dana Darurat, Liburan ke Jepang"
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-muted mb-1.5">
                        Icon
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {GOAL_ICONS.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setValue('icon', item.icon)}
                                className={`p-2 rounded-lg border transition-colors ${selectedIcon === item.icon
                                    ? 'bg-primary/20 border-primary text-primary'
                                    : 'bg-surface-highlight border-border-dark text-text-muted hover:border-primary/50'
                                    }`}
                                title={item.label}
                            >
                                <span className="material-symbols-outlined">{item.icon}</span>
                            </button>
                        ))}
                    </div>
                    <input type="hidden" {...register('icon')} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-muted mb-1.5">
                        Target Amount
                    </label>
                    <Controller
                        name="targetAmount"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <FormattedNumberInput
                                value={value}
                                onChange={onChange}
                                className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-lg text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="e.g. 10.000.000"
                            />
                        )}
                    />
                    {errors.targetAmount && (
                        <p className="mt-1 text-sm text-red-400">{errors.targetAmount.message}</p>
                    )}
                </div>

                {isEdit && (
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1.5">
                            Current Amount
                        </label>
                        <Controller
                            name="currentAmount"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <FormattedNumberInput
                                    value={value}
                                    onChange={onChange}
                                    className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-lg text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="0"
                                />
                            )}
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-text-muted mb-1.5">
                        Deadline (Opsional)
                    </label>
                    <input
                        type="date"
                        {...register('deadline')}
                        className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-muted mb-1.5">
                        Catatan (Opsional)
                    </label>
                    <textarea
                        {...register('notes')}
                        rows={2}
                        className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-lg text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        placeholder="Catatan tambahan..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors mt-6 disabled:opacity-50"
                >
                    {isSubmitting ? 'Menyimpan...' : isEdit ? 'Update Goal' : 'Buat Goal'}
                </button>
            </form>
        </Modal>
    );
}
