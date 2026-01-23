import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import Logo from './Logo';

const navItems = [
    { name: 'Dashboard', icon: 'grid_view', path: '/' },
    { name: 'Aset', icon: 'account_balance_wallet', path: '/assets' },
    { name: 'Transaksi', icon: 'receipt_long', path: '/transactions' },
    { name: 'Anggaran', icon: 'pie_chart', path: '/budget' },
    { name: 'Goals', icon: 'flag', path: '/goals' },
    { name: 'Laporan', icon: 'description', path: '/reports' },
];

export default function Sidebar({ isOpen, onClose }) {
    const { user, auth, signOut, openLoginModal } = useStore();
    const navigate = useNavigate();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const isAuthenticated = auth.status === 'authed';

    const handleLogout = async () => {
        await signOut();
        setIsSettingsOpen(false);
        navigate('/');
    };

    return (
        <aside className={`
            fixed inset-y-0 left-0 z-50 w-64 flex-col border-r border-border-dark bg-sidebar-bg transition-transform duration-300 h-screen
            md:relative md:translate-x-0
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
            <div className="flex flex-col h-full p-4">
                {/* Logo */}
                <div className="flex gap-3 items-center px-2 pt-2 mb-8 justify-between">
                    <div className="flex gap-3 items-center">
                        <Logo />
                        <div className="flex flex-col">
                            <h1 className="text-base font-bold leading-none text-white">Goceng</h1>
                            <p className="text-text-muted text-xs font-normal mt-1">Pencatat Keuangan</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-2 flex-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={() => onClose && onClose()}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isActive
                                    ? 'text-white bg-primary shadow-lg shadow-primary/20'
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
                <div className="flex flex-col gap-3 mt-auto relative">
                    {isAuthenticated ? (
                        <>
                            {/* Settings Popup */}
                            {isSettingsOpen && (
                                <div className="absolute bottom-full left-0 mb-2 w-full bg-sidebar-card-bg rounded-xl border border-border-dark shadow-xl overflow-hidden z-50 animate-fade-in">
                                    <NavLink
                                        to="/profile"
                                        className="flex items-center gap-3 px-4 py-3 text-text-muted hover:bg-white/5 hover:text-white transition-colors"
                                        onClick={() => {
                                            setIsSettingsOpen(false);
                                            if (onClose) onClose();
                                        }}
                                    >
                                        <span className="material-symbols-outlined text-[20px]">person</span>
                                        <p className="text-sm font-medium leading-normal">Profil</p>
                                    </NavLink>
                                    <NavLink
                                        to="/settings"
                                        className="flex items-center gap-3 px-4 py-3 text-text-muted hover:bg-white/5 hover:text-white transition-colors border-t border-border-dark"
                                        onClick={() => {
                                            setIsSettingsOpen(false);
                                            if (onClose) onClose();
                                        }}
                                    >
                                        <span className="material-symbols-outlined text-[20px]">settings</span>
                                        <p className="text-sm font-medium leading-normal">Pengaturan</p>
                                    </NavLink>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors border-t border-border-dark"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">logout</span>
                                        <p className="text-sm font-medium leading-normal">Keluar</p>
                                    </button>
                                </div>
                            )}

                            {/* Profile Card */}
                            <div
                                className="bg-sidebar-card-bg rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-surface-highlight transition-colors"
                                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                            >
                                <div className="bg-gray-600 rounded-full size-10 shrink-0 overflow-hidden">
                                    <img
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                        src={user?.avatar || "https://ui-avatars.com/api/?name=" + (user?.name || "User") + "&background=random"}
                                    />
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <p className="text-sm font-bold truncate text-white">{user?.name || 'User'}</p>
                                    <p className="text-text-muted text-xs truncate">{user?.email || 'email@example.com'}</p>
                                </div>
                                <span className="material-symbols-outlined text-text-muted ml-auto text-[18px]">
                                    {isSettingsOpen ? 'expand_less' : 'expand_more'}
                                </span>
                            </div>
                        </>
                    ) : (
                        /* Login Button for Guests */
                        <button
                            onClick={() => {
                                openLoginModal();
                                if (onClose) onClose();
                            }}
                            className="bg-primary hover:bg-primary/90 rounded-xl p-3 flex items-center justify-center gap-3 cursor-pointer transition-colors shadow-lg shadow-primary/20"
                        >
                            <span className="material-symbols-outlined text-white text-[20px]">login</span>
                            <p className="text-sm font-bold text-white">Masuk</p>
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
}
