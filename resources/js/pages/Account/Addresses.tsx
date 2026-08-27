import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AccountLayout from '@/layouts/AccountLayout';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import AddAddressForm from '@/components/account/AddAddressForm';

interface Address {
    id: number;
    recipient: string;
    phone: string;
    street: string;
    village: string | null;
    district: string | null;
    city: string;
    province: string;
    postal_code: string;
    country: string;
    latitude: string | null;
    longitude: string | null;
    is_default: boolean;
}

interface PageProps {
    addresses: Address[];
    flash?: { success?: string };
    [key: string]: unknown;
}

export default function Addresses() {
    const { props } = usePage<PageProps>();
    const addresses = props.addresses || [];
    const successMessage = props.flash?.success;

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus alamat ini?')) {
            router.delete(`/account/addresses/${id}`);
        }
    };

    return (
        <AccountLayout title="Alamat Saya">
            <Head title="Alamat Saya" />

            <div className="bg-vgs-black-surface border border-vgs-gray-border rounded-2xl p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display font-bold text-lg text-vgs-silver-bright">
                        Daftar Alamat
                    </h2>
                    <Button variant="primary" size="sm" type="button" onClick={() => setIsModalOpen(true)}>
                        + Tambah Alamat
                    </Button>
                </div>

                {/* Flash Message */}
                {successMessage && (
                    <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-vgs-success/10 border border-vgs-success/20">
                        <svg className="w-5 h-5 text-vgs-success shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-vgs-success font-medium">{successMessage}</span>
                    </div>
                )}

                {/* Address List */}
                {addresses.length === 0 ? (
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
                        <p className="text-sm text-vgs-silver-muted max-w-xs mb-4">
                            Tambahkan alamat pengiriman untuk mempermudah proses checkout.
                        </p>
                        <Button variant="primary" size="sm" type="button" onClick={() => setIsModalOpen(true)}>
                            + Tambah Alamat
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {addresses.map((address) => (
                            <div
                                key={address.id}
                                className="relative p-5 rounded-xl border border-vgs-gray-border bg-vgs-black-void/50 hover:border-vgs-silver-muted/30 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-sm font-semibold text-vgs-silver-bright">
                                                {address.recipient}
                                            </h3>
                                            <Badge variant="primary" size="xs">
                                                {address.phone}
                                            </Badge>
                                            {address.is_default && (
                                                <Badge variant="success" size="xs">
                                                    Utama
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-vgs-silver-mid leading-relaxed">
                                            {address.street}
                                            {address.village && `, ${address.village}`}
                                            {address.district && `, ${address.district}`}
                                        </p>
                                        <p className="text-sm text-vgs-silver-mid">
                                            {address.city}, {address.province} {address.postal_code}
                                        </p>
                                        <p className="text-xs text-vgs-silver-muted mt-1">{address.country}</p>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        type="button"
                                        onClick={() => handleDelete(address.id)}
                                        className="shrink-0 text-vgs-silver-muted hover:text-vgs-danger"
                                        aria-label="Hapus alamat"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Tambah Alamat */}
            <AddAddressForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </AccountLayout>
    );
}
