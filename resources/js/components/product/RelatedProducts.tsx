import React from 'react';
import type { Product } from '@/types/product';
import ProductCard from '@/components/product/ProductCard';
import { getProductsByCategory, getFeaturedProducts } from '@/data/dummy-products';

export interface RelatedProductsProps {
    currentProductId: number | string;
    categoryId: number | string;
    categoryName?: string;
    onAddToCart?: (product: Product) => void;
    className?: string;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
    currentProductId,
    categoryId,
    categoryName,
    onAddToCart,
    className = '',
}) => {
    // Fetch products in same category
    let related = getProductsByCategory(categoryId).filter(
        (p) => String(p.id) !== String(currentProductId)
    );

    // If less than 4 related items, complement with featured products
    if (related.length < 4) {
        const featured = getFeaturedProducts().filter(
            (p) => String(p.id) !== String(currentProductId) && !related.some((r) => r.id === p.id)
        );
        related = [...related, ...featured];
    }

    // Cap at 4 items
    const displayProducts = related.slice(0, 4);

    if (displayProducts.length === 0) return null;

    return (
        <section className={`py-12 border-t border-vgs-gray-border/60 ${className}`}>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8">
                <div>
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-vgs-blue-electric">
                        KATEGORI {categoryName ? categoryName.toUpperCase() : 'SERUPA'}
                    </span>
                    <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-vgs-silver-bright tracking-wide mt-1">
                        Rekomendasi Perlengkapan Terkait
                    </h2>
                </div>
                <p className="text-xs text-vgs-silver-muted font-mono">
                    Menampilkan {displayProducts.length} produk pilihan
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={onAddToCart}
                    />
                ))}
            </div>
        </section>
    );
};

export default RelatedProducts;
