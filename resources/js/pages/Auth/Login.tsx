import React from 'react';
import { Head } from '@inertiajs/react';
import AuthLayout from '@/layouts/AuthLayout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

/**
 * STUB HALAMAN LOGIN
 * Dikerjakan secara lengkap oleh Orang 2 (BRIEF_ORANG2.md).
 * Menggunakan AuthLayout, Input, dan Button buatan Orang 1.
 */
export default function Login() {
    return (
        <AuthLayout title="Masuk ke Akun VGS" subtitle="Masuk untuk melihat riwayat pesanan dan turnamen.">
            <Head title="Masuk — Vortix Gaming Store" />

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <Input
                    label="Email Pengguna"
                    type="email"
                    placeholder="nama@email.com"
                    required
                />

                <Input
                    label="Kata Sandi"
                    type="password"
                    placeholder="••••••••"
                    required
                />

                <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 text-vgs-silver-muted cursor-pointer">
                        <input type="checkbox" className="rounded bg-vgs-black-surface border-vgs-gray-border text-vgs-blue-electric focus:ring-vgs-blue-electric" />
                        <span>Ingat saya</span>
                    </label>
                    <a href="#forgot" className="text-vgs-blue-electric hover:underline">
                        Lupa sandi?
                    </a>
                </div>

                <div className="pt-2">
                    <Button variant="primary" block size="lg" type="submit">
                        Masuk ke Akun
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
