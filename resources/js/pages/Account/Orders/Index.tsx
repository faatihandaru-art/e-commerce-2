import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AccountLayout from '@/layouts/AccountLayout';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import { formatRupiah } from '@/lib/format';
import { paymentStatusLabel, orderStatusLabel } from '@/components/orders/orderStatus';

interface Order {
    id: number;
    order_number: string;
    order_status: string;
    payment_status: string;
    fulfillment_status: string;
    grand_total: number;
    placed_at: string | null;
    items_count: number;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface OrdersPageProps {
    orders: {
        data: Order[];
        meta: {
            current_page: number;
            last_page: number;
            from: number | null;
            to: number | null;
            total: number;
            links: PaginationLink[];
        };
    };
    filters: { status?: string };
}

const FILTERS = [
    { value: 'all', label: 'Semua' },
    { value: 'pending_payment', label: 'Menunggu Pembayaran' },
    { value: 'processing', label: 'Diproses' },
    { value: 'packed', label: 'Dikemas' },
    { value: 'shipped', label: 'Dikirim' },
    { value: 'completed', label: 'Selesai' },
    { value: 'cancelled', label: 'Dibatalkan' },
];

export default function OrdersIndex({ orders, filters }: OrdersPageProps) {
    const activeStatus = filters.status ?? 'all';
    const { data, meta } = orders;

    return (
        <AccountLayout title="Pesanan Saya">
            <Head title="Pesanan Saya — Vortix Gaming Store" />

            <div className="space-y-5">
                <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filter status pesanan">
                    {FILTERS.map((filter) => (
                        <Link
                            key={filter.value}
                            href={filter.value === 'all' ? '/account/orders' : `/account/orders?status=${filter.value}`}
                            preserveScroll
                            className={`shrink-0 rounded-xl border px-4 py-2 text-xs font-semibold transition-colors ${
                                activeStatus === filter.value
                                    ? 'border-vgs-blue-electric/50 bg-vgs-blue-electric/15 text-vgs-blue-electric'
                                    : 'border-vgs-gray-border bg-vgs-black-surface text-vgs-silver-muted hover:text-vgs-silver-bright'
                            }`}
                        >
                            {filter.label}
                        </Link>
                    ))}
                </div>

                <div className="rounded-2xl border border-vgs-gray-border bg-vgs-black-surface p-4 sm:p-6">
                    {data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-vgs-blue-electric/20 bg-vgs-blue-electric/10">
                                <svg className="h-8 w-8 text-vgs-blue-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <h2 className="font-display font-bold text-vgs-silver-bright">
                                {activeStatus === 'all' ? 'Belum Ada Pesanan' : 'Pesanan Tidak Ditemukan'}
                            </h2>
                            <p className="mt-1 max-w-xs text-sm text-vgs-silver-muted">
                                {activeStatus === 'all'
                                    ? 'Mulai berbelanja untuk melihat riwayat pesanan Anda di sini.'
                                    : 'Belum ada pesanan dengan status ini.'}
                            </p>
                            {activeStatus === 'all' && (
                                <Link href="/products" className="mt-5 rounded-xl bg-vgs-blue-electric px-5 py-2.5 text-xs font-bold text-white hover:bg-vgs-blue-glow">
                                    Mulai Belanja
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {data.map((order) => (
                                <article key={order.id} className="overflow-hidden rounded-2xl border border-vgs-gray-border bg-vgs-black-void/60">
                                    <div className="flex flex-col gap-3 border-b border-vgs-gray-border bg-vgs-black-elevated/60 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                                        <div>
                                            <p className="font-mono text-sm font-bold text-vgs-blue-electric">{order.order_number}</p>
                                            <p className="mt-1 text-xs text-vgs-silver-muted">
                                                {order.placed_at ? new Date(order.placed_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : 'Tanggal belum tersedia'} · {order.items_count} item
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <OrderStatusBadge status={order.order_status} />
                                            <span className="rounded-lg border border-vgs-gray-border bg-vgs-black-surface px-2.5 py-1 text-[11px] font-semibold text-vgs-silver-muted">
                                                {paymentStatusLabel(order.payment_status)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 border-t border-vgs-gray-border bg-vgs-black-elevated/40 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                                        <p className="text-xs text-vgs-silver-muted">
                                            Total pesanan <span className="ml-1 text-sm font-bold text-vgs-blue-electric">{formatRupiah(order.grand_total)}</span>
                                        </p>
                                        <Link href={`/account/orders/${order.id}`} className="inline-flex justify-center rounded-xl border border-vgs-blue-electric/40 px-4 py-2 text-xs font-bold text-vgs-blue-electric hover:bg-vgs-blue-electric/10">
                                            Lihat Detail
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>

                {meta.last_page > 1 && (
                    <nav className="flex flex-wrap justify-center gap-2" aria-label="Pagination pesanan">
                        {meta.links.map((link, index) => (
                            <Link
                                key={`${link.label}-${index}`}
                                href={link.url ?? '#'}
                                preserveScroll
                                className={`rounded-lg border px-3 py-2 text-xs ${
                                    link.active
                                        ? 'border-vgs-blue-electric bg-vgs-blue-electric/15 text-vgs-blue-electric'
                                        : link.url
                                            ? 'border-vgs-gray-border text-vgs-silver-muted hover:text-vgs-silver-bright'
                                            : 'cursor-not-allowed border-vgs-gray-border/50 text-vgs-silver-muted/40'
                                }`}
                                aria-disabled={!link.url}
                            >
                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                            </Link>
                        ))}
                    </nav>
                )}
            </div>
        </AccountLayout>
    );
}
