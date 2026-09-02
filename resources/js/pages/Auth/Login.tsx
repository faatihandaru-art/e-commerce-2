import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthLayout from '@/layouts/AuthLayout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function Login() {
    return (
        <AuthLayout title="Masuk ke Akun" subtitle="Selamat datang kembali">
            <Head title="Masuk" />
            <LoginForm />
        </AuthLayout>
    );
}

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} error={errors.email} required />
                <Input
                    label="Kata Sandi"
                    type={showPassword ? 'text' : 'password'}
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={errors.password}
                    required
                    suffix={
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-vgs-silver-muted hover:text-vgs-silver-bright focus:outline-none cursor-pointer"
                            aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
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
                />

                <div>
                    <Button type="submit" variant="primary" loading={processing} block>
                        Masuk
                    </Button>
                </div>

                <div className="text-center pt-4 border-t text-xs">
                    <span>Belum punya akun? </span>
                    <Link href="/register" className="text-vgs-blue-electric font-semibold">Daftar</Link>
                </div>
            </form>
    );
};
