import { useState } from 'react';
import useStore from '../store/useStore';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import Logo from './Logo';

export default function LoginModal() {
    const { showLoginModal, closeLoginModal } = useStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGoogleLogin = async () => {
        if (!isSupabaseConfigured || !supabase) {
            setError('Supabase belum dikonfigurasi. Silakan buat file .env dengan kredensial Supabase.');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}${window.location.pathname}`,
                },
            });

            if (error) throw error;
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Gagal login. Silakan coba lagi.');
            setIsLoading(false);
        }
    };

    if (!showLoginModal) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-md bg-surface-dark border border-border-dark rounded-2xl shadow-2xl animate-scale-in overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border-dark">
                    <h2 className="text-lg font-bold text-white">Masuk untuk Melanjutkan</h2>
                    <button
                        onClick={closeLoginModal}
                        className="p-1 rounded-lg text-text-muted hover:bg-white/10 hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex flex-col items-center mb-6">
                        <Logo className="w-16 h-16 mb-4" />
                        <p className="text-text-muted text-center text-sm">
                            Masuk untuk menyimpan data keuanganmu dan mengaksesnya dari perangkat manapun.
                        </p>
                    </div>

                    {/* Configuration Notice */}
                    {!isSupabaseConfigured && (
                        <div className="mb-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm">
                            <p className="font-semibold mb-1">⚠️ Konfigurasi Diperlukan</p>
                            <p className="text-yellow-400/80 text-xs">
                                Buat file <code className="bg-yellow-500/20 px-1 rounded">.env</code> dengan kredensial Supabase.
                            </p>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Google Login Button */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading || !isSupabaseConfigured}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-white/10 rounded-xl shadow-lg text-sm font-bold text-white bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center p-1">
                                <svg className="w-full h-full" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                            </div>
                        )}
                        <span>{isLoading ? 'Memproses...' : 'Lanjutkan dengan Google'}</span>
                    </button>

                    <p className="mt-4 text-center text-[10px] text-text-muted">
                        Dengan melanjutkan, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi kami.
                    </p>
                </div>
            </div>
        </div>
    );
}
