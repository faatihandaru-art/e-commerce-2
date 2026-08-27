import React, { useState, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { router } from '@inertiajs/react';
import type { Product, ProductVariant } from '@/types/product';
import { formatRupiah } from '@/data/dummy-products';
import { useCart } from '@/context/CartContext';
import Chip from '@/components/ui/Chip';
import Badge from '@/components/ui/Badge';
import QuantityStepper from '@/components/ui/QuantityStepper';
import Button from '@/components/ui/Button';

export interface ProductVariantModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'cart' | 'buy';
    onSuccess?: (variant: ProductVariant | null, quantity: number, mode: 'cart' | 'buy') => void;
}

export const ProductVariantModal: React.FC<ProductVariantModalProps> = ({
    product,
    isOpen,
    onClose,
    initialMode = 'cart',
    onSuccess,
}) => {
    const { addToCart } = useCart();
    const titleId = useId();
    const panelRef = useRef<HTMLDivElement>(null);

    // Initial variant selection
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(() => {
        if (product.variants && product.variants.length > 0) {
            // Find first in-stock variant if available
            const inStock = product.variants.find((v) => (v.stock ?? 1) > 0);
            return inStock || product.variants[0];
        }
        return null;
    });

    const [quantity, setQuantity] = useState<number>(1);
    const [activeMode, setActiveMode] = useState<'cart' | 'buy'>(initialMode);

    // Update activeMode when initialMode changes or when modal reopens
    useEffect(() => {
        if (isOpen) {
            setActiveMode(initialMode);
            setQuantity(1);
            if (product.variants && product.variants.length > 0) {
                const inStock = product.variants.find((v) => (v.stock ?? 1) > 0);
                setSelectedVariant(inStock || product.variants[0]);
            } else {
                setSelectedVariant(null);
            }
        }
    }, [isOpen, initialMode, product]);

    // Handle Escape key and body lock
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        panelRef.current?.focus();

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Calculation values
    const priceModifier = selectedVariant?.priceModifier || 0;
    const unitPrice = product.price + priceModifier;
    const compareAtPrice = product.compareAtPrice
        ? product.compareAtPrice + priceModifier
        : null;

    const discountPercent =
        compareAtPrice && compareAtPrice > unitPrice
            ? Math.round(((compareAtPrice - unitPrice) / compareAtPrice) * 100)
            : 0;

    const availableStock = selectedVariant?.stock ?? product.stock ?? 0;
    const isOutOfStock = availableStock <= 0;

    const productImage =
        product.images && product.images.length > 0
            ? product.images[0]
            : 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80';

    // Group variants by variant name (e.g. "Color", "Switch", "Size", "Tipe", "Rasa")
    const groupedVariants = (product.variants || []).reduce<Record<string, ProductVariant[]>>(
        (acc, variant) => {
            const groupName = variant.name || 'Pilihan Varian';
            if (!acc[groupName]) {
                acc[groupName] = [];
            }
            acc[groupName].push(variant);
            return acc;
        },
        {}
    );

    const handleSelectVariant = (variant: ProductVariant) => {
        setSelectedVariant(variant);
        // If current quantity exceeds new variant's stock, adjust quantity
        const maxStock = variant.stock ?? product.stock ?? 99;
        if (quantity > maxStock && maxStock > 0) {
            setQuantity(maxStock);
        }
    };

    const handleAddToCartAction = () => {
        if (isOutOfStock) return;
        addToCart(product, quantity, selectedVariant);
        if (onSuccess) {
            onSuccess(selectedVariant, quantity, 'cart');
        }
        onClose();
    };

    const handleBuyNowAction = () => {
        if (isOutOfStock) return;
        addToCart(product, quantity, selectedVariant);
        if (onSuccess) {
            onSuccess(selectedVariant, quantity, 'buy');
        }
        onClose();
        router.visit('/cart');
    };

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
        >
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Dialog Card (Bottom sheet on mobile, centered modal on desktop) */}
            <div
                ref={panelRef}
                tabIndex={-1}
                className="relative w-full sm:max-w-lg bg-vgs-black-elevated border-t sm:border border-vgs-gray-border rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[88vh] sm:max-h-[85vh] overflow-hidden z-10 focus:outline-none animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
            >
                {/* Mobile Handle Drag Indicator */}
                <div className="sm:hidden flex justify-center pt-3 pb-1">
                    <div className="w-10 h-1 rounded-full bg-vgs-gray-border" />
                </div>

                {/* Header Product Info Preview */}
                <div className="p-4 sm:p-5 border-b border-vgs-gray-border/80 flex items-start gap-3.5 bg-vgs-black-surface/70">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-vgs-black-void border border-vgs-gray-border p-1.5 shrink-0 overflow-hidden flex items-center justify-center">
                        <img
                            src={productImage}
                            alt={product.name}
                            className="w-full h-full object-contain"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1 pr-6">
                        <span className="text-[10px] sm:text-xs font-mono font-semibold uppercase tracking-wider text-vgs-blue-electric truncate">
                            {product.brand || product.category?.name || 'VGS GAMING'}
                        </span>

                        <h3
                            id={titleId}
                            className="font-semibold text-sm sm:text-base text-vgs-silver-bright line-clamp-1"
                        >
                            {product.name}
                        </h3>

                        {/* Price Row */}
                        <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
                            <span className="font-mono font-bold text-lg sm:text-xl text-vgs-blue-electric">
                                {formatRupiah(unitPrice)}
                            </span>
                            {compareAtPrice && compareAtPrice > unitPrice && (
                                <>
                                    <span className="text-xs font-mono text-vgs-silver-muted line-through">
                                        {formatRupiah(compareAtPrice)}
                                    </span>
                                    {discountPercent > 0 && (
                                        <Badge variant="sale" size="xs">
                                            -{discountPercent}%
                                        </Badge>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Stock & Selected Variant Info */}
                        <div className="flex items-center gap-2 text-xs font-mono mt-0.5">
                            <span
                                className={
                                    isOutOfStock
                                        ? 'text-vgs-danger font-semibold'
                                        : availableStock <= 5
                                        ? 'text-vgs-warning font-semibold'
                                        : 'text-vgs-success'
                                }
                            >
                                {isOutOfStock ? 'Stok Habis' : `Stok: ${availableStock}`}
                            </span>

                            {selectedVariant && (
                                <>
                                    <span className="text-vgs-gray-border">•</span>
                                    <span className="text-vgs-silver-muted truncate">
                                        Pilihan: <span className="text-vgs-silver-bright">{selectedVariant.value}</span>
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Close Button */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-3.5 right-3.5 w-8 h-8 rounded-lg text-vgs-silver-muted hover:text-white hover:bg-vgs-black-surface flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Tutup modal"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable Body: Variant Groups & Quantity */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
                    {/* Variants Selector */}
                    {Object.keys(groupedVariants).length > 0 ? (
                        Object.entries(groupedVariants).map(([groupName, items]) => (
                            <div key={groupName} className="flex flex-col gap-2.5">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-semibold uppercase tracking-wider text-vgs-silver-mid font-mono">
                                        {groupName}:
                                    </span>
                                    {selectedVariant && items.some((i) => i.id === selectedVariant.id) && (
                                        <span className="font-semibold text-vgs-silver-bright text-xs">
                                            {selectedVariant.value}
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {items.map((variant) => {
                                        const isSelected = selectedVariant?.id === variant.id;
                                        const isVariantOutOfStock = (variant.stock ?? 0) === 0;

                                        return (
                                            <Chip
                                                key={variant.id}
                                                size="md"
                                                selected={isSelected}
                                                disabled={isVariantOutOfStock}
                                                showCheck={isSelected}
                                                onClick={() => !isVariantOutOfStock && handleSelectVariant(variant)}
                                                className="transition-all"
                                            >
                                                <div className="flex items-center gap-1.5">
                                                    <span>{variant.value}</span>
                                                    {variant.priceModifier && variant.priceModifier > 0 ? (
                                                        <span className="text-[11px] font-mono text-vgs-blue-electric font-semibold">
                                                            (+{formatRupiah(variant.priceModifier)})
                                                        </span>
                                                    ) : null}
                                                    {isVariantOutOfStock && (
                                                        <span className="text-[10px] text-vgs-danger font-mono">
                                                            (Habis)
                                                        </span>
                                                    )}
                                                </div>
                                            </Chip>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-3 rounded-xl bg-vgs-black-surface/50 border border-vgs-gray-border/50 text-xs text-vgs-silver-muted flex items-center gap-2">
                            <svg className="w-4 h-4 text-vgs-blue-electric shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Produk ini adalah varian standar tunggal (Ready Stock).</span>
                        </div>
                    )}

                    {/* Quantity Stepper Row */}
                    <div className="pt-2 border-t border-vgs-gray-border/60 flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold font-mono uppercase tracking-wider text-vgs-silver-mid">
                                Jumlah Pembelian
                            </span>
                            <span className="text-[11px] font-mono text-vgs-silver-muted">
                                Maksimal {availableStock} unit
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <QuantityStepper
                                value={quantity}
                                onChange={setQuantity}
                                min={1}
                                max={Math.max(1, availableStock)}
                                disabled={isOutOfStock}
                            />
                        </div>
                    </div>

                    {/* Subtotal Preview */}
                    <div className="p-3 rounded-xl bg-vgs-black-surface/80 border border-vgs-gray-border/70 flex items-center justify-between">
                        <span className="text-xs font-medium text-vgs-silver-muted">
                            Subtotal ({quantity} barang):
                        </span>
                        <span className="font-mono font-bold text-base text-vgs-blue-electric">
                            {formatRupiah(unitPrice * quantity)}
                        </span>
                    </div>
                </div>

                {/* Sticky Bottom Actions Bar (Shopee Style) */}
                <div className="p-4 sm:p-5 border-t border-vgs-gray-border bg-vgs-black-surface grid grid-cols-2 gap-3">
                    {/* Add to Cart Button */}
                    <Button
                        variant="secondary"
                        size="lg"
                        disabled={isOutOfStock}
                        onClick={handleAddToCartAction}
                        className={`border-vgs-blue-electric/50 text-vgs-blue-electric hover:bg-vgs-blue-electric hover:text-white ${
                            activeMode === 'cart' ? 'ring-1 ring-vgs-blue-electric bg-vgs-blue-electric/10' : ''
                        }`}
                        icon={
                            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                        }
                    >
                        + Keranjang
                    </Button>

                    {/* Buy Now Button */}
                    <Button
                        variant="primary"
                        size="lg"
                        disabled={isOutOfStock}
                        onClick={handleBuyNowAction}
                        className={`${
                            activeMode === 'buy' ? 'shadow-lg shadow-vgs-blue-electric/25' : ''
                        }`}
                    >
                        Beli Sekarang
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ProductVariantModal;
