import React from 'react';
import { Badge } from '@/components/ui/Badge';
import {
    getStatusMeta,
    getStatusTypeLabel,
    type StatusBadgeVariant,
} from '@/components/admin/orders/orderStatus';
import type { OrderStatusType } from '@/types/orders';

export interface OrderStatusBadgeProps {
    type: OrderStatusType;
    status: string | null | undefined;
    /** Label baris pertama: tipe status (default menampilkan Order/Pembayaran/Fulfillment) */
    showType?: boolean;
    label?: string;
    className?: string;
}

/**
 * Badge status order yang reusable untuk halaman Admin maupun Account.
 * Terima tipe status (order | payment | fulfillment) + nilai status,
 * warna badge otomatis mengikuti mapping di orderStatus.ts.
 */
export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
    type,
    status,
    showType = false,
    label,
    className = '',
}) => {
    const meta = getStatusMeta(type, status);
    const variant = meta.variant as StatusBadgeVariant;
    const display = label ?? meta.label;

    if (!showType) {
        return (
            <Badge variant={variant} dot className={className}>
                {display}
            </Badge>
        );
    }

    return (
        <div className={`inline-flex flex-col gap-0.5 ${className}`}>
            <Badge variant={variant} dot>
                {display}
            </Badge>
            <span className="text-[9px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                {getStatusTypeLabel(type)}
            </span>
        </div>
    );
};

export default OrderStatusBadge;