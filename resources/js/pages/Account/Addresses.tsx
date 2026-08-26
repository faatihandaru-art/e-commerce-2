import React from 'react';
import { Head } from '@inertiajs/react';
import AccountLayout from '@/layouts/AccountLayout';
import Button from '@/components/ui/Button';

export default function Addresses() {
    return (
        <AccountLayout title="Alamat Saya">
            <Head title="Alamat Saya" />

            <div className="bg-vgs-black-surface border border-vgs-gray-border rounded-2xl p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display font-bold text-lg text-vgs-silver-bright">
                        Daftar Alamat
                    </h2>
                    <Button variant="primary" size="sm" type="button">
                        + Tambah Alamat
                    </Button>
                </div>

                {/* Empty State */}
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-vgs-blue-electric/10 border border-vgs-blue-electric/20 flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-vgs-blue-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <h3 className="font-display font-bold text-vgs-silver-bright mb-1">
                        Belum Ada Alamat
                    </h3>
                    <p className="text-sm text-vgs-silver-muted max-w-xs">
                        Tambahkan alamat pengiriman untuk mempermudah proses checkout.
                    </p>
                </div>
            </div>
        </AccountLayout>
    );
}
