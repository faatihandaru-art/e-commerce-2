import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AccountLayout from '@/layouts/AccountLayout';

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

export default function Status() {
    const { props } = usePage<PageProps>();
    const user = props.auth?.user;
    const isActive = user?.status === 'active';

    return (
        <AccountLayout title="Status Akun">
            <Head title="Status Akun" />

            <div className="bg-vgs-black-surface border border-vgs-gray-border rounded-2xl p-6 sm:p-8">
                <h2 className="font-display font-bold text-lg text-vgs-silver-bright mb-6">
                    Status Akun Anda
                </h2>

                <div className="flex items-center gap-4 p-5 rounded-xl border border-vgs-gray-border bg-vgs-black-elevated/50">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isActive
                            ? 'bg-vgs-success/15 text-vgs-success'
                            : 'bg-vgs-danger/15 text-vgs-danger'
                    }`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-vgs-silver-bright">
                            Status: {' '}
                            <span className={isActive ? 'text-vgs-success' : 'text-vgs-danger'}>
                                {isActive ? 'Active' : 'Inactive'}
                            </span>
                        </p>
                        <p className="text-xs text-vgs-silver-muted mt-1">
                            {isActive
                                ? 'Akun Anda aktif dan dapat digunakan untuk berbelanja.'
                                : 'Akun Anda belum aktif. Silakan hubungi dukungan pelanggan.'}
                        </p>
                    </div>
                    <span className={`text-xs font-mono font-bold px-3 py-1.5 rounded-full ${
                        isActive
                            ? 'bg-vgs-success/15 text-vgs-success border border-vgs-success/30'
                            : 'bg-vgs-danger/15 text-vgs-danger border border-vgs-danger/30'
                    }`}>
                        {isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                </div>
            </div>
        </AccountLayout>
    );
}
