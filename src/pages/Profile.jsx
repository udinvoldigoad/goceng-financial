import useStore from '../store/useStore';
import { formatDate } from '../services/formatters';

export default function Profile() {
    const { settings, transactions, wallets, goals } = useStore();

    const completedGoals = goals.filter(g => g.currentAmount >= g.targetAmount).length;
    const totalTransactions = transactions.length;

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-4">Profil</h1>
            <div className="bg-surface-dark border border-border-dark rounded-2xl p-6">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 rounded-full bg-gray-600 overflow-hidden">
                        <img
                            alt="Profile"
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCgbulcB0M9cILVXQceQfzLp-PXgZzRQV2DrR2LdPSB7x6LL17D3FWLRg7-jDGJv5tWL9iUWDJKmK5rPfvEUSaqYaVz6Vp7tjHtkwzUZ6tGyWTjc0ro-Yu-UfYaLR_dGcLmasvBnkK_qS7vA9fmTKh-zOt6Neq3np-cjrDKGdfUY2H3A7zoDMeC_I8DPGDEqx96JtiK0VSKMsGKna-Ykm01CBwXX5j2kyqOjWYXrmslT9bYFFqtmSrNrGct7ieEpe_wXR-kx5TAPZT"
                        />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Udin Petot</h2>
                        <p className="text-text-muted">udin@goceng.id</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-surface-highlight border border-border-dark">
                        <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Member Since</p>
                        <p className="text-white font-medium">
                            {settings.memberSince
                                ? formatDate(settings.memberSince, 'medium')
                                : 'Januari 2023'
                            }
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-surface-highlight border border-border-dark">
                        <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Total Transaksi</p>
                        <p className="text-white font-medium">{totalTransactions} Transaksi</p>
                    </div>
                    <div className="p-4 rounded-xl bg-surface-highlight border border-border-dark">
                        <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Wallet Aktif</p>
                        <p className="text-white font-medium">{wallets.length} Wallet</p>
                    </div>
                    <div className="p-4 rounded-xl bg-surface-highlight border border-border-dark">
                        <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Goals Tercapai</p>
                        <p className="text-white font-medium">{completedGoals} / {goals.length}</p>
                    </div>
                </div>

                {/* Account Actions */}
                <div className="border-t border-border-dark pt-6">
                    <h3 className="font-bold text-white mb-4">Informasi Akun</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-surface-highlight">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-text-muted">email</span>
                                <span className="text-white">Email</span>
                            </div>
                            <span className="text-text-muted">udin@goceng.id</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-surface-highlight">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-text-muted">verified_user</span>
                                <span className="text-white">Status Akun</span>
                            </div>
                            <span className="text-green-400 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                Aktif
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-surface-highlight">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-text-muted">storage</span>
                                <span className="text-white">Penyimpanan</span>
                            </div>
                            <span className="text-text-muted">Local (Browser)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
