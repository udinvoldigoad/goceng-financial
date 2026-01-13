import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout() {
    const now = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    const dateString = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()} | ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;

    return (
        <div className="flex h-screen w-full bg-background-dark text-text-main font-display overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Header */}
                <header className="w-full flex items-center justify-between px-8 py-5 border-b border-border-dark">
                    <div className="flex items-center gap-4 flex-1 justify-end">
                        <div className="flex items-center gap-3 text-text-muted bg-surface-dark px-4 py-2 rounded-lg">
                            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                            <span className="text-sm font-medium">{dateString}</span>
                        </div>
                        <button className="flex items-center justify-center size-10 rounded-full text-text-muted hover:bg-surface-highlight transition-colors relative">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"></span>
                        </button>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
