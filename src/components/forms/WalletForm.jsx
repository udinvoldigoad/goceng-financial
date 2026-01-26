import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { WALLET_TYPES, WALLET_COLORS } from '../../models/categories';
import useStore from '../../store/useStore';
import Modal from '../ui/Modal';
import { toast } from '../ui/Toast';
import FormattedNumberInput from '../ui/FormattedNumberInput';

const walletSchema = z.object({
    name: z.string().min(1, 'Nama wallet wajib diisi'),
    type: z.string(),
    accountNumber: z.string().optional(),
    balance: z.coerce.number().min(0, 'Saldo tidak boleh negatif'),
    color: z.string().optional(),
});

/**
 * Wallet form component for add/edit with visual type and color selector
 */
export default function WalletForm({ isOpen, onClose, wallet = null }) {
    const { addWallet, updateWallet } = useStore();
    const isEdit = !!wallet;

    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        setValue,
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

    const selectedType = watch('type');
    const selectedColor = watch('color');

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
            title={isEdit ? 'Edit Dompet' : 'Tambah Dompet'}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Wallet Name */}
                <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">
                        Wallet Name
                    </label>
                    <input
                        type="text"
                        {...register('name')}
                        className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-lg text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="e.g. BCA Savings"
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                    )}
                </div>

                {/* Type Selector - Grid */}
                <div>
                    <label className="block text-sm font-medium text-text-muted mb-3">
                        Type
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                        {WALLET_TYPES.map((type) => (
                            <button
                                key={type.id}
                                type="button"
                                onClick={() => setValue('type', type.id)}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${selectedType === type.id
                                        ? 'border-primary bg-primary/10'
                                        : 'border-transparent bg-surface-highlight hover:bg-surface-highlight/80'
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedType === type.id ? 'bg-primary/20' : 'bg-surface-dark'
                                    }`}>
                                    <span className={`material-symbols-outlined text-[20px] ${selectedType === type.id ? 'text-primary' : 'text-text-muted'
                                        }`}>
                                        {type.icon}
                                    </span>
                                </div>
                                <span className={`text-xs font-medium ${selectedType === type.id ? 'text-white' : 'text-text-muted'
                                    }`}>
                                    {type.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Color Selector */}
                <div>
                    <label className="block text-sm font-medium text-text-muted mb-3">
                        Warna
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {WALLET_COLORS.map((colorOption) => (
                            <button
                                key={colorOption.id}
                                type="button"
                                onClick={() => setValue('color', colorOption.id)}
                                className={`w-10 h-10 rounded-full transition-all ${selectedColor === colorOption.id
                                        ? 'ring-2 ring-white ring-offset-2 ring-offset-surface-dark scale-110'
                                        : 'hover:scale-105'
                                    }`}
                                style={{ backgroundColor: colorOption.color }}
                            />
                        ))}
                    </div>
                </div>

                {/* Saldo Awal */}
                <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">
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
                    className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors mt-4 disabled:opacity-50"
                >
                    {isSubmitting ? 'Menyimpan...' : isEdit ? 'Update Dompet' : 'Tambah Dompet'}
                </button>
            </form>
        </Modal>
    );
}
