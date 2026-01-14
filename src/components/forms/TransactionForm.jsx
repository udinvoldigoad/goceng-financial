import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../models/categories';
import useStore from '../../store/useStore';
import Modal from '../ui/Modal';
import { toast } from '../ui/Toast';
import FormattedNumberInput from '../ui/FormattedNumberInput';

const transactionSchema = z.object({
    type: z.enum(['income', 'expense', 'transfer']),
    amount: z.coerce.number().min(1, 'Jumlah harus lebih dari 0'),
    category: z.string().min(1, 'Kategori wajib dipilih'),
    walletId: z.string().min(1, 'Wallet wajib dipilih'),
    date: z.string(),
    description: z.string().optional(),
    walletTargetId: z.string().optional(), // For transfer only
}).refine((data) => {
    if (data.type === 'transfer' && !data.walletTargetId) {
        return false;
    }
    if (data.type === 'transfer' && data.walletId === data.walletTargetId) {
        return false;
    }
    return true;
}, {
    message: "Wallet tujuan diperlukan dan tidak boleh sama",
    path: ["walletTargetId"],
});

export default function TransactionForm({ isOpen, onClose, transaction = null }) {
    const { addTransaction, updateTransaction, wallets } = useStore();
    const isEdit = !!transaction;

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            type: 'expense',
            amount: 0,
            category: 'food',
            walletId: '',
            walletTargetId: '',
            date: new Date().toISOString().split('T')[0],
            description: '',
        },
    });

    const type = watch('type');

    // Reset when opening/closing or editing
    useEffect(() => {
        if (isOpen) {
            if (transaction) {
                reset({
                    type: transaction.type,
                    amount: transaction.amount,
                    category: transaction.category,
                    walletId: transaction.walletId,
                    walletTargetId: transaction.walletTargetId || '',
                    date: transaction.date,
                    description: transaction.description || '',
                });
            } else {
                reset({
                    type: 'expense',
                    amount: 0,
                    category: 'food',
                    walletId: wallets[0]?.id || '',
                    walletTargetId: '',
                    date: new Date().toISOString().split('T')[0],
                    description: '',
                });
            }
        }
    }, [isOpen, transaction, wallets, reset]);

    const onSubmit = (data) => {
        // Validation for sufficient balance (simple check)
        if (data.type === 'expense' || data.type === 'transfer') {
            const wallet = wallets.find(w => w.id === data.walletId);
            if (wallet && wallet.balance < data.amount) {
                // We allow it but maybe warn? For now let's just proceed or maybe toast error?
                // Let's allow negative balances for flexibility, but maybe show warning toast
            }
        }

        if (isEdit) {
            updateTransaction(transaction.id, data);
            toast.success('Transaksi berhasil diperbarui!');
        } else {
            addTransaction(data);
            toast.success('Transaksi berhasil ditambahkan!');
        }
        onClose();
    };

    const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? 'Edit Transaksi' : 'Tambah Transaksi'}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Type Toggle */}
                <div className="grid grid-cols-3 gap-2 p-1 bg-surface-dark border border-border-dark rounded-xl">
                    {['expense', 'income', 'transfer'].map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setValue('type', t)}
                            className={`py-2 text-sm font-medium rounded-lg transition-all ${type === t
                                    ? t === 'income' ? 'bg-green-500 text-white shadow-lg'
                                        : t === 'transfer' ? 'bg-blue-500 text-white shadow-lg'
                                            : 'bg-red-500 text-white shadow-lg'
                                    : 'text-text-muted hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {t === 'income' ? 'Pemasukan' : t === 'transfer' ? 'Transfer' : 'Pengeluaran'}
                        </button>
                    ))}
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

                {/* Wallet & Target Wallet (for transfer) */}
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1.5">
                            {type === 'transfer' ? 'Dari Wallet' : 'Wallet'}
                        </label>
                        <select
                            {...register('walletId')}
                            className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                        >
                            <option value="" disabled>Pilih Wallet</option>
                            {wallets.map(w => (
                                <option key={w.id} value={w.id}>{w.name} ({new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(w.balance)})</option>
                            ))}
                        </select>
                        {errors.walletId && (
                            <p className="mt-1 text-sm text-red-400">{errors.walletId.message}</p>
                        )}
                    </div>

                    {type === 'transfer' && (
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">
                                Ke Wallet
                            </label>
                            <select
                                {...register('walletTargetId')}
                                className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                            >
                                <option value="" disabled>Pilih Wallet Tujuan</option>
                                {wallets.filter(w => w.id !== watch('walletId')).map(w => (
                                    <option key={w.id} value={w.id}>{w.name}</option>
                                ))}
                            </select>
                            {errors.walletTargetId && (
                                <p className="mt-1 text-sm text-red-400">{errors.walletTargetId.message}</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Category (Hide for transfer) */}
                {type !== 'transfer' && (
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1.5">
                            Kategori
                        </label>
                        <div className="grid grid-cols-4 gap-2 max-h-[160px] overflow-y-auto p-1 custom-scrollbar">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setValue('category', cat.id)}
                                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${watch('category') === cat.id
                                            ? `bg-${cat.color}-900/30 border-${cat.color}-500 ring-1 ring-${cat.color}-500`
                                            : 'bg-surface-highlight border-transparent hover:border-white/10'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-${cat.color}-900/50 text-${cat.color}-400`}>
                                        <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                                    </div>
                                    <span className={`text-[10px] text-center truncate w-full ${watch('category') === cat.id ? 'text-white font-medium' : 'text-text-muted'}`}>
                                        {cat.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Date & Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1.5">
                            Tanggal
                        </label>
                        <input
                            type="date"
                            {...register('date')}
                            className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary [color-scheme:dark]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1.5">
                            Catatan (Opsional)
                        </label>
                        <input
                            type="text"
                            {...register('description')}
                            className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-lg text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="e.g. Makan siang"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors mt-4 disabled:opacity-50"
                >
                    {isSubmitting ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Transaksi'}
                </button>
            </form>
        </Modal>
    );
}
