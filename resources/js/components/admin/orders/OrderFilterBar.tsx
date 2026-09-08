import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ORDER_STATUS_LABELS } from '@/components/orders/orderStatus';

export interface OrderFiltersState {
    search: string;
    status: string;
    date_from: string;
    date_to: string;
}

interface OrderFilterBarProps {
    filters: Partial<OrderFiltersState>;
    onApply: (filters: OrderFiltersState) => void;
    onReset: () => void;
    statusOptions?: { value: string; label: string }[];
}

const DEFAULT_STATUS_OPTIONS = Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
}));

export default function OrderFilterBar({
    filters,
    onApply,
    onReset,
    statusOptions = DEFAULT_STATUS_OPTIONS,
}: OrderFilterBarProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? 'all');
    const [dateFrom, setDateFrom] = useState(filters.date_from ?? '');
    const [dateTo, setDateTo] = useState(filters.date_to ?? '');

    useEffect(() => {
        setSearch(filters.search ?? '');
        setStatus(filters.status ?? 'all');
        setDateFrom(filters.date_from ?? '');
        setDateTo(filters.date_to ?? '');
    }, [filters]);

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();
        onApply({ search, status, date_from: dateFrom, date_to: dateTo });
    };

    return (
        <form
            onSubmit={handleApply}
            className="rounded-2xl bg-vgs-black-surface border border-vgs-gray-border p-4 flex flex-col gap-3"
        >
            <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-end">
                <div className="flex-1 w-full">
                    <Input
                        label="Cari No. Order / Customer"
                        placeholder="Ketik nomor order atau nama customer…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="w-full lg:w-56">
                    <label className="text-xs font-semibold uppercase tracking-wider text-vgs-silver-mid block mb-1.5">
                        Status Order
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full min-h-[44px] bg-vgs-black-surface text-vgs-silver-bright text-sm rounded-xl px-4 py-3 border border-vgs-gray-border focus:outline-none focus:border-vgs-blue-electric focus:ring-2 focus:ring-vgs-blue-electric/30"
                    >
                        <option value="all">Semua Status</option>
                        {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="w-full sm:w-52">
                    <label className="text-xs font-semibold uppercase tracking-wider text-vgs-silver-mid block mb-1.5">
                        Dari Tanggal
                    </label>
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="w-full min-h-[44px] bg-vgs-black-surface text-vgs-silver-bright text-sm rounded-xl px-4 py-3 border border-vgs-gray-border focus:outline-none focus:border-vgs-blue-electric focus:ring-2 focus:ring-vgs-blue-electric/30"
                    />
                </div>
                <div className="w-full sm:w-52">
                    <label className="text-xs font-semibold uppercase tracking-wider text-vgs-silver-mid block mb-1.5">
                        Sampai Tanggal
                    </label>
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="w-full min-h-[44px] bg-vgs-black-surface text-vgs-silver-bright text-sm rounded-xl px-4 py-3 border border-vgs-gray-border focus:outline-none focus:border-vgs-blue-electric focus:ring-2 focus:ring-vgs-blue-electric/30"
                    />
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                            setSearch('');
                            setStatus('all');
                            setDateFrom('');
                            setDateTo('');
                            onReset();
                        }}
                    >
                        Reset
                    </Button>
                    <Button type="submit" variant="primary">
                        Terapkan Filter
                    </Button>
                </div>
            </div>
        </form>
    );
}
