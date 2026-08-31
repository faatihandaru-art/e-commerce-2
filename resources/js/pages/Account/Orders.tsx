import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AccountLayout from '@/layouts/AccountLayout';
import { formatRupiah } from '@/lib/format';

interface OrderItemPayload {
    sku: string | null;
    product_name: string;
    variant_name: string | null;
    quantity: number;
    unit_price: number;
    total: number;
    image: string | null;
}

interface OrderPayload {
    id: number | string;
    order_number: string;
    order_status: string;
    payment_status: string;
    subtotal: number;
    discount_total: number;
    shipping_total: number;
    fee_total: number;
    grand_total: number;
    placed_at: string | null;
    item_count: number;
    items: OrderItemPayload[];
    shipping: {
        recipient: string;
        phone: string;
        line: string;
        city: string;
    } | null;
    payment: { method: string; status: string } | null;
}

interface OrdersPageProps {
    orders: OrderPayload[];
}

const ORDER_STATUS_LABELS: Record<string, string> = {
    pending_payment: 'Menunggu Pembayaran',
    confirmed: 'Dikonfirmasi',
    processed: 'Diproses',
    shipped: 'Dikirim',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
    refunded: 'Refund',
};

const ORDER_STATUS_STYLES: Record<string, string> = {
    pending_payment: 'text-vgs-warning bg-vgs-warning/10 border-vgs-warning/40',
    confirmed: 'text-vgs-blue-electric bg-vgs-blue-electric/10 border-vgs-blue-electric/40',
    processed: 'text-vgs-blue-electric bg-vgs-blue-electric/10 border-vgs-blue-electric/40',
    shipped: 'text-vgs-blue-electric bg-vgs-blue-electric/10 border-vgs-blue-electric/40',
    completed: 'text-vgs-success bg-vgs-success/10 border-vgs-success/40',
    cancelled: 'text-vgs-danger bg-vgs-danger/10 border-vgs-danger/40',
    refunded: 'text-vgs-danger bg-vgs-danger/10 border-vgs-danger/40',
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
    unpaid: 'Belum Bayar',
    paid: 'Lunas',
    refunded: 'Refund',
    failed: 'Gagal',
};

export default function Orders({ orders }: OrdersPageProps) {
    const orderList = orders ?? [];

    return (
        <AccountLayout title="Pesanan Saya">
            <Head title="Pesanan Saya — Vortix Gaming Store" />

            <div className="bg-vgs-black-surface border border-vgs-gray-border rounded-2xl p-6 sm:p-8">
                <h2 className="font-display font-bold text-lg text-vgs-silver-bright mb-6">
                    Riwayat Pesanan
                </h2>

                {orderList.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-vgs-blue-electric/10 border border-vgs-blue-electric/20 flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-vgs-blue-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h3 className="font-display font-bold text-vgs-silver-bright mb-1">
                            Belum Ada Pesanan
                        </h3>
                        <p className="text-sm text-vgs-silver-muted max-w-xs">
                            Mulai berbelanja untuk melihat riwayat pesanan Anda di sini.
                        </p>
                        <Link
                            href="/products"
                            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-vgs-blue-electric text-white text-xs font-bold hover:bg-vgs-blue-glow transition-colors"
                        >
                            Mulai Belanja
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {orderList.map((order) => (
                            <div
                                key={order.id}
                                className="rounded-2xl border border-vgs-gray-border bg-vgs-black-void/60 overflow-hidden"
                            >
                                {/* Order Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-vgs-gray-border bg-vgs-black-elevated/60">
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                        <span className="font-mono font-bold text-sm text-vgs-blue-electric">
                                            {order.order_number}
                                        </span>
                                        <span className="text-xs font-mono text-vgs-silver-muted">
                                            {order.placed_at || ''}
                                        </span>
                                        <span className="text-xs text-vgs-silver-muted">
                                            {order.item_count} item
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border ${
                                                ORDER_STATUS_STYLES[order.order_status] || 'text-vgs-silver-mid bg-vgs-black-surface border-vgs-gray-border'
                                            }`}
                                        >
                                            {ORDER_STATUS_LABELS[order.order_status] || order.order_status}
                                        </span>
                                        <span
                                            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border ${
                                                order.payment_status === 'paid'
                                                    ? 'text-vgs-success bg-vgs-success/10 border-vgs-success/40'
                                                    : 'text-vgs-silver-muted bg-vgs-black-surface border-vgs-gray-border'
                                            }`}
                                        >
                                            {PAYMENT_STATUS_LABELS[order.payment_status] || order.payment_status}
                                        </span>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="px-5 py-4 flex flex-col gap-3">
                                    {order.items.map((item, idx) => (
                                        <div key={`${item.sku}-${idx}`} className="flex items-center gap-3">
                                            <div className="relative w-14 h-14 rounded-lg bg-vgs-black-surface border border-vgs-gray-border p-1 flex items-center justify-center shrink-0 overflow-hidden">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.product_name} className="w-full h-full object-contain" />
                                                ) : (
                                                    <span className="text-xs font-mono text-vgs-silver-muted">VGS</span>
                                                )}
                                                <span className="absolute -top-1 -right-1 bg-vgs-blue-electric text-white text-[9px] font-mono font-bold min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs sm:text-sm font-semibold text-vgs-silver-bright truncate">
                                                    {item.product_name}
                                                </p>
                                                {item.variant_name && (
                                                    <p className="text-[11px] font-mono text-vgs-silver-muted truncate">
                                                        {item.variant_name}
                                                    </p>
                                                )}
                                                {item.sku && (
                                                    <p className="text-[10px] font-mono text-vgs-silver-muted">
                                                        SKU: {item.sku}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="font-mono text-xs font-bold text-vgs-silver-bright">
                                                    {formatRupiah(item.total)}
                                                </p>
                                                <p className="text-[10px] font-mono text-vgs-silver-muted">
                                                    @ {formatRupiah(item.unit_price)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Footer */}
                                <div className="px-5 py-4 border-t border-vgs-gray-border bg-vgs-black-elevated/40 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                                    {order.shipping ? (
                                        <div className="min-w-0">
                                            <p className="text-[11px] font-mono text-vgs-silver-muted">
                                                Dikirim ke <span className="text-vgs-silver-bright font-semibold">{order.shipping.recipient}</span>
                                            </p>
                                            <p className="text-[11px] font-mono text-vgs-silver-muted truncate">
                                                {order.shipping.line} • {order.shipping.city}
                                            </p>
                                        </div>
                                    ) : (
                                        <div />
                                    )}
                                    <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
                                        {order.discount_total > 0 && (
                                            <div className="text-right">
                                                <p className="text-[10px] font-mono text-vgs-silver-muted">Diskon</p>
                                                <p className="font-mono text-xs font-bold text-vgs-success">
                                                    -{formatRupiah(order.discount_total)}
                                                </p>
                                            </div>
                                        )}
                                        <div className="text-right">
                                            <p className="text-[10px] font-mono text-vgs-silver-muted">Total Tagihan</p>
                                            <p className="font-mono font-extrabold text-sm text-vgs-blue-electric">
                                                {formatRupiah(order.grand_total)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AccountLayout>
    );
}