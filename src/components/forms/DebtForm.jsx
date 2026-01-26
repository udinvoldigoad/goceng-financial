import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useStore from '../../store/useStore';
import Modal from '../ui/Modal';
import { toast } from '../ui/Toast';
import FormattedNumberInput from '../ui/FormattedNumberInput';

const debtSchema = z.object({
    type: z.enum(['debt', 'receivable']), // hutang / piutang
    personName: z.string().min(1, 'Nama wajib diisi'),
    amount: z.coerce.number().min(1, 'Jumlah harus lebih dari 0'),
    description: z.string().optional(),
    dueDate: z.string().optional(),
    walletId: z.string().min(1, 'Dompet wajib dipilih'),
    icon: z.string().optional(),
});

const DEBT_ICONS = [
    { id: 'person', icon: 'person' },
    { id: 'group', icon: 'group' },
    { id: 'business', icon: 'business' },
    { id: 'family', icon: 'family_restroom' },
    { id: 'handshake', icon: 'handshake' },
    { id: 'attach_money', icon: 'attach_money' },
];

export default function DebtForm({ isOpen, onClose, debt = null }) {
    const { wallets, addDebt, updateDebt } = useStore();
    const isEdit = !!debt;
    const [selectedIcon, setSelectedIcon] = useState('person');

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(debtSchema),
        defaultValues: {
            type: 'debt',
            personName: '',
            amount: 0,
            description: '',
            dueDate: '',
            walletId: '',
            icon: 'person',
        },
    });

    const type = watch('type');

    useEffect(() => {
        if (isOpen) {
            if (debt) {
                reset({
                    type: debt.type,
                    personName: debt.personName,
                    amount: debt.amount,
                    description: debt.description || '',
                    dueDate: debt.dueDate || '',
                    walletId: debt.walletId,
                    icon: debt.icon || 'person',
                });
                setSelectedIcon(debt.icon || 'person');
            } else {
                reset({
                    type: 'debt',
                    personName: '',
                    amount: 0,
                    description: '',
                    dueDate: '',
                    walletId: wallets[0]?.id || '',
                    icon: 'person',
                });
                setSelectedIcon('person');
            }
        }
    }, [isOpen, debt, wallets, reset]);

    const onSubmit = (data) => {
        const debtData = {
            ...data,
            icon: selectedIcon,
            status: 'unpaid', // unpaid, paid
            createdAt: new Date().toISOString(),
        };

        if (isEdit) {
            updateDebt(debt.id, debtData);
            toast.success('Catatan berhasil diperbarui!');
        } else {
            addDebt(debtData);
            toast.success('Catatan berhasil ditambahkan!');
        }
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? 'Edit Catatan' : type === 'debt' ? 'Tambah Hutang' : 'Tambah Piutang'}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Type Toggle */}
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setValue('type', 'debt')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${type === 'debt'
                                ? 'bg-red-500 text-white'
                                : 'bg-surface-highlight text-text-muted hover:text-white'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[16px]">south_west</span>
                        Hutang Saya
                    </button>
                    <button
                        type="button"
                        onClick={() => setValue('type', 'receivable')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${type === 'receivable'
                                ? 'bg-green-500 text-white'
                                : 'bg-surface-highlight text-text-muted hover:text-white'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[16px]">north_east</span>
                        Piutang Saya
                    </button>
                </div>

                {/* Icon Selector */}
                <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">Ikon</label>
                    <div className="flex gap-2">
                        {DEBT_ICONS.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setSelectedIcon(item.icon)}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selectedIcon === item.icon
                                        ? type === 'debt' ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-green-500/20 text-green-400 border border-green-500/50'
                                        : 'bg-surface-highlight text-text-muted hover:text-white border border-transparent'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Person Name */}
                <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">
                        {type === 'debt' ? 'Nama Pemberi Hutang' : 'Nama Peminjam'}
                    </label>
                    <input
                        type="text"
                        {...register('personName')}
                        className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-xl text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="e.g. John Doe"
                    />
                    {errors.personName && (
                        <p className="mt-1 text-sm text-red-400">{errors.personName.message}</p>
                    )}
                </div>

                {/* Amount */}
                <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">Jumlah</label>
                    <Controller
                        name="amount"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <FormattedNumberInput
                                value={value}
                                onChange={onChange}
                                className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-xl text-white font-bold text-lg placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="0"
                            />
                        )}
                    />
                    {errors.amount && (
                        <p className="mt-1 text-sm text-red-400">{errors.amount.message}</p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">Keterangan</label>
                    <input
                        type="text"
                        {...register('description')}
                        className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-xl text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Untuk apa ini?"
                    />
                </div>

                {/* Due Date */}
                <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">Jatuh Tempo (Opsional)</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[20px]">calendar_today</span>
                        <input
                            type="date"
                            {...register('dueDate')}
                            className="w-full pl-12 pr-4 py-3 bg-surface-highlight border border-border-dark rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary [color-scheme:dark]"
                            placeholder="hh/bb/tttt"
                        />
                    </div>
                </div>

                {/* Wallet Selector */}
                <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">Tautkan ke Dompet *</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[20px]">account_balance_wallet</span>
                        <select
                            {...register('walletId')}
                            className="w-full pl-12 pr-4 py-3 bg-surface-highlight border border-border-dark rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                        >
                            <option value="" disabled>Pilih dompet...</option>
                            {wallets.map(w => (
                                <option key={w.id} value={w.id}>{w.name}</option>
                            ))}
                        </select>
                    </div>
                    <p className="text-xs text-text-muted mt-1">
                        {type === 'debt' ? 'Hutang akan dipantau terhadap saldo dompet ini' : 'Piutang akan dipantau terhadap saldo dompet ini'}
                    </p>
                    {errors.walletId && (
                        <p className="mt-1 text-sm text-red-400">{errors.walletId.message}</p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 bg-surface-highlight text-white font-medium rounded-xl hover:bg-surface-highlight/80 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex-1 py-3 font-bold rounded-xl transition-colors disabled:opacity-50 ${type === 'debt'
                                ? 'bg-[#C7FF00] hover:bg-[#b8ed00] text-black'
                                : 'bg-[#C7FF00] hover:bg-[#b8ed00] text-black'
                            }`}
                    >
                        {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
