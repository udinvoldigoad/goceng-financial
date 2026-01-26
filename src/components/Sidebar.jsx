import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import Logo from './Logo';
import ConfirmDialog from './ui/ConfirmDialog';

const navItems = [
    { name: 'Dashboard', icon: 'grid_view', path: '/' },
    { name: 'Dompet', icon: 'account_balance_wallet', path: '/assets' },
    { name: 'Transaksi', icon: 'receipt_long', path: '/transactions' },
    { name: 'Anggaran', icon: 'pie_chart', path: '/budget' },
    { name: 'Target', icon: 'flag', path: '/goals' },
    { name: 'Hutang & Piutang', icon: 'swap_horiz', path: '/debts' },
    { name: 'Langganan', icon: 'subscriptions', path: '/subscriptions' },
    { name: 'Laporan', icon: 'bar_chart', path: '/reports' },
];

export default function Sidebar() {
    const { signOut, openLoginModal, auth } = useStore();
    const navigate = useNavigate();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const isAuthenticated = auth.status === 'authed';

    const handleLogout = async () => {
        await signOut();
        setShowLogoutConfirm(false);
        navigate('/');
    };

    return (
        <>
            <aside className="hidden md:flex fixed inset-y-0 left-0 z-50 w-[220px] flex-col border-r border-border-dark bg-sidebar-bg h-screen md:relative">
                <div className="flex flex-col h-full py-6 overflow-hidden">
                    {/* Logo */}
                    <div className="flex items-center gap-3 px-5 mb-8">
                        <Logo className="w-9 h-9" showText={true} />
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-1 flex-1 min-h-0 px-3">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive
                                        ? 'bg-primary text-white font-semibold'
                                        : 'text-text-muted hover:text-white hover:bg-white/5'
                                    }`
                                }
                            >
                                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                                <p className="text-sm font-medium leading-normal">{item.name}</p>
                            </NavLink>
                        ))}
                    </nav>

                    {/* Bottom Section */}
                    <div className="flex flex-col gap-2 mt-auto px-3 pt-4 border-t border-border-dark">
                        {/* Settings */}
                        <NavLink
                            to="/settings"
                            onClick={() => onClose && onClose()}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive
                                    ? 'bg-primary text-white font-semibold'
                                    : 'text-text-muted hover:text-white hover:bg-white/5'
                                }`
                            }
                        >
                            <span className="material-symbols-outlined text-[20px]">settings</span>
                            <p className="text-sm font-medium leading-normal">Pengaturan</p>
                        </NavLink>

                        {/* Logout / Login Button */}
                        {isAuthenticated ? (
                            <button
                                onClick={() => setShowLogoutConfirm(true)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-all w-full text-left"
                            >
                                <span className="material-symbols-outlined text-[20px]">logout</span>
                                <p className="text-sm font-medium leading-normal">Logout</p>
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    openLoginModal();
                                    if (onClose) onClose();
                                }}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary text-white font-semibold transition-all w-full text-left hover:bg-primary/90"
                            >
                                <span className="material-symbols-outlined text-[20px]">login</span>
                                <p className="text-sm font-medium leading-normal">Masuk</p>
                            </button>
                        )}
                    </div>
                </div>
            </aside>

            {/* Logout Confirmation */}
            <ConfirmDialog
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={handleLogout}
                title="Keluar dari Akun?"
                message="Apakah kamu yakin ingin keluar? Data lokal tetap tersimpan, tapi kamu perlu login lagi untuk sinkronisasi."
                confirmLabel="Ya, Keluar"
                danger
            />
        </>
    );
}
