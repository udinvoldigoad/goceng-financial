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
    walletTargetId: z.string().optional(),
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
        if (data.type === 'expense' || data.type === 'transfer') {
            const wallet = wallets.find(w => w.id === data.walletId);
            if (wallet) {
                let availableBalance = wallet.balance;

                if (isEdit) {
                    if (transaction.walletId === data.walletId) {
                        if (transaction.type === 'expense' || transaction.type === 'transfer') {
                            availableBalance += transaction.amount;
                        } else if (transaction.type === 'income') {
                            availableBalance -= transaction.amount;
                        }
                    }
                }

                if (availableBalance < data.amount) {
                    toast.error('Saldo tidak mencukupi! Saldo tersedia: Rp ' + new Intl.NumberFormat('id-ID').format(availableBalance));
                    return;
                }
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Type Toggle - Tab Style */}
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setValue('type', 'expense')}
                        className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${type === 'expense'
                                ? 'bg-red-500 text-white'
                                : 'bg-surface-highlight text-text-muted hover:text-white'
                            }`}
                    >
                        Pengeluaran
                    </button>
                    <button
                        type="button"
                        onClick={() => setValue('type', 'income')}
                        className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${type === 'income'
                                ? 'bg-green-500 text-white'
                                : 'bg-surface-highlight text-text-muted hover:text-white'
                            }`}
                    >
                        Pemasukan
                    </button>
                    <button
                        type="button"
                        onClick={() => setValue('type', 'transfer')}
                        className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${type === 'transfer'
                                ? 'bg-blue-500 text-white'
                                : 'bg-surface-highlight text-text-muted hover:text-white'
                            }`}
                    >
                        Transfer
                    </button>
                </div>

                {/* Amount - Large Style */}
                <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">
                        Jumlah
                    </label>
                    <Controller
                        name="amount"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <FormattedNumberInput
                                value={value}
                                onChange={onChange}
                                className="w-full px-4 py-4 bg-surface-highlight border border-border-dark rounded-xl text-white font-bold text-2xl placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="0"
                            />
                        )}
                    />
                    {errors.amount && (
                        <p className="mt-1 text-sm text-red-400">{errors.amount.message}</p>
                    )}
                    {(type === 'expense' || type === 'transfer') && (() => {
                        const selectedWallet = wallets.find(w => w.id === watch('walletId'));
                        const currentAmount = watch('amount');
                        if (selectedWallet && currentAmount && Number(currentAmount) > selectedWallet.balance) {
                            return (
                                <p className="mt-1 text-sm text-yellow-400">
                                    ⚠️ Saldo tidak mencukupi. Tersedia: Rp {new Intl.NumberFormat('id-ID').format(selectedWallet.balance)}
                                </p>
                            );
                        }
                        return null;
                    })()}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">
                        Deskripsi
                    </label>
                    <input
                        type="text"
                        {...register('description')}
                        className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-xl text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Ini untuk apa?"
                    />
                </div>

                {/* Category & Wallet - Side by Side */}
                {type !== 'transfer' ? (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">
                                Kategori
                            </label>
                            <select
                                {...register('category')}
                                className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                            >
                                <option value="" disabled>Pilih...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">
                                Dompet
                            </label>
                            <select
                                {...register('walletId')}
                                className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                            >
                                <option value="" disabled>Pilih...</option>
                                {wallets.map(w => (
                                    <option key={w.id} value={w.id}>{w.name}</option>
                                ))}
                            </select>
                            {errors.walletId && (
                                <p className="mt-1 text-sm text-red-400">{errors.walletId.message}</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">
                                Dari Dompet
                            </label>
                            <select
                                {...register('walletId')}
                                className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                            >
                                <option value="" disabled>Pilih...</option>
                                {wallets.map(w => (
                                    <option key={w.id} value={w.id}>{w.name}</option>
                                ))}
                            </select>
                            {errors.walletId && (
                                <p className="mt-1 text-sm text-red-400">{errors.walletId.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">
                                Ke Dompet
                            </label>
                            <select
                                {...register('walletTargetId')}
                                className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                            >
                                <option value="" disabled>Pilih...</option>
                                {wallets.filter(w => w.id !== watch('walletId')).map(w => (
                                    <option key={w.id} value={w.id}>{w.name}</option>
                                ))}
                            </select>
                            {errors.walletTargetId && (
                                <p className="mt-1 text-sm text-red-400">{errors.walletTargetId.message}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Date */}
                <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">
                        Tanggal
                    </label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[20px]">calendar_today</span>
                        <input
                            type="date"
                            {...register('date')}
                            className="w-full pl-12 pr-4 py-3 bg-surface-highlight border border-border-dark rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary [color-scheme:dark]"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3.5 font-bold rounded-xl transition-colors mt-2 disabled:opacity-50 ${type === 'expense' ? 'bg-red-500 hover:bg-red-600 text-white' :
                            type === 'income' ? 'bg-green-500 hover:bg-green-600 text-white' :
                                'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                >
                    {isSubmitting ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Transaksi'}
                </button>
            </form>
        </Modal>
    );
}
