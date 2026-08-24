import React, { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthLayout from '@/layouts/AuthLayout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);

    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        phone?: string;
        password?: string;
        passwordConfirmation?: string;
        agreeTerms?: string;
    }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Dynamic password strength evaluation
    const passwordStrength = useMemo(() => {
        if (!password) return { score: 0, label: '', color: 'bg-vgs-gray-border', text: 'text-vgs-silver-muted' };

        let score = 0;
        if (password.length >= 8) score += 1;
        if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
        if (/\d/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;

        if (score <= 1) {
            return { score: 1, label: 'Lemah', color: 'bg-vgs-danger', text: 'text-vgs-danger' };
        } else if (score === 2) {
            return { score: 2, label: 'Sedang', color: 'bg-vgs-warning', text: 'text-vgs-warning' };
        } else if (score === 3) {
            return { score: 3, label: 'Kuat', color: 'bg-vgs-success', text: 'text-vgs-success' };
        } else {
            return { score: 4, label: 'Sangat Kuat (Esports Grade)', color: 'bg-vgs-blue-electric', text: 'text-vgs-blue-electric' };
        }
    }, [password]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: {
            name?: string;
            email?: string;
            phone?: string;
            password?: string;
            passwordConfirmation?: string;
            agreeTerms?: string;
        } = {};

        if (!name.trim()) {
            newErrors.name = 'Nama lengkap / Nickname wajib diisi';
        } else if (name.trim().length < 3) {
            newErrors.name = 'Nama minimal 3 karakter';
        }

        if (!email.trim()) {
            newErrors.email = 'Email wajib diisi';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Format email tidak valid';
        }

        if (!password) {
            newErrors.password = 'Kata sandi wajib diisi';
        } else if (password.length < 8) {
            newErrors.password = 'Kata sandi minimal 8 karakter';
        }

        if (!passwordConfirmation) {
            newErrors.passwordConfirmation = 'Konfirmasi kata sandi wajib diisi';
        } else if (password !== passwordConfirmation) {
            newErrors.passwordConfirmation = 'Konfirmasi kata sandi tidak cocok';
        }

        if (!agreeTerms) {
            newErrors.agreeTerms = 'Anda harus menyetujui syarat & ketentuan VGS';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setIsLoading(true);

        // Simulate registration process
        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
            setTimeout(() => {
                router.visit('/');
            }, 1500);
        }, 1200);
    };

    return (
        <AuthLayout
            title="Daftar Member Baru VGS"
            subtitle="Bergabung dengan komunitas esports & dapatkan reward eksklusif."
        >
            <Head title="Daftar Akun Baru — Vortix Gaming Store" />

            {isSuccess ? (
                <div className="py-8 flex flex-col items-center justify-center text-center gap-4 animate-in fade-in zoom-in-95 duration-300">
                    <div className="w-16 h-16 rounded-2xl bg-vgs-success/20 text-vgs-success border border-vgs-success/40 flex items-center justify-center shadow-lg shadow-vgs-success/20 animate-bounce">
                        <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-display font-bold text-2xl text-white">
                            Pendaftaran Berhasil!
                        </h3>
                        <p className="text-xs text-vgs-blue-electric font-mono font-semibold mt-1">
                            +5.000 VGS Welcome EXP Ditambahkan ke Akun Anda
                        </p>
                    </div>
                    <p className="text-xs text-vgs-silver-muted font-mono max-w-xs leading-relaxed">
                        Selamat datang di skuad Vortix Gaming. Mengarahkan Anda ke beranda toko...
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Header Member Perks Banner */}
                    <div className="p-3 rounded-xl bg-vgs-blue-electric/10 border border-vgs-blue-electric/25 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-vgs-blue-electric/20 flex items-center justify-center text-vgs-blue-electric shrink-0">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-vgs-silver-bright">Keuntungan Member VGS</span>
                            <span className="text-[11px] text-vgs-silver-mid">Garansi 1-to-1 replacement & poin cashback belanja.</span>
                        </div>
                    </div>

                    {/* Nama Lengkap / In-Game Nickname */}
                    <Input
                        label="Nama Lengkap / Nickname"
                        type="text"
                        placeholder="Contoh: Alex 'Vortex' Pratama"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={errors.name}
                        prefix={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        }
                        required
                    />

                    {/* Email Pengguna */}
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

                    {/* Nomor WhatsApp / HP (Opsional) */}
                    <Input
                        label="Nomor WhatsApp / HP (Opsional)"
                        type="tel"
                        placeholder="081234567890"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        error={errors.phone}
                        hint="Untuk notifikasi resi pengiriman cepat."
                        prefix={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        }
                    />

                    {/* Kata Sandi */}
                    <div>
                        <Input
                            label="Kata Sandi"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Minimal 8 karakter"
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

                        {/* Password Strength Indicator Bar */}
                        {password.length > 0 && (
                            <div className="mt-2 space-y-1">
                                <div className="flex items-center justify-between text-[10px] font-mono">
                                    <span className="text-vgs-silver-muted">Kekuatan Sandi:</span>
                                    <span className={`font-semibold ${passwordStrength.text}`}>
                                        {passwordStrength.label}
                                    </span>
                                </div>
                                <div className="grid grid-cols-4 gap-1 h-1.5 w-full bg-vgs-black-elevated rounded-full overflow-hidden p-0.5 border border-vgs-gray-border/50">
                                    <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-transparent'}`} />
                                    <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-transparent'}`} />
                                    <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-transparent'}`} />
                                    <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.score >= 4 ? passwordStrength.color : 'bg-transparent'}`} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Konfirmasi Kata Sandi */}
                    <Input
                        label="Konfirmasi Kata Sandi"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Ketik ulang kata sandi Anda"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        error={errors.passwordConfirmation}
                        prefix={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        }
                        suffix={
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="text-vgs-silver-muted hover:text-vgs-silver-bright focus:outline-none cursor-pointer"
                                aria-label={showConfirmPassword ? 'Sembunyikan konfirmasi sandi' : 'Tampilkan konfirmasi sandi'}
                            >
                                {showConfirmPassword ? (
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

                    {/* Agreement & Newsletter Checkboxes */}
                    <div className="space-y-2 pt-1 text-xs">
                        <label className="flex items-start gap-2 text-vgs-silver-mid cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={agreeTerms}
                                onChange={(e) => setAgreeTerms(e.target.checked)}
                                className="rounded mt-0.5 bg-vgs-black-surface border-vgs-gray-border text-vgs-blue-electric focus:ring-vgs-blue-electric cursor-pointer"
                            />
                            <span>
                                Saya menyetujui{' '}
                                <a href="#terms" className="text-vgs-blue-electric hover:underline font-medium">
                                    Syarat & Ketentuan
                                </a>{' '}
                                serta{' '}
                                <a href="#privacy" className="text-vgs-blue-electric hover:underline font-medium">
                                    Kebijakan Privasi
                                </a>{' '}
                                VGS. <span className="text-vgs-danger">*</span>
                            </span>
                        </label>
                        {errors.agreeTerms && (
                            <p className="text-[11px] text-vgs-danger font-medium pl-6">
                                {errors.agreeTerms}
                            </p>
                        )}

                        <label className="flex items-start gap-2 text-vgs-silver-muted cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={subscribeNewsletter}
                                onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                                className="rounded mt-0.5 bg-vgs-black-surface border-vgs-gray-border text-vgs-blue-electric focus:ring-vgs-blue-electric cursor-pointer"
                            />
                            <span>
                                Kirimkan saya penawaran diskon eksklusif, voucher turnamen, dan info perilisan gear terbaru.
                            </span>
                        </label>
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
                            Buat Akun Sekarang
                        </Button>
                    </div>

                    {/* Login Option */}
                    <div className="text-center pt-4 border-t border-vgs-gray-border/60 text-xs text-vgs-silver-muted">
                        <span>Sudah memiliki akun VGS? </span>
                        <Link href="/login" className="text-vgs-blue-electric font-semibold hover:underline">
                            Masuk ke Akun
                        </Link>
                    </div>
                </form>
            )}
        </AuthLayout>
    );
}
