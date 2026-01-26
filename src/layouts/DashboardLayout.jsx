import { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MobileNav from '../components/MobileNav';
import Logo from '../components/Logo';
import PageTransition from '../components/ui/PageTransition';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import useStore from '../store/useStore';
import { formatRelativeDate } from '../services/formatters';

export default function DashboardLayout() {
    const { notifications, markAllNotificationsRead, clearNotifications, user, auth, openLoginModal, signOut } = useStore();
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const notificationRef = useRef(null);
    const userDropdownRef = useRef(null);
    const scrollRef = useRef(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    // Handle scroll effect for navbar
    useEffect(() => {
        const scrollEl = scrollRef.current;
        if (!scrollEl) return;

        const handleScroll = () => {
            setIsScrolled(scrollEl.scrollTop > 20);
        };

        scrollEl.addEventListener('scroll', handleScroll);
        return () => scrollEl.removeEventListener('scroll', handleScroll);
    }, []);

    // Click outside to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setShowUserDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleOpenNotifications = () => {
        setShowNotifications(!showNotifications);
        if (!showNotifications && unreadCount > 0) {
            markAllNotificationsRead();
        }
    };

    const handleLogout = async () => {
        await signOut();
        setShowLogoutConfirm(false);
        setShowUserDropdown(false);
        navigate('/');
    };

    const handleLogoutClick = () => {
        setShowUserDropdown(false);
        setShowLogoutConfirm(true);
    };

    return (
        <div className="flex h-screen w-full bg-background-dark text-text-main overflow-hidden">
            <Sidebar />

            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Scrollable content wrapper - header is sticky inside */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain">
                    {/* Header - Sticky navbar with blur effect */}
                    <header className={`sticky top-0 w-full flex items-center justify-between px-4 md:px-6 py-3 border-b z-30 transition-all duration-300 ${isScrolled ? 'navbar-scrolled border-transparent' : 'bg-background-dark border-border-dark'}`}>
                        {/* Left - Logo for mobile, empty for desktop (sidebar has logo) */}
                        <div className="flex items-center gap-4">
                            {/* Logo for mobile */}
                            <div className="md:hidden">
                                <Logo className="w-8 h-8" />
                            </div>
                        </div>

                        {/* Right - Actions & Profile */}
                        <div className="flex items-center gap-2">
                            {/* Notifications */}
                            <div className="relative" ref={notificationRef}>
                                <button
                                    onClick={handleOpenNotifications}
                                    className="flex items-center justify-center w-10 h-10 rounded-lg text-text-muted hover:bg-surface-dark hover:text-white transition-colors relative"
                                >
                                    <span className="material-symbols-outlined">notifications</span>
                                    {unreadCount > 0 && (
                                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                    )}
                                </button>

                                {/* Notifications Dropdown */}
                                {showNotifications && (
                                    <div className="fixed md:absolute left-4 right-4 md:left-auto md:right-0 top-16 md:top-12 md:w-96 bg-surface-dark border border-border-dark rounded-xl shadow-2xl overflow-hidden z-[70] animate-in fade-in slide-in-from-top-2">
                                        <div className="flex items-center justify-between p-4 border-b border-border-dark">
                                            <h3 className="font-bold text-white">Notifikasi</h3>
                                            <button
                                                onClick={clearNotifications}
                                                className="text-xs text-primary hover:underline"
                                            >
                                                Hapus Semua
                                            </button>
                                        </div>
                                        <div className="max-h-[400px] overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="p-8 text-center text-text-muted">
                                                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">notifications_off</span>
                                                    <p className="text-sm">Belum ada notifikasi</p>
                                                </div>
                                            ) : (
                                                <div className="divide-y divide-border-dark">
                                                    {notifications.map((notification) => (
                                                        <div
                                                            key={notification.id}
                                                            className={`p-4 hover:bg-surface-highlight transition-colors ${!notification.read ? 'bg-primary/5' : ''}`}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className={`p-2 rounded-full ${notification.type === 'alert' ? 'bg-red-500/10 text-red-400' : 'bg-primary/10 text-primary'}`}>
                                                                    <span className="material-symbols-outlined text-[18px]">
                                                                        {notification.icon || 'notifications'}
                                                                    </span>
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="text-sm font-medium text-white">{notification.title}</p>
                                                                    <p className="text-xs text-text-muted mt-0.5">{notification.message}</p>
                                                                    <p className="text-[10px] text-text-muted mt-2">
                                                                        {formatRelativeDate(notification.createdAt)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* User Profile Dropdown */}
                            <div className="relative" ref={userDropdownRef}>
                                {auth.status === 'authed' ? (
                                    <button
                                        onClick={() => setShowUserDropdown(!showUserDropdown)}
                                        className="flex items-center gap-2 p-1 rounded-full hover:bg-surface-dark transition-colors"
                                    >
                                        <div className="w-9 h-9 rounded-full bg-primary overflow-hidden border-2 border-primary">
                                            <img
                                                className="w-full h-full object-cover"
                                                src={user?.avatar || "https://ui-avatars.com/api/?name=" + (user?.name || "User") + "&background=3399FF&color=fff"}
                                                alt="Profile"
                                            />
                                        </div>
                                        <span className="material-symbols-outlined text-text-muted text-[18px] hidden md:block">
                                            {showUserDropdown ? 'expand_less' : 'expand_more'}
                                        </span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={openLoginModal}
                                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-white text-sm font-medium transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">login</span>
                                        <span className="hidden md:inline">Masuk</span>
                                    </button>
                                )}

                                {/* User Dropdown Menu */}
                                {showUserDropdown && auth.status === 'authed' && (
                                    <div className="absolute right-0 top-14 w-56 bg-surface-dark border border-border-dark rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                                        <div className="p-4 border-b border-border-dark">
                                            <p className="font-semibold text-white truncate">{user?.name}</p>
                                            <p className="text-xs text-text-muted truncate">{user?.email}</p>
                                        </div>
                                        <div className="py-2">
                                            <button
                                                onClick={() => {
                                                    navigate('/profile');
                                                    setShowUserDropdown(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-text-muted hover:bg-surface-highlight hover:text-white transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">person</span>
                                                <span className="text-sm">Profil Saya</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    navigate('/settings');
                                                    setShowUserDropdown(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-text-muted hover:bg-surface-highlight hover:text-white transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">settings</span>
                                                <span className="text-sm">Pengaturan</span>
                                            </button>
                                            <div className="border-t border-border-dark my-1"></div>
                                            <button
                                                onClick={handleLogoutClick}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">logout</span>
                                                <span className="text-sm">Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* Content */}
                    <div className="p-4 md:p-6 pb-24 md:pb-6">
                        <PageTransition>
                            <Outlet />
                        </PageTransition>
                    </div>
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <MobileNav />

            {/* Logout Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={handleLogout}
                title="Konfirmasi Logout"
                message="Apakah Anda yakin ingin keluar dari akun?"
                confirmText="Logout"
                confirmVariant="danger"
            />
        </div>
    );
}
