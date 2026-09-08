import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AccountLayout from '@/layouts/AccountLayout';
import OrderStatusBadge from '@/components/admin/orders/OrderStatusBadge';
import { formatRupiah } from '@/lib/format';
import { FULFILLMENT_STATUS_LABELS, PAYMENT_STATUS_LABELS, paymentStatusLabel, orderStatusLabel } from '@/components/admin/orders/orderStatus';

interface OrderItem {
    id: number;
    sku: string | null;
    product_name: string;
    variant_name: string | null;
    quantity: number;
    unit_price: number;
    total: number;
    image: string | null;
}

interface OrderPayment {
    id: number;
    method: string;
    provider: string | null;
    amount: number;
    currency: string;
    status: string;
    paid_at: string | null;
}

interface OrderShipment {
    id: number;
    courier: string | null;
    tracking_number: string | null;
    cost: number;
    status: string;
    shipped_at: string | null;
    delivered_at: string | null;
}

interface OrderStatusHistory {
    id: number;
    from_status: string | null;
    to_status: string;
    created_at: string | null;
}

interface Order {
    id: number;
    order_number: string;
    order_status: string;
    payment_status: string;
    fulfillment_status: string;
    subtotal: number;
    discount_total: number;
    shipping_total: number;
    tax_total: number;
    fee_total: number;
    grand_total: number;
    placed_at: string | null;
    items: OrderItem[];
    payments: OrderPayment[];
    shipping_address: {
        recipient: string;
        phone: string;
        address_line1: string;
        address_line2: string | null;
        city: string;
        province: string;
        postal_code: string;
        country: string;
    } | null;
    shipments: OrderShipment[];
    status_histories: OrderStatusHistory[];
}

interface ShowProps {
    order: Order;
}

const TIMELINE = ['confirmed', 'processing', 'packed', 'shipped', 'completed'];

function formatDate(value: string | null): string {
    if (!value) return 'Tanggal belum tersedia';
    return new Date(value).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function OrdersShow({ order }: ShowProps) {
    const currentStep = TIMELINE.indexOf(order.order_status);
    const isCancelled = ['cancelled', 'refunded'].includes(order.order_status);
    const primaryPayment = order.payments[0] ?? null;

    return (
        <AccountLayout title={`Pesanan ${order.order_number}`}>
            <Head title={`${order.order_number} — Vortix Gaming Store`} />

            <div className="space-y-5">
                <Link href="/account/orders" className="inline-flex items-center gap-2 text-sm font-semibold text-vgs-silver-muted hover:text-vgs-blue-electric">
                    ← Kembali ke Pesanan Saya
                </Link>

                <section className="rounded-2xl border border-vgs-gray-border bg-vgs-black-surface p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="text-xs text-vgs-silver-muted">Nomor Pesanan</p>
                            <h1 className="mt-1 font-mono text-xl font-bold text-vgs-blue-electric">{order.order_number}</h1>
                            <p className="mt-1 text-xs text-vgs-silver-muted">{formatDate(order.placed_at)}</p>
                        </div>
                        <OrderStatusBadge type="order" status={order.order_status} className="self-start" />
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <InfoRow label="Pembayaran" value={paymentStatusLabel(order.payment_status)} />
                        <InfoRow label="Pengiriman" value={FULFILLMENT_STATUS_LABELS[order.fulfillment_status] ?? order.fulfillment_status} />
                    </div>
                </section>

                <section className="rounded-2xl border border-vgs-gray-border bg-vgs-black-surface p-5 sm:p-6">
                    <h2 className="font-display text-lg font-bold text-vgs-silver-bright">Status Pesanan</h2>
                    {isCancelled ? (
                        <div className="mt-4 rounded-xl border border-vgs-danger/30 bg-vgs-danger/10 p-4 text-sm text-vgs-danger">
                            Pesanan ini berstatus {orderStatusLabel(order.order_status).toLowerCase()}.
                        </div>
                    ) : (
                        <div className="mt-5 grid grid-cols-5 gap-1">
                            {TIMELINE.map((status, index) => {
                                const reached = currentStep >= index;
                                return (
                                    <div key={status} className="text-center">
                                        <div className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold ${reached ? 'border-vgs-blue-electric bg-vgs-blue-electric text-white' : 'border-vgs-gray-border text-vgs-silver-muted'}`}>
                                            {index + 1}
                                        </div>
                                        <p className={`mt-2 text-[10px] sm:text-xs ${reached ? 'font-semibold text-vgs-blue-electric' : 'text-vgs-silver-muted'}`}>{orderStatusLabel(status)}</p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                <section className="rounded-2xl border border-vgs-gray-border bg-vgs-black-surface p-5 sm:p-6">
                    <h2 className="font-display text-lg font-bold text-vgs-silver-bright">Produk yang Dibeli</h2>
                    <div className="mt-5 divide-y divide-vgs-gray-border">
                        {order.items.map((item) => (
                            <div key={item.id ?? `${item.sku ?? item.product_name}-${item.unit_price}-${item.quantity}`} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-vgs-gray-border bg-vgs-black-void p-1">
                                    {item.image ? <img src={item.image} alt="" className="h-full w-full object-contain" /> : <span className="text-[10px] text-vgs-silver-muted">VGS</span>}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-vgs-silver-bright">{item.product_name}</p>
                                    {item.variant_name && <p className="mt-1 text-xs text-vgs-silver-muted">{item.variant_name}</p>}
                                    <p className="mt-1 text-xs text-vgs-silver-muted">{item.quantity} × {formatRupiah(item.unit_price)}</p>
                                </div>
                                <p className="shrink-0 text-sm font-bold text-vgs-silver-bright">{formatRupiah(item.total)}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="grid gap-5 lg:grid-cols-2">
                    <section className="rounded-2xl border border-vgs-gray-border bg-vgs-black-surface p-5 sm:p-6">
                        <h2 className="font-display text-lg font-bold text-vgs-silver-bright">Alamat Pengiriman</h2>
                        {order.shipping_address ? (
                            <div className="mt-4 space-y-1 text-sm text-vgs-silver-muted">
                                <p className="font-semibold text-vgs-silver-bright">{order.shipping_address.recipient}</p>
                                <p>{order.shipping_address.phone}</p>
                                <p>{order.shipping_address.address_line1}</p>
                                {order.shipping_address.address_line2 && <p>{order.shipping_address.address_line2}</p>}
                                <p>{order.shipping_address.city}, {order.shipping_address.province} {order.shipping_address.postal_code}</p>
                                <p>{order.shipping_address.country}</p>
                            </div>
                        ) : <p className="mt-4 text-sm text-vgs-silver-muted">Alamat pengiriman tidak tersedia.</p>}
                    </section>

                    <section className="rounded-2xl border border-vgs-gray-border bg-vgs-black-surface p-5 sm:p-6">
                        <h2 className="font-display text-lg font-bold text-vgs-silver-bright">Ringkasan Biaya</h2>
                        <div className="mt-4 space-y-3 text-sm">
                            <CostRow label="Subtotal" value={formatRupiah(order.subtotal)} />
                            <CostRow label="Diskon" value={`-${formatRupiah(order.discount_total)}`} valueClass="text-vgs-success" />
                            <CostRow label="Ongkir" value={formatRupiah(order.shipping_total)} />
                            <CostRow label="Pajak" value={formatRupiah(order.tax_total)} />
                            <CostRow label="Biaya lainnya" value={formatRupiah(order.fee_total)} />
                            <div className="flex items-center justify-between border-t border-vgs-gray-border pt-3 font-bold">
                                <span className="text-vgs-silver-bright">Total</span>
                                <span className="text-lg text-vgs-blue-electric">{formatRupiah(order.grand_total)}</span>
                            </div>
                        </div>
                    </section>
                </div>

                {primaryPayment && (
                    <section className="rounded-2xl border border-vgs-gray-border bg-vgs-black-surface p-5 sm:p-6">
                        <h2 className="font-display text-lg font-bold text-vgs-silver-bright">Informasi Pembayaran</h2>
                        <div className="mt-4 space-y-2 text-sm">
                            <PaymentRow label="Metode" value={primaryPayment.method} />
                            <PaymentRow label="Status" value={PAYMENT_STATUS_LABELS[primaryPayment.status] ?? primaryPayment.status} />
                            {primaryPayment.paid_at && <PaymentRow label="Dibayar" value={formatDate(primaryPayment.paid_at)} />}
                        </div>
                    </section>
                )}

                {order.shipments.length > 0 && (
                    <section className="rounded-2xl border border-vgs-gray-border bg-vgs-black-surface p-5 sm:p-6">
                        <h2 className="font-display text-lg font-bold text-vgs-silver-bright">Informasi Pengiriman</h2>
                        <div className="mt-4 space-y-3">
                            {order.shipments.map((shipment) => (
                                <div key={shipment.id} className="rounded-xl border border-vgs-gray-border bg-vgs-black-elevated/50 p-4 text-sm">
                                    <div className="flex flex-wrap justify-between gap-2">
                                        <span className="font-semibold text-vgs-silver-bright">{shipment.courier || 'Kurir belum ditentukan'}</span>
                                        <span className="text-vgs-silver-muted">{shipment.status}</span>
                                    </div>
                                    {shipment.tracking_number && <p className="mt-2 text-vgs-blue-electric">Nomor resi: {shipment.tracking_number}</p>}
                                    {shipment.shipped_at && <p className="mt-1 text-xs text-vgs-silver-muted">Dikirim {formatDate(shipment.shipped_at)}</p>}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {order.status_histories.length > 0 && (
                    <section className="rounded-2xl border border-vgs-gray-border bg-vgs-black-surface p-5 sm:p-6">
                        <h2 className="font-display text-lg font-bold text-vgs-silver-bright">Riwayat Status</h2>
                        <ol className="mt-4 space-y-3">
                            {order.status_histories.map((history) => (
                                <li key={history.id} className="flex justify-between gap-4 rounded-xl border border-vgs-gray-border bg-vgs-black-elevated/50 p-4 text-sm">
                                    <span className="font-semibold text-vgs-silver-bright">{orderStatusLabel(history.to_status)}</span>
                                    <span className="text-xs text-vgs-silver-muted">{formatDate(history.created_at)}</span>
                                </li>
                            ))}
                        </ol>
                    </section>
                )}
            </div>
        </AccountLayout>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return <div className="rounded-xl border border-vgs-gray-border bg-vgs-black-elevated/50 p-3"><p className="text-xs text-vgs-silver-muted">{label}</p><p className="mt-1 text-sm font-semibold text-vgs-silver-bright">{value}</p></div>;
}

function CostRow({ label, value, valueClass = 'text-vgs-silver-bright' }: { label: string; value: string; valueClass?: string }) {
    return <div className="flex items-center justify-between gap-4"><span className="text-vgs-silver-muted">{label}</span><span className={valueClass}>{value}</span></div>;
}

function PaymentRow({ label, value }: { label: string; value: string }) {
    return <div className="flex items-center justify-between gap-4"><span className="text-vgs-silver-muted">{label}</span><span className="font-semibold text-vgs-silver-bright">{value}</span></div>;
}
