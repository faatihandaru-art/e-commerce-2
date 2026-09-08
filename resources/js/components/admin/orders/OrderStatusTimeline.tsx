import React from 'react';
import { orderStatusLabel } from '@/components/orders/orderStatus';

export interface StatusHistoryEntry {
    id: number | string;
    from_status: string | null;
    to_status: string;
    notes?: string | null;
    changed_by?: { id: number; name: string } | null;
    created_at?: string | null;
}

interface OrderStatusTimelineProps {
    histories: StatusHistoryEntry[];
    emptyText?: string;
}

function formatDate(value?: string | null): string {
    if (!value) return 'Tanggal belum tersedia';
    return new Date(value).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function OrderStatusTimeline({
    histories,
    emptyText = 'Belum ada riwayat perubahan status.',
}: OrderStatusTimelineProps) {
    if (!histories || histories.length === 0) {
        return <p className="text-sm text-vgs-silver-muted">{emptyText}</p>;
    }

    return (
        <ol className="relative space-y-5 border-l border-vgs-gray-border ml-2">
            {histories.map((history) => (
                <li key={history.id} className="pl-6 relative">
                    <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-vgs-blue-electric ring-4 ring-vgs-blue-electric/20" />
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-vgs-silver-bright">
                            {orderStatusLabel(history.to_status)}
                        </p>
                        <span className="text-xs text-vgs-silver-muted">
                            {formatDate(history.created_at)}
                        </span>
                    </div>
                    {history.from_status && (
                        <p className="mt-0.5 text-xs text-vgs-silver-mid">
                            dari {orderStatusLabel(history.from_status)}
                        </p>
                    )}
                    {history.changed_by?.name && (
                        <p className="mt-0.5 text-xs text-vgs-silver-muted">
                            Oleh {history.changed_by.name}
                        </p>
                    )}
                    {history.notes && (
                        <p className="mt-1 text-sm text-vgs-silver-bright rounded-lg border border-vgs-gray-border bg-vgs-black-elevated/50 px-3 py-2">
                            {history.notes}
                        </p>
                    )}
                </li>
            ))}
        </ol>
    );
}
