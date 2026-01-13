export default function Settings() {
    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-4">Pengaturan</h1>
            <div className="space-y-4">
                <div className="bg-surface-dark border border-border-dark rounded-2xl p-5">
                    <h3 className="font-bold text-white mb-4">Preferensi</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-surface-highlight">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-text-muted">dark_mode</span>
                                <span className="text-white">Dark Mode</span>
                            </div>
                            <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-surface-highlight">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-text-muted">notifications</span>
                                <span className="text-white">Notifikasi</span>
                            </div>
                            <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-surface-highlight">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-text-muted">language</span>
                                <span className="text-white">Bahasa</span>
                            </div>
                            <span className="text-text-muted">Indonesia</span>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-dark border border-border-dark rounded-2xl p-5">
                    <h3 className="font-bold text-white mb-4">Akun</h3>
                    <div className="space-y-2">
                        <button className="w-full text-left p-3 rounded-lg bg-surface-highlight hover:bg-surface-highlight/80 transition-colors text-white">
                            Ubah Password
                        </button>
                        <button className="w-full text-left p-3 rounded-lg bg-surface-highlight hover:bg-surface-highlight/80 transition-colors text-white">
                            Export Data
                        </button>
                        <button className="w-full text-left p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors text-red-400">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
