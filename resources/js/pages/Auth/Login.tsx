import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthLayout from '@/layouts/AuthLayout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <AuthLayout title="Masuk ke Akun" subtitle="Selamat datang kembali">
            <Head title="Masuk" />

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} error={errors.email} required />
                <Input label="Kata Sandi" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} error={errors.password} required />

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
        </AuthLayout>
    );
}
