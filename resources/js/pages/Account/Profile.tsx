import React from 'react';
import { Head, usePage, useForm } from '@inertiajs/react';
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
    flash?: {
        success?: string;
    };
    errors?: Record<string, string>;
}

export default function Profile() {
    const { props } = usePage<PageProps>();
    const user = props.auth?.user;
    const flash = props.flash?.success;

    const profileForm = useForm({
        name: user?.name || '',
        phone: user?.phone || '',
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submitProfile = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.patch('/account/profile', {
            preserveScroll: true,
        });
    };

    const submitPassword = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.post('/account/profile/password', {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    };

    return (
        <AccountLayout title="Profil Saya">
            <Head title="Profil Saya — Vortix Gaming Store" />

            {flash && (
                <div className="mb-6 p-4 rounded-xl bg-vgs-success/10 border border-vgs-success/40 text-sm text-vgs-success font-medium">
                    {flash}
                </div>
            )}

            <div className="bg-vgs-black-surface border border-vgs-gray-border rounded-2xl p-6 sm:p-8">
                <h2 className="font-display font-bold text-lg text-vgs-silver-bright mb-6">
                    Informasi Pribadi
                </h2>

                <form onSubmit={submitProfile} className="space-y-5">
                    <Input
                        label="Nama Lengkap"
                        value={profileForm.data.name}
                        onChange={(e) => profileForm.setData('name', e.target.value)}
                        error={profileForm.errors.name}
                        required
                    />
                    <Input
                        label="Email"
                        type="email"
                        value={user?.email || ''}
                        required
                        disabled
                        hint="Email tidak dapat diubah."
                    />
                    <Input
                        label="Nomor Telepon"
                        type="tel"
                        value={profileForm.data.phone}
                        onChange={(e) => profileForm.setData('phone', e.target.value)}
                        error={profileForm.errors.phone}
                        placeholder="Masukkan nomor telepon"
                    />

                    <div className="flex justify-end pt-2">
                        <Button variant="primary" type="submit" loading={profileForm.processing}>
                            Simpan Perubahan
                        </Button>
                    </div>
                </form>
            </div>

            <div className="mt-6 bg-vgs-black-surface border border-vgs-gray-border rounded-2xl p-6 sm:p-8">
                <h2 className="font-display font-bold text-lg text-vgs-silver-bright mb-6">
                    Ubah Kata Sandi
                </h2>

                <form onSubmit={submitPassword} className="space-y-5">
                    <Input
                        label="Kata Sandi Saat Ini"
                        type="password"
                        value={passwordForm.data.current_password}
                        onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                        error={passwordForm.errors.current_password}
                        placeholder="••••••••"
                        required
                    />
                    <Input
                        label="Kata Sandi Baru"
                        type="password"
                        value={passwordForm.data.password}
                        onChange={(e) => passwordForm.setData('password', e.target.value)}
                        error={passwordForm.errors.password}
                        placeholder="••••••••"
                        required
                    />
                    <Input
                        label="Konfirmasi Kata Sandi Baru"
                        type="password"
                        value={passwordForm.data.password_confirmation}
                        onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                        error={passwordForm.errors.password_confirmation}
                        placeholder="••••••••"
                        required
                    />

                    <div className="flex justify-end pt-2">
                        <Button variant="primary" type="submit" loading={passwordForm.processing}>
                            Ubah Kata Sandi
                        </Button>
                    </div>
                </form>
            </div>
        </AccountLayout>
    );
}