import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { OrderStatusBadge } from '@/components/admin/orders/OrderStatusBadge';
import { OrderItemsTable } from '@/components/admin/orders/OrderItemsTable';
import { OrderStatusTimeline } from '@/components/admin/orders/OrderStatusTimeline';
import {
    getNextStatuses,
    orderStatusLabel,
} from '@/components/admin/orders/orderStatus';
import { formatRupiah } from '@/lib/format';
import type { AdminPageProps } from '@/types/admin';
import {
    type OrderDetail,
    type OrderNote,
    type PaymentStatus,
} from '@/types/orders';

interface OrdersShowProps extends AdminPageProps {
    order: OrderDetail;
}

function formatDateTime(value: string | null): string {
    if (!value) return '—';
    return new Date(value).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
    qris: 'QRIS',
    bank_transfer: 'Transfer Bank',
    ewallet: 'E-Wallet',
    cod: 'COD',
    credit_card: 'Kartu Kredit',
};

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
    unpaid: 'Belum Bayar',
    pending: 'Menunggu Bayar',
    paid: 'Lunas',
    failed: 'Gagal',
    expired: 'Kadaluarsa',
    partially_refunded: 'Refund Sebagian',
    refunded: 'Refund',
};

function formatAddressLine(address: {
    address_line1: string;
    address_line2?: string | null;
    city: string;
    province?: string | null;
    postal_code?: string | null;
    country?: string | null;
}): string {
    const parts = [address.address_line1];
    if (address.address_line2) parts.push(address.address_line2);
    parts.push(address.city);
    if (address.province) parts.push(address.province);
    if (address.postal_code) parts.push(address.postal_code);
    return parts.join(', ');
}

export default function OrdersShow() {
    const { order, flash, errors } = usePage<OrdersShowProps>().props;

    const [statusDraft, setStatusDraft] = useState<string>('');
    const [statusNotes, setStatusNotes] = useState('');
    const [submittingStatus, setSubmittingStatus] = useState(false);

    const [noteDraft, setNoteDraft] = useState('');
    const [noteVisibility, setNoteVisibility] = useState<'internal' | 'customer'>('internal');
    const [submittingNote, setSubmittingNote] = useState(false);

    const [cancelOpen, setCancelOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [submittingCancel, setSubmittingCancel] = useState(false);

    if (!order) {
        return (
            <AdminLayout title="Detail Order">
                <Head title="Detail Order" />
                <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6">
                    <div className="rounded-2xl bg-vgs-black-surface border border-vgs-gray-border p-10 text-center">
                        <p className="text-vgs-silver-mid">Data order tidak ditemukan.</p>
                        <Link
                            href="/admin/orders"
                            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-vgs-blue-electric hover:underline"
                        >
                            ← Kembali ke daftar order
                        </Link>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    const nextStatuses = getNextStatuses(order.order_status);
    const isTerminal = nextStatuses.length === 0;
    const statusError = typeof errors?.status === 'string' ? errors.status : null;
    const noteError = typeof errors?.note === 'string' ? errors.note : null;

    const handleChangeStatus = () => {
        if (!statusDraft) return;
        setSubmittingStatus(true);
        router.patch(`/admin/orders/${order.id}/status`, {
            status: statusDraft,
            notes: statusNotes,
        }, {
            preserveScroll: true,
            onStart: () => {},
            onFinish: () => {
                setSubmittingStatus(false);
                setStatusDraft('');
                setStatusNotes('');
            },
        });
    };

    const handleAddNote = () => {
        if (!noteDraft.trim()) return;
        setSubmittingNote(true);
        router.post(`/admin/orders/${order.id}/notes`, {
            note: noteDraft,
            visibility: noteVisibility,
        }, {
            preserveScroll: true,
            onFinish: () => {
                setSubmittingNote(false);
                setNoteDraft('');
            },
        });
    };

    const handleCancelOrder = () => {
        setSubmittingCancel(true);
        router.post(`/admin/orders/${order.id}/cancel`, {
            reason: cancelReason.trim() || 'Dibatalkan oleh Admin',
        }, {
            preserveScroll: true,
            onFinish: () => {
                setSubmittingCancel(false);
                setCancelOpen(false);
                setCancelReason('');
            },
        });
    };

    const notes: OrderNote[] = order.notes ?? [];

    return (
        <AdminLayout title={`Order ${order.order_number}`}>
            <Head title={`Detail Order ${order.order_number}`} />

            <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6">
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

                {/* Header */}
                <div>
                    <Link
                        href="/admin/orders"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-vgs-silver-mid hover:text-vgs-blue-electric transition-colors focus-visible:outline-none"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Orders
                    </Link>
                    <h2 className="mt-3 text-xl sm:text-2xl font-display font-bold text-vgs-silver-bright">
                        {order.order_number}
                    </h2>
                    <p className="text-sm text-vgs-silver-mid mt-1">
                        Dibuat pada {formatDateTime(order.placed_at ?? order.created_at)}
                    </p>
                    {/* Badge status TERPISAH — tiap status independen */}
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <OrderStatusBadge type="order" status={order.order_status} showType />
                        <OrderStatusBadge type="payment" status={order.payment_status} showType />
                        <OrderStatusBadge type="fulfillment" status={order.fulfillment_status} showType />
                    </div>
                </div>

                {/* Panel Aksi Admin */}
                <div className="rounded-2xl bg-vgs-black-surface border border-vgs-gray-border p-5">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-vgs-silver-muted mb-4">
                        Aksi Admin
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Ubah status */}
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-vgs-silver-mid block mb-1.5">
                                Ubah Status Order
                            </label>
                            {isTerminal ? (
                                <p className="text-sm text-vgs-silver-mid">
                                    Status saat ini{' '}
                                    <span className="font-semibold text-vgs-silver-bright">
                                        {orderStatusLabel(order.order_status)}
                                    </span>{' '}
                                    adalah status terminal (tidak bisa diubah lagi).
                                </p>
                            ) : (
                                <>
                                    <select
                                        value={statusDraft}
                                        onChange={(e) => setStatusDraft(e.target.value)}
                                        className="w-full min-h-[44px] bg-vgs-black-surface text-vgs-silver-bright text-sm rounded-xl px-4 py-3 border border-vgs-gray-border focus:outline-none focus:border-vgs-blue-electric focus:ring-2 focus:ring-vgs-blue-electric/30"
                                    >
                                        <option value="">Pilih status tujuan…</option>
                                        {nextStatuses.map((s) => (
                                            <option key={s} value={s}>
                                                {orderStatusLabel(s)}
                                            </option>
                                        ))}
                                    </select>
                                    <textarea
                                        value={statusNotes}
                                        onChange={(e) => setStatusNotes(e.target.value)}
                                        placeholder="Alasan perubahan status (wajib diisi)…"
                                        rows={3}
                                        className="mt-3 w-full bg-vgs-black-surface text-vgs-silver-bright placeholder:text-vgs-silver-muted text-sm rounded-xl px-4 py-3 border border-vgs-gray-border focus:outline-none focus:border-vgs-blue-electric focus:ring-2 focus:ring-vgs-blue-electric/30 min-h-[80px]"
                                    />
                                    {statusError && (
                                        <p className="mt-1.5 text-xs text-vgs-danger">{statusError}</p>
                                    )}
                                    <Button
                                        variant="primary"
                                        size="md"
                                        className="mt-3"
                                        disabled={!statusDraft || !statusNotes.trim()}
                                        loading={submittingStatus}
                                        onClick={handleChangeStatus}
                                    >
                                        Simpan Perubahan Status
                                    </Button>
                                </>
                            )}

                            {/* Batalkan order */}
                            <div className="mt-6 pt-5 border-t border-vgs-gray-border">
                                <Button
                                    variant="danger"
                                    size="md"
                                    disabled={isTerminal}
                                    onClick={() => setCancelOpen(true)}
                                >
                                    Batalkan Order
                                </Button>
                                <p className="mt-1.5 text-xs text-vgs-silver-muted">
                                    Pesanan yang dibatalkan akan melepas reservasi stok.
                                </p>
                            </div>
                        </div>

                        {/* Tambah catatan internal */}
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-vgs-silver-mid block mb-1.5">
                                Tambah Catatan Internal
                            </label>
                            <textarea
                                value={noteDraft}
                                onChange={(e) => setNoteDraft(e.target.value)}
                                placeholder="Tulis catatan internal (tidak terlihat customer)…"
                                rows={3}
                                className="w-full bg-vgs-black-surface text-vgs-silver-bright placeholder:text-vgs-silver-muted text-sm rounded-xl px-4 py-3 border border-vgs-gray-border focus:outline-none focus:border-vgs-blue-electric focus:ring-2 focus:ring-vgs-blue-electric/30 min-h-[80px]"
                            />
                            <div className="mt-3 flex items-center gap-3">
                                <div className="w-48">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-vgs-silver-mid block mb-1.5">
                                        Visibilitas
                                    </label>
                                    <select
                                        value={noteVisibility}
                                        onChange={(e) =>
                                            setNoteVisibility(e.target.value as 'internal' | 'customer')
                                        }
                                        className="w-full min-h-[44px] bg-vgs-black-surface text-vgs-silver-bright text-sm rounded-xl px-4 py-3 border border-vgs-gray-border focus:outline-none focus:border-vgs-blue-electric focus:ring-2 focus:ring-vgs-blue-electric/30"
                                    >
                                        <option value="internal">Internal</option>
                                        <option value="customer">Visible ke Customer</option>
                                    </select>
                                </div>
                                <Button
                                    variant="secondary"
                                    size="md"
                                    className="mt-5"
                                    disabled={!noteDraft.trim()}
                                    loading={submittingNote}
                                    onClick={handleAddNote}
                                >
                                    Simpan Catatan
                                </Button>
                            </div>
                            {noteError && <p className="mt-1.5 text-xs text-vgs-danger">{noteError}</p>}
                        </div>
                    </div>
                </div>

                {/* Info customer & alamat */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <div className="rounded-2xl bg-vgs-black-surface border border-vgs-gray-border p-5">
                        <h3 className="text-xs font-mono uppercase tracking-widest text-vgs-silver-muted mb-3">
                            Customer
                        </h3>
                        <p className="font-semibold text-vgs-silver-bright">{order.customer.name}</p>
                        <p className="text-xs font-mono text-vgs-silver-muted mt-1">
                            {order.contact_email}
                        </p>
                        <p className="text-xs font-mono text-vgs-silver-muted mt-0.5">
                            {order.contact_phone ?? '—'}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-vgs-black-surface border border-vgs-gray-border p-5">
                        <h3 className="text-xs font-mono uppercase tracking-widest text-vgs-silver-muted mb-3">
                            Alamat Pengiriman
                        </h3>
                        {order.shipping_address ? (
                            <>
                                <p className="text-sm font-semibold text-vgs-silver-bright">
                                    {order.shipping_address.recipient}
                                </p>
                                <p className="text-xs font-mono text-vgs-silver-mid mt-1">
                                    {formatAddressLine(order.shipping_address)}
                                </p>
                                <p className="text-xs font-mono text-vgs-silver-muted mt-1">
                                    Telp: {order.shipping_address.phone ?? '—'}
                                </p>
                            </>
                        ) : (
                            <p className="text-sm text-vgs-silver-mid">Tidak tersedia.</p>
                        )}
                    </div>

                    <div className="rounded-2xl bg-vgs-black-surface border border-vgs-gray-border p-5">
                        <h3 className="text-xs font-mono uppercase tracking-widest text-vgs-silver-muted mb-3">
                            Alamat Penagihan
                        </h3>
                        {order.billing_address ? (
                            <>
                                <p className="text-sm font-semibold text-vgs-silver-bright">
                                    {order.billing_address.recipient}
                                </p>
                                <p className="text-xs font-mono text-vgs-silver-mid mt-1">
                                    {formatAddressLine(order.billing_address)}
                                </p>
                                <p className="text-xs font-mono text-vgs-silver-muted mt-1">
                                    Telp: {order.billing_address.phone ?? '—'}
                                </p>
                            </>
                        ) : (
                            <p className="text-sm text-vgs-silver-mid">
                                Sama dengan alamat pengiriman.
                            </p>
                        )}
                    </div>
                </div>

                {/* Item pesanan + ringkasan total */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
                    <div className="lg:col-span-2 rounded-2xl bg-vgs-black-surface border border-vgs-gray-border overflow-hidden">
                        <div className="px-6 py-4 border-b border-vgs-gray-border">
                            <h3 className="text-xs font-mono uppercase tracking-widest text-vgs-silver-muted">
                                Item Pesanan
                            </h3>
                        </div>
                        <OrderItemsTable items={order.items} />
                    </div>

                    <div className="rounded-2xl bg-vgs-black-surface border border-vgs-gray-border p-5">
                        <h3 className="text-xs font-mono uppercase tracking-widest text-vgs-silver-muted mb-4">
                            Ringkasan Total
                        </h3>
                        <dl className="flex flex-col gap-2.5 text-sm">
                            <div className="flex items-center justify-between">
                                <dt className="text-vgs-silver-mid">Subtotal</dt>
                                <dd className="font-mono text-vgs-silver-bright">
                                    {formatRupiah(order.subtotal)}
                                </dd>
                            </div>
                            {order.discount_total > 0 && (
                                <div className="flex items-center justify-between">
                                    <dt className="text-vgs-silver-mid">Diskon</dt>
                                    <dd className="font-mono text-vgs-danger">
                                        -{formatRupiah(order.discount_total)}
                                    </dd>
                                </div>
                            )}
                            <div className="flex items-center justify-between">
                                <dt className="text-vgs-silver-mid">Ongkir</dt>
                                <dd className="font-mono text-vgs-silver-bright">
                                    {formatRupiah(order.shipping_total)}
                                </dd>
                            </div>
                            {order.tax_total > 0 && (
                                <div className="flex items-center justify-between">
                                    <dt className="text-vgs-silver-mid">Pajak</dt>
                                    <dd className="font-mono text-vgs-silver-bright">
                                        {formatRupiah(order.tax_total)}
                                    </dd>
                                </div>
                            )}
                            {order.fee_total > 0 && (
                                <div className="flex items-center justify-between">
                                    <dt className="text-vgs-silver-mid">Biaya Lain</dt>
                                    <dd className="font-mono text-vgs-silver-bright">
                                        {formatRupiah(order.fee_total)}
                                    </dd>
                                </div>
                            )}
                            <div className="mt-2 pt-3 border-t border-vgs-gray-border flex items-center justify-between">
                                <dt className="font-semibold text-vgs-silver-bright">Grand Total</dt>
                                <dd className="font-mono font-extrabold text-vgs-blue-electric">
                                    {formatRupiah(order.grand_total)}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* Timeline status + pembayaran */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
                    <div className="rounded-2xl bg-vgs-black-surface border border-vgs-gray-border p-5">
                        <h3 className="text-xs font-mono uppercase tracking-widest text-vgs-silver-muted mb-4">
                            Riwayat Status
                        </h3>
                        <OrderStatusTimeline histories={order.status_histories} />
                    </div>

                    <div className="rounded-2xl bg-vgs-black-surface border border-vgs-gray-border p-5">
                        <h3 className="text-xs font-mono uppercase tracking-widest text-vgs-silver-muted mb-4">
                            Pembayaran
                        </h3>
                        {(order.payments ?? []).length === 0 ? (
                            <p className="text-sm text-vgs-silver-mid">Belum ada pembayaran.</p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {(order.payments ?? []).map((payment) => (
                                    <div
                                        key={payment.id}
                                        className="rounded-xl border border-vgs-gray-border bg-vgs-black-void/40 p-4 flex flex-col gap-1.5"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="font-semibold text-vgs-silver-bright">
                                                {PAYMENT_METHOD_LABELS[payment.method] ?? payment.method}
                                            </span>
                                            <OrderStatusBadge
                                                type="payment"
                                                status={payment.status}
                                                label={PAYMENT_STATUS_LABELS[payment.status as PaymentStatus] ?? payment.status}
                                            />
                                        </div>
                                        <p className="text-xs font-mono text-vgs-silver-muted">
                                            {payment.provider ? `${payment.provider} • ` : ''}
                                            {payment.provider_reference ?? '—'}
                                        </p>
                                        <p className="font-mono font-bold text-vgs-silver-bright">
                                            {formatRupiah(payment.amount)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Catatan internal */}
                <div className="rounded-2xl bg-vgs-black-surface border border-vgs-gray-border p-5">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-vgs-silver-muted mb-4">
                        Catatan
                    </h3>
                    {notes.length === 0 ? (
                        <p className="text-sm text-vgs-silver-mid">Belum ada catatan internal.</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {notes.map((note) => (
                                <div
                                    key={note.id}
                                    className="rounded-xl border border-vgs-gray-border bg-vgs-black-void/40 p-4"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                                            {note.visibility === 'internal' ? 'Internal' : 'Customer'}
                                        </span>
                                        <span className="text-[11px] font-mono text-vgs-silver-muted">
                                            {formatDateTime(note.created_at)}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm text-vgs-silver-bright">{note.note}</p>
                                    <p className="mt-1 text-[11px] font-mono text-vgs-silver-muted">
                                        Oleh: {note.created_by?.name ?? 'Sistem'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Dialog konfirmasi pembatalan */}
            <Modal
                isOpen={cancelOpen}
                onClose={() => setCancelOpen(false)}
                title="Batalkan Order?"
                size="sm"
            >
                <p className="text-sm text-vgs-silver-mid">
                    Pesanan <span className="font-mono font-semibold text-vgs-silver-bright">{order.order_number}</span>{' '}
                    akan dibatalkan dan reservasi stok dilepas. Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="mt-4">
                    <Input
                        label="Alasan Pembatalan"
                        placeholder="Misal: stok barang kosong / rusak saat QC"
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                    />
                </div>
                <div className="mt-5 flex items-center justify-end gap-3">
                    <Button variant="secondary" onClick={() => setCancelOpen(false)}>
                        Batal
                    </Button>
                    <Button
                        variant="danger"
                        loading={submittingCancel}
                        disabled={submittingCancel}
                        onClick={handleCancelOrder}
                    >
                        Ya, Batalkan Order
                    </Button>
                </div>
            </Modal>
        </AdminLayout>
    );
}