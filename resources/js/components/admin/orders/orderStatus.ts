import type {
    FulfillmentStatus,
    OrderStatus,
    OrderStatusType,
    PaymentStatus,
} from '@/types/orders';

export type StatusBadgeVariant =
    | 'primary'
    | 'new'
    | 'sale'
    | 'warning'
    | 'danger'
    | 'success'
    | 'neutral';

export interface StatusMeta {
    label: string;
    variant: StatusBadgeVariant;
}

/**
 * Mapping label + warna badge untuk order_status.
 * Warna mengikuti pola halaman Inventory (badge status berwarna sama keluarga).
 */
export const ORDER_STATUS_META: Record<OrderStatus, StatusMeta> = {
    pending_payment: { label: 'Menunggu Pembayaran', variant: 'warning' },
    confirmed: { label: 'Dikonfirmasi', variant: 'primary' },
    processing: { label: 'Diproses', variant: 'primary' },
    packed: { label: 'Dikemas', variant: 'primary' },
    shipped: { label: 'Dikirim', variant: 'primary' },
    completed: { label: 'Selesai', variant: 'success' },
    cancelled: { label: 'Dibatalkan', variant: 'danger' },
    refunded: { label: 'Refund', variant: 'danger' },
};

export const PAYMENT_STATUS_META: Record<PaymentStatus, StatusMeta> = {
    unpaid: { label: 'Belum Bayar', variant: 'warning' },
    pending: { label: 'Menunggu Bayar', variant: 'warning' },
    paid: { label: 'Lunas', variant: 'success' },
    failed: { label: 'Gagal', variant: 'danger' },
    expired: { label: 'Kadaluarsa', variant: 'danger' },
    partially_refunded: { label: 'Refund Sebagian', variant: 'warning' },
    refunded: { label: 'Refund', variant: 'danger' },
};

export const FULFILLMENT_STATUS_META: Record<FulfillmentStatus, StatusMeta> = {
    unfulfilled: { label: 'Belum Diproses', variant: 'neutral' },
    processing: { label: 'Dipersiapkan', variant: 'primary' },
    partially_fulfilled: { label: 'Sebagian Dikirim', variant: 'warning' },
    fulfilled: { label: 'Terpenuhi', variant: 'success' },
    returned: { label: 'Dikembalikan', variant: 'danger' },
};

const TYPE_META: Record<
    OrderStatusType,
    Record<string, StatusMeta>
> = {
    order: ORDER_STATUS_META,
    payment: PAYMENT_STATUS_META,
    fulfillment: FULFILLMENT_STATUS_META,
};

const TYPE_LABELS: Record<OrderStatusType, string> = {
    order: 'Order',
    payment: 'Pembayaran',
    fulfillment: 'Fulfillment',
};

export function getStatusMeta(
    type: OrderStatusType,
    status: string | null | undefined
): StatusMeta {
    if (!status) return { label: '—', variant: 'neutral' };
    return (
        TYPE_META[type]?.[status] ?? { label: status.replaceAll('_', ' '), variant: 'neutral' }
    );
}

export function getStatusTypeLabel(type: OrderStatusType): string {
    return TYPE_LABELS[type];
}

/**
 * Status order yang valid sebagai tujuan transisi berikutnya.
 * Sesuai state machine di API_CONTRACT.md bagian 1.
 */
export const NEXT_ORDER_STATUSES: Partial<Record<OrderStatus, OrderStatus[]>> = {
    pending_payment: ['confirmed', 'cancelled'],
    confirmed: ['processing', 'cancelled', 'refunded'],
    processing: ['packed', 'cancelled', 'refunded'],
    packed: ['shipped', 'cancelled', 'refunded'],
    shipped: ['completed', 'refunded'],
    completed: ['refunded'],
};

export function getNextStatuses(current: OrderStatus | null | undefined): OrderStatus[] {
    if (!current) return [];
    return NEXT_ORDER_STATUSES[current] ?? [];
}

export function orderStatusLabel(status: string | null | undefined): string {
    if (!status) return '—';
    return ORDER_STATUS_LABELS[status] ?? status;
}

// ---------------------------------------------------------------------------
// Compatibility exports — label maps & helpers yang dipakai halaman Account
// ("Pesanan Saya"). Single source of truth: semua label diturunkan dari *_META
// di atas supaya tidak ada duplikasi wording antar halaman.
// ---------------------------------------------------------------------------

export const ORDER_STATUS_LABELS: Record<string, string> = Object.fromEntries(
    Object.entries(ORDER_STATUS_META).map(([key, meta]) => [key, meta.label])
);

export const PAYMENT_STATUS_LABELS: Record<string, string> = Object.fromEntries(
    Object.entries(PAYMENT_STATUS_META).map(([key, meta]) => [key, meta.label])
);

export const FULFILLMENT_STATUS_LABELS: Record<string, string> = Object.fromEntries(
    Object.entries(FULFILLMENT_STATUS_META).map(([key, meta]) => [key, meta.label])
);

export function paymentStatusLabel(status: string | null | undefined): string {
    if (!status) return '—';
    return PAYMENT_STATUS_LABELS[status] ?? status;
}

export function fulfillmentStatusLabel(status: string | null | undefined): string {
    if (!status) return '—';
    return FULFILLMENT_STATUS_LABELS[status] ?? status;
}