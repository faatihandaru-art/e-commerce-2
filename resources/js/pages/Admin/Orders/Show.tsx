import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import type { AdminPageProps } from '@/types/admin';
import OrderStatusBadge from '@/components/admin/orders/OrderStatusBadge';
import OrderItemsTable, { type OrderItem } from '@/components/admin/orders/OrderItemsTable';
import OrderStatusTimeline, {
    type StatusHistoryEntry,
} from '@/components/admin/orders/OrderStatusTimeline';
import { formatRupiah } from '@/lib/format';
import { ORDER_STATUS_LABELS } from '@/components/orders/orderStatus';

interface OrderAddress {
    id: number;
    recipient: string;
    phone: string;
    address_line1: string;
    address_line2: string | null;
    city: string;
    province: string;
    postal_code: string;
    country: string;
}

interface OrderCustomer {
    id: number;
    name: string;
    email: string;
    phone: string;
}

interface OrderNote {
    id: number;
    visibility: 'internal' | 'customer';
    note: string;
    created_by: { id: number; name: string } | null;
    created_at: string | null;
}

interface OrderPayment {
    id: number;
    method: string;
    provider: string | null;
    amount: number;
    currency: string;
    status: string;
    paid_at: string | null;
    expires_at: string | null;
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

interface AdminOrderDetail {
    id: number;
    order_number: string;
    customer: OrderCustomer;
    contact_email: string | null;
    contact_phone: string | null;
    currency: string;
    subtotal: number;
    discount_total: number;
    shipping_total: number;
    tax_total: number;
    fee_total: number;
    grand_total: number;
    order_status: string;
    payment_status: string;
    fulfillment_status: string;
    placed_at: string | null;
    updated_at: string | null;
    items: OrderItem[];
    shipping_address: OrderAddress | null;
    billing_address: OrderAddress | null;
    status_histories: StatusHistoryEntry[];
    payments: OrderPayment[];
    shipments: OrderShipment[];
    notes: OrderNote[];
}

interface OrdersShowProps extends AdminPageProps {
    order: AdminOrderDetail;
}

// Transitions = sama dengan backend OrderStatus::allowedNextStatuses()
const ALLOWED_NEXT: Record<string, string[]> = {
    pending_payment: ['confirmed', 'cancelled'],
    confirmed: ['processing', 'cancelled', 'refunded'],
    processing: ['packed', 'cancelled', 'refunded'],
    packed: ['shipped', 'cancelled', 'refunded'],
    shipped: ['completed', 'refunded'],
    completed: ['refunded'],
    cancelled: [],
    refunded: [],
};

function formatDate(value: string | null): string {
    if (!value) return 'Tanggal belum tersedia';
    return new Date(value).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function OrdersShow() {
    const { order, flash } = usePage<OrdersShowProps>().props;

    const allowedNext = ALLOWED_NEXT[order.order_status] ?? [];
    const isTerminal = order.order_status === 'cancelled' || order.order_status === 'refunded';

    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [noteModalOpen, setNoteModalOpen] = useState(false);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);

    const statusForm = useForm<{ status: string; notes: string }>({
        status: allowedNext[0] ?? '',
        notes: '',
    });

    const noteForm = useForm<{ note: string; visibility: 'internal' | 'customer' }>({
        note: '',
        visibility: 'internal',
    });

    const cancelForm = useForm<{ reason: string }>({
        reason: 'Dibatalkan oleh Admin',
    });

    const handleStatusSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!statusForm.data.notes.trim()) {
            statusForm.setError('notes', 'Alasan perubahan wajib diisi.');
            return;
        }
        statusForm.patch(`/admin/orders/${order.id}/status`, {
            preserveScroll: true,
            onSuccess: () => setStatusModalOpen(false),
        });
    };

    const handleNoteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        noteForm.post(`/admin/orders/${order.id}/notes`, {
            preserveScroll: true,
            onSuccess: () => {
                setNoteModalOpen(false);
                noteForm.reset();
            },
        });
    };

    const handleCancelSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        cancelForm.post(`/admin/orders/${order.id}/cancel`, {
            preserveScroll: true,
            onSuccess: () => setCancelModalOpen(false),
        });
    };

    const primaryPayment = order.payments?.[0] ?? null;
    const internalNotes: OrderNote[] = order.notes?.filter((n) => n.visibility === 'internal') ?? [];

    return (
        <AdminLayout title={`Order ${order.order_number}`}>
            <Head title={`${order.order_number} — Detail Order`} />

            <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6">
                <Link
                    href="/admin/orders"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-vgs-silver-muted hover:text-vgs-blue-electric"
                >
                    ← Kembali ke Orders
                </Link>

                {flash?.success && (
                    <p className="text-sm text-vgs-success border border-vgs-success/30 bg-vgs-success/10 rounded-lg px-3 py-2">
                        {flash.success}
                    </p>
                )}
                {flash?.error && (
                    <p className="text-sm text-vgs-danger border border-vgs-danger/30 bg-vgs-danger/10 rounded-lg px-3 py-2">
                        {flash.error}
                    </p>
                )}

                {/* Header + status badges */}
                <section className="rounded-2xl border border-vgs-gray-border bg-vgs-black-surface p-5 sm:p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <p className="text-xs text-vgs-silver-muted">Nomor Order</p>
                            <h1 className="mt-1 font-mono text-xl font-bold text-vgs-blue-electric">
                                {order.order_number}
                            </h1>
                            <p className="mt-1 text-xs text-vgs-silver-muted">
                                Dipesan {formatDate(order.placed_at)}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs text-vgs-silver-muted mr-1">Order</span>
                            <OrderStatusBadge type="order" status={order.order_status} />
                            <span className="text-xs text-vgs-silver-muted mr-1 ml-2">Payment</span>
                            <OrderStatusBadge type="payment" status={order.payment_status} />
                            <span className="text-xs text-vgs-silver-muted mr-1 ml-2">Fulfillment</span>
                            <OrderStatusBadge type="fulfillment" status={order.fulfillment_status} />
                        </div>
                    </div>
                </section>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Kolom kiri: item & total */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <section className="rounded-2xl border border-vgs-gray-border bg-vgs-black-surface p-5 sm:p-6">
                            <h2 className="font-display text-lg font-bold text-vgs-silver-bright">
                                Item Pesanan
                            </h2>
                            <div className="mt-4">
                                <OrderItemsTable items={order.items ?? []} showCost />
                            </div>
                        </section>

                        <section className="rounded-2xl border border-vgs-gray-border bg-vgs-black-surface p-5 sm:p-6">
                            <h2 className="font-display text-lg font-bold text-vgs-silver-bright">
                                Ringkasan Biaya
                            </h2>
                            <div className="mt-4 space-y-3 text-sm">
                                <CostRow label="Subtotal" value={formatRupiah(order.subtotal)} />
                                <CostRow
                                    label="Diskon"
                                    value={`-${formatRupiah(order.discount_total)}`}
                                    valueClass="text-vgs-success"
                                />
                                <CostRow label="Ongkir" value={formatRupiah(order.shipping_total)} />
                                <CostRow label="Pajak" value={formatRupiah(order.tax_total)} />
                                <CostRow label="Biaya lainnya" value={formatRupiah(order.fee_total)} />
                                <div className="flex items-center justify-between border-t border-vgs-gray-border pt-3 font-bold">
                                    <span className="text-vgs-silver-bright">Grand Total</span>
                                    <span className="text-lg text-vgs-blue-electric">
                                        {formatRupiah(order.grand_total)}
                                    </span>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-vgs-gray-border bg-vgs-black-surface p-5 sm:p-6">
                            <h2 className="font-display text-lg font-bold text-vgs-silver-bright">
                                Timeline Status
                            </h2>
                            <div className="mt-5">
                                <OrderStatusTimeline histories={order.status_histories ?? []} />
                            </div>
                        </section>
                    </div>

                    {/* Kolom kanan: customer & aksi */}
                    <div className="flex flex-col gap-6">
                        <section className="rounded-2xl border border-vgs-gray-border bg-vgs-black-surface p-5 sm:p-6">
                            <h2 className="font-display text-lg font-bold text-vgs-silver-bright">
                                Customer
                            </h2>
                            <div className="mt-4 space-y-3 text-sm">
                                <div>
                                    <p className="text-xs text-vgs-silver-muted">Nama</p>
                                    <p className="font-semibold text-vgs-silver-bright">
                                        {order.customer?.name ?? 'Guest'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-vgs-silver-muted">Email</p>
                                    <p className="text-vgs-silver-bright">
                                        {order.contact_email ?? order.customer?.email ?? '—'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-vgs-silver-muted">Telepon</p>
                                    <p className="text-vgs-silver-bright">
                                        {order.contact_phone ?? order.customer?.phone ?? '—'}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <AddressCard title="Alamat Pengiriman" address={order.shipping_address} />
                        <AddressCard title="Alamat Penagihan" address={order.billing_address} />

                        {primaryPayment && (
                            <section className="rounded-2xl border border-vgs-gray-border bg-vgs-black-surface p-5 sm:p-6">
                                <h2 className="font-display text-lg font-bold text-vgs-silver-bright">
                                    Pembayaran
                                </h2>
                                <div className="mt-4 space-y-3 text-sm">
                                    <div>
                                        <p className="text-xs text-vgs-silver-muted">Metode</p>
                                        <p className="font-semibold text-vgs-silver-bright uppercase">
                                            {primaryPayment.method}
                                        </p>
                                    </div>
                                    {primaryPayment.provider && (
                                        <div>
                                            <p className="text-xs text-vgs-silver-muted">Provider</p>
                                            <p className="text-vgs-silver-bright">{primaryPayment.provider}</p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-xs text-vgs-silver-muted">Nominal</p>
                                        <p className="font-bold text-vgs-blue-electric">
                                            {formatRupiah(primaryPayment.amount)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-vgs-silver-muted">Status</p>
                                        <OrderStatusBadge type="payment" status={primaryPayment.status} />
                                    </div>
                                    {primaryPayment.paid_at && (
                                        <div>
                                            <p className="text-xs text-vgs-silver-muted">Dibayar</p>
                                            <p className="text-vgs-silver-bright">
                                                {formatDate(primaryPayment.paid_at)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        <section className="rounded-2xl border border-vgs-gray-border bg-vgs-black-surface p-5 sm:p-6">
                            <h2 className="font-display text-lg font-bold text-vgs-silver-bright">
                                Catatan Internal
                            </h2>
                            <div className="mt-4 space-y-3">
                                {internalNotes.length === 0 ? (
                                    <p className="text-sm text-vgs-silver-muted">
                                        Belum ada catatan internal.
                                    </p>
                                ) : (
                                    internalNotes.map((note) => (
                                        <div
                                            key={note.id}
                                            className="rounded-xl border border-vgs-gray-border bg-vgs-black-elevated/50 p-4 text-sm"
                                        >
                                            <p className="text-vgs-silver-bright">{note.note}</p>
                                            <p className="mt-2 text-xs text-vgs-silver-muted">
                                                {note.created_by?.name ?? 'Sistem'} · {formatDate(note.created_at)}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        {/* Panel aksi */}
                        <section className="rounded-2xl border border-vgs-gray-border bg-vgs-black-surface p-5 sm:p-6">
                            <h2 className="font-display text-lg font-bold text-vgs-silver-bright">
                                Aksi Admin
                            </h2>
                            <div className="mt-4 space-y-3">
                                <Button
                                    variant="outline"
                                    block
                                    onClick={() => setStatusModalOpen(true)}
                                    disabled={isTerminal || allowedNext.length === 0}
                                >
                                    Ubah Status
                                </Button>
                                <Button variant="outline" block onClick={() => setNoteModalOpen(true)}>
                                    Tambah Catatan
                                </Button>
                                <Button
                                    variant="danger"
                                    block
                                    onClick={() => setCancelModalOpen(true)}
                                    disabled={isTerminal}
                                >
                                    Batalkan Order
                                </Button>
                            </div>
                            {isTerminal && (
                                <p className="mt-3 text-xs text-vgs-silver-muted text-center">
                                    Order dengan status {ORDER_STATUS_LABELS[order.order_status] ?? order.order_status} tidak dapat diubah.
                                </p>
                            )}
                        </section>
                    </div>
                </div>
            </div>

            {/* Modal ubah status */}
            <Modal
                isOpen={statusModalOpen}
                onClose={() => setStatusModalOpen(false)}
                title="Ubah Status Order"
                size="md"
            >
                <form onSubmit={handleStatusSubmit} className="space-y-5">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="status-select" className="text-xs font-semibold uppercase tracking-wider text-vgs-silver-mid">
                            Status Baru <span className="text-vgs-danger">*</span>
                        </label>
                        <select
                            id="status-select"
                            value={statusForm.data.status}
                            onChange={(e) => statusForm.setData('status', e.target.value)}
                            className="w-full min-h-[44px] bg-vgs-black-surface text-vgs-silver-bright text-sm rounded-xl px-4 py-3 border border-vgs-gray-border focus:outline-none focus:border-vgs-blue-electric focus:ring-2 focus:ring-vgs-blue-electric/30"
                        >
                            {allowedNext.map((s) => (
                                <option key={s} value={s}>
                                    {ORDER_STATUS_LABELS[s] ?? s}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Input
                        label="Alasan Perubahan"
                        placeholder="Wajib diisi, misalnya keterangan perubahan status…"
                        required
                        value={statusForm.data.notes}
                        onChange={(e) => statusForm.setData('notes', e.target.value)}
                        error={statusForm.errors.notes}
                    />
                    {statusForm.errors.status && (
                        <p className="text-xs text-vgs-danger">{statusForm.errors.status}</p>
                    )}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setStatusModalOpen(false)}
                            disabled={statusForm.processing}
                        >
                            Batal
                        </Button>
                        <Button type="submit" variant="primary" loading={statusForm.processing}>
                            Simpan Status
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Modal tambah catatan */}
            <Modal
                isOpen={noteModalOpen}
                onClose={() => setNoteModalOpen(false)}
                title="Tambah Catatan"
                size="md"
            >
                <form onSubmit={handleNoteSubmit} className="space-y-5">
                    <Input
                        label="Catatan"
                        placeholder="Tulis catatan untuk order ini…"
                        required
                        value={noteForm.data.note}
                        onChange={(e) => noteForm.setData('note', e.target.value)}
                        error={noteForm.errors.note}
                    />
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-vgs-silver-mid">
                            Visibilitas
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {(
                                [
                                    { value: 'internal', label: 'Internal', desc: 'Hanya admin' },
                                    { value: 'customer', label: 'Customer', desc: 'Terlihat pelanggan' },
                                ] as { value: 'internal' | 'customer'; label: string; desc: string }[]
                            ).map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => noteForm.setData('visibility', opt.value)}
                                    aria-pressed={noteForm.data.visibility === opt.value}
                                    className={`flex flex-col items-start gap-0.5 rounded-xl border px-4 py-3 text-left min-h-[44px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vgs-blue-electric ${
                                        noteForm.data.visibility === opt.value
                                            ? 'border-vgs-blue-electric bg-vgs-blue-electric/10'
                                            : 'border-vgs-gray-border bg-vgs-black-surface/60 hover:border-vgs-silver-muted/50'
                                    }`}
                                >
                                    <span className={`text-sm font-semibold ${noteForm.data.visibility === opt.value ? 'text-vgs-blue-electric' : 'text-vgs-silver-bright'}`}>
                                        {opt.label}
                                    </span>
                                    <span className="text-xs text-vgs-silver-mid">{opt.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    {noteForm.errors.visibility && (
                        <p className="text-xs text-vgs-danger">{noteForm.errors.visibility}</p>
                    )}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setNoteModalOpen(false)}
                            disabled={noteForm.processing}
                        >
                            Batal
                        </Button>
                        <Button type="submit" variant="primary" loading={noteForm.processing}>
                            Simpan Catatan
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Modal batalkan order */}
            <Modal
                isOpen={cancelModalOpen}
                onClose={() => setCancelModalOpen(false)}
                title="Batalkan Order"
                size="md"
            >
                <form onSubmit={handleCancelSubmit} className="space-y-5">
                    <p className="text-sm text-vgs-silver-mid">
                        Yakin ingin membatalkan order{' '}
                        <span className="font-mono font-bold text-vgs-blue-electric">{order.order_number}</span>
                        ? Tindakan ini akan melepas stok yang direservasi.
                    </p>
                    <Input
                        label="Alasan Pembatalan"
                        required
                        value={cancelForm.data.reason}
                        onChange={(e) => cancelForm.setData('reason', e.target.value)}
                        error={cancelForm.errors.reason}
                    />
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setCancelModalOpen(false)}
                            disabled={cancelForm.processing}
                        >
                            Tidak Jadi
                        </Button>
                        <Button type="submit" variant="danger" loading={cancelForm.processing}>
                            Ya, Batalkan
                        </Button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}

function AddressCard({ title, address }: { title: string; address: OrderAddress | null }) {
    return (
        <section className="rounded-2xl border border-vgs-gray-border bg-vgs-black-surface p-5 sm:p-6">
            <h2 className="font-display text-lg font-bold text-vgs-silver-bright">{title}</h2>
            {address ? (
                <div className="mt-4 space-y-1 text-sm text-vgs-silver-muted">
                    <p className="font-semibold text-vgs-silver-bright">{address.recipient}</p>
                    <p>{address.phone}</p>
                    <p>{address.address_line1}</p>
                    {address.address_line2 && <p>{address.address_line2}</p>}
                    <p>
                        {address.city}, {address.province} {address.postal_code}
                    </p>
                    <p>{address.country}</p>
                </div>
            ) : (
                <p className="mt-4 text-sm text-vgs-silver-muted">Tidak tersedia.</p>
            )}
        </section>
    );
}

function CostRow({
    label,
    value,
    valueClass = 'text-vgs-silver-bright',
}: {
    label: string;
    value: string;
    valueClass?: string;
}) {
    return (
        <div className="flex items-center justify-between gap-4">
            <span className="text-vgs-silver-muted">{label}</span>
            <span className={valueClass}>{value}</span>
        </div>
    );
}
