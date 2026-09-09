import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export interface CustomerFiltersState {
    search: string;
    status: string;
    sort_by: string;
    sort_order: 'asc' | 'desc';
}

interface CustomerFilterBarProps {
    filters: Partial<CustomerFiltersState>;
    onApply: (filters: CustomerFiltersState) => void;
    onReset: () => void;
}

export const CUSTOMER_STATUS_OPTIONS: { value: string; label: string }[] = [
    { value: 'active', label: 'Aktif' },
    { value: 'inactive', label: 'Nonaktif' },
    { value: 'banned', label: 'Dibanned' },
];

export const CUSTOMER_SORT_OPTIONS: { value: string; label: string }[] = [
    { value: 'created_at', label: 'Terbaru Daftar' },
    { value: 'name', label: 'Nama (alfabetis)' },
    { value: 'total_orders', label: 'Total Order' },
    { value: 'total_spent', label: 'Total Belanja' },
    { value: 'last_order_at', label: 'Order Terakhir' },
];

export default function CustomerFilterBar({
    filters,
    onApply,
    onReset,
}: CustomerFilterBarProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [sortBy, setSortBy] = useState(filters.sort_by ?? 'created_at');
    const [sortOrder, setSortOrder] = useState<CustomerFiltersState['sort_order']>(
        filters.sort_order ?? 'desc'
    );

    useEffect(() => {
        setSearch(filters.search ?? '');
        setStatus(filters.status || 'all');
        setSortBy(filters.sort_by ?? 'created_at');
        setSortOrder(filters.sort_order ?? 'desc');
    }, [filters]);

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();
        onApply({
            search,
            status: status === 'all' ? '' : status,
            sort_by: sortBy,
            sort_order: sortOrder,
        });
    };

    return (
        <form
            onSubmit={handleApply}
            className="rounded-2xl bg-vgs-black-surface border border-vgs-gray-border p-4 flex flex-col gap-3"
        >
            <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-end">
                <div className="flex-1 w-full">
                    <Input
                        label="Cari Customer"
                        placeholder="Ketik nama, email, atau nomor HP…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="w-full lg:w-48">
                    <label className="text-xs font-semibold uppercase tracking-wider text-vgs-silver-mid block mb-1.5">
                        Status
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full min-h-[44px] bg-vgs-black-surface text-vgs-silver-bright text-sm rounded-xl px-4 py-3 border border-vgs-gray-border focus:outline-none focus:border-vgs-blue-electric focus:ring-2 focus:ring-vgs-blue-electric/30"
                    >
                        <option value="all">Semua Status</option>
                        {CUSTOMER_STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="w-full lg:w-56">
                    <label className="text-xs font-semibold uppercase tracking-wider text-vgs-silver-mid block mb-1.5">
                        Urutkan
                    </label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full min-h-[44px] bg-vgs-black-surface text-vgs-silver-bright text-sm rounded-xl px-4 py-3 border border-vgs-gray-border focus:outline-none focus:border-vgs-blue-electric focus:ring-2 focus:ring-vgs-blue-electric/30"
                    >
                        {CUSTOMER_SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="w-full lg:w-40">
                    <label className="text-xs font-semibold uppercase tracking-wider text-vgs-silver-mid block mb-1.5">
                        Arah
                    </label>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as CustomerFiltersState['sort_order'])}
                        className="w-full min-h-[44px] bg-vgs-black-surface text-vgs-silver-bright text-sm rounded-xl px-4 py-3 border border-vgs-gray-border focus:outline-none focus:border-vgs-blue-electric focus:ring-2 focus:ring-vgs-blue-electric/30"
                    >
                        <option value="desc">Menurun</option>
                        <option value="asc">Menaik</option>
                    </select>
                </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                        setSearch('');
                        setStatus('all');
                        setSortBy('created_at');
                        setSortOrder('desc');
                        onReset();
                    }}
                >
                    Reset
                </Button>
                <Button type="submit" variant="primary">
                    Terapkan Filter
                </Button>
            </div>
        </form>
    );
}