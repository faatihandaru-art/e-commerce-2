import React, { useMemo } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/Button';
import { OrderFilterBar } from '@/components/admin/orders/OrderFilterBar';
import { OrderStatusBadge } from '@/components/admin/orders/OrderStatusBadge';
import useInertiaLoading from '@/components/admin/orders/useInertiaLoading';
import { formatRupiah } from '@/lib/format';
import type { AdminPageProps } from '@/types/admin';
import type { OrderFilters, OrderListItem, OrderPaginator, OrdersSummary } from '@/types/orders';

interface OrdersIndexProps extends AdminPageProps {
    orders: OrderPaginator;
    summary: OrdersSummary;
    filters: OrderFilters;
}

function formatDateTime(value: string | null): string {
    if (!value) return '—';
    const d = new Date(value);
    return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export default function OrdersIndex() {
    const { orders, summary, filters, flash, errors } = usePage<OrdersIndexProps>().props;
    const rows: OrderListItem[] = orders?.data ?? [];
    const loading = useInertiaLoading();

    const normalizedFilters: OrderFilters = useMemo(
        () => ({
            search: filters?.search ?? '',
            order_status: filters?.order_status || filters?.status || '',
            payment_status: filters?.payment_status ?? '',
            fulfillment_status: filters?.fulfillment_status ?? '',
            date_from: filters?.date_from ?? '',
            date_to: filters?.date_to ?? '',
        }),
        [filters]
    );

    const applyFilters = (next: OrderFilters) => {
        const params: Record<string, string> = {};
        if (next.order_status) params.order_status = next.order_status;
        if (next.payment_status) params.payment_status = next.payment_status;
        if (next.fulfillment_status) params.fulfillment_status = next.fulfillment_status;
        if (next.search?.trim()) params.search = next.search.trim();
        if (next.date_from) params.date_from = next.date_from;
        if (next.date_to) params.date_to = next.date_to;
        router.get('/admin/orders', params, { preserveState: true, preserveScroll: true });
    };

    const buildPageUrl = (page: number) => {
        const params = new URLSearchParams();
        if (filters?.order_status) params.set('order_status', String(filters.order_status));
        if (filters?.payment_status) params.set('payment_status', String(filters.payment_status));
        if (filters?.fulfillment_status) params.set('fulfillment_status', String(filters.fulfillment_status));
        if (filters?.search?.trim()) params.set('search', filters.search.trim());
        if (filters?.date_from) params.set('date_from', filters.date_from);
        if (filters?.date_to) params.set('date_to', filters.date_to);
        params.set('page', String(page));
        const qs = params.toString();
        return `/admin/orders${qs ? `?${qs}` : ''}`;
    };

    const serverError = typeof errors?.status === 'string' ? errors.status : null;

    return (
        <AdminLayout title="Kelola Orders">
            <Head title="Kelola Orders" />

            <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6">
                {flash?.success && (
                    <p className="text-sm text-vgs-success border border-vgs-success/30 bg-vgs-success/10 rounded-lg px-3 py-2">
                        {flash.success}
                    </p>
                )}
                {flash?.error && (
                    <p className="text-sm text-vgs-danger border border-vgs-danger/30 bg-vgs-danger/10 rounded-lg px-3 py-2">
                        {flash.error}
                    </p>
                )}

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-display font-bold text-vgs-silver-bright">
                            Kelola Orders
                        </h2>
                        <p className="text-sm text-vgs-silver-mid mt-1">
                            {summary?.perlu_diproses ?? 0} pesanan perlu diproses
                        </p>
                    </div>
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
                        <p className="mt-1 text-xs text-vgs-silver-muted">Seluruh pesanan masuk</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-vgs-black-surface border border-vgs-gray-border">
                        <p className="text-xs font-mono uppercase tracking-wider text-vgs-silver-muted">
                            Perlu Diproses
                        </p>
                        <p className="mt-2 text-2xl font-display font-bold text-vgs-warning">
                            {summary?.perlu_diproses ?? 0}
                        </p>
                        <p className="mt-1 text-xs text-vgs-silver-muted">Menunggu konfirmasi gudang</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-vgs-black-surface border border-vgs-gray-border">
                        <p className="text-xs font-mono uppercase tracking-wider text-vgs-silver-muted">
                            Perlu Dikirim
                        </p>
                        <p className="mt-2 text-2xl font-display font-bold text-vgs-blue-electric">
                            {summary?.perlu_dikirim ?? 0}
                        </p>
                        <p className="mt-1 text-xs text-vgs-silver-muted">Siap diserahkan ke kurir</p>
                    </div>
                </div>

                {/* Filter / pencarian */}
                <OrderFilterBar
                    filters={normalizedFilters}
                    onApply={applyFilters}
                />

                {/* Tabel */}
                <div className="rounded-2xl bg-vgs-black-surface border border-vgs-gray-border overflow-hidden">
                    {loading && (
                        <div className="px-6 py-2.5 border-b border-vgs-gray-border bg-vgs-blue-electric/5 flex items-center gap-2">
                            <svg
                                className="animate-spin h-4 w-4 text-vgs-blue-electric"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span className="text-xs font-mono text-vgs-blue-electric">
                                Memuat data…
                            </span>
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
                                        Order Status
                                    </th>
                                    <th className="px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                                        Payment Status
                                    </th>
                                    <th className="px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                                        Fulfillment Status
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
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-14 h-14 rounded-2xl bg-vgs-blue-electric/10 border border-vgs-blue-electric/20 flex items-center justify-center mb-4">
                                                    <svg className="w-7 h-7 text-vgs-blue-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                    </svg>
                                                </div>
                                                <p className="text-vgs-silver-mid">
                                                    Tidak ada order yang cocok.
                                                </p>
                                                <p className="text-xs text-vgs-silver-muted mt-1">
                                                    Coba ubah filter atau pencarian.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {rows.map((row) => (
                                    <tr key={row.id} className="hover:bg-vgs-black-elevated/40 transition-colors">
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/admin/orders/${row.id}`}
                                                className="font-mono font-bold text-vgs-blue-electric hover:underline focus-visible:outline-none"
                                            >
                                                {row.order_number}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-vgs-silver-bright">
                                                {row.customer.name}
                                            </p>
                                            <p className="text-xs font-mono text-vgs-silver-muted truncate max-w-[220px]">
                                                {row.customer.email}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-vgs-silver-mid whitespace-nowrap">
                                            {formatDateTime(row.placed_at ?? row.created_at)}
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono font-bold text-vgs-silver-bright whitespace-nowrap">
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
                                                <Link
                                                    href={`/admin/orders/${row.id}`}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-vgs-blue-electric border border-vgs-blue-electric/30 hover:bg-vgs-blue-electric/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vgs-blue-electric"
                                                >
                                                    Lihat Detail
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {orders && orders.meta.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-vgs-gray-border flex items-center justify-between">
                            <span className="text-xs text-vgs-silver-muted">
                                Halaman {orders.meta.current_page} dari {orders.meta.last_page} ·{' '}
                                {orders.meta.total} order
                            </span>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    href={
                                        orders.meta.current_page > 1
                                            ? buildPageUrl(orders.meta.current_page - 1)
                                            : undefined
                                    }
                                    disabled={orders.meta.current_page <= 1}
                                >
                                    Sebelumnya
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    href={
                                        orders.meta.current_page < orders.meta.last_page
                                            ? buildPageUrl(orders.meta.current_page + 1)
                                            : undefined
                                    }
                                    disabled={orders.meta.current_page >= orders.meta.last_page}
                                >
                                    Berikutnya
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {serverError && (
                    <p className="text-sm text-vgs-danger border border-vgs-danger/30 bg-vgs-danger/10 rounded-lg px-3 py-2">
                        {serverError}
                    </p>
                )}
            </div>
        </AdminLayout>
    );
}