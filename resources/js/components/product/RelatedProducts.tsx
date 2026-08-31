import React, { useEffect, useState } from 'react';
import type { Product } from '@/types/product';
import ProductCard from '@/components/product/ProductCard';
import { getCatalog, getFeaturedProducts, ApiError } from '@/lib/api';

export interface RelatedProductsProps {
    currentProductId: number | string;
    categoryId: number | string;
    categoryName?: string;
    className?: string;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
    currentProductId,
    categoryId,
    categoryName,
    className = '',
}) => {
    const [related, setRelated] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);

        const load = async () => {
            let list: Product[] = [];
            try {
                const sameCategory = await getCatalog({ categoryId }, { perPage: 4 });
                list = sameCategory.data.filter(
                    (p) => String(p.id) !== String(currentProductId)
                );
            } catch (err) {
                console.error('[RelatedProducts] Gagal memuat:', err instanceof ApiError ? err.message : err);
            }

            if (list.length < 4) {
                try {
                    const featured = await getFeaturedProducts(8);
                    const extra = featured.filter(
                        (p) =>
                            String(p.id) !== String(currentProductId) &&
                            !list.some((r) => String(r.id) === String(p.id))
                    );
                    list = [...list, ...extra];
                } catch (err) {
                    console.error('[RelatedProducts] Gagal memuat unggulan:', err instanceof ApiError ? err.message : err);
                }
            }

            if (!cancelled) {
                setRelated(list.slice(0, 4));
                setIsLoading(false);
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, [currentProductId, categoryId]);

    if (isLoading) {
        return (
            <div className={`py-12 border-t border-vgs-gray-border/60 ${className}`}>
                <div className="h-5 w-48 bg-vgs-black-elevated rounded animate-pulse mb-8" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="aspect-[3/4] rounded-2xl bg-vgs-black-elevated border border-vgs-gray-border animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (related.length === 0) return null;

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
                    Menampilkan {related.length} produk pilihan
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>
        </section>
    );
};

export default RelatedProducts;