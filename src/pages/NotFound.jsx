import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background-dark flex items-center justify-center p-4">
            <div className="text-center max-w-md">
                {/* 404 Illustration */}
                <div className="mb-8">
                    <div className="relative inline-block">
                        <span className="text-[120px] md:text-[180px] font-black text-surface-highlight/30 leading-none select-none">
                            404
                        </span>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="material-symbols-outlined text-6xl md:text-8xl text-primary animate-bounce">
                                explore_off
                            </span>
                        </div>
                    </div>
                </div>

                {/* Message */}
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    Halaman Tidak Ditemukan
                </h1>
                <p className="text-text-muted mb-8">
                    Oops! Sepertinya halaman yang kamu cari tidak ada atau sudah dipindahkan.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                    >
                        <span className="material-symbols-outlined text-[20px]">home</span>
                        Kembali ke Dashboard
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-surface-dark border border-border-dark text-white font-medium rounded-xl hover:bg-surface-highlight transition-all"
                    >
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                        Halaman Sebelumnya
                    </button>
                </div>

                {/* Quick Links */}
                <div className="mt-12 pt-8 border-t border-border-dark">
                    <p className="text-text-muted text-sm mb-4">Atau kunjungi halaman lain:</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link to="/assets" className="px-4 py-2 text-sm text-text-muted hover:text-white hover:bg-surface-highlight rounded-lg transition-colors">
                            Aset
                        </Link>
                        <Link to="/transactions" className="px-4 py-2 text-sm text-text-muted hover:text-white hover:bg-surface-highlight rounded-lg transition-colors">
                            Transaksi
                        </Link>
                        <Link to="/budget" className="px-4 py-2 text-sm text-text-muted hover:text-white hover:bg-surface-highlight rounded-lg transition-colors">
                            Anggaran
                        </Link>
                        <Link to="/reports" className="px-4 py-2 text-sm text-text-muted hover:text-white hover:bg-surface-highlight rounded-lg transition-colors">
                            Laporan
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
