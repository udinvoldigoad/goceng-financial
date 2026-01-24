import { useState } from 'react';
import useStore from '../store/useStore';
import { formatDate } from '../services/formatters';

export default function Profile() {
    const { settings, transactions, wallets, goals, user, updateUser } = useStore();
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        avatar: ''
    });

    const completedGoals = goals.filter(g => g.currentAmount >= g.targetAmount).length;
    const totalTransactions = transactions.length;

    const handleEditClick = () => {
        setEditForm({
            name: user.name || '',
            email: user.email || '',
            avatar: user.avatar || ''
        });
        setShowEditModal(true);
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        updateUser(editForm);
        setShowEditModal(false);
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-4">Profil</h1>
            <div className="bg-surface-dark border border-border-dark rounded-2xl p-6">
                <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-gray-600 overflow-hidden ring-4 ring-surface-highlight">
                            <img
                                alt="Profile"
                                className="w-full h-full object-cover"
                                src={user?.avatar || "https://ui-avatars.com/api/?name=" + (user?.name || "User") + "&background=random"}
                            />
                        </div>

                    </div>
                    <div className="text-center md:text-left flex-1">
                        <div className="flex flex-col md:flex-row items-center gap-3">
                            <h2 className="text-2xl font-bold text-white">{user?.name || 'User'}</h2>
                        </div>
                        <p className="text-text-muted mt-1">{user?.email || 'email@example.com'}</p>
                        <button
                            onClick={handleEditClick}
                            className="mt-4 px-4 py-2 bg-surface-highlight hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors inline-flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">edit_square</span>
                            Edit Profil
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-surface-highlight border border-border-dark hover:border-primary/30 transition-colors">
                        <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Member Since</p>
                        <p className="text-white font-medium">
                            {settings.memberSince
                                ? formatDate(settings.memberSince, 'medium')
                                : 'Januari 2023'
                            }
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-surface-highlight border border-border-dark hover:border-primary/30 transition-colors">
                        <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Total Transaksi</p>
                        <p className="text-white font-medium">{totalTransactions} Transaksi</p>
                    </div>
                    <div className="p-4 rounded-xl bg-surface-highlight border border-border-dark hover:border-primary/30 transition-colors">
                        <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Wallet Aktif</p>
                        <p className="text-white font-medium">{wallets.length} Wallet</p>
                    </div>
                    <div className="p-4 rounded-xl bg-surface-highlight border border-border-dark hover:border-primary/30 transition-colors">
                        <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Goals Tercapai</p>
                        <p className="text-white font-medium">{completedGoals} / {goals.length}</p>
                    </div>
                </div>

                {/* Account Actions */}
                <div className="border-t border-border-dark pt-6">
                    <h3 className="font-bold text-white mb-4">Informasi Akun</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-surface-highlight group hover:bg-surface-highlight/80 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-text-muted group-hover:text-primary transition-colors">email</span>
                                <span className="text-white">Email</span>
                            </div>
                            <span className="text-text-muted truncate max-w-[150px] sm:max-w-[250px]">{user?.email || 'email@example.com'}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-surface-highlight group hover:bg-surface-highlight/80 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-text-muted group-hover:text-green-400 transition-colors">verified_user</span>
                                <span className="text-white">Status Akun</span>
                            </div>
                            <span className="text-green-400 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                Aktif
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-surface-highlight group hover:bg-surface-highlight/80 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-text-muted group-hover:text-blue-400 transition-colors">storage</span>
                                <span className="text-white">Penyimpanan</span>
                            </div>
                            <span className="text-text-muted">Local (Browser)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-md rounded-2xl bg-surface-card border border-border-dark p-6 shadow-xl animate-scale-in">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Edit Profil</h2>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="rounded-lg p-1 text-text-muted hover:bg-white/10 hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSaveProfile} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-text-muted">Nama Lengkap</label>
                                <input
                                    type="text"
                                    required
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full rounded-xl border border-border-dark bg-surface-dark px-4 py-3 text-white placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                    placeholder="Masukkan nama lengkap"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-text-muted">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    className="w-full rounded-xl border border-border-dark bg-surface-dark px-4 py-3 text-white placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                    placeholder="Masukkan alamat email"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-text-muted">URL Avatar (Optional)</label>
                                <input
                                    type="url"
                                    value={editForm.avatar}
                                    onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                                    className="w-full rounded-xl border border-border-dark bg-surface-dark px-4 py-3 text-white placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                    placeholder="https://example.com/avatar.jpg"
                                />
                                <p className="mt-1 text-xs text-text-muted">Biarkan kosong untuk menggunakan avatar default.</p>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 rounded-xl bg-surface-highlight px-4 py-3 text-sm font-medium text-text-muted hover:bg-white/10 hover:text-white transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                                >
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
