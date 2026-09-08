import React from 'react';
import {
    ORDER_STATUS_LABELS,
    PAYMENT_STATUS_LABELS,
    FULFILLMENT_STATUS_LABELS,
    paymentStatusLabel,
} from '@/components/orders/orderStatus';
import { Badge } from '@/components/ui/Badge';

export type OrderStatusType = 'order' | 'payment' | 'fulfillment';

interface OrderStatusBadgeProps {
    type?: OrderStatusType;
    status: string;
    className?: string;
}

const VARIANT_FOR_STATUS: Record<
    OrderStatusType,
    (status: string) => 'warning' | 'danger' | 'success' | 'primary' | 'neutral'
> = {
    order: (status) => {
        switch (status) {
            case 'pending_payment':
                return 'warning';
            case 'cancelled':
            case 'refunded':
                return 'danger';
            case 'completed':
                return 'success';
            case 'confirmed':
            case 'processing':
            case 'packed':
            case 'shipped':
                return 'primary';
            default:
                return 'neutral';
        }
    },
    payment: (status) => {
        switch (status) {
            case 'paid':
                return 'success';
            case 'failed':
            case 'expired':
                return 'danger';
            case 'pending':
                return 'warning';
            case 'partially_refunded':
            case 'refunded':
                return 'danger';
            default:
                return 'neutral';
        }
    },
    fulfillment: (status) => {
        switch (status) {
            case 'fulfilled':
                return 'success';
            case 'returned':
                return 'danger';
            case 'partially_fulfilled':
            case 'processing':
                return 'primary';
            case 'unfulfilled':
                return 'neutral';
            default:
                return 'neutral';
        }
    },
};

export default function OrderStatusBadge({
    type = 'order',
    status,
    className = '',
}: OrderStatusBadgeProps) {
    // Reuse the generic order-status badge style map as a fallback for
    // order statuses, but prefer the Badge component variants for a
    // consistent look with the rest of the admin UI.
    const label =
        type === 'payment'
            ? paymentStatusLabel(status)
            : type === 'fulfillment'
              ? (FULFILLMENT_STATUS_LABELS[status] ?? 'Status Pengiriman')
              : (ORDER_STATUS_LABELS[status] ?? 'Status Order');

    const variant = VARIANT_FOR_STATUS[type](status);

    return (
        <Badge variant={variant} dot className={className}>
            {label}
        </Badge>
    );
}
