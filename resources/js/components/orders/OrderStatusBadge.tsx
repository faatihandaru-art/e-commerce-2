import React from 'react';
import { ORDER_STATUS_STYLES, orderStatusLabel } from './orderStatus';

interface OrderStatusBadgeProps {
    status: string;
    className?: string;
}

export default function OrderStatusBadge({ status, className = '' }: OrderStatusBadgeProps) {
    return (
        <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-[11px] font-bold ${ORDER_STATUS_STYLES[status] ?? 'text-vgs-silver-mid bg-vgs-black-surface border-vgs-gray-border'} ${className}`}>
            {orderStatusLabel(status)}
        </span>
    );
}
