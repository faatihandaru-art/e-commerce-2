import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import CustomerFilterBar, {
    type CustomerFiltersState,
} from '@/components/admin/customers/CustomerFilterBar';
import { formatRupiah } from '@/lib/format';
import type { AdminPageProps } from '@/types/admin';

interface AdminCustomer {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    status: string;
    total_orders: number;
    total_spent: number;
    last_order_at: string | null;
    created_at: string | null;
}

interface CustomerPaginator {
    data: AdminCustomer[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from: number | null;
    to: number | null;
}

interface CustomerFilters {
    search: string;
    status: string;
    sort_by: string;
    sort_order: string;
}

interface CustomersIndexProps extends AdminPageProps {
    customers: CustomerPaginator;
    filters: CustomerFilters;
}

const STATUS_META: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'neutral' }> = {
    active: { label: 'Aktif', variant: 'success' },
    inactive: { label: 'Nonaktif', variant: 'warning' },
    banned: { label: 'Dibanned', variant: 'danger' },
};

function formatDate(value: string | null): string {
    if (!value) return 'Belum pernah order';
    return new Date(value).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function CustomersIndex() {
    const { customers, filters } = usePage<CustomersIndexProps>().props;
    const rows = customers?.data ?? [];
    const [loading, setLoading] = useState(false);

    const applyFilters = (next: CustomerFiltersState) => {
        const params: Record<string, string> = {};
        if (next.search.trim()) params.search = next.search.trim();
        if (next.status && next.status !== 'all') params.status = next.status;
        if (next.sort_by) params.sort_by = next.sort_by;
        if (next.sort_order) params.sort_order = next.sort_order;

        setLoading(true);
        router.get('/admin/customers', params, {
            preserveState: true,
            preserveScroll: true,
            only: ['customers', 'filters'],
            onFinish: () => setLoading(false),
        });
    };

    const resetFilters = () => {
        setLoading(true);
        router.get('/admin/customers', {}, {
            preserveState: true,
            preserveScroll: true,
            only: ['customers', 'filters'],
            onFinish: () => setLoading(false),
        });
    };

    const buildPageUrl = (page: number) => {
        const params = new URLSearchParams();
        if (filters?.search?.trim()) params.set('search', filters.search.trim());
        if (filters?.status) params.set('status', filters.status);
        if (filters?.sort_by) params.set('sort_by', filters.sort_by);
        if (filters?.sort_order) params.set('sort_order', filters.sort_order);
        params.set('page', String(page));
        const qs = params.toString();
        return `/admin/customers${qs ? `?${qs}` : ''}`;
    };

    return (
        <AdminLayout title="Kelola Customer">
            <Head title="Kelola Customer" />

            <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6">
                {/* Header */}
                <div>
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-vgs-silver-bright">
                        Kelola Customer
                    </h2>
                    <p className="text-sm text-vgs-silver-mid mt-1">
                        {customers?.total ?? 0} customer terdaftar
                    </p>
                </div>

                {/* Kartu ringkasan */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="p-5 rounded-2xl bg-vgs-black-surface border border-vgs-gray-border">
                        <p className="text-xs font-mono uppercase tracking-wider text-vgs-silver-muted">
                            Total Customer
                        </p>
                        <p className="mt-2 text-2xl font-display font-bold text-vgs-silver-bright">
                            {customers?.total ?? 0}
                        </p>
                        <p className="mt-1 text-xs text-vgs-silver-muted">Akun ber-role customer</p>
                    </div>
                </div>

                {/* Filter & pencarian */}
                <CustomerFilterBar
                    filters={{
                        search: filters?.search ?? '',
                        status: filters?.status ?? '',
                        sort_by: filters?.sort_by ?? 'created_at',
                        sort_order: (filters?.sort_order ?? 'desc') as CustomerFiltersState['sort_order'],
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
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                                        Nomor HP
                                    </th>
                                    <th className="px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                                        Total Order
                                    </th>
                                    <th className="px-6 py-3 text-right text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                                        Total Belanja
                                    </th>
                                    <th className="px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                                        Order Terakhir
                                    </th>
                                    <th className="px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-vgs-gray-border/60">
                                {rows.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center">
                                            <p className="text-vgs-silver-mid">
                                                Belum ada customer.
                                            </p>
                                            <p className="text-xs text-vgs-silver-muted mt-1">
                                                Coba ubah filter atau pencarian.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                                {rows.map((row) => {
                                    const statusMeta = STATUS_META[row.status] ?? {
                                        label: row.status ?? '—',
                                        variant: 'neutral' as const,
                                    };
                                    return (
                                        <tr key={row.id} className="hover:bg-vgs-black-elevated/40 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-vgs-silver-bright">{row.name}</p>
                                                <p className="text-xs text-vgs-silver-muted">{row.email}</p>
                                            </td>
                                            <td className="px-6 py-4 text-vgs-silver-mid whitespace-nowrap">
                                                {row.phone ?? '—'}
                                            </td>
                                            <td className="px-6 py-4 text-vgs-silver-mid">
                                                {row.total_orders}
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-vgs-silver-bright whitespace-nowrap">
                                                {formatRupiah(row.total_spent)}
                                            </td>
                                            <td className="px-6 py-4 text-vgs-silver-mid whitespace-nowrap">
                                                {formatDate(row.last_order_at)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={statusMeta.variant} dot>
                                                    {statusMeta.label}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        href={`/admin/customers/${row.id}`}
                                                    >
                                                        Lihat Detail
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {customers && customers.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-vgs-gray-border flex items-center justify-between">
                            <span className="text-xs text-vgs-silver-muted">
                                Halaman {customers.current_page} dari {customers.last_page} ({customers.total} customer)
                            </span>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    href={
                                        customers.current_page > 1
                                            ? buildPageUrl(customers.current_page - 1)
                                            : undefined
                                    }
                                    disabled={customers.current_page <= 1}
                                >
                                    Sebelumnya
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    href={
                                        customers.current_page < customers.last_page
                                            ? buildPageUrl(customers.current_page + 1)
                                            : undefined
                                    }
                                    disabled={customers.current_page >= customers.last_page}
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