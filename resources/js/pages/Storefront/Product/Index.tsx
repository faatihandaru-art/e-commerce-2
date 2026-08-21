import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import ProductCard from '@/components/product/ProductCard';
import { getProducts } from '@/data/dummy-products';

/**
 * STUB HALAMAN PRODUCT LISTING
 * Dikerjakan secara lengkap oleh Orang 2 (BRIEF_ORANG2.md).
 * Orang 1 hanya menyediakan placeholder & fondasi layout / komponen.
 */
export default function ProductIndex() {
    const products = getProducts();

    return (
        <StorefrontLayout>
            <Head title="Katalog Produk — Vortix Gaming Store" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header Stub */}
                <div className="mb-8 border-b border-vgs-gray-border/60 pb-6">
                    <div className="text-xs font-mono text-vgs-blue-electric uppercase tracking-wider mb-1">
                        KATALOG LENGKAP VGS
                    </div>
                    <h1 className="font-display font-black text-3xl sm:text-4xl text-vgs-silver-bright">
                        Semua Perangkat Gaming
                    </h1>
                    <p className="text-sm text-vgs-silver-mid mt-1">
                        Filter kategori, harga, dan sorting sedang dibangun oleh Orang 2.
                    </p>
                </div>

                {/* Product Grid Stub */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.slice(0, 8).map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </StorefrontLayout>
    );
}
