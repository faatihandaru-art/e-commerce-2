import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthLayout from '@/layouts/AuthLayout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <AuthLayout title="Daftar Member Baru" subtitle="Bergabung sekarang">
            <Head title="Daftar" />

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Nama" value={data.name} onChange={(e) => setData('name', e.target.value)} error={errors.name} required />
                <Input label="Email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} error={errors.email} required />
                <Input label="Telepon (opsional)" type="tel" value={data.phone} onChange={(e) => setData('phone', e.target.value)} error={errors.phone} />
                <Input label="Kata Sandi" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} error={errors.password} required />
                <Input label="Konfirmasi Kata Sandi" type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} error={errors.password_confirmation} required />

                <div>
                    <Button type="submit" variant="primary" loading={processing} block>
                        Buat Akun
                    </Button>
                </div>

                <div className="text-center pt-4 border-t text-xs">
                    <span>Sudah punya akun? </span>
                    <Link href="/login" className="text-vgs-blue-electric font-semibold">Masuk</Link>
                </div>
            </form>
        </AuthLayout>
    );
}
