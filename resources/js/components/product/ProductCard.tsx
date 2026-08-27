import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import type { Product, ProductVariant } from '@/types/product';
import Badge from '@/components/ui/Badge';
import RatingStars from '@/components/ui/RatingStars';
import { formatRupiah } from '@/data/dummy-products';
import ProductVariantModal from '@/components/product/ProductVariantModal';

export interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product, variant?: ProductVariant | null, quantity?: number) => void;
    className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onAddToCart,
    className = '',
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'cart' | 'buy'>('cart');

    const productImage =
        product.images && product.images.length > 0
            ? product.images[0]
            : 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80';

    const productUrl = `/products/${product.slug || product.id}`;

    const discountPercent =
        product.compareAtPrice && product.compareAtPrice > product.price
            ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
            : 0;

    const getBadgeVariant = (badge: string) => {
        switch (badge) {
            case 'Baru':
                return 'new';
            case 'Diskon':
                return 'sale';
            case 'Stok Terbatas':
                return 'warning';
            default:
                return 'primary';
        }
    };

    const handleOpenCartModal = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.stock === 0) return;
        setModalMode('cart');
        setIsModalOpen(true);
    };

    const handleOpenBuyModal = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.stock === 0) return;
        setModalMode('buy');
        setIsModalOpen(true);
    };

    return (
        <>
            <div
                className={`group relative flex flex-col bg-vgs-black-surface rounded-2xl border border-vgs-gray-border overflow-hidden transition-all duration-300 hover:border-vgs-blue-glow hover:shadow-xl hover:shadow-vgs-blue-electric/10 hover:-translate-y-1 ${className}`}
            >
                {/* Top Image Container with Badges */}
                <div className="relative w-full aspect-[4/3] bg-vgs-black-void/60 overflow-hidden flex items-center justify-center p-4">
                    <img
                        src={productImage}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                        {product.badge ? (
                            <Badge variant={getBadgeVariant(product.badge)} size="xs">
                                {product.badge}
                            </Badge>
                        ) : discountPercent > 0 ? (
                            <Badge variant="sale" size="xs">
                                -{discountPercent}%
                            </Badge>
                        ) : null}
                    </div>

                    {/* Quick Stock Indicator */}
                    {product.stock <= 5 && product.stock > 0 && (
                        <div className="absolute bottom-3 left-3 z-10">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-vgs-black-void/80 border border-vgs-warning/40 text-[10px] font-mono text-vgs-warning">
                                <span className="w-1.5 h-1.5 rounded-full bg-vgs-warning animate-ping" />
                                Sisa {product.stock}
                            </span>
                        </div>
                    )}
                </div>

                {/* Product Info Details */}
                <div className="flex flex-col flex-1 p-5 gap-3">
                    {/* Brand & Category Row */}
                    <div className="flex items-center justify-between text-xs font-mono text-vgs-silver-muted">
                        <span className="uppercase tracking-wider truncate">
                            {product.brand || product.category?.name || 'VGS HARDWARE'}
                        </span>
                        {product.sku && (
                            <span className="text-[10px] text-vgs-silver-muted/80 font-mono">
                                {product.sku}
                            </span>
                        )}
                    </div>

                    {/* Product Title */}
                    <Link
                        href={productUrl}
                        className="font-semibold text-base text-vgs-silver-bright group-hover:text-vgs-blue-electric transition-colors line-clamp-2 leading-snug focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-vgs-blue-electric rounded"
                    >
                        {product.name}
                    </Link>

                    {/* Rating Row */}
                    <div className="flex items-center gap-2">
                        <RatingStars
                            rating={product.rating || 5}
                            reviewCount={product.reviewCount}
                            size="sm"
                        />
                    </div>

                    {/* Price & Action Buttons Row (Shopee Flow: Cart Icon 🛒 + "Beli" Button) */}
                    <div className="mt-auto pt-3 border-t border-vgs-gray-border/60 flex items-center justify-between gap-2">
                        {/* Price Block */}
                        <div className="flex flex-col min-w-0">
                            <span className="text-base sm:text-lg font-bold font-mono text-vgs-blue-electric truncate">
                                {formatRupiah(product.price)}
                            </span>
                            {product.compareAtPrice && product.compareAtPrice > product.price && (
                                <span className="text-xs font-mono text-vgs-silver-muted line-through truncate">
                                    {formatRupiah(product.compareAtPrice)}
                                </span>
                            )}
                        </div>

                        {/* Actions: Cart Icon Button 🛒 + "Beli" Button */}
                        <div className="flex items-center gap-1.5 shrink-0">
                            {/* Shopping Cart Icon Button */}
                            <button
                                type="button"
                                onClick={handleOpenCartModal}
                                disabled={product.stock === 0}
                                className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vgs-blue-electric ${
                                    product.stock === 0
                                        ? 'bg-vgs-black-elevated text-vgs-silver-muted cursor-not-allowed opacity-50'
                                        : 'border border-vgs-blue-electric/40 bg-vgs-blue-electric/10 text-vgs-blue-electric hover:bg-vgs-blue-electric hover:text-white shadow-xs hover:shadow-md hover:shadow-vgs-blue-electric/20 active:scale-95'
                                }`}
                                title="Tambah ke Keranjang"
                                aria-label={`Pilih varian dan tambah ${product.name} ke keranjang`}
                            >
                                <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </button>

                            {/* "Beli" Button */}
                            <button
                                type="button"
                                onClick={handleOpenBuyModal}
                                disabled={product.stock === 0}
                                className={`px-3 sm:px-3.5 h-9 sm:h-10 rounded-xl text-xs sm:text-sm font-semibold transition-all select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vgs-blue-electric ${
                                    product.stock === 0
                                        ? 'bg-vgs-black-elevated text-vgs-silver-muted cursor-not-allowed opacity-50'
                                        : 'bg-vgs-blue-electric text-white hover:bg-vgs-blue-deep shadow-xs hover:shadow-md hover:shadow-vgs-blue-electric/20 active:scale-95'
                                }`}
                                title="Beli Sekarang"
                                aria-label={`Beli ${product.name} sekarang`}
                            >
                                Beli
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shopee-style Variant Selection Popup Modal */}
            <ProductVariantModal
                product={product}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialMode={modalMode}
                onSuccess={(variant, quantity) => {
                    if (onAddToCart) {
                        onAddToCart(product, variant, quantity);
                    }
                }}
            />
        </>
    );
};

export default ProductCard;
