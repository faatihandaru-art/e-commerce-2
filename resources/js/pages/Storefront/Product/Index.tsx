import React, { useState, useMemo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import ProductCard from '@/components/product/ProductCard';
import ProductFilterSidebar from '@/components/product/ProductFilterSidebar';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { categories, getProducts } from '@/data/dummy-products';
import type { Product, ProductFilter } from '@/types/product';
import { useCart } from '@/context/CartContext';

export default function ProductIndex() {
    const { url } = usePage();
    const { addToCart } = useCart();

    // Parse initial query params from URL if present
    const queryParams = useMemo(() => {
        if (typeof window === 'undefined') return new URLSearchParams();
        const searchPart = url.includes('?') ? url.split('?')[1] : window.location.search;
        return new URLSearchParams(searchPart);
    }, [url]);

    const initialCategorySlug = queryParams.get('category');
    const initialCategoryId = initialCategorySlug
        ? categories.find((c) => c.slug === initialCategorySlug)?.id || null
        : queryParams.get('categoryId') || null;

    const initialSearch = queryParams.get('search') || queryParams.get('q') || '';
    const initialSort = (queryParams.get('sort') as ProductFilter['sortBy']) || 'featured';

    const [filter, setFilter] = useState<ProductFilter>({
        categoryId: initialCategoryId,
        minPrice: null,
        maxPrice: null,
        sortBy: initialSort,
        search: initialSearch,
    });

    const [inStockOnly, setInStockOnly] = useState(false);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

    // Filter products
    const filteredProducts = useMemo(() => {
        let list = getProducts(filter);
        if (inStockOnly) {
            list = list.filter((p) => p.stock > 0);
        }
        return list;
    }, [filter, inStockOnly]);

    const totalAllCount = getProducts().length;

    const activeCategory = filter.categoryId
        ? categories.find((c) => String(c.id) === String(filter.categoryId))
        : null;

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter((prev) => ({
            ...prev,
            sortBy: e.target.value as ProductFilter['sortBy'],
        }));
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter((prev) => ({
            ...prev,
            search: e.target.value,
        }));
    };

    const handleResetFilter = () => {
        setFilter({
            categoryId: null,
            minPrice: null,
            maxPrice: null,
            sortBy: 'featured',
            search: '',
        });
        setInStockOnly(false);
    };

    const handleAddToCart = (product: Product) => {
        addToCart(product, 1);
    };

    return (
        <StorefrontLayout>
            <Head title="Katalog Produk Gaming — Vortix Gaming Store" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Header Banner */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-8 border-b border-vgs-gray-border/80">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-vgs-blue-electric uppercase tracking-widest">
                                KATALOG PERANGKAT VGS
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-vgs-blue-electric" />
                            <span className="text-xs font-mono text-vgs-silver-muted">
                                100% Esports Ready
                            </span>
                        </div>
                        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-vgs-silver-bright tracking-wide">
                            {activeCategory ? activeCategory.name : 'Semua Perlengkapan Gaming'}
                        </h1>
                        <p className="text-sm text-vgs-silver-mid max-w-2xl mt-1">
                            {activeCategory
                                ? activeCategory.description
                                : 'Peralatan gaming kompetitif kelas turnamen dengan sensor presisi, low-latency wireless, dan durabilitas tinggi.'}
                        </p>
                    </div>

                    {/* Quick Search & Mobile Filter Button */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Input
                                placeholder="Cari gear, brand, SKU..."
                                value={filter.search || ''}
                                onChange={handleSearchChange}
                                prefix={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                }
                                className="text-xs py-2.5"
                            />
                        </div>

                        {/* Mobile Drawer Trigger */}
                        <button
                            type="button"
                            onClick={() => setIsMobileDrawerOpen(true)}
                            className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-vgs-black-surface border border-vgs-gray-border text-vgs-silver-bright hover:border-vgs-blue-electric text-xs font-semibold shrink-0 min-h-[44px] cursor-pointer"
                            aria-label="Buka filter produk"
                        >
                            <svg className="w-4 h-4 text-vgs-blue-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            <span>Filter</span>
                        </button>
                    </div>
                </div>

                {/* Main Content Layout: Sidebar + Grid */}
                <div className="flex items-start gap-8">
                    {/* Left Sticky Sidebar Filter (Desktop) */}
                    <ProductFilterSidebar
                        categories={categories}
                        filter={filter}
                        onFilterChange={setFilter}
                        onResetFilter={handleResetFilter}
                        totalProductsCount={totalAllCount}
                        isMobileDrawerOpen={isMobileDrawerOpen}
                        onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
                    />

                    {/* Right Product Grid & Controls */}
                    <div className="flex-1 min-w-0 flex flex-col gap-6">
                        {/* Control Bar: Active Filter Chips & Sort Select */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-vgs-black-surface/50 border border-vgs-gray-border">
                            {/* Product Counter & Stock Checkbox */}
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                                <span className="text-xs font-mono text-vgs-silver-mid font-semibold">
                                    Menampilkan <span className="text-vgs-blue-electric font-bold">{filteredProducts.length}</span> dari {totalAllCount} produk
                                </span>

                                <label className="flex items-center gap-2 text-xs text-vgs-silver-mid cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={inStockOnly}
                                        onChange={(e) => setInStockOnly(e.target.checked)}
                                        className="rounded bg-vgs-black-void border-vgs-gray-border text-vgs-blue-electric focus:ring-vgs-blue-electric w-4 h-4 cursor-pointer"
                                    />
                                    <span>Hanya Stok Tersedia</span>
                                </label>
                            </div>

                            {/* Sort Dropdown */}
                            <div className="flex items-center gap-2 shrink-0">
                                <label htmlFor="sort-select" className="text-xs font-mono text-vgs-silver-muted uppercase tracking-wider">
                                    Urutkan:
                                </label>
                                <select
                                    id="sort-select"
                                    value={filter.sortBy || 'featured'}
                                    onChange={handleSortChange}
                                    className="bg-vgs-black-surface text-vgs-silver-bright border border-vgs-gray-border rounded-xl px-3 py-2 text-xs font-semibold focus:border-vgs-blue-electric focus:ring-1 focus:ring-vgs-blue-electric cursor-pointer"
                                >
                                    <option value="featured">Unggulan / Rekomendasi</option>
                                    <option value="price-asc">Harga: Terendah ke Tertinggi</option>
                                    <option value="price-desc">Harga: Tertinggi ke Terendah</option>
                                    <option value="rating">Rating Tertinggi</option>
                                    <option value="newest">Produk Terbaru</option>
                                </select>
                            </div>
                        </div>

                        {/* Active Filter Badges */}
                        {(activeCategory || filter.minPrice != null || filter.maxPrice != null || filter.search) && (
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-mono text-vgs-silver-muted">Filter Aktif:</span>
                                {activeCategory && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-vgs-blue-electric/15 border border-vgs-blue-electric/30 text-xs font-mono text-vgs-blue-electric">
                                        <span>Kategori: {activeCategory.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => setFilter((prev) => ({ ...prev, categoryId: null }))}
                                            className="hover:text-white cursor-pointer"
                                        >
                                            ✕
                                        </button>
                                    </span>
                                )}
                                {(filter.minPrice != null || filter.maxPrice != null) && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-vgs-blue-electric/15 border border-vgs-blue-electric/30 text-xs font-mono text-vgs-blue-electric">
                                        <span>
                                            Harga: {filter.minPrice ? `Rp ${filter.minPrice.toLocaleString()}` : '0'} - {filter.maxPrice ? `Rp ${filter.maxPrice.toLocaleString()}` : '∞'}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setFilter((prev) => ({ ...prev, minPrice: null, maxPrice: null }))}
                                            className="hover:text-white cursor-pointer"
                                        >
                                            ✕
                                        </button>
                                    </span>
                                )}
                                {filter.search && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-vgs-blue-electric/15 border border-vgs-blue-electric/30 text-xs font-mono text-vgs-blue-electric">
                                        <span>Pencarian: &quot;{filter.search}&quot;</span>
                                        <button
                                            type="button"
                                            onClick={() => setFilter((prev) => ({ ...prev, search: '' }))}
                                            className="hover:text-white cursor-pointer"
                                        >
                                            ✕
                                        </button>
                                    </span>
                                )}
                                <button
                                    type="button"
                                    onClick={handleResetFilter}
                                    className="text-xs font-mono text-vgs-silver-muted hover:text-vgs-danger underline ml-1 cursor-pointer"
                                >
                                    Hapus Semua
                                </button>
                            </div>
                        )}

                        {/* Product Grid (2 cols mobile, 3 cols tablet, 3-4 cols desktop) */}
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onAddToCart={handleAddToCart}
                                    />
                                ))}
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="flex flex-col items-center justify-center text-center p-12 sm:p-16 rounded-2xl bg-vgs-black-surface/40 border border-dashed border-vgs-gray-border">
                                <div className="w-16 h-16 rounded-2xl bg-vgs-black-surface border border-vgs-gray-border flex items-center justify-center text-vgs-silver-muted mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="font-display font-bold text-xl text-vgs-silver-bright mb-2">
                                    Tidak Ada Produk yang Cocok
                                </h3>
                                <p className="text-sm text-vgs-silver-muted max-w-md mb-6">
                                    Coba ubah kriteria filter, kurangi kata kunci pencarian, atau reset rentang harga.
                                </p>
                                <Button variant="secondary" size="md" onClick={handleResetFilter}>
                                    Reset Semua Filter
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}
