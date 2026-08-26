import React from 'react';
import { Head } from '@inertiajs/react';
import AccountLayout from '@/layouts/AccountLayout';

export default function Orders() {
    return (
        <AccountLayout title="Pesanan Saya">
            <Head title="Pesanan Saya" />

            <div className="bg-vgs-black-surface border border-vgs-gray-border rounded-2xl p-6 sm:p-8">
                <h2 className="font-display font-bold text-lg text-vgs-silver-bright mb-6">
                    Riwayat Pesanan
                </h2>

                {/* Empty State */}
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-vgs-blue-electric/10 border border-vgs-blue-electric/20 flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-vgs-blue-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h3 className="font-display font-bold text-vgs-silver-bright mb-1">
                        Belum Ada Pesanan
                    </h3>
                    <p className="text-sm text-vgs-silver-muted max-w-xs">
                        Mulai berbelanja untuk melihat riwayat pesanan Anda di sini.
                    </p>
                </div>
            </div>
        </AccountLayout>
    );
}
