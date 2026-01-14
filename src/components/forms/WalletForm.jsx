import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { WALLET_TYPES } from '../../models/categories';
import useStore from '../../store/useStore';
import Modal from '../ui/Modal';
import { toast } from '../ui/Toast';
import FormattedNumberInput from '../ui/FormattedNumberInput';

const walletSchema = z.object({
    name: z.string().min(1, 'Nama wallet wajib diisi'),
    type: z.enum(['bank', 'ewallet', 'cash', 'savings', 'investment']),
    accountNumber: z.string().optional(),
    balance: z.coerce.number().min(0, 'Saldo tidak boleh negatif'),
    color: z.string().optional(),
});

/**
 * Wallet form component for add/edit
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {function} props.onClose
 * @param {Object} [props.wallet] - Existing wallet for edit mode
 */
export default function WalletForm({ isOpen, onClose, wallet = null }) {
    const { addWallet, updateWallet } = useStore();
    const isEdit = !!wallet;

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(walletSchema),
        defaultValues: {
            name: '',
            type: 'bank',
            accountNumber: '',
            balance: 0,
            color: 'blue',
        },
    });

    // Effect to reset form when wallet prop changes
    useEffect(() => {
        if (isOpen) {
            if (wallet) {
                reset({
                    name: wallet.name,
                    type: wallet.type,
                    accountNumber: wallet.accountNumber || '',
                    balance: wallet.balance,
                    color: wallet.color || 'blue',
                });
            } else {
                reset({
                    name: '',
                    type: 'bank',
                    accountNumber: '',
                    balance: 0,
                    color: 'blue',
                });
            }
        }
    }, [isOpen, wallet, reset]);

    const onSubmit = (data) => {
        const walletType = WALLET_TYPES.find((t) => t.id === data.type);

        const walletData = {
            ...data,
            icon: walletType?.icon || 'account_balance_wallet',
            color: walletType?.color || 'blue',
        };

        if (isEdit) {
            updateWallet(wallet.id, walletData);
            toast.success('Wallet berhasil diperbarui!');
        } else {
            addWallet(walletData);
            toast.success('Wallet berhasil ditambahkan!');
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
            title={isEdit ? 'Edit Wallet' : 'Tambah Wallet Baru'}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-text-muted mb-1.5">
                        Nama Wallet
                    </label>
                    <input
                        type="text"
                        {...register('name')}
                        className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-lg text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="e.g. BCA, GoPay, Dompet"
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-muted mb-1.5">
                        Tipe Wallet
                    </label>
                    <select
                        {...register('type')}
                        className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        {WALLET_TYPES.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-muted mb-1.5">
                        Nomor Rekening (Opsional)
                    </label>
                    <input
                        type="text"
                        {...register('accountNumber')}
                        className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-lg text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="e.g. **** 4829"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-muted mb-1.5">
                        Saldo Awal
                    </label>
                    <Controller
                        name="balance"
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
                    {errors.balance && (
                        <p className="mt-1 text-sm text-red-400">{errors.balance.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors mt-6 disabled:opacity-50"
                >
                    {isSubmitting ? 'Menyimpan...' : isEdit ? 'Update Wallet' : 'Tambah Wallet'}
                </button>
            </form>
        </Modal>
    );
}
