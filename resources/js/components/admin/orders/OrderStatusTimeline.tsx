import React from 'react';
import { getStatusMeta } from '@/components/admin/orders/orderStatus';
import type { OrderStatusHistory } from '@/types/orders';

export interface OrderStatusTimelineProps {
    histories: OrderStatusHistory[];
}

function formatDateTime(value: string | null): string {
    if (!value) return '—';
    const d = new Date(value);
    return d.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Timeline histori perubahan status order.
 * Menampilkan dari-status -> ke-status, siapa yang mengubah, dan kapan.
 */
export const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({ histories }) => {
    const rows = histories ?? [];

    if (rows.length === 0) {
        return (
            <p className="text-sm text-vgs-silver-mid">Belum ada riwayat perubahan status.</p>
        );
    }

    return (
        <ol className="relative flex flex-col gap-5 border-l border-vgs-gray-border pl-5">
            {rows.map((history) => {
                const to = getStatusMeta('order', history.to_status);
                const from = history.from_status
                    ? getStatusMeta('order', history.from_status)
                    : null;

                const dotColor =
                    to.variant === 'success'
                        ? 'bg-vgs-success'
                        : to.variant === 'danger'
                          ? 'bg-vgs-danger'
                          : to.variant === 'warning'
                            ? 'bg-vgs-warning'
                            : 'bg-vgs-blue-electric';

                return (
                    <li key={history.id} className="relative">
                        <span
                            className={`absolute -left-[26px] top-1 w-2.5 h-2.5 rounded-full ${dotColor} shadow-[0_0_8px_currentColor]`}
                            aria-hidden="true"
                        />
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <span className="text-sm font-semibold text-vgs-silver-bright">
                                {from ? from.label : 'Order dibuat'}
                                <span className="text-vgs-blue-electric mx-1.5">→</span>
                                {to.label}
                            </span>
                            <span className="text-[11px] font-mono text-vgs-silver-muted">
                                {formatDateTime(history.created_at)}
                            </span>
                        </div>
                        {history.notes && (
                            <p className="mt-1 text-xs text-vgs-silver-mid">{history.notes}</p>
                        )}
                        <p className="mt-0.5 text-[11px] font-mono text-vgs-silver-muted">
                            Oleh:{' '}
                            <span className="text-vgs-silver-bright">
                                {history.changed_by?.name ?? 'Sistem'}
                            </span>
                        </p>
                    </li>
                );
            })}
        </ol>
    );
};

export default OrderStatusTimeline;