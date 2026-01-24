import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useStore from '../../store/useStore';
import Modal from '../ui/Modal';
import { toast } from '../ui/Toast';
import FormattedNumberInput from '../ui/FormattedNumberInput';

const transferSchema = z.object({
    fromWalletId: z.string().min(1, 'Wallet asal wajib dipilih'),
    toWalletId: z.string().min(1, 'Wallet tujuan wajib dipilih'),
    amount: z.coerce.number().positive('Jumlah harus lebih dari 0'),
    description: z.string().optional(),
}).refine((data) => data.fromWalletId !== data.toWalletId, {
    message: 'Wallet tujuan harus berbeda dari wallet asal',
    path: ['toWalletId'],
});

/**
 * Transfer form for wallet-to-wallet transfers
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {function} props.onClose
 */
export default function TransferForm({ isOpen, onClose }) {
    const { wallets, addTransaction, getWalletById } = useStore();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(transferSchema),
        defaultValues: {
            fromWalletId: '',
            toWalletId: '',
            amount: '',
            description: '',
        },
    });

    const fromWalletId = watch('fromWalletId');
    const amount = watch('amount');
    const fromWallet = fromWalletId ? getWalletById(fromWalletId) : null;

    const onSubmit = (data) => {
        // Check if source wallet has sufficient balance
        if (fromWallet && fromWallet.balance < data.amount) {
            toast.error('Saldo tidak mencukupi!');
            return;
        }

        addTransaction({
            type: 'transfer',
            amount: data.amount,
            category: 'transfer',
            walletId: data.fromWalletId,
            walletTargetId: data.toWalletId,
            date: new Date().toISOString().split('T')[0],
            description: data.description || 'Transfer antar wallet',
        });

        toast.success('Transfer berhasil!');
        reset();
        onClose();
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Transfer Antar Wallet">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-text-muted mb-1.5">
                        Dari Wallet
                    </label>
                    <select
                        {...register('fromWalletId')}
                        className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="">Pilih Wallet Asal</option>
                        {wallets.map((wallet) => (
                            <option key={wallet.id} value={wallet.id}>
                                {wallet.name} - Rp {wallet.balance.toLocaleString('id-ID')}
                            </option>
                        ))}
                    </select>
                    {errors.fromWalletId && (
                        <p className="mt-1 text-sm text-red-400">{errors.fromWalletId.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-muted mb-1.5">
                        Ke Wallet
                    </label>
                    <select
                        {...register('toWalletId')}
                        className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="">Pilih Wallet Tujuan</option>
                        {wallets
                            .filter((w) => w.id !== fromWalletId)
                            .map((wallet) => (
                                <option key={wallet.id} value={wallet.id}>
                                    {wallet.name}
                                </option>
                            ))}
                    </select>
                    {errors.toWalletId && (
                        <p className="mt-1 text-sm text-red-400">{errors.toWalletId.message}</p>
                    )}
                </div>

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
                    {fromWallet && amount && Number(amount) > fromWallet.balance && (
                        <p className="mt-1 text-sm text-yellow-400">
                            ⚠️ Saldo tidak mencukupi. Tersedia: Rp {fromWallet.balance.toLocaleString('id-ID')}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-muted mb-1.5">
                        Keterangan (Opsional)
                    </label>
                    <input
                        type="text"
                        {...register('description')}
                        className="w-full px-4 py-3 bg-surface-highlight border border-border-dark rounded-lg text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="e.g. Top up GoPay"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors mt-6 disabled:opacity-50"
                >
                    {isSubmitting ? 'Memproses...' : 'Transfer'}
                </button>
            </form>
        </Modal>
    );
}
