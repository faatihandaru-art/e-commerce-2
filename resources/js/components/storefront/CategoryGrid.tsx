import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import type { Category } from '@/types/product';
import { getCategories, ApiError } from '@/lib/api';

export const CategoryGrid: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        getCategories()
            .then((list) => {
                if (cancelled) return;
                setCategories(list);
            })
            .catch((err: unknown) => {
                if (cancelled) return;
                console.error('[CategoryGrid] Gagal memuat kategori:', err instanceof ApiError ? err.message : err);
            })
            .finally(() => {
                if (cancelled) return;
                setIsLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const featuredCategories = categories.slice(0, 8);

    const getCategoryIcon = (iconName?: string) => {
        switch (iconName) {
            case 'Mouse':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="5" y="2" width="14" height="20" rx="7" strokeWidth="2" />
                        <path d="M12 6v4" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                );
            case 'Keyboard':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="2" y="4" width="20" height="16" rx="2" strokeWidth="2" />
                        <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M7 16h10" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                );
            case 'Headphones':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                );
            case 'Mic':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" strokeWidth="2" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                );
            case 'Monitor':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth="2" />
                        <path d="M8 21h8M12 17v4" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                );
            case 'Gamepad2':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <line x1="6" y1="12" x2="10" y2="12" strokeWidth="2" strokeLinecap="round" />
                        <line x1="8" y1="10" x2="8" y2="14" strokeWidth="2" strokeLinecap="round" />
                        <line x1="15" y1="13" x2="15.01" y2="13" strokeWidth="2.5" strokeLinecap="round" />
                        <line x1="18" y1="11" x2="18.01" y2="11" strokeWidth="2.5" strokeLinecap="round" />
                        <rect x="2" y="6" width="20" height="12" rx="6" strokeWidth="2" />
                    </svg>
                );
            case 'Square':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="16" rx="3" strokeWidth="2" />
                        <path d="M8 12h8" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                );
            case 'Armchair':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M7 4h10v7H7zM5 11h14v4H5zM8 15v5M16 15v5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="5" y="2" width="14" height="20" rx="7" strokeWidth="2" />
                    </svg>
                );
        }
    };

    return (
        <section className="py-14 sm:py-20 border-t border-vgs-gray-border/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                    <div>
                        <div className="inline-flex items-center gap-2 text-xs font-mono text-vgs-blue-electric font-semibold uppercase tracking-wider mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-vgs-blue-electric" />
                            <span>Katalog Perangkat</span>
                        </div>
                        <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-vgs-silver-bright tracking-tight">
                            Kategori Perlengkapan
                        </h2>
                        <p className="text-sm text-vgs-silver-mid mt-1.5 max-w-lg">
                            Pilih kategori gear untuk menemukan spesifikasi turnamen yang sesuai dengan gaya permainanmu.
                        </p>
                    </div>

                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 text-xs font-mono font-bold text-vgs-blue-electric hover:text-vgs-blue-glow transition-colors self-start sm:self-auto group py-2"
                    >
                        <span>Lihat Semua 31 Kategori</span>
                        <svg
                            className="w-4 h-4 transition-transform group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {/* Categories Grid: 2 columns on mobile, 4 on desktop */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    {isLoading
                        ? Array.from({ length: 8 }).map((_, i) => (
                              <div
                                  key={i}
                                  className="min-h-[140px] rounded-2xl bg-vgs-black-elevated border border-vgs-gray-border animate-pulse"
                              />
                          ))
                        : featuredCategories.map((cat) => (
                        <Link
                            key={cat.slug}
                            href={`/products?category=${cat.slug}`}
                            className="group relative flex flex-col p-5 sm:p-6 rounded-2xl bg-vgs-black-surface border border-vgs-gray-border hover:border-vgs-blue-electric hover:bg-vgs-black-elevated/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-vgs-blue-electric/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vgs-blue-electric min-h-[140px]"
                        >
                            {/* Top Row */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-vgs-black-void border border-vgs-gray-border flex items-center justify-center text-vgs-silver-bright group-hover:text-vgs-blue-electric group-hover:border-vgs-blue-electric/50 transition-colors shadow-xs">
                                    {getCategoryIcon(cat.icon)}
                                </div>

                                <span className="text-[11px] font-mono text-vgs-silver-muted group-hover:text-vgs-silver-mid transition-colors">
                                    {cat.productCount || 2} item
                                </span>
                            </div>

                            {/* Category Name */}
                            <h3 className="font-bold text-sm sm:text-base text-vgs-silver-bright group-hover:text-vgs-blue-electric transition-colors leading-tight mb-1.5">
                                {cat.name}
                            </h3>

                            {/* Short Description */}
                            <p className="text-xs text-vgs-silver-muted line-clamp-2 leading-relaxed mt-auto">
                                {cat.description}
                            </p>

                            {/* Corner Arrow Indicator */}
                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-vgs-blue-electric">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </Link>
                        ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;
