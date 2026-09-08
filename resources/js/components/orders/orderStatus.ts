export const ORDER_STATUS_LABELS: Record<string, string> = {
    pending_payment: 'Menunggu Pembayaran',
    confirmed: 'Dikonfirmasi',
    processing: 'Diproses',
    packed: 'Dikemas',
    shipped: 'Dikirim',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
    refunded: 'Dikembalikan',
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
    unpaid: 'Belum Bayar',
    pending: 'Menunggu Pembayaran',
    paid: 'Lunas',
    failed: 'Gagal',
    expired: 'Kedaluwarsa',
    partially_refunded: 'Sebagian Dikembalikan',
    refunded: 'Dikembalikan',
};

export const FULFILLMENT_STATUS_LABELS: Record<string, string> = {
    unfulfilled: 'Belum Diproses',
    processing: 'Diproses',
    partially_fulfilled: 'Sebagian Dikirim',
    fulfilled: 'Selesai Dikirim',
    returned: 'Dikembalikan',
};

export const ORDER_STATUS_STYLES: Record<string, string> = {
    pending_payment: 'text-vgs-warning bg-vgs-warning/10 border-vgs-warning/40',
    confirmed: 'text-vgs-blue-electric bg-vgs-blue-electric/10 border-vgs-blue-electric/40',
    processing: 'text-vgs-blue-electric bg-vgs-blue-electric/10 border-vgs-blue-electric/40',
    packed: 'text-vgs-blue-electric bg-vgs-blue-electric/10 border-vgs-blue-electric/40',
    shipped: 'text-vgs-blue-electric bg-vgs-blue-electric/10 border-vgs-blue-electric/40',
    completed: 'text-vgs-success bg-vgs-success/10 border-vgs-success/40',
    cancelled: 'text-vgs-danger bg-vgs-danger/10 border-vgs-danger/40',
    refunded: 'text-vgs-danger bg-vgs-danger/10 border-vgs-danger/40',
};

export function orderStatusLabel(status: string): string {
    return ORDER_STATUS_LABELS[status] ?? 'Status Pesanan';
}

export function paymentStatusLabel(status: string): string {
    return PAYMENT_STATUS_LABELS[status] ?? 'Status Pembayaran';
}
