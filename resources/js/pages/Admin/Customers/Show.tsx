import React, { useState } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import OrderStatusBadge from '@/components/admin/orders/OrderStatusBadge';
import { formatRupiah } from '@/lib/format';
import type { AdminPageProps } from '@/types/admin';

export interface CustomerProfile {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    status: 'active' | 'inactive' | 'banned';
    last_login_at: string | null;
    created_at: string | null;
    updated_at: string | null;
    total_orders: number;
    total_spent: number;
    last_order_at: string | null;
}

export interface CustomerAddress {
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

export interface CustomerOrder {
    id: number;
    order_number: string;
    grand_total: number;
    order_status: string;
    payment_status: string;
    fulfillment_status: string;
    placed_at: string | null;
    created_at: string | null;
}

export interface CustomerNoteItem {
    id: number;
    note: string;
    created_by: number;
    author_name: string;
    created_at: string;
}

export interface CustomerDetailData {
    profile: CustomerProfile;
    addresses: CustomerAddress[];
    orders: CustomerOrder[];
    notes: CustomerNoteItem[];
}

export interface CustomersShowProps extends AdminPageProps {
    customer: CustomerDetailData;
}

function formatDate(value: string | null | undefined): string {
    if (!value) return '-';
    try {
        const date = new Date(value);
        if (isNaN(date.getTime())) return '-';
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return value;
    }
}

export default function CustomersShow() {
    const { customer, flash } = usePage<CustomersShowProps>().props;
    const { profile, addresses = [], orders = [], notes = [] } = customer;

    // Modals state
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [deleteNoteId, setDeleteNoteId] = useState<number | null>(null);
    const [isDeletingNote, setIsDeletingNote] = useState(false);

    // Status update form
    const statusForm = useForm<{ status: 'active' | 'inactive' | 'banned' }>({
        status: profile.status,
    });

    // Note form
    const noteForm = useForm<{ note: string }>({
        note: '',
    });

    // Handle status update
    const handleStatusSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        statusForm.post(`/admin/customers/${profile.id}/status`, {
            preserveScroll: true,
            onSuccess: () => {
                setStatusModalOpen(false);
            },
        });
    };

    // Handle note submission
    const handleNoteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!noteForm.data.note.trim()) {
            noteForm.setError('note', 'Catatan tidak boleh kosong.');
            return;
        }

        noteForm.post(`/admin/customers/${profile.id}/notes`, {
            preserveScroll: true,
            onSuccess: () => {
                noteForm.reset();
            },
        });
    };

    // Handle note deletion
    const handleConfirmDeleteNote = () => {
        if (!deleteNoteId) return;

        setIsDeletingNote(true);
        router.delete(`/admin/customers/notes/${deleteNoteId}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteNoteId(null);
                setIsDeletingNote(false);
            },
            onError: () => {
                setIsDeletingNote(false);
            },
        });
    };

    // Badge styling for customer account status
    const renderStatusBadge = (status: 'active' | 'inactive' | 'banned') => {
        switch (status) {
            case 'active':
                return (
                    <Badge variant="success" dot size="sm">
                        Aktif
                    </Badge>
                );
            case 'inactive':
                return (
                    <Badge variant="warning" dot size="sm">
                        Nonaktif
                    </Badge>
                );
            case 'banned':
                return (
                    <Badge variant="danger" dot size="sm">
                        Diblokir
                    </Badge>
                );
            default:
                return (
                    <Badge variant="neutral" dot size="sm">
                        {status}
                    </Badge>
                );
        }
    };

    return (
        <AdminLayout title={`Detail Customer — ${profile.name}`}>
            <Head title={`${profile.name} — Detail Customer`} />

            <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full">
                {/* Navigasi Kembali */}
                <div>
                    <Link
                        href="/admin/customers"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-vgs-silver-muted hover:text-vgs-blue-electric transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vgs-blue-electric rounded-lg px-2 -ml-2"
                    >
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Kembali ke Daftar Customer</span>
                    </Link>
                </div>

                {/* Flash message notifications */}
                {flash?.success && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-vgs-success/10 border border-vgs-success/30 text-vgs-success animate-fadeIn">
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium">{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-vgs-danger/10 border border-vgs-danger/30 text-vgs-danger animate-fadeIn">
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium">{flash.error}</span>
                    </div>
                )}

                {/* BAGIAN A: HEADER & INFO PROFIL CUSTOMER */}
                <section
                    aria-labelledby="customer-profile-heading"
                    className="rounded-2xl border border-vgs-gray-border bg-vgs-black-surface p-5 sm:p-7 shadow-xs"
                >
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        {/* Identitas Customer */}
                        <div className="flex items-start gap-4 sm:gap-5">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-vgs-blue-electric/20 to-vgs-blue-deep/30 border border-vgs-blue-electric/30 flex items-center justify-center shrink-0 shadow-inner">
                                <span className="font-display font-bold text-xl sm:text-2xl text-vgs-blue-electric">
                                    {profile.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                    <h1
                                        id="customer-profile-heading"
                                        className="text-xl sm:text-2xl font-display font-bold text-vgs-silver-bright truncate"
                                    >
                                        {profile.name}
                                    </h1>
                                    {renderStatusBadge(profile.status)}
                                </div>
                                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-vgs-silver-mid">
                                    <span className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4 text-vgs-silver-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                        {profile.email}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4 text-vgs-silver-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        {profile.phone || <span className="text-vgs-silver-muted italic">Tidak ada nomor HP</span>}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4 text-vgs-silver-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Bergabung {formatDate(profile.created_at)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Tombol Aksi Ubah Status Akun & Penjelasan */}
                        <div className="flex flex-col sm:items-end gap-1.5 border-t sm:border-t-0 pt-4 sm:pt-0 border-vgs-gray-border/50">
                            <Button
                                variant="secondary"
                                size="md"
                                onClick={() => {
                                    statusForm.setData('status', profile.status);
                                    setStatusModalOpen(true);
                                }}
                                className="w-full sm:w-auto"
                            >
                                <svg className="w-4 h-4 mr-2 text-vgs-silver-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Ubah Status Akun
                            </Button>
                            <p className="text-[11px] text-vgs-silver-muted max-w-xs text-left sm:text-right">
                                {profile.status === 'active'
                                    ? 'Klik untuk menonaktifkan atau memblokir akses login customer.'
                                    : profile.status === 'inactive'
                                      ? 'Akun nonaktif: Customer tidak dapat login ke toko.'
                                      : 'Akun diblokir: Akses customer dihentikan permanen.'}
                            </p>
                        </div>
                    </div>

                    {/* Ringkasan Statistik Belanja (Dihitung Backend) */}
                    <div className="mt-6 pt-6 border-t border-vgs-gray-border/60 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-xl bg-vgs-black-void/50 border border-vgs-gray-border/60">
                            <p className="text-[11px] font-mono uppercase tracking-wider text-vgs-silver-muted">
                                Total Belanja (Paid)
                            </p>
                            <p className="mt-1.5 text-lg sm:text-xl font-display font-bold text-vgs-silver-bright">
                                {formatRupiah(profile.total_spent)}
                            </p>
                            <p className="mt-1 text-[11px] text-vgs-silver-muted">Hanya order lunas</p>
                        </div>

                        <div className="p-4 rounded-xl bg-vgs-black-void/50 border border-vgs-gray-border/60">
                            <p className="text-[11px] font-mono uppercase tracking-wider text-vgs-silver-muted">
                                Total Order
                            </p>
                            <p className="mt-1.5 text-lg sm:text-xl font-display font-bold text-vgs-blue-electric">
                                {profile.total_orders} <span className="text-xs font-normal text-vgs-silver-muted">pesanan</span>
                            </p>
                            <p className="mt-1 text-[11px] text-vgs-silver-muted">Semua status order</p>
                        </div>

                        <div className="p-4 rounded-xl bg-vgs-black-void/50 border border-vgs-gray-border/60">
                            <p className="text-[11px] font-mono uppercase tracking-wider text-vgs-silver-muted">
                                Order Terakhir
                            </p>
                            <p className="mt-1.5 text-sm font-semibold text-vgs-silver-bright truncate">
                                {profile.last_order_at ? formatDate(profile.last_order_at) : 'Belum pernah order'}
                            </p>
                            <p className="mt-1 text-[11px] text-vgs-silver-muted">Waktu pemesanan</p>
                        </div>

                        <div className="p-4 rounded-xl bg-vgs-black-void/50 border border-vgs-gray-border/60">
                            <p className="text-[11px] font-mono uppercase tracking-wider text-vgs-silver-muted">
                                Login Terakhir
                            </p>
                            <p className="mt-1.5 text-sm font-semibold text-vgs-silver-bright truncate">
                                {profile.last_login_at ? formatDate(profile.last_login_at) : 'Belum pernah login'}
                            </p>
                            <p className="mt-1 text-[11px] text-vgs-silver-muted">Aktivitas akun</p>
                        </div>
                    </div>
                </section>

                {/* LAYOUT DUA KOLOM: UTAMA (KIRI) DAN SUPPORT INTERNAL (KANAN) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* KOLOM KIRI (2/3): ORDER & ALAMAT */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* BAGIAN C: RINGKASAN RIWAYAT ORDER */}
                        <section
                            aria-labelledby="order-history-heading"
                            className="rounded-2xl border border-vgs-gray-border bg-vgs-black-surface overflow-hidden shadow-xs"
                        >
                            <div className="p-5 sm:p-6 border-b border-vgs-gray-border flex items-center justify-between">
                                <div>
                                    <h2 id="order-history-heading" className="font-display font-bold text-base sm:text-lg text-vgs-silver-bright">
                                        Riwayat Pesanan
                                    </h2>
                                    <p className="text-xs text-vgs-silver-muted mt-0.5">
                                        Ringkasan seluruh transaksi pemesanan milik customer ({orders.length} transaksi)
                                    </p>
                                </div>
                            </div>

                            {orders.length === 0 ? (
                                <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center">
                                    <div className="w-14 h-14 rounded-2xl bg-vgs-gray-border/30 border border-vgs-gray-border flex items-center justify-center mb-3">
                                        <svg className="w-7 h-7 text-vgs-silver-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                    <p className="font-semibold text-vgs-silver-bright">Customer ini belum pernah melakukan pemesanan.</p>
                                    <p className="text-xs text-vgs-silver-muted mt-1 max-w-sm">
                                        Saat customer melakukan checkout, daftar transaksi akan otomatis muncul di sini.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="text-left border-b border-vgs-gray-border bg-vgs-black-elevated/40">
                                                <th className="px-5 py-3 text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                                                    No. Order
                                                </th>
                                                <th className="px-5 py-3 text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                                                    Tanggal
                                                </th>
                                                <th className="px-5 py-3 text-right text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                                                    Grand Total
                                                </th>
                                                <th className="px-5 py-3 text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                                                    Order Status
                                                </th>
                                                <th className="px-5 py-3 text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                                                    Payment
                                                </th>
                                                <th className="px-5 py-3 text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                                                    Fulfillment
                                                </th>
                                                <th className="px-5 py-3 text-right text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-vgs-gray-border/60">
                                            {orders.map((ord) => (
                                                <tr key={ord.id} className="hover:bg-vgs-black-elevated/30 transition-colors">
                                                    <td className="px-5 py-3.5">
                                                        <span className="font-mono text-xs sm:text-sm font-bold text-vgs-blue-electric">
                                                            {ord.order_number}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3.5 text-xs text-vgs-silver-mid whitespace-nowrap">
                                                        {formatDate(ord.placed_at || ord.created_at)}
                                                    </td>
                                                    <td className="px-5 py-3.5 text-right font-bold text-xs sm:text-sm text-vgs-silver-bright whitespace-nowrap">
                                                        {formatRupiah(ord.grand_total)}
                                                    </td>
                                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                                        <OrderStatusBadge type="order" status={ord.order_status} />
                                                    </td>
                                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                                        <OrderStatusBadge type="payment" status={ord.payment_status} />
                                                    </td>
                                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                                        <OrderStatusBadge type="fulfillment" status={ord.fulfillment_status} />
                                                    </td>
                                                    <td className="px-5 py-3.5 text-right">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            href={`/admin/orders/${ord.id}`}
                                                            className="text-xs"
                                                        >
                                                            Lihat Detail
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>

                        {/* BAGIAN B: DAFTAR ALAMAT TERSIMPAN (READ-ONLY) */}
                        <section
                            aria-labelledby="customer-addresses-heading"
                            className="rounded-2xl border border-vgs-gray-border bg-vgs-black-surface p-5 sm:p-6 shadow-xs"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 id="customer-addresses-heading" className="font-display font-bold text-base sm:text-lg text-vgs-silver-bright">
                                            Daftar Alamat Tersimpan
                                        </h2>
                                        <span className="text-xs font-mono text-vgs-silver-muted bg-vgs-black-void px-2 py-0.5 rounded border border-vgs-gray-border">
                                            {addresses.length} Alamat
                                        </span>
                                    </div>
                                    <p className="text-xs text-vgs-silver-muted mt-0.5">
                                        Data alamat pengiriman buku alamat milik customer
                                    </p>
                                </div>

                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-vgs-black-void border border-vgs-gray-border text-[11px] text-vgs-silver-muted">
                                    <svg className="w-3.5 h-3.5 text-vgs-silver-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <span>Read-only: Hanya customer yang dapat mengubah alamat</span>
                                </div>
                            </div>

                            {addresses.length === 0 ? (
                                <div className="py-8 text-center border border-dashed border-vgs-gray-border rounded-xl">
                                    <p className="text-sm text-vgs-silver-mid">Customer ini belum memiliki alamat tersimpan.</p>
                                    <p className="text-xs text-vgs-silver-muted mt-1">
                                        Alamat akan muncul otomatis ketika ditambahkan oleh customer melalui profilnya.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {addresses.map((address) => (
                                        <div
                                            key={address.id}
                                            className={`relative p-5 rounded-xl border transition-colors bg-vgs-black-void/50 ${
                                                address.is_default
                                                    ? 'border-vgs-blue-electric/40 bg-vgs-blue-electric/[0.02]'
                                                    : 'border-vgs-gray-border'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <h3 className="text-sm font-semibold text-vgs-silver-bright truncate">
                                                    {address.recipient}
                                                </h3>
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    {address.is_default && (
                                                        <Badge variant="success" size="xs">
                                                            Utama
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mb-2">
                                                <Badge variant="primary" size="xs">
                                                    {address.phone}
                                                </Badge>
                                            </div>

                                            <p className="text-xs sm:text-sm text-vgs-silver-mid leading-relaxed">
                                                {address.street}
                                                {address.village && `, ${address.village}`}
                                                {address.district && `, ${address.district}`}
                                            </p>
                                            <p className="text-xs sm:text-sm text-vgs-silver-mid mt-0.5">
                                                {address.city}, {address.province} {address.postal_code}
                                            </p>
                                            <p className="text-xs text-vgs-silver-muted mt-1.5 font-mono">
                                                {address.country}
                                                {address.latitude && address.longitude && (
                                                    <span className="ml-2 text-[10px] text-vgs-silver-muted/80">
                                                        ({address.latitude}, {address.longitude})
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* KOLOM KANAN (1/3): CATATAN SUPPORT INTERNAL (FITUR BARU) */}
                    <div className="flex flex-col gap-6">
                        <section
                            aria-labelledby="internal-notes-heading"
                            className="rounded-2xl border border-vgs-gray-border bg-vgs-black-surface p-5 sm:p-6 shadow-xs"
                        >
                            {/* Header Section dengan Penanda Visual Kuat: Internal Staf Only */}
                            <div className="mb-5 pb-4 border-b border-vgs-gray-border">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-vgs-warning/15 border border-vgs-warning/30 flex items-center justify-center text-vgs-warning shrink-0">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <h2 id="internal-notes-heading" className="font-display font-bold text-base text-vgs-silver-bright">
                                            Catatan Support
                                        </h2>
                                    </div>
                                    <Badge variant="warning" size="xs">
                                        Internal Staf
                                    </Badge>
                                </div>
                                <p className="text-xs text-vgs-silver-muted mt-2 leading-relaxed">
                                    Hanya terlihat oleh tim staf internal VGS. Catatan ini <span className="text-vgs-silver-bright font-medium">tidak pernah</span> ditampilkan kepada customer.
                                </p>
                            </div>

                            {/* Form Tambah Catatan Baru */}
                            <form onSubmit={handleNoteSubmit} className="mb-6">
                                <label htmlFor="new-note-input" className="block text-xs font-semibold text-vgs-silver-bright mb-1.5">
                                    Tambah Catatan Baru
                                </label>
                                <div className="relative">
                                    <textarea
                                        id="new-note-input"
                                        rows={3}
                                        value={noteForm.data.note}
                                        onChange={(e) => {
                                            noteForm.setData('note', e.target.value);
                                            if (noteForm.errors.note) {
                                                noteForm.clearErrors('note');
                                            }
                                        }}
                                        maxLength={2000}
                                        placeholder="Tulis catatan internal (misal: histori komplain, permintaan pengemasan khusus, nomor kendala kurir)..."
                                        className="w-full rounded-xl border border-vgs-gray-border bg-vgs-black-void px-3.5 py-2.5 text-xs sm:text-sm text-vgs-silver-bright placeholder:text-vgs-silver-muted/70 focus:border-vgs-blue-electric focus:outline-none focus:ring-1 focus:ring-vgs-blue-electric transition-colors resize-none"
                                        aria-describedby="note-char-count"
                                    />
                                </div>

                                <div className="mt-2 flex items-center justify-between gap-2">
                                    <span id="note-char-count" className="text-[11px] font-mono text-vgs-silver-muted">
                                        {noteForm.data.note.length}/2000
                                    </span>
                                    <Button
                                        type="submit"
                                        size="sm"
                                        loading={noteForm.processing}
                                        disabled={noteForm.processing || !noteForm.data.note.trim()}
                                    >
                                        Simpan Catatan
                                    </Button>
                                </div>
                                {noteForm.errors.note && (
                                    <p className="text-xs text-vgs-danger mt-1.5">{noteForm.errors.note}</p>
                                )}
                            </form>

                            {/* Daftar Catatan Support */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-mono uppercase tracking-wider text-vgs-silver-muted">
                                    Riwayat Catatan ({notes.length})
                                </h3>

                                {notes.length === 0 ? (
                                    <div className="p-4 rounded-xl border border-dashed border-vgs-gray-border text-center bg-vgs-black-void/30">
                                        <p className="text-xs text-vgs-silver-mid">Belum ada catatan internal.</p>
                                        <p className="text-[11px] text-vgs-silver-muted mt-0.5">
                                            Gunakan form di atas untuk menambahkan catatan pertama.
                                        </p>
                                    </div>
                                ) : (
                                    notes.map((noteItem) => (
                                        <div
                                            key={noteItem.id}
                                            className="p-3.5 rounded-xl border border-vgs-gray-border bg-vgs-black-void/50 hover:border-vgs-silver-muted/30 transition-colors flex flex-col gap-2"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex items-center gap-1.5 min-w-0">
                                                    <span className="w-5 h-5 rounded-full bg-vgs-blue-electric/20 text-vgs-blue-electric flex items-center justify-center text-[10px] font-bold shrink-0">
                                                        {noteItem.author_name.charAt(0).toUpperCase()}
                                                    </span>
                                                    <span className="text-xs font-semibold text-vgs-silver-bright truncate">
                                                        {noteItem.author_name}
                                                    </span>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => setDeleteNoteId(noteItem.id)}
                                                    className="text-vgs-silver-muted hover:text-vgs-danger transition-colors p-1 rounded hover:bg-vgs-danger/10 shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-vgs-danger"
                                                    title="Hapus catatan"
                                                    aria-label="Hapus catatan"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <p className="text-xs sm:text-sm text-vgs-silver-mid whitespace-pre-line leading-relaxed break-words">
                                                {noteItem.note}
                                            </p>

                                            <div className="text-[10px] text-vgs-silver-muted font-mono flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {formatDate(noteItem.created_at)}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* MODAL: UBAH STATUS AKUN CUSTOMER */}
            <Modal
                isOpen={statusModalOpen}
                onClose={() => setStatusModalOpen(false)}
                title="Ubah Status Akun Customer"
                size="md"
            >
                <form onSubmit={handleStatusSubmit} className="space-y-4">
                    <p className="text-xs sm:text-sm text-vgs-silver-mid leading-relaxed">
                        Pilih status akun baru untuk customer <span className="font-semibold text-vgs-silver-bright">{profile.name}</span> ({profile.email}):
                    </p>

                    <div className="space-y-2.5">
                        {/* Option: Active */}
                        <label
                            className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                                statusForm.data.status === 'active'
                                    ? 'border-vgs-success bg-vgs-success/10 text-vgs-silver-bright'
                                    : 'border-vgs-gray-border bg-vgs-black-void hover:border-vgs-silver-muted/50'
                            }`}
                        >
                            <input
                                type="radio"
                                name="customer_status"
                                value="active"
                                checked={statusForm.data.status === 'active'}
                                onChange={() => statusForm.setData('status', 'active')}
                                className="mt-1 text-vgs-success focus:ring-vgs-success"
                            />
                            <div className="text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm text-vgs-silver-bright">Aktif (Active)</span>
                                    <Badge variant="success" size="xs">Normal</Badge>
                                </div>
                                <p className="text-vgs-silver-muted mt-1 leading-relaxed">
                                    Akun dapat login, melihat profil, menjelajahi produk, dan membuat pesanan baru secara normal.
                                </p>
                            </div>
                        </label>

                        {/* Option: Inactive */}
                        <label
                            className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                                statusForm.data.status === 'inactive'
                                    ? 'border-vgs-warning bg-vgs-warning/10 text-vgs-silver-bright'
                                    : 'border-vgs-gray-border bg-vgs-black-void hover:border-vgs-silver-muted/50'
                            }`}
                        >
                            <input
                                type="radio"
                                name="customer_status"
                                value="inactive"
                                checked={statusForm.data.status === 'inactive'}
                                onChange={() => statusForm.setData('status', 'inactive')}
                                className="mt-1 text-vgs-warning focus:ring-vgs-warning"
                            />
                            <div className="text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm text-vgs-silver-bright">Nonaktif (Inactive)</span>
                                    <Badge variant="warning" size="xs">Suspended</Badge>
                                </div>
                                <p className="text-vgs-silver-muted mt-1 leading-relaxed">
                                    <span className="text-vgs-warning font-semibold">Konsekuensi:</span> Customer tidak akan bisa login ke akun mereka. Data pesanan, poin, dan buku alamat tetap tersimpan aman.
                                </p>
                            </div>
                        </label>

                        {/* Option: Banned */}
                        <label
                            className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                                statusForm.data.status === 'banned'
                                    ? 'border-vgs-danger bg-vgs-danger/10 text-vgs-silver-bright'
                                    : 'border-vgs-gray-border bg-vgs-black-void hover:border-vgs-silver-muted/50'
                            }`}
                        >
                            <input
                                type="radio"
                                name="customer_status"
                                value="banned"
                                checked={statusForm.data.status === 'banned'}
                                onChange={() => statusForm.setData('status', 'banned')}
                                className="mt-1 text-vgs-danger focus:ring-vgs-danger"
                            />
                            <div className="text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm text-vgs-silver-bright">Diblokir (Banned)</span>
                                    <Badge variant="danger" size="xs">Dilarang</Badge>
                                </div>
                                <p className="text-vgs-silver-muted mt-1 leading-relaxed">
                                    <span className="text-vgs-danger font-semibold">Konsekuensi:</span> Customer diblokir secara penuh. Tidak dapat mengakses akun, dan seluruh upaya pemesanan baru akan ditolak.
                                </p>
                            </div>
                        </label>
                    </div>

                    {statusForm.errors.status && (
                        <p className="text-xs text-vgs-danger">{statusForm.errors.status}</p>
                    )}

                    <div className="pt-3 border-t border-vgs-gray-border flex items-center justify-end gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            size="md"
                            onClick={() => setStatusModalOpen(false)}
                            disabled={statusForm.processing}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            variant={statusForm.data.status === 'banned' ? 'danger' : 'primary'}
                            size="md"
                            loading={statusForm.processing}
                        >
                            Simpan Perubahan Status
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* MODAL: KONFIRMASI HAPUS CATATAN SUPPORT */}
            <Modal
                isOpen={deleteNoteId !== null}
                onClose={() => {
                    if (!isDeletingNote) setDeleteNoteId(null);
                }}
                title="Hapus Catatan Support"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-xs sm:text-sm text-vgs-silver-mid leading-relaxed">
                        Apakah Anda yakin ingin menghapus catatan support ini? Tindakan ini tidak dapat dibatalkan.
                    </p>

                    <div className="pt-3 border-t border-vgs-gray-border flex items-center justify-end gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            size="md"
                            onClick={() => setDeleteNoteId(null)}
                            disabled={isDeletingNote}
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            variant="danger"
                            size="md"
                            loading={isDeletingNote}
                            onClick={handleConfirmDeleteNote}
                        >
                            Hapus Catatan
                        </Button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
