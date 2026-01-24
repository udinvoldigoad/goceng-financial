import { useState, useRef } from 'react';
import useStore from '../store/useStore';
import { generateDemoData } from '../services/demoData';
import { exportDataJson } from '../services/exportCsv';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { toast } from '../components/ui/Toast';

export default function Settings() {
    const {
        settings,
        updateSettings,
        resetAllData,
        exportData,
        importData,
        wallets,
        assets,
        transactions,
        budgets,
        goals,
        subscriptions,
    } = useStore();

    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [showSeedConfirm, setShowSeedConfirm] = useState(false);
    const [showImportConfirm, setShowImportConfirm] = useState(false);
    const [importFile, setImportFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleExportData = () => {
        const data = exportData();
        exportDataJson(JSON.parse(data), 'goceng-backup');
        toast.success('Data berhasil diexport!');
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.name.endsWith('.json')) {
                toast.error('File harus berformat JSON!');
                return;
            }
            setImportFile(file);
            setShowImportConfirm(true);
        }
        // Reset input
        e.target.value = '';
    };

    const handleImportData = async () => {
        if (!importFile) return;

        try {
            const text = await importFile.text();
            const success = importData(text);
            if (success) {
                toast.success('Data berhasil diimport!');
            } else {
                toast.error('Gagal mengimport data. Format file tidak valid.');
            }
        } catch (error) {
            toast.error('Gagal membaca file!');
        }
        setShowImportConfirm(false);
        setImportFile(null);
    };

    const handleResetData = () => {
        resetAllData();
        toast.success('Semua data berhasil dihapus!');
        setShowResetConfirm(false);
    };

    const handleSeedDemoData = () => {
        const demoData = generateDemoData();

        // Import demo data into store
        const store = useStore.getState();

        // Add demo wallets
        demoData.wallets.forEach(wallet => {
            store.wallets.push(wallet);
        });

        // Add demo assets
        demoData.assets.forEach(asset => {
            store.assets.push(asset);
        });

        // Add demo transactions
        demoData.transactions.forEach(tx => {
            store.transactions.push(tx);
        });

        // Add demo budgets
        demoData.budgets.forEach(budget => {
            store.budgets.push(budget);
        });

        // Add demo goals
        demoData.goals.forEach(goal => {
            store.goals.push(goal);
        });

        // Add demo subscriptions
        demoData.subscriptions.forEach(sub => {
            store.subscriptions.push(sub);
        });

        // Force re-render by updating settings
        updateSettings({ demoLoaded: true });

        toast.success('Data demo berhasil dimuat!');
        setShowSeedConfirm(false);
    };

    const hasData = wallets.length > 0 || transactions.length > 0 || budgets.length > 0 || goals.length > 0;

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-6">Pengaturan</h1>

            <div className="space-y-6">
                {/* Preferences */}
                <div className="bg-surface-dark border border-border-dark rounded-2xl p-5">
                    <h3 className="font-bold text-white mb-4">Preferensi</h3>
                    <div className="space-y-4">

                        <div className="flex items-center justify-between p-3 rounded-lg bg-surface-highlight">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-text-muted">language</span>
                                <div>
                                    <span className="text-white">Bahasa</span>
                                    <p className="text-xs text-text-muted">Bahasa aplikasi</p>
                                </div>
                            </div>
                            <span className="text-text-muted">Indonesia</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-surface-highlight">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-text-muted">attach_money</span>
                                <div>
                                    <span className="text-white">Mata Uang</span>
                                    <p className="text-xs text-text-muted">Format mata uang</p>
                                </div>
                            </div>
                            <span className="text-text-muted">IDR (Rp)</span>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-surface-dark border border-border-dark rounded-2xl p-5">
                    <h3 className="font-bold text-white mb-4">Notifikasi</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-surface-highlight">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-text-muted">notifications</span>
                                <div>
                                    <span className="text-white">Notifikasi Browser</span>
                                    <p className="text-xs text-text-muted">Terima notifikasi push di browser</p>
                                </div>
                            </div>
                            <button
                                onClick={async () => {
                                    if ('Notification' in window) {
                                        if (Notification.permission === 'granted') {
                                            toast.success('Notifikasi sudah aktif!');
                                        } else if (Notification.permission === 'denied') {
                                            toast.error('Notifikasi diblokir. Aktifkan di pengaturan browser.');
                                        } else {
                                            const permission = await Notification.requestPermission();
                                            if (permission === 'granted') {
                                                toast.success('Notifikasi berhasil diaktifkan!');
                                                new Notification('Goceng', {
                                                    body: 'Notifikasi browser aktif!',
                                                    icon: '/goceng.png'
                                                });
                                            } else {
                                                toast.error('Izin notifikasi ditolak.');
                                            }
                                        }
                                    } else {
                                        toast.error('Browser tidak mendukung notifikasi');
                                    }
                                }}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'bg-primary/20 text-primary hover:bg-primary/30'
                                    }`}
                            >
                                {typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
                                    ? '✓ Aktif'
                                    : 'Aktifkan'}
                            </button>
                        </div>
                        <p className="text-xs text-text-muted px-3">
                            Notifikasi otomatis akan muncul untuk: tagihan jatuh tempo, anggaran hampir habis, dan progress goal.
                        </p>
                    </div>
                </div>

                {/* Data Management */}
                <div className="bg-surface-dark border border-border-dark rounded-2xl p-5">
                    <h3 className="font-bold text-white mb-4">Kelola Data</h3>
                    <div className="space-y-3">
                        <button
                            onClick={handleExportData}
                            className="w-full text-left p-3 rounded-lg bg-surface-highlight hover:bg-surface-highlight/80 transition-colors text-white flex items-center gap-3"
                        >
                            <span className="material-symbols-outlined text-text-muted">download</span>
                            <div>
                                <span>Export Data</span>
                                <p className="text-xs text-text-muted">Download semua data sebagai file JSON</p>
                            </div>
                        </button>

                        <button
                            onClick={handleImportClick}
                            className="w-full text-left p-3 rounded-lg bg-surface-highlight hover:bg-surface-highlight/80 transition-colors text-white flex items-center gap-3"
                        >
                            <span className="material-symbols-outlined text-text-muted">upload</span>
                            <div>
                                <span>Import Data</span>
                                <p className="text-xs text-text-muted">Restore data dari file backup JSON</p>
                            </div>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {!hasData && (
                            <button
                                onClick={() => setShowSeedConfirm(true)}
                                className="w-full text-left p-3 rounded-lg bg-surface-highlight hover:bg-surface-highlight/80 transition-colors text-white flex items-center gap-3"
                            >
                                <span className="material-symbols-outlined text-primary">science</span>
                                <div>
                                    <span className="text-primary">Muat Data Demo</span>
                                    <p className="text-xs text-text-muted">Muat contoh data untuk mencoba aplikasi</p>
                                </div>
                            </button>
                        )}
                    </div>
                </div>

                {/* Storage Info */}
                <div className="bg-surface-dark border border-border-dark rounded-2xl p-5">
                    <h3 className="font-bold text-white mb-4">Penyimpanan</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="p-3 rounded-lg bg-surface-highlight">
                            <p className="text-2xl font-bold text-white">{wallets.length}</p>
                            <p className="text-xs text-text-muted">Wallet</p>
                        </div>
                        <div className="p-3 rounded-lg bg-surface-highlight">
                            <p className="text-2xl font-bold text-white">{transactions.length}</p>
                            <p className="text-xs text-text-muted">Transaksi</p>
                        </div>
                        <div className="p-3 rounded-lg bg-surface-highlight">
                            <p className="text-2xl font-bold text-white">{budgets.length}</p>
                            <p className="text-xs text-text-muted">Anggaran</p>
                        </div>
                        <div className="p-3 rounded-lg bg-surface-highlight">
                            <p className="text-2xl font-bold text-white">{goals.length}</p>
                            <p className="text-xs text-text-muted">Goals</p>
                        </div>
                    </div>
                    <p className="text-xs text-text-muted">
                        Data disimpan secara lokal di browser Anda menggunakan localStorage.
                    </p>
                </div>

                {/* Danger Zone */}
                <div className="bg-surface-dark border border-red-500/30 rounded-2xl p-5">
                    <h3 className="font-bold text-red-400 mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined">warning</span>
                        Zona Berbahaya
                    </h3>
                    <div className="space-y-3">
                        <button
                            onClick={() => setShowResetConfirm(true)}
                            className="w-full text-left p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors text-red-400 flex items-center gap-3"
                        >
                            <span className="material-symbols-outlined">delete_forever</span>
                            <div>
                                <span>Hapus Semua Data</span>
                                <p className="text-xs text-red-400/70">Menghapus semua data secara permanen</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Reset Confirmation */}
            <ConfirmDialog
                isOpen={showResetConfirm}
                onClose={() => setShowResetConfirm(false)}
                onConfirm={handleResetData}
                title="Hapus Semua Data?"
                message="Tindakan ini akan menghapus semua wallet, transaksi, anggaran, goals, dan pengaturan Anda secara permanen. Data tidak dapat dikembalikan."
                confirmLabel="Ya, Hapus Semua"
                danger
            />

            {/* Seed Demo Confirmation */}
            <ConfirmDialog
                isOpen={showSeedConfirm}
                onClose={() => setShowSeedConfirm(false)}
                onConfirm={handleSeedDemoData}
                title="Muat Data Demo?"
                message="Ini akan menambahkan contoh wallet, transaksi, anggaran, dan goals untuk mencoba fitur aplikasi."
                confirmLabel="Ya, Muat Demo"
            />

            {/* Import Data Confirmation */}
            <ConfirmDialog
                isOpen={showImportConfirm}
                onClose={() => {
                    setShowImportConfirm(false);
                    setImportFile(null);
                }}
                onConfirm={handleImportData}
                title="Import Data?"
                message={`Ini akan mengganti semua data yang ada dengan data dari file "${importFile?.name}". Pastikan Anda sudah export data terlebih dahulu jika diperlukan.`}
                confirmLabel="Ya, Import Data"
                danger
            />
        </div>
    );
}
