import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/Button';
import type { AdminPageProps } from '@/types/admin';
import OrderStatusBadge from '@/components/admin/orders/OrderStatusBadge';
import OrderFilterBar, { type OrderFiltersState } from '@/components/admin/orders/OrderFilterBar';
import { formatRupiah } from '@/lib/format';

interface OrderCustomer {
    id: number;
    name: string;
    email: string;
    phone: string;
}

interface AdminOrder {
    id: number;
    order_number: string;
    customer: OrderCustomer;
    currency: string;
    subtotal: number;
    discount_total: number;
    shipping_total: number;
    tax_total: number;
    fee_total: number;
    grand_total: number;
    order_status: string;
    payment_status: string;
    fulfillment_status: string;
    items_count: number;
    placed_at: string | null;
    created_at: string | null;
}

interface Paginator {
    data: AdminOrder[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from: number | null;
    to: number | null;
}

interface OrderSummary {
    total_orders: number;
    perlu_diproses: number;
    perlu_dikirim: number;
}

interface AdminFilters {
    status?: string;
    order_status?: string;
    payment_status?: string;
    fulfillment_status?: string;
    search?: string;
    date_from?: string;
    date_to?: string;
}

interface OrdersIndexProps extends AdminPageProps {
    orders: Paginator;
    summary: OrderSummary;
    filters: AdminFilters;
}

function formatDate(value: string | null): string {
    if (!value) return 'Tanggal belum tersedia';
    return new Date(value).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function OrdersIndex() {
    const { orders, summary, filters } = usePage<OrdersIndexProps>().props;
    const rows = orders?.data ?? [];
    const [loading, setLoading] = useState(false);

    const applyFilters = (next: OrderFiltersState) => {
        const params: Record<string, string> = {};
        if (next.search.trim()) params.search = next.search.trim();
        if (next.status && next.status !== 'all') params.status = next.status;
        if (next.date_from) params.date_from = next.date_from;
        if (next.date_to) params.date_to = next.date_to;

        setLoading(true);
        router.get('/admin/orders', params, {
            preserveState: true,
            preserveScroll: true,
            only: ['orders', 'filters'],
            onFinish: () => setLoading(false),
        });
    };

    const resetFilters = () => {
        setLoading(true);
        router.get('/admin/orders', {}, {
            preserveState: true,
            preserveScroll: true,
            only: ['orders', 'filters'],
            onFinish: () => setLoading(false),
        });
    };

    const buildPageUrl = (page: number) => {
        const params = new URLSearchParams();
        if (filters?.search?.trim()) params.set('search', filters.search.trim());
        if (filters?.status) params.set('status', filters.status);
        if (filters?.date_from) params.set('date_from', filters.date_from);
        if (filters?.date_to) params.set('date_to', filters.date_to);
        params.set('page', String(page));
        const qs = params.toString();
        return `/admin/orders${qs ? `?${qs}` : ''}`;
    };

    return (
        <AdminLayout title="Kelola Orders">
            <Head title="Kelola Orders" />

            <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6">
                {/* Header */}
                <div>
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-vgs-silver-bright">
                        Kelola Orders
                    </h2>
                    <p className="text-sm text-vgs-silver-mid mt-1">
                        {summary?.perlu_diproses ?? 0} pesanan perlu diproses,{' '}
                        {summary?.perlu_dikirim ?? 0} perlu dikirim
                    </p>
                </div>

                {/* Kartu ringkasan */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="p-5 rounded-2xl bg-vgs-black-surface border border-vgs-gray-border">
                        <p className="text-xs font-mono uppercase tracking-wider text-vgs-silver-muted">
                            Total Orders
                        </p>
                        <p className="mt-2 text-2xl font-display font-bold text-vgs-silver-bright">
                            {summary?.total_orders ?? 0}
                        </p>
                        <p className="mt-1 text-xs text-vgs-silver-muted">Seluruh pesanan</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-vgs-black-surface border border-vgs-gray-border">
                        <p className="text-xs font-mono uppercase tracking-wider text-vgs-silver-muted">
                            Perlu Diproses
                        </p>
                        <p className="mt-2 text-2xl font-display font-bold text-vgs-warning">
                            {summary?.perlu_diproses ?? 0}
                        </p>
                        <p className="mt-1 text-xs text-vgs-silver-muted">Menunggu dikonfirmasi</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-vgs-black-surface border border-vgs-gray-border">
                        <p className="text-xs font-mono uppercase tracking-wider text-vgs-silver-muted">
                            Perlu Dikirim
                        </p>
                        <p className="mt-2 text-2xl font-display font-bold text-vgs-blue-electric">
                            {summary?.perlu_dikirim ?? 0}
                        </p>
                        <p className="mt-1 text-xs text-vgs-silver-muted">Siap dikirim</p>
                    </div>
                </div>

                {/* Filter bar */}
                <OrderFilterBar
                    filters={{
                        search: filters?.search ?? '',
                        status: filters?.status ?? filters?.order_status ?? 'all',
                        date_from: filters?.date_from ?? '',
                        date_to: filters?.date_to ?? '',
                    }}
                    onApply={applyFilters}
                    onReset={resetFilters}
                />

                {/* Tabel */}
                <div className="rounded-2xl bg-vgs-black-surface border border-vgs-gray-border overflow-hidden">
                    {loading && (
                        <div className="px-6 py-3 border-b border-vgs-gray-border text-xs text-vgs-silver-mid flex items-center gap-2">
                            <svg className="w-4 h-4 animate-spin text-vgs-blue-electric" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Memuat data…
                        </div>
                    )}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left border-b border-vgs-gray-border bg-vgs-black-elevated/40">
                                    <th className="px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                                        No. Order
                                    </th>
                                    <th className="px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                                        Tanggal
                                    </th>
                                    <th className="px-6 py-3 text-right text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                                        Grand Total
                                    </th>
                                    <th className="px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                                        Order
                                    </th>
                                    <th className="px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                                        Payment
                                    </th>
                                    <th className="px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                                        Fulfillment
                                    </th>
                                    <th className="px-6 py-3 text-right text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-vgs-gray-border/60">
                                {rows.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center">
                                            <p className="text-vgs-silver-mid">Belum ada order.</p>
                                            <p className="text-xs text-vgs-silver-muted mt-1">
                                                Coba ubah filter atau pencarian.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                                {rows.map((row) => (
                                    <tr key={row.id} className="hover:bg-vgs-black-elevated/40 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-mono text-sm font-bold text-vgs-blue-electric">
                                                {row.order_number}
                                            </p>
                                            <p className="text-xs text-vgs-silver-muted">{row.items_count} item</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-vgs-silver-bright">{row.customer?.name}</p>
                                            <p className="text-xs text-vgs-silver-muted">{row.customer?.email}</p>
                                        </td>
                                        <td className="px-6 py-4 text-vgs-silver-mid whitespace-nowrap">
                                            {formatDate(row.placed_at)}
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-vgs-silver-bright whitespace-nowrap">
                                            {formatRupiah(row.grand_total)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <OrderStatusBadge type="order" status={row.order_status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <OrderStatusBadge type="payment" status={row.payment_status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <OrderStatusBadge type="fulfillment" status={row.fulfillment_status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    href={`/admin/orders/${row.id}`}
                                                >
                                                    Lihat Detail
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {orders && orders.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-vgs-gray-border flex items-center justify-between">
                            <span className="text-xs text-vgs-silver-muted">
                                Halaman {orders.current_page} dari {orders.last_page} ({orders.total} order)
                            </span>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    href={
                                        orders.current_page > 1
                                            ? buildPageUrl(orders.current_page - 1)
                                            : undefined
                                    }
                                    disabled={orders.current_page <= 1}
                                >
                                    Sebelumnya
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    href={
                                        orders.current_page < orders.last_page
                                            ? buildPageUrl(orders.current_page + 1)
                                            : undefined
                                    }
                                    disabled={orders.current_page >= orders.last_page}
                                >
                                    Berikutnya
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
