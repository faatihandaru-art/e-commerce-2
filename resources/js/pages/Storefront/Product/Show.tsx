import React, { useEffect, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import ProductGallery from '@/components/product/ProductGallery';
import VariantSelector from '@/components/product/VariantSelector';
import SpecTable from '@/components/product/SpecTable';
import RelatedProducts from '@/components/product/RelatedProducts';
import RatingStars from '@/components/ui/RatingStars';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import QuantityStepper from '@/components/ui/QuantityStepper';
import { formatRupiah } from '@/lib/format';
import { getProduct, ApiError, type ProductReviewPayload } from '@/lib/api';
import type { Product, ProductVariant } from '@/types/product';
import { useCart } from '@/context/CartContext';

interface ProductShowProps {
    slug?: string;
}

export default function ProductShow({ slug: propSlug }: ProductShowProps) {
    const { url } = usePage();
    const { addToCart } = useCart();

    // Resolve slug dari prop atau URL
    const resolvedSlug =
        propSlug || (url ? url.split('/products/')[1]?.split('?')[0] : '') || '';

    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<ProductReviewPayload[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    // Selected variant
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

    // Quantity state
    const [quantity, setQuantity] = useState<number>(1);

    // Active Tab state: 'description' | 'specifications' | 'reviews'
    const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');

    // Muat detail produk dari API
    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);
        setLoadError(null);
        setSelectedVariant(null);
        setQuantity(1);

        if (!resolvedSlug) {
            if (!cancelled) {
                setLoadError('Produk tidak ditemukan.');
                setIsLoading(false);
            }
            return;
        }

        getProduct(resolvedSlug)
            .then((payload) => {
                if (cancelled) return;
                setProduct(payload.data);
                setReviews(payload.reviews ?? []);
                setSelectedVariant(
                    payload.data.variants && payload.data.variants.length > 0
                        ? payload.data.variants[0]
                        : null
                );
            })
            .catch((err: unknown) => {
                if (cancelled) return;
                setLoadError(err instanceof ApiError ? err.message : 'Produk tidak ditemukan.');
            })
            .finally(() => {
                if (cancelled) return;
                setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [resolvedSlug]);

    if (isLoading) {
        return (
            <StorefrontLayout>
                <Head title="Memuat Produk — Vortix Gaming Store" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="aspect-square rounded-2xl bg-vgs-black-elevated border border-vgs-gray-border animate-pulse" />
                    <div className="flex flex-col gap-4">
                        <div className="h-4 w-32 bg-vgs-black-elevated rounded animate-pulse" />
                        <div className="h-8 w-3/4 bg-vgs-black-elevated rounded animate-pulse" />
                        <div className="h-8 w-48 bg-vgs-black-elevated rounded animate-pulse" />
                        <div className="h-24 w-full bg-vgs-black-elevated rounded animate-pulse" />
                    </div>
                </div>
            </StorefrontLayout>
        );
    }

    if (loadError || !product) {
        return (
            <StorefrontLayout>
                <Head title="Produk Tidak Ditemukan — Vortix Gaming Store" />
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-vgs-black-surface border border-vgs-gray-border flex items-center justify-center text-vgs-silver-muted mb-4 mx-auto">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="font-display font-bold text-2xl text-vgs-silver-bright mb-2">
                        Produk Tidak Ditemukan
                    </h1>
                    <p className="text-sm text-vgs-silver-muted mb-6">
                        {loadError || 'Produk yang Anda cari mungkin sudah tidak tersedia.'}
                    </p>
                    <Button onClick={() => router.visit('/products')} variant="secondary">
                        Lihat Semua Produk
                    </Button>
                </div>
            </StorefrontLayout>
        );
    }

    // Calculations
    const priceModifier = selectedVariant?.priceModifier || 0;
    const finalPrice = product.price + priceModifier;
    const compareAtPrice = product.compareAtPrice
        ? product.compareAtPrice + priceModifier
        : null;

    const discountPercent =
        compareAtPrice && compareAtPrice > finalPrice
            ? Math.round(((compareAtPrice - finalPrice) / compareAtPrice) * 100)
            : 0;

    const maxStock = selectedVariant?.stock ?? product.stock ?? 99;

    const handleAddToCart = () => {
        addToCart(product, quantity, selectedVariant);
    };

    const handleBuyNow = () => {
        const added = addToCart(product, quantity, selectedVariant);
        if (added) {
            router.visit('/cart');
        }
    };

    // Dummy realistic gamer reviews
    const noReviews = reviews.length === 0;

    return (
        <StorefrontLayout>
            <Head title={`${product.name} — Vortix Gaming Store`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
                {/* Breadcrumbs Navigation */}
                <nav className="flex items-center gap-2 text-xs font-mono text-vgs-silver-muted mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap pb-1">
                    <Link href="/" className="hover:text-vgs-silver-bright transition-colors">
                        Home
                    </Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-vgs-silver-bright transition-colors">
                        Produk
                    </Link>
                    {product.category && (
                        <>
                            <span>/</span>
                            <Link
                                href={`/products?category=${product.category.slug}`}
                                className="hover:text-vgs-silver-bright transition-colors"
                            >
                                {product.category.name}
                            </Link>
                        </>
                    )}
                    <span>/</span>
                    <span className="text-vgs-silver-bright font-medium truncate max-w-[200px] sm:max-w-xs">
                        {product.name}
                    </span>
                </nav>

                {/* Main Product Showcase: Left Gallery, Right Product Info */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* LEFT COLUMN: Multi-Image Interactive Gallery */}
                    <div className="lg:col-span-6 xl:col-span-7">
                        <ProductGallery
                            images={product.images}
                            productName={product.name}
                            badge={product.badge}
                        />
                    </div>

                    {/* RIGHT COLUMN: Product Details & Order Actions */}
                    <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-6">
                        {/* Brand, SKU & Badges */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs font-mono font-bold tracking-widest text-vgs-blue-electric uppercase">
                                {product.brand || product.category?.name || 'VGS PRO SERIES'}
                            </span>
                            {product.sku && (
                                <span className="text-xs font-mono text-vgs-silver-muted bg-vgs-black-surface px-2.5 py-1 rounded-md border border-vgs-gray-border">
                                    SKU: {product.sku}
                                </span>
                            )}
                        </div>

                        {/* Product Title */}
                        <h1 className="font-display font-extrabold text-2xl sm:text-3xl xl:text-4xl text-vgs-silver-bright leading-tight tracking-wide">
                            {product.name}
                        </h1>

                        {/* Rating & Sold Statistics */}
                        <div className="flex flex-wrap items-center gap-4 py-2 border-y border-vgs-gray-border/60 text-xs font-mono">
                            <div className="flex items-center gap-2">
                                <RatingStars rating={product.rating} showValue size="sm" />
                                <span className="text-vgs-silver-muted">
                                    ({product.reviewCount} ulasan)
                                </span>
                            </div>
                            <span className="text-vgs-gray-border">|</span>
                            <div className="text-vgs-silver-mid">
                                Terjual <span className="text-vgs-silver-bright font-bold">1.2k+</span> item
                            </div>
                            <span className="text-vgs-gray-border">|</span>
                            <div className="flex items-center gap-1.5 text-vgs-success">
                                <span className="w-2 h-2 rounded-full bg-vgs-success" />
                                <span>Stok Tersedia ({maxStock})</span>
                            </div>
                        </div>

                        {/* Price Card Block */}
                        <div className="p-5 rounded-2xl bg-vgs-black-surface border border-vgs-gray-border flex flex-col gap-2">
                            <span className="text-[11px] font-mono uppercase tracking-wider text-vgs-silver-muted">
                                Harga Resmi VGS
                            </span>
                            <div className="flex flex-wrap items-baseline gap-3">
                                <span className="font-mono font-extrabold text-2xl sm:text-3xl text-vgs-blue-electric">
                                    {formatRupiah(finalPrice)}
                                </span>
                                {compareAtPrice && compareAtPrice > finalPrice && (
                                    <>
                                        <span className="font-mono text-sm sm:text-base text-vgs-silver-muted line-through">
                                            {formatRupiah(compareAtPrice)}
                                        </span>
                                        <Badge variant="sale" size="xs">
                                            Hemat {discountPercent}%
                                        </Badge>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Variant Selector */}
                        {product.variants && product.variants.length > 0 && (
                            <VariantSelector
                                variants={product.variants}
                                selectedVariant={selectedVariant}
                                onSelectVariant={setSelectedVariant}
                            />
                        )}

                        {/* Quantity & Stock Stepper */}
                        <div className="flex flex-col gap-2 pt-2">
                            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-vgs-silver-mid">
                                Jumlah Pembelian:
                            </span>
                            <div className="flex items-center gap-4">
                                <QuantityStepper
                                    value={quantity}
                                    onChange={setQuantity}
                                    min={1}
                                    max={maxStock}
                                />
                                <span className="text-xs font-mono text-vgs-silver-muted">
                                    Maksimal {maxStock} unit per pesanan
                                </span>
                            </div>
                        </div>

                        {/* CTA Buttons: Add to Cart & Buy Now */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            <Button
                                variant="secondary"
                                size="lg"
                                block
                                onClick={handleAddToCart}
                                disabled={maxStock === 0}
                                icon={
                                    <svg className="w-5 h-5 text-vgs-blue-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                }
                            >
                                Tambah ke Keranjang
                            </Button>

                            <Button
                                variant="primary"
                                size="lg"
                                block
                                onClick={handleBuyNow}
                                disabled={maxStock === 0}
                            >
                                Beli Sekarang
                            </Button>
                        </div>

                        {/* Value Proposition Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-vgs-black-surface/50 border border-vgs-gray-border/60 text-xs">
                            <div className="flex items-center gap-2.5">
                                <svg className="w-4 h-4 text-vgs-blue-electric shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span className="text-vgs-silver-mid font-medium">Garansi Resmi 2 Tahun</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <svg className="w-4 h-4 text-vgs-blue-electric shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span className="text-vgs-silver-mid font-medium">Pengiriman Instan & Aman</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <svg className="w-4 h-4 text-vgs-blue-electric shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span className="text-vgs-silver-mid font-medium">7 Hari Ganti Baru</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BOTTOM SECTION: Detailed Tabs (Deskripsi, Spesifikasi, Ulasan) */}
                <div className="mt-16 sm:mt-20 border-t border-vgs-gray-border/80 pt-10">
                    {/* Tab Navigation Header */}
                    <div className="flex items-center gap-4 sm:gap-8 border-b border-vgs-gray-border overflow-x-auto pb-px">
                        <button
                            type="button"
                            onClick={() => setActiveTab('description')}
                            className={`pb-4 text-sm sm:text-base font-display font-bold tracking-wide transition-all border-b-2 cursor-pointer ${
                                activeTab === 'description'
                                    ? 'border-vgs-blue-electric text-vgs-blue-electric shadow-[0_2px_8px_var(--vgs-blue-electric)]'
                                    : 'border-transparent text-vgs-silver-mid hover:text-vgs-silver-bright'
                            }`}
                        >
                            Deskripsi Produk
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('specifications')}
                            className={`pb-4 text-sm sm:text-base font-display font-bold tracking-wide transition-all border-b-2 cursor-pointer ${
                                activeTab === 'specifications'
                                    ? 'border-vgs-blue-electric text-vgs-blue-electric shadow-[0_2px_8px_var(--vgs-blue-electric)]'
                                    : 'border-transparent text-vgs-silver-mid hover:text-vgs-silver-bright'
                            }`}
                        >
                            Spesifikasi Teknis
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('reviews')}
                            className={`pb-4 text-sm sm:text-base font-display font-bold tracking-wide transition-all border-b-2 cursor-pointer ${
                                activeTab === 'reviews'
                                    ? 'border-vgs-blue-electric text-vgs-blue-electric shadow-[0_2px_8px_var(--vgs-blue-electric)]'
                                    : 'border-transparent text-vgs-silver-mid hover:text-vgs-silver-bright'
                            }`}
                        >
                            Ulasan ({product.reviewCount})
                        </button>
                    </div>

                    {/* Tab Content Panels */}
                    <div className="py-8">
                        {/* 1. Tab Deskripsi */}
                        {activeTab === 'description' && (
                            <div className="max-w-4xl flex flex-col gap-6 leading-relaxed text-vgs-silver-mid text-sm sm:text-base">
                                <p className="text-lg text-vgs-silver-bright font-medium leading-relaxed">
                                    {product.description}
                                </p>
                              <div className="p-6 rounded-2xl bg-vgs-black-surface border border-vgs-gray-border flex flex-col gap-3">
    <h3 className="font-display font-bold text-base text-vgs-silver-bright uppercase tracking-wider">
        Sorotan Fitur Utama:
    </h3>

    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-vgs-blue-electric shrink-0" />
            <span>Respons cepat dengan teknologi low-latency</span>
        </li>

        <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-vgs-blue-electric shrink-0" />
            <span>Material berkualitas untuk penggunaan jangka panjang</span>
        </li>

        <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-vgs-blue-electric shrink-0" />
            <span>Desain ergonomis untuk kenyamanan saat bermain</span>
        </li>

        <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-vgs-blue-electric shrink-0" />
            <span>Pengaturan dan konfigurasi yang fleksibel sesuai kebutuhan</span>
        </li>
    </ul>
</div>
                            </div>
                        )}

                        {/* 2. Tab Spesifikasi */}
                        {activeTab === 'specifications' && (
                            <div className="max-w-4xl">
                                <SpecTable specifications={product.specifications} />
                            </div>
                        )}

                        {/* 3. Tab Ulasan */}
                        {activeTab === 'reviews' && (
                            <div className="max-w-4xl flex flex-col gap-6">
                                {/* Review Summary Card */}
                                <div className="p-6 rounded-2xl bg-vgs-black-surface border border-vgs-gray-border flex flex-col sm:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-4 text-center sm:text-left">
                                        <div className="font-display font-black text-4xl sm:text-5xl text-vgs-blue-electric">
                                            {product.rating.toFixed(1)}
                                        </div>
                                        <div>
                                            <RatingStars rating={product.rating} size="md" />
                                            <p className="text-xs font-mono text-vgs-silver-muted mt-1">
                                                Berdasarkan {product.reviewCount} ulasan pembeli terverifikasi
                                            </p>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 rounded-xl bg-vgs-black-elevated border border-vgs-gray-border text-xs font-mono text-vgs-silver-mid text-center">
                                        98% Gamer Merekomendasikan Produk Ini
                                    </div>
                                </div>

                                {/* Review Items List */}
                                <div className="flex flex-col gap-4">
                                    {noReviews ? (
                                        <div className="p-8 rounded-2xl bg-vgs-black-surface/60 border border-dashed border-vgs-gray-border text-center text-sm text-vgs-silver-muted">
                                            Belum ada ulasan untuk produk ini.
                                        </div>
                                    ) : (
                                        reviews.map((rev) => (
                                            <div
                                                key={rev.id}
                                                className="p-5 rounded-2xl bg-vgs-black-surface/60 border border-vgs-gray-border flex flex-col gap-3"
                                            >
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-vgs-blue-electric/20 border border-vgs-blue-electric/40 font-mono font-bold text-xs text-vgs-blue-electric flex items-center justify-center">
                                                            {rev.author.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold text-xs sm:text-sm text-vgs-silver-bright">
                                                                {rev.author}
                                                            </span>
                                                            <span className="text-[11px] font-mono text-vgs-silver-muted block">
                                                                {rev.date || ''}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <RatingStars rating={rev.rating} size="xs" />
                                                </div>

                                                <p className="text-sm text-vgs-silver-mid leading-relaxed">
                                                    &quot;{rev.comment}&quot;
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products Section */}
                <RelatedProducts
                    currentProductId={product.id}
                    categoryId={product.categoryId}
                    categoryName={product.category?.name}
                />
            </div>
        </StorefrontLayout>
    );
}
