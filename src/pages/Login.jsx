import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';

export default function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simple navigation for demo purposes
        navigate('/');
    };

    return (
        <AuthLayout>
            <div className="w-full max-w-md p-8 sm:p-10 mx-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative w-20 h-20 mb-6 group">
                        <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-teal-400 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-500"></div>
                        <div className="relative w-full h-full bg-background-dark ring-1 ring-white/10 rounded-full flex items-center justify-center shadow-2xl overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-teal-500/20 opacity-50"></div>
                            <span className="relative text-4xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-blue-200 drop-shadow-xl z-10 tracking-tighter">G</span>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight text-center">Halo, Selamat Datang!</h2>
                    <p className="mt-2 text-slate-400 text-center text-sm">
                        Masuk untuk mengelola keuanganmu
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="email">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-slate-500 text-lg">email</span>
                            </div>
                            <input
                                autoComplete="email"
                                className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl leading-5 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white/10 sm:text-sm transition-all duration-200"
                                id="email"
                                name="email"
                                placeholder="nama@goceng.id"
                                required
                                type="email"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="password">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-slate-500 text-lg">lock</span>
                            </div>
                            <input
                                autoComplete="current-password"
                                className="block w-full pl-10 pr-10 py-3 border border-white/10 rounded-xl leading-5 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white/10 sm:text-sm transition-all duration-200"
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                required
                                type={showPassword ? 'text' : 'password'}
                            />
                            <div
                                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-slate-500 hover:text-white transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <span className="material-symbols-outlined text-lg">
                                    {showPassword ? 'visibility_off' : 'visibility'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Remember & Forgot */}
                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center">
                            <input
                                className="h-4 w-4 text-primary focus:ring-primary border-slate-600 rounded bg-white/5"
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                            />
                            <label className="ml-2 block text-sm text-slate-300" htmlFor="remember-me">
                                Ingat saya
                            </label>
                        </div>
                        <div className="text-sm">
                            <a className="font-medium text-blue-400 hover:text-blue-300 transition-colors" href="#">
                                Lupa password?
                            </a>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        className="w-full flex justify-center py-3.5 px-4 mt-6 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background-dark transition-all transform active:scale-[0.98]"
                        type="submit"
                    >
                        Masuk
                    </button>
                </form>
            </div>
        </AuthLayout>
    );
}
