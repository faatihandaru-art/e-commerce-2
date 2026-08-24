import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthLayout from '@/layouts/AuthLayout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { email?: string; password?: string } = {};

        if (!email.trim()) {
            newErrors.email = 'Email wajib diisi';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Format email tidak valid';
        }

        if (!password) {
            newErrors.password = 'Kata sandi wajib diisi';
        } else if (password.length < 6) {
            newErrors.password = 'Kata sandi minimal 6 karakter';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setIsLoading(true);

        // Simulate login request
        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
            setTimeout(() => {
                router.visit('/');
            }, 1000);
        }, 1200);
    };

    return (
        <AuthLayout
            title="Masuk ke Akun VGS"
            subtitle="Akses profil turnamen, garansi gear, & riwayat pesanan Anda."
        >
            <Head title="Masuk — Vortix Gaming Store" />

            {isSuccess ? (
                <div className="py-8 flex flex-col items-center justify-center text-center gap-3 animate-in fade-in duration-300">
                    <div className="w-14 h-14 rounded-2xl bg-vgs-success/20 text-vgs-success border border-vgs-success/40 flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h3 className="font-display font-bold text-xl text-white">
                        Otentikasi Berhasil!
                    </h3>
                    <p className="text-xs text-vgs-silver-muted font-mono">
                        Mengarahkan kembali ke beranda toko...
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email Pengguna"
                        type="email"
                        placeholder="nama@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={errors.email}
                        prefix={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                        }
                        required
                    />

                    <Input
                        label="Kata Sandi"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={errors.password}
                        prefix={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        }
                        suffix={
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-vgs-silver-muted hover:text-vgs-silver-bright focus:outline-none cursor-pointer"
                                aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                            >
                                {showPassword ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        }
                        required
                    />

                    {/* Remember me & Forgot Password */}
                    <div className="flex items-center justify-between text-xs pt-1">
                        <label className="flex items-center gap-2 text-vgs-silver-mid cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="rounded bg-vgs-black-surface border-vgs-gray-border text-vgs-blue-electric focus:ring-vgs-blue-electric cursor-pointer"
                            />
                            <span>Ingat saya</span>
                        </label>
                        <a href="#forgot" className="text-vgs-blue-electric hover:underline font-medium">
                            Lupa kata sandi?
                        </a>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <Button
                            variant="primary"
                            size="lg"
                            block
                            type="submit"
                            loading={isLoading}
                        >
                            Masuk ke Akun
                        </Button>
                    </div>

                    {/* Register Option */}
                    <div className="text-center pt-4 border-t border-vgs-gray-border/60 text-xs text-vgs-silver-muted">
                        <span>Belum memiliki akun VGS? </span>
                        <Link href="/register" className="text-vgs-blue-electric font-semibold hover:underline">
                            Daftar Sekarang
                        </Link>
                    </div>
                </form>
            )}
        </AuthLayout>
    );
}
