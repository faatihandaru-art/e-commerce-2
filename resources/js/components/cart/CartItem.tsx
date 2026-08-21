import React from 'react';
import { Link } from '@inertiajs/react';
import type { CartItem as CartItemType } from '@/types/product';
import QuantityStepper from '@/components/ui/QuantityStepper';
import { formatRupiah } from '@/data/dummy-products';

export interface CartItemProps {
    item: CartItemType;
    onUpdateQuantity: (quantity: number) => void;
    onRemove: () => void;
    compact?: boolean;
    className?: string;
}

export const CartItem: React.FC<CartItemProps> = ({
    item,
    onUpdateQuantity,
    onRemove,
    compact = false,
    className = '',
}) => {
    const product = item.product;

    if (!product) return null;

    const basePrice = product.price;
    const modifier = item.variant?.priceModifier || 0;
    const unitPrice = basePrice + modifier;
    const totalPrice = unitPrice * item.quantity;

    const imageUrl =
        product.images && product.images.length > 0
            ? product.images[0]
            : 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80';

    const maxStock = item.variant?.stock ?? product.stock ?? 99;

    return (
        <div
            className={`flex items-start gap-3 sm:gap-4 p-4 rounded-2xl bg-vgs-black-surface/80 border border-vgs-gray-border hover:border-vgs-gray-border/80 transition-all ${
                compact ? 'p-3' : 'p-4 sm:p-5'
            } ${className}`}
        >
            {/* Product Thumbnail */}
            <Link
                href={`/products/${product.slug || product.id}`}
                className={`relative shrink-0 rounded-xl overflow-hidden bg-vgs-black-void border border-vgs-gray-border/80 flex items-center justify-center p-1.5 ${
                    compact ? 'w-16 h-16' : 'w-20 h-20 sm:w-24 sm:h-24'
                }`}
            >
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain object-center"
                    loading="lazy"
                />
            </Link>

            {/* Info & Quantity / Price Block */}
            <div className="flex flex-col flex-1 min-w-0 justify-between self-stretch gap-2">
                {/* Title & Remove Button */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col min-w-0">
                        <Link
                            href={`/products/${product.slug || product.id}`}
                            className="font-semibold text-xs sm:text-sm text-vgs-silver-bright hover:text-vgs-blue-electric transition-colors line-clamp-2 leading-snug"
                        >
                            {product.name}
                        </Link>
                        {item.variant && (
                            <span className="text-[11px] font-mono text-vgs-silver-muted mt-0.5 truncate">
                                Varian: {item.variant.value}
                            </span>
                        )}
                    </div>

                    {/* Delete Item Button */}
                    <button
                        type="button"
                        onClick={onRemove}
                        className="text-vgs-silver-muted hover:text-vgs-danger p-1 rounded-lg hover:bg-vgs-danger/10 transition-colors shrink-0 cursor-pointer"
                        title="Hapus dari keranjang"
                        aria-label={`Hapus ${product.name} dari keranjang`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>

                {/* Price & Stepper Row */}
                <div className="flex items-center justify-between gap-2 mt-auto pt-1">
                    <QuantityStepper
                        value={item.quantity}
                        onChange={onUpdateQuantity}
                        min={1}
                        max={maxStock}
                        className={compact ? 'scale-90 origin-left' : ''}
                    />

                    <div className="flex flex-col items-end">
                        <span className="font-mono font-bold text-xs sm:text-sm text-vgs-blue-electric">
                            {formatRupiah(totalPrice)}
                        </span>
                        {item.quantity > 1 && (
                            <span className="text-[10px] font-mono text-vgs-silver-muted">
                                @{formatRupiah(unitPrice)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
