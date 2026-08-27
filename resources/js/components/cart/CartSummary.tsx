import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { formatRupiah } from '@/data/dummy-products';

export interface CartSummaryProps {
    subtotal: number;
    showPromoInput?: boolean;
    showViewCartButton?: boolean;
    onViewCart?: () => void;
    onCheckout?: () => void;
    className?: string;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
    subtotal,
    showPromoInput = true,
    showViewCartButton = false,
    onViewCart,
    onCheckout,
    className = '',
}) => {
    const [promoCode, setPromoCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
    const [promoMessage, setPromoMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    // Free shipping threshold: 1.000.000 IDR
    const FREE_SHIPPING_THRESHOLD = 1000000;
    const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
    const shippingFee = subtotal > 0 ? (isFreeShipping ? 0 : 35000) : 0;
    const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

    const handleApplyPromo = (e: React.FormEvent) => {
        e.preventDefault();
        const code = promoCode.trim().toUpperCase();
        if (code === 'VGSWIN' || code === 'ESPORTS10') {
            const discountAmount = Math.round(subtotal * 0.1);
            setAppliedDiscount(discountAmount);
            setPromoMessage({
                type: 'success',
                text: 'Kupon 10% diskon berhasil diterapkan!',
            });
        } else if (code === '') {
            setPromoMessage(null);
            setAppliedDiscount(0);
        } else {
            setPromoMessage({
                type: 'error',
                text: 'Kode kupon tidak valid atau sudah kedaluwarsa.',
            });
            setAppliedDiscount(0);
        }
    };

    const finalTotal = Math.max(0, subtotal - appliedDiscount + shippingFee);

    const handleCheckoutClick = () => {
        setIsCheckingOut(true);
        setTimeout(() => {
            setIsCheckingOut(false);
            if (onCheckout) {
                onCheckout();
            } else {
                alert('Fitur Checkout sedang dipersiapkan untuk integrasi payment gateway turnamen.');
            }
        }, 1000);
    };

    return (
      <div
    className={`flex flex-col gap-3 p-4 sm:p-5 rounded-2xl bg-vgs-black-surface border border-vgs-gray-border shadow-xl ${className}`}
>
    <h3 className="font-display font-bold text-lg text-vgs-silver-bright border-b border-vgs-gray-border pb-2 flex items-center justify-between">
        <span>Ringkasan Pesanan</span>
        <span className="text-xs font-mono text-vgs-blue-electric font-semibold uppercase">
            VGS CHECKOUT
        </span>
    </h3>

    {/* Free Shipping Progress Indicator */}
    {subtotal > 0 && (
        <div className="flex flex-col gap-1 p-3 rounded-xl bg-vgs-black-void border border-vgs-gray-border/60">
            <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-vgs-silver-bright flex items-center gap-1.5">
                    <svg
                        className="w-4 h-4 text-vgs-blue-electric"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                        />
                    </svg>

                    {isFreeShipping
                        ? 'Gratis Ongkir Turnamen Aktif!'
                        : 'Gratis Ongkir'}
                </span>

                <span className="font-mono text-[11px] text-vgs-silver-muted">
                    {isFreeShipping
                        ? 'Tercapai'
                        : `Tambah ${formatRupiah(
                              FREE_SHIPPING_THRESHOLD - subtotal
                          )}`}
                </span>
            </div>

            <div className="w-full h-1.5 rounded-full bg-vgs-gray-border overflow-hidden">
                <div
                    className={`h-full transition-all duration-300 ${
                        isFreeShipping
                            ? 'bg-vgs-success'
                            : 'bg-vgs-blue-electric'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                />
            </div>
        </div>
    )}

    {/* Promo Code Input */}
    {showPromoInput && subtotal > 0 && (
        <form onSubmit={handleApplyPromo} className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
                <Input
                    placeholder="Kode Kupon (e.g. VGSWIN)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="font-mono uppercase text-xs py-2"
                />

                <Button
                    variant="secondary"
                    size="md"
                    type="submit"
                    className="shrink-0"
                >
                    Pakai
                </Button>
            </div>

            {promoMessage && (
                <span
                    className={`text-xs ${
                        promoMessage.type === 'success'
                            ? 'text-vgs-success'
                            : 'text-vgs-danger'
                    }`}
                >
                    {promoMessage.text}
                </span>
            )}
        </form>
    )}

    {/* Line Items Breakdown */}
    <div className="flex flex-col gap-2 text-xs sm:text-sm font-medium border-t border-vgs-gray-border/60 pt-3">
        <div className="flex items-center justify-between text-vgs-silver-mid">
            <span>Subtotal Produk</span>

            <span className="font-mono text-vgs-silver-bright font-semibold">
                {formatRupiah(subtotal)}
            </span>
        </div>

        {appliedDiscount > 0 && (
            <div className="flex items-center justify-between text-vgs-success">
                <span>Diskon Kupon</span>

                <span className="font-mono font-semibold">
                    -{formatRupiah(appliedDiscount)}
                </span>
            </div>
        )}

        <div className="flex items-center justify-between text-vgs-silver-mid">
            <span>Estimasi Ongkos Kirim</span>

            <span className="font-mono text-vgs-silver-bright font-semibold">
                {subtotal === 0 ? (
                    'Rp 0'
                ) : isFreeShipping ? (
                    <span className="text-vgs-success font-bold uppercase text-xs">
                        GRATIS
                    </span>
                ) : (
                    formatRupiah(shippingFee)
                )}
            </span>
        </div>

        {/* Grand Total */}
        <div className="flex items-center justify-between border-t border-vgs-gray-border pt-2 mt-1 text-sm sm:text-base">
            <span className="font-bold text-vgs-silver-bright">
                Total Tagihan
            </span>

            <span className="font-mono font-extrabold text-lg sm:text-xl text-vgs-blue-electric">
                {formatRupiah(finalTotal)}
            </span>
        </div>
    </div>

    {/* Action Buttons */}
    <div className="flex flex-col gap-2 pt-1">
        <Button
            variant="primary"
            size="lg"
            block
            loading={isCheckingOut}
            disabled={subtotal === 0}
            onClick={handleCheckoutClick}
        >
            Lanjut ke Checkout
        </Button>

        {showViewCartButton && (
            <Button
                variant="outline"
                size="md"
                block
                href="/cart"
                onClick={onViewCart}
            >
                Buka Halaman Keranjang
            </Button>
        )}
    </div>

    {/* Security Guarantee Notice */}
    <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-vgs-silver-muted pt-0">
        <svg
            className="w-3.5 h-3.5 text-vgs-success"
            fill="currentColor"
            viewBox="0 0 20 20"
        >
            <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
            />
        </svg>

        <span>Garansi Resmi 100% Original & Aman</span>
    </div>
</div>
    );
};

export default CartSummary;
