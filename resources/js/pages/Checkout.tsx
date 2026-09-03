import React, { useMemo, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useCart, getCartItemKey } from '@/context/CartContext';
import { formatRupiah } from '@/lib/format';
import {
    placeOrder,
    ApiError,
    type CheckoutAddressPayload,
    type PaymentMethodPayload,
    type PlaceOrderPayload,
    type ShippingOptionPayload,
} from '@/lib/api';

interface CheckoutPageProps {
    addresses: CheckoutAddressPayload[];
    shippingMethods: ShippingOptionPayload[];
    paymentMethods: PaymentMethodPayload[];
}

interface OrderResultInfo {
    order_number: string;
    grand_total: number;
    paymentName: string;
}

export default function Checkout() {
    const page = usePage();
    const props = (page.props ?? {}) as unknown as CheckoutPageProps;
    const addresses = props.addresses ?? [];
    const shippingMethods = props.shippingMethods ?? [];
    const paymentMethods = props.paymentMethods ?? [];

    const { items, selectedItems, selectedSubtotal, clearCart } = useCart();

    const [paymentId, setPaymentId] = useState<string>(() => paymentMethods[0]?.id ?? '');
    const [shippingId, setShippingId] = useState<number | string>(
        () => shippingMethods[0]?.id ?? ''
    );
    const [addressId, setAddressId] = useState<number | string>(
        () => addresses[0]?.id ?? ''
    );
    const [couponCode, setCouponCode] = useState('');
    const [notes, setNotes] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [placing, setPlacing] = useState(false);
    const [orderInfo, setOrderInfo] = useState<OrderResultInfo | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Inline shipping fields dipakai ketika user belum punya alamat tersimpan.
    const [newAddress, setNewAddress] = useState({
        recipient: '',
        phone: '',
        address_line1: '',
        city: '',
        province: '',
        postal_code: '',
    });

    const paymentGroups = useMemo(() => {
        const groups: { id: string; name: string; methods: PaymentMethodPayload[] }[] = [];
        paymentMethods.forEach((m) => {
            let group = groups.find((g) => g.id === m.group);
            if (!group) {
                const names: Record<string, string> = {
                    ewallet: 'E-Wallet',
                    qris: 'QRIS',
                    cod: 'Bayar di Tempat (COD)',
                    banktransfer: 'Transfer Bank',
                    virtualaccount: 'Virtual Account',
                };
                group = { id: m.group, name: names[m.group] || m.group, methods: [] };
                groups.push(group);
            }
            group.methods.push(m);
        });
        return groups;
    }, [paymentMethods]);

    const itemsToCheckout = selectedItems.length > 0 ? selectedItems : items;

    const subtotal =
        selectedItems.length > 0
            ? selectedSubtotal
            : itemsToCheckout.reduce(
                  (acc, i) =>
                      acc +
                      (i.product ? i.product.price + (i.variant?.priceModifier || 0) : 0) *
                          i.quantity,
                  0
              );

    const shipping = shippingMethods.find((o) => String(o.id) === String(shippingId));
    const shippingCost = shipping?.cost ?? 0;
    const payment = paymentMethods.find((p) => p.id === paymentId);
    const paymentFee = payment?.fee ?? 0;
    const grandTotal = subtotal + shippingCost + paymentFee;

    const selectedAddress =
        addresses.find((a) => String(a.id) === String(addressId)) || addresses[0];

    const count = itemsToCheckout.reduce((acc, i) => acc + i.quantity, 0);

    const shippingPayload = useMemo(() => {
        if (selectedAddress) {
            return {
                recipient: selectedAddress.recipient,
                phone: selectedAddress.phone,
                address_line1: selectedAddress.line,
                city: selectedAddress.city.split(',')[0]?.trim() || selectedAddress.city,
                province: selectedAddress.province,
                postal_code: selectedAddress.postal_code,
                country: selectedAddress.country ?? 'Indonesia',
            };
        }
        return {
            recipient: newAddress.recipient,
            phone: newAddress.phone,
            address_line1: newAddress.address_line1,
            city: newAddress.city,
            province: newAddress.province,
            postal_code: newAddress.postal_code,
            country: 'Indonesia',
        };
    }, [selectedAddress, newAddress]);

    const handlePlaceOrder = async () => {
        if (!payment) {
            setError('Pilih metode pembayaran terlebih dahulu.');
            return;
        }
        if (!shipping) {
            setError('Pilih metode pengiriman terlebih dahulu.');
            return;
        }
        if (!shippingPayload.recipient || !shippingPayload.address_line1 || !shippingPayload.city) {
            setError('Lengkapi alamat pengiriman terlebih dahulu.');
            return;
        }

        setPlacing(true);
        setError(null);

        const payload: PlaceOrderPayload = {
            items: itemsToCheckout.map((i) => ({
                variant_id: String(i.variantId ?? ''),
                quantity: i.quantity,
            })),
            shipping: shippingPayload,
            shipping_method_id: shipping.id,
            shipping_cost: shippingCost,
            shipping_name: shipping.name,
            payment: {
                method: payment.id,
                group: payment.group,
                fee: paymentFee,
            },
            coupon_code: couponCode.trim() || undefined,
            notes: notes.trim() || undefined,
        };

        try {
            const result = await placeOrder(payload);
            clearCart();
            setOrderInfo({
                order_number: result.order.order_number,
                grand_total: result.order.grand_total,
                paymentName: payment.name,
            });
            setShowSuccess(true);
        } catch (err) {
            setError(
                err instanceof ApiError ? err.message : 'Gagal membuat pesanan. Silakan coba lagi.'
            );
        } finally {
            setPlacing(false);
        }
    };

    return (
        <StorefrontLayout>
            <Head title="Checkout — Vortix Gaming Store" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs font-mono text-vgs-silver-muted mb-6">
                    <Link href="/" className="hover:text-vgs-silver-bright transition-colors">
                        Home
                    </Link>
                    <span>/</span>
                    <Link href="/cart" className="hover:text-vgs-silver-bright transition-colors">
                        Keranjang
                    </Link>
                    <span>/</span>
                    <span className="text-vgs-silver-bright font-medium">Checkout</span>
                </nav>

                {/* Title */}
                <div className="pb-6 mb-8 border-b border-vgs-gray-border/80">
                    <span className="text-xs font-mono font-bold text-vgs-blue-electric uppercase tracking-widest">
                        TUJUAN PEMBELIAN
                    </span>
                    <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-vgs-silver-bright tracking-wide mt-1">
                        Checkout
                    </h1>
                </div>

                {/* Coupon feedback */}
                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-vgs-danger/10 border border-vgs-danger/40 text-sm text-vgs-danger font-medium">
                        {error}
                    </div>
                )}

                {itemsToCheckout.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-16 sm:py-24 px-4 bg-vgs-black-surface/40 rounded-3xl border border-dashed border-vgs-gray-border max-w-2xl mx-auto">
                        <div className="w-20 h-20 rounded-3xl bg-vgs-black-surface border border-vgs-gray-border flex items-center justify-center text-vgs-silver-muted mb-6 shadow-xl">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h2 className="font-display font-extrabold text-2xl text-vgs-silver-bright mb-2">
                            Tidak Ada Produk untuk Di-checkout
                        </h2>
                        <p className="text-sm text-vgs-silver-muted max-w-md mb-8">
                            Centang produk yang ingin dibeli di halaman keranjang terlebih dahulu.
                        </p>
                        <Button variant="primary" size="lg" href="/cart">
                            Kembali ke Keranjang
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Left: Checkout Details */}
                        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-5">
                            {/* Steps Indicator */}
                            <div className="flex items-center gap-3 text-xs font-mono">
                                {['Alamat', 'Pembayaran', 'Selesai'].map((step, i) => (
                                    <React.Fragment key={step}>
                                        <div className="flex items-center gap-2">
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center ${i <= 1 ? 'bg-vgs-blue-electric text-white' : 'bg-vgs-black-surface text-vgs-silver-muted border border-vgs-gray-border'}`}>
                                                {i + 1}
                                            </span>
                                            <span className={i <= 1 ? 'text-vgs-silver-bright' : 'text-vgs-silver-muted'}>{step}</span>
                                        </div>
                                        {i < 2 && <span className="w-8 h-px bg-vgs-gray-border" />}
                                    </React.Fragment>
                                ))}
                            </div>

                            {/* Shipping Address */}
                            <section className="rounded-2xl bg-vgs-black-surface border border-vgs-gray-border overflow-hidden">
                                <div className="flex items-center justify-between px-5 py-4 border-b border-vgs-gray-border bg-vgs-black-elevated/60">
                                    <h2 className="font-display font-bold text-vgs-silver-bright flex items-center gap-2">
                                        <span className="text-vgs-blue-electric">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </span>
                                        Alamat Pengiriman
                                    </h2>
                                    <span className="text-[11px] font-mono text-vgs-silver-muted">
                                        {addresses.length} tersimpan
                                    </span>
                                </div>

                                <div className="p-5">
                                    {addresses.length > 0 ? (
                                        <div className="flex flex-col gap-2">
                                            {addresses.map((addr) => (
                                                <label
                                                    key={addr.id}
                                                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                                                        String(addressId) === String(addr.id)
                                                            ? 'border-vgs-blue-electric bg-vgs-blue-electric/10'
                                                            : 'border-vgs-gray-border hover:border-vgs-silver-mid/50 bg-vgs-black-void'
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="address"
                                                        value={String(addr.id)}
                                                        checked={String(addressId) === String(addr.id)}
                                                        onChange={() => setAddressId(addr.id)}
                                                        className="accent-vgs-blue-electric w-4 h-4 mt-1"
                                                    />
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-vgs-silver-bright text-sm">
                                                                {addr.recipient}
                                                            </span>
                                                            <span className="text-xs font-mono text-vgs-silver-muted">
                                                                {addr.phone}
                                                            </span>
                                                            {addr.note && (
                                                                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase text-vgs-blue-electric bg-vgs-blue-electric/10 border border-vgs-blue-electric/30">
                                                                    {addr.note}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-vgs-silver-mid mt-0.5">{addr.line}</p>
                                                        <p className="text-xs text-vgs-silver-muted">{addr.city}</p>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-3">
                                            <p className="text-xs text-vgs-silver-muted">
                                                Anda belum memiliki alamat tersimpan. Lengkapi alamat pengiriman di bawah ini.
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <Input
                                                    placeholder="Nama Penerima"
                                                    value={newAddress.recipient}
                                                    onChange={(e) =>
                                                        setNewAddress((p) => ({ ...p, recipient: e.target.value }))
                                                    }
                                                />
                                                <Input
                                                    placeholder="No. HP (08xx)"
                                                    value={newAddress.phone}
                                                    onChange={(e) =>
                                                        setNewAddress((p) => ({ ...p, phone: e.target.value }))
                                                    }
                                                />
                                                <Input
                                                    containerClassName="sm:col-span-2"
                                                    placeholder="Alamat Lengkap (Jalan, RT/RW, Kelurahan, Kecamatan)"
                                                    value={newAddress.address_line1}
                                                    onChange={(e) =>
                                                        setNewAddress((p) => ({ ...p, address_line1: e.target.value }))
                                                    }
                                                />
                                                <Input
                                                    placeholder="Kota / Kabupaten"
                                                    value={newAddress.city}
                                                    onChange={(e) =>
                                                        setNewAddress((p) => ({ ...p, city: e.target.value }))
                                                    }
                                                />
                                                <Input
                                                    placeholder="Provinsi"
                                                    value={newAddress.province}
                                                    onChange={(e) =>
                                                        setNewAddress((p) => ({ ...p, province: e.target.value }))
                                                    }
                                                />
                                                <Input
                                                    placeholder="Kode Pos"
                                                    value={newAddress.postal_code}
                                                    onChange={(e) =>
                                                        setNewAddress((p) => ({ ...p, postal_code: e.target.value }))
                                                    }
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Shipping Method */}
                            <section className="rounded-2xl bg-vgs-black-surface border border-vgs-gray-border overflow-hidden">
                                <div className="flex items-center justify-between px-5 py-4 border-b border-vgs-gray-border bg-vgs-black-elevated/60">
                                    <h2 className="font-display font-bold text-vgs-silver-bright flex items-center gap-2">
                                        <span className="text-vgs-blue-electric">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                            </svg>
                                        </span>
                                        Metode Pengiriman
                                    </h2>
                                    <span className="text-[11px] font-mono text-vgs-silver-muted">Pilih kurir</span>
                                </div>

                                <div className="p-3 flex flex-col gap-2">
                                    {shippingMethods.map((opt) => (
                                        <label
                                            key={opt.id}
                                            className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                                                String(shippingId) === String(opt.id)
                                                    ? 'border-vgs-blue-electric bg-vgs-blue-electric/10'
                                                    : 'border-vgs-gray-border hover:border-vgs-silver-mid/50 bg-vgs-black-void'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="shipping"
                                                value={String(opt.id)}
                                                checked={String(shippingId) === String(opt.id)}
                                                onChange={() => setShippingId(opt.id)}
                                                className="accent-vgs-blue-electric w-4 h-4"
                                            />
                                            <div className="w-14 h-10 rounded-lg bg-white border border-vgs-gray-border flex items-center justify-center overflow-hidden shrink-0 p-1.5">
                                                <img
                                                    src={opt.logoUrl}
                                                    alt={`Logo ${opt.name}`}
                                                    className="max-w-full max-h-full w-auto h-auto object-contain block"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="flex-1 flex items-center justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-vgs-silver-bright text-sm">{opt.name}</p>
                                                    <p className="text-xs text-vgs-silver-muted">Estimasi {opt.eta}</p>
                                                </div>
                                                <span className="font-mono font-bold text-sm text-vgs-blue-electric shrink-0">
                                                    {opt.cost === 0 ? (
                                                        <span className="text-vgs-success uppercase text-xs font-bold">GRATIS</span>
                                                    ) : (
                                                        formatRupiah(opt.cost)
                                                    )}
                                                </span>
                                            </div>
                                        </label>
                                    ))}
                                    {shippingMethods.length === 0 && (
                                        <p className="p-3 text-sm text-vgs-silver-muted">
                                            Belum ada metode pengiriman yang tersedia.
                                        </p>
                                    )}
                                </div>
                            </section>

                            {/* Payment Methods */}
                            <section className="rounded-2xl bg-vgs-black-surface border border-vgs-gray-border overflow-hidden">
                                <div className="flex items-center justify-between px-5 py-4 border-b border-vgs-gray-border bg-vgs-black-elevated/60">
                                    <h2 className="font-display font-bold text-vgs-silver-bright flex items-center gap-2">
                                        <span className="text-vgs-blue-electric">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h2m-2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2zm14-12V9a2 2 0 00-2-2h-2" />
                                            </svg>
                                        </span>
                                        Metode Pembayaran
                                    </h2>
                                    <span className="text-[11px] font-mono text-vgs-silver-muted">Pilih pembayaran</span>
                                </div>

                                <div className="p-3 flex flex-col gap-3">
                                    {paymentGroups.map((group) => (
                                        <div key={group.id}>
                                            <p className="px-2 pb-2 text-[11px] font-mono font-bold uppercase tracking-wider text-vgs-silver-muted">
                                                {group.name}
                                            </p>
                                            <div className="flex flex-col gap-2">
                                                {group.methods.map((m) => (
                                                    <label
                                                        key={m.id}
                                                        className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                                                            paymentId === m.id
                                                                ? 'border-vgs-blue-electric bg-vgs-blue-electric/10'
                                                                : 'border-vgs-gray-border hover:border-vgs-silver-mid/50 bg-vgs-black-void'
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="payment"
                                                            value={m.id}
                                                            checked={paymentId === m.id}
                                                            onChange={() => setPaymentId(m.id)}
                                                            className="accent-vgs-blue-electric w-4 h-4"
                                                        />
                                                        <div className="w-15 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
                                                            {m.logo ? (
                                                                <img
                                                                    src={m.logo}
                                                                    alt={`Logo ${m.name}`}
                                                                    className="w-30 h-31 object-contain block"
                                                                    loading="lazy"
                                                                />
                                                            ) : (
                                                                <span className="text-xs font-bold text-vgs-black-void">COD</span>
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-vgs-silver-bright text-sm">{m.name}</p>
                                                            {m.desc && <p className="text-xs text-vgs-silver-muted">{m.desc}</p>}
                                                        </div>
                                                        {m.fee > 0 && (
                                                            <span className="text-xs font-mono text-vgs-silver-muted">
                                                                {formatRupiah(m.fee)}
                                                            </span>
                                                        )}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    {paymentMethods.length === 0 && (
                                        <p className="p-3 text-sm text-vgs-silver-muted">
                                            Belum ada metode pembayaran yang tersedia.
                                        </p>
                                    )}
                                </div>
                            </section>

                            {/* Order Notes & Coupon */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <section className="rounded-2xl bg-vgs-black-surface border border-vgs-gray-border p-5">
                                    <h2 className="font-display font-bold text-vgs-silver-bright mb-3">
                                        Catatan untuk Penjual
                                    </h2>
                                    <Input
                                        placeholder="Contoh: Tolong kirim dengan packaging bubble wrap tambahan"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </section>

                                <section className="rounded-2xl bg-vgs-black-surface border border-vgs-gray-border p-5">
                                    <h2 className="font-display font-bold text-vgs-silver-bright mb-3">
                                        Kupon Diskon
                                    </h2>
                                    <Input
                                        placeholder="Masukkan kode kupon (opsional)"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    />
                                    <p className="text-[11px] font-mono text-vgs-silver-muted mt-2">
                                        Kupon divalidasi saat pesanan dibuat. Coba VGSWIN / ESPORTS10.
                                    </p>
                                </section>
                            </div>
                        </div>

                        {/* Right: Order Summary */}
                        <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-28">
                            <div className="rounded-2xl bg-vgs-black-surface border border-vgs-gray-border shadow-xl overflow-hidden">
                                <div className="px-5 py-4 border-b border-vgs-gray-border bg-vgs-black-elevated/60">
                                    <h2 className="font-display font-bold text-vgs-silver-bright">
                                        Ringkasan Pesanan
                                    </h2>
                                </div>

                                <div className="p-5 flex flex-col gap-4">
                                    {/* Items */}
                                    <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">
                                        {itemsToCheckout.map((item) => {
                                            const unit = item.product
                                                ? item.product.price + (item.variant?.priceModifier || 0)
                                                : 0;
                                            const img =
                                                item.product?.images?.[0] ||
                                                'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80';
                                            return (
                                                <div key={getCartItemKey(item)} className="flex items-center gap-3">
                                                    <div className="relative w-12 h-12 rounded-lg bg-vgs-black-void border border-vgs-gray-border p-1 flex items-center justify-center shrink-0 overflow-hidden">
                                                        <img src={img} alt={item.product?.name} className="w-full h-full object-contain" />
                                                        <span className="absolute -top-1 -right-1 bg-vgs-blue-electric text-white text-[9px] font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                                            {item.quantity}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-semibold text-vgs-silver-bright truncate">
                                                            {item.product?.name}
                                                        </p>
                                                        {item.variant && (
                                                            <p className="text-[10px] font-mono text-vgs-silver-muted truncate">
                                                                {item.variant.value}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <span className="font-mono text-xs font-bold text-vgs-silver-bright shrink-0">
                                                        {formatRupiah(unit * item.quantity)}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Totals */}
                                    <div className="flex flex-col gap-2 text-xs font-medium border-t border-vgs-gray-border/60 pt-4">
                                        <div className="flex items-center justify-between text-vgs-silver-mid">
                                            <span>Subtotal ({count} item)</span>
                                            <span className="font-mono font-semibold text-vgs-silver-bright">
                                                {formatRupiah(subtotal)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-vgs-silver-mid">
                                            <span>Ongkos Kirim ({shipping?.name ?? '-'})</span>
                                            <span className="font-mono font-semibold">
                                                {shippingCost === 0 ? (
                                                    <span className="text-vgs-success uppercase font-bold text-[10px]">GRATIS</span>
                                                ) : (
                                                    formatRupiah(shippingCost)
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-vgs-silver-mid">
                                            <span>Biaya Layanan ({payment?.name ?? '-'})</span>
                                            <span className="font-mono font-semibold">
                                                {paymentFee === 0 ? (
                                                    <span className="text-vgs-success font-bold text-[10px] uppercase">Rp 0</span>
                                                ) : (
                                                    formatRupiah(paymentFee)
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-vgs-gray-border pt-3 text-sm sm:text-base">
                                            <span className="font-bold text-vgs-silver-bright">Total Tagihan</span>
                                            <span className="font-mono font-extrabold text-lg text-vgs-blue-electric">
                                                {formatRupiah(grandTotal)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Pay Button */}
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        block
                                        loading={placing}
                                        onClick={handlePlaceOrder}
                                        disabled={itemsToCheckout.length === 0}
                                    >
                                        {placing ? 'Memproses...' : `Buat Pesanan · ${formatRupiah(grandTotal)}`}
                                    </Button>

                                    <p className="text-[11px] font-mono text-vgs-silver-muted text-center flex items-center justify-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 text-vgs-success" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Data pembayaran Anda terlindungi dan terenkripsi
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Success Modal */}
            {showSuccess && orderInfo && (
                <div className="fixed inset-0 z-[60] overflow-hidden flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowSuccess(false)} />
                    <div className="relative w-full max-w-md bg-vgs-black-elevated border border-vgs-gray-border rounded-3xl p-8 shadow-2xl text-center animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-vgs-success/15 border border-vgs-success/40 flex items-center justify-center text-vgs-success mb-5">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="font-display font-extrabold text-2xl text-vgs-silver-bright mb-2">
                            Pesanan Berhasil Dibuat!
                        </h3>
                        <p className="text-xs font-mono text-vgs-blue-electric mb-1">
                            No. Pesanan: <span className="font-bold">{orderInfo.order_number}</span>
                        </p>
                        <p className="text-sm text-vgs-silver-muted mb-1">
                            Total tagihan: <span className="font-mono font-bold text-vgs-silver-bright">{formatRupiah(orderInfo.grand_total)}</span>
                        </p>
                        <p className="text-xs font-mono text-vgs-silver-muted mb-6">
                            Pembayaran dengan <span className="font-bold">{orderInfo.paymentName}</span>
                        </p>
                        <div className="flex flex-col gap-2">
                            <Button variant="primary" size="lg" block href="/account/orders">
                                Lihat Status Pesanan
                            </Button>
                            <Button variant="outline" size="md" block href="/products">
                                Lanjut Belanja
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </StorefrontLayout>
    );
}