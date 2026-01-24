import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useStore from '../../store/useStore';
import Modal from '../ui/Modal';
import { toast } from '../ui/Toast';
import FormattedNumberInput from '../ui/FormattedNumberInput';

const subscriptionSchema = z.object({
    name: z.string().min(1, 'Nama wajib diisi'),
    amount: z.coerce.number().min(1, 'Jumlah harus lebih dari 0'),
    cycle: z.enum(['weekly', 'monthly', 'yearly']),
    walletId: z.string().min(1, 'Wallet wajib dipilih'),
    nextDueDate: z.string().min(1, 'Tanggal jatuh tempo wajib diisi'),
    icon: z.string().optional(),
    color: z.string().optional(),
});

const ICONS = [
    { id: 'subscriptions', icon: 'subscriptions', color: 'red', label: 'Streaming' },
    { id: 'music_note', icon: 'music_note', color: 'green', label: 'Musik' },
    { id: 'movie', icon: 'movie', color: 'purple', label: 'Film' },
    { id: 'cloud', icon: 'cloud', color: 'blue', label: 'Cloud' },
    { id: 'videogame_asset', icon: 'videogame_asset', color: 'orange', label: 'Game' },
    { id: 'fitness_center', icon: 'fitness_center', color: 'pink', label: 'Gym' },
    { id: 'newspaper', icon: 'newspaper', color: 'gray', label: 'News' },
    { id: 'wifi', icon: 'wifi', color: 'cyan', label: 'Internet' },
    { id: 'phone_android', icon: 'phone_android', color: 'teal', label: 'Telepon' },
    { id: 'credit_card', icon: 'credit_card', color: 'yellow', label: 'Kartu' },
    { id: 'bolt', icon: 'bolt', color: 'amber', label: 'Listrik' },
    { id: 'water_drop', icon: 'water_drop', color: 'sky', label: 'Air' },
];

export default function SubscriptionForm({ isOpen, onClose, subscription = null }) {
    const { addSubscription, updateSubscription, wallets } = useStore();
    const isEdit = !!subscription;

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(subscriptionSchema),
        defaultValues: {
            name: '',
            amount: 0,
            cycle: 'monthly',
            walletId: '',
            nextDueDate: new Date().toISOString().split('T')[0],
            icon: 'subscriptions',
            color: 'cyan',
        },
    });

    const selectedIcon = watch('icon');

    useEffect(() => {
        if (isOpen) {
            if (subscription) {
                reset({
                    name: subscription.name,
                    amount: subscription.amount,
                    cycle: subscription.cycle,
                    walletId: subscription.walletId,
                    nextDueDate: subscription.nextDueDate,
                    icon: subscription.icon || 'subscriptions',
                    color: subscription.color || 'cyan',
                });
            } else {
                reset({
                    name: '',
                    amount: 0,
                    cycle: 'monthly',
                    walletId: wallets[0]?.id || '',
                    nextDueDate: new Date().toISOString().split('T')[0],
                    icon: 'subscriptions',
                    color: 'cyan',
                });
            }
        }
    }, [isOpen, subscription, wallets, reset]);

    const onSubmit = (data) => {
        // Get color from selected icon
        const iconData = ICONS.find(i => i.icon === data.icon);
        data.color = iconData?.color || 'cyan';

        if (isEdit) {
            updateSubscription(subscription.id, data);
            toast.success('Langganan berhasil diperbarui!');
        } else {
            addSubscription(data);
            toast.success('Langganan berhasil ditambahkan!');
        }
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? 'Edit Langganan' : 'Tambah Langganan'}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-text-muted mb-1.5">
                        Nama Langganan
                    </label>
                    <input
                        type="text"
                        {...register('name')}
                        className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-lg text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="e.g. Netflix, Spotify, Internet"
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                    )}
                </div>

                {/* Icon Selector */}
                <div>
                    <label className="block text-sm font-medium text-text-muted mb-1.5">
                        Ikon
                    </label>
                    <div className="grid grid-cols-6 gap-2 max-h-[120px] overflow-y-auto p-1 custom-scrollbar">
                        {ICONS.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                    setValue('icon', item.icon);
                                    setValue('color', item.color);
                                }}
                                className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${selectedIcon === item.icon
                                        ? `bg-${item.color}-900/30 border-${item.color}-500 ring-1 ring-${item.color}-500`
                                        : 'bg-surface-highlight border-transparent hover:border-white/10'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-${item.color}-900/50 text-${item.color}-400`}>
                                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Amount */}
                <div>
                    <label className="block text-sm font-medium text-text-muted mb-1.5">
                        Jumlah
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-bold">Rp</span>
                        <Controller
                            name="amount"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <FormattedNumberInput
                                    value={value}
                                    onChange={onChange}
                                    className="w-full pl-12 pr-4 py-3 bg-surface-highlight border border-border-dark rounded-lg text-white font-bold text-lg placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="0"
                                />
                            )}
                        />
                    </div>
                    {errors.amount && (
                        <p className="mt-1 text-sm text-red-400">{errors.amount.message}</p>
                    )}
                </div>

                {/* Cycle */}
                <div>
                    <label className="block text-sm font-medium text-text-muted mb-1.5">
                        Siklus Pembayaran
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { id: 'weekly', label: 'Mingguan' },
                            { id: 'monthly', label: 'Bulanan' },
                            { id: 'yearly', label: 'Tahunan' },
                        ].map((cycle) => (
                            <button
                                key={cycle.id}
                                type="button"
                                onClick={() => setValue('cycle', cycle.id)}
                                className={`py-2.5 text-sm font-medium rounded-lg transition-all ${watch('cycle') === cycle.id
                                        ? 'bg-primary text-white shadow-lg'
                                        : 'bg-surface-highlight text-text-muted hover:text-white'
                                    }`}
                            >
                                {cycle.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Wallet & Due Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1.5">
                            Wallet Pembayaran
                        </label>
                        <select
                            {...register('walletId')}
                            className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                        >
                            <option value="" disabled>Pilih Wallet</option>
                            {wallets.map(w => (
                                <option key={w.id} value={w.id}>{w.name}</option>
                            ))}
                        </select>
                        {errors.walletId && (
                            <p className="mt-1 text-sm text-red-400">{errors.walletId.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1.5">
                            Tanggal Jatuh Tempo
                        </label>
                        <input
                            type="date"
                            {...register('nextDueDate')}
                            className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary [color-scheme:dark]"
                        />
                        {errors.nextDueDate && (
                            <p className="mt-1 text-sm text-red-400">{errors.nextDueDate.message}</p>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors mt-4 disabled:opacity-50"
                >
                    {isSubmitting ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Langganan'}
                </button>
            </form>
        </Modal>
    );
}
