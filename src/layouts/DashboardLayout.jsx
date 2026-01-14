import { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import useStore from '../store/useStore';
import { formatRelativeDate } from '../services/formatters';

export default function DashboardLayout() {
    const { notifications, markAllNotificationsRead, clearNotifications } = useStore();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    // Update clock every second
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Click outside to close notifications
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
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

    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    const dateString = `${days[currentTime.getDay()]}, ${currentTime.getDate()} ${months[currentTime.getMonth()]} ${currentTime.getFullYear()} | ${currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WIB`;

    return (
        <div className="flex h-screen w-full bg-background-dark text-text-main font-display overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Header */}
                <header className="w-full flex items-center justify-between px-8 py-5 border-b border-border-dark bg-surface-dark/50 backdrop-blur-sm z-30">
                    <div className="flex items-center gap-4 flex-1 justify-end relative">
                        <div className="hidden md:flex items-center gap-3 text-text-muted bg-surface-dark px-4 py-2 rounded-lg border border-border-dark/50">
                            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                            <span className="text-sm font-medium">{dateString}</span>
                        </div>

                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={handleOpenNotifications}
                                className="flex items-center justify-center size-10 rounded-full text-text-muted hover:bg-surface-highlight hover:text-white transition-colors relative"
                            >
                                <span className="material-symbols-outlined">notifications</span>
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 top-12 w-80 md:w-96 bg-surface-dark border border-border-dark rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
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
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
