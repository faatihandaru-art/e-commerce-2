import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AccountLayout from '@/layouts/AccountLayout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface PageProps {
    [key: string]: unknown;
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            phone?: string;
            status?: string;
        } | null;
    };
}

export default function Profile() {
    const { props } = usePage<PageProps>();
    const user = props.auth?.user;

    return (
        <AccountLayout title="Profil Saya">
            <Head title="Profil Saya" />

            <div className="bg-vgs-black-surface border border-vgs-gray-border rounded-2xl p-6 sm:p-8">
                <h2 className="font-display font-bold text-lg text-vgs-silver-bright mb-6">
                    Informasi Pribadi
                </h2>

                <form className="space-y-5">
                    <Input
                        label="Nama Lengkap"
                        defaultValue={user?.name || ''}
                        required
                    />
                    <Input
                        label="Email"
                        type="email"
                        defaultValue={user?.email || ''}
                        required
                        disabled
                    />
                    <Input
                        label="Nomor Telepon"
                        type="tel"
                        defaultValue={user?.phone || ''}
                        placeholder="Masukkan nomor telepon"
                    />

                    <div className="flex justify-end pt-2">
                        <Button variant="primary" type="button">
                            Simpan Perubahan
                        </Button>
                    </div>
                </form>
            </div>

            <div className="mt-6 bg-vgs-black-surface border border-vgs-gray-border rounded-2xl p-6 sm:p-8">
                <h2 className="font-display font-bold text-lg text-vgs-silver-bright mb-6">
                    Ubah Kata Sandi
                </h2>

                <form className="space-y-5">
                    <Input
                        label="Kata Sandi Saat Ini"
                        type="password"
                        placeholder="••••••••"
                        required
                    />
                    <Input
                        label="Kata Sandi Baru"
                        type="password"
                        placeholder="••••••••"
                        required
                    />
                    <Input
                        label="Konfirmasi Kata Sandi Baru"
                        type="password"
                        placeholder="••••••••"
                        required
                    />

                    <div className="flex justify-end pt-2">
                        <Button variant="primary" type="button">
                            Ubah Kata Sandi
                        </Button>
                    </div>
                </form>
            </div>
        </AccountLayout>
    );
}
