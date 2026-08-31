import React, { useState } from 'react';
import type { Category, ProductFilter } from '@/types/product';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { formatRupiah } from '@/lib/format';

export interface ProductFilterSidebarProps {
    categories: Category[];
    filter: ProductFilter;
    onFilterChange: (newFilter: ProductFilter) => void;
    onResetFilter: () => void;
    totalProductsCount: number;
    isMobileDrawerOpen?: boolean;
    onCloseMobileDrawer?: () => void;
    className?: string;
}

export const ProductFilterSidebar: React.FC<ProductFilterSidebarProps> = ({
    categories = [],
    filter,
    onFilterChange,
    onResetFilter,
    totalProductsCount,
    isMobileDrawerOpen = false,
    onCloseMobileDrawer,
    className = '',
}) => {
    const [minPriceInput, setMinPriceInput] = useState<string>(
        filter.minPrice != null ? String(filter.minPrice) : ''
    );
    const [maxPriceInput, setMaxPriceInput] = useState<string>(
        filter.maxPrice != null ? String(filter.maxPrice) : ''
    );

    const handleCategoryClick = (categoryId: number | string | null) => {
        onFilterChange({
            ...filter,
            categoryId: filter.categoryId === categoryId ? null : categoryId,
        });
    };

    const handleApplyPriceFilter = (e: React.FormEvent) => {
        e.preventDefault();
        const min = minPriceInput.trim() !== '' ? Number(minPriceInput) : null;
        const max = maxPriceInput.trim() !== '' ? Number(maxPriceInput) : null;
        onFilterChange({
            ...filter,
            minPrice: min,
            maxPrice: max,
        });
    };

    const handleQuickPriceRange = (min: number | null, max: number | null) => {
        setMinPriceInput(min != null ? String(min) : '');
        setMaxPriceInput(max != null ? String(max) : '');
        onFilterChange({
            ...filter,
            minPrice: min,
            maxPrice: max,
        });
    };

    const hasActiveFilters = Boolean(
        filter.categoryId ||
        filter.minPrice != null ||
        filter.maxPrice != null ||
        filter.search ||
        (filter.sortBy && filter.sortBy !== 'featured')
    );

    const sidebarContent = (
        <div className="flex flex-col gap-6">
            {/* Header Filter / Reset */}
            <div className="flex items-center justify-between pb-4 border-b border-vgs-gray-border/80">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-vgs-blue-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span className="font-display font-bold text-base text-vgs-silver-bright tracking-wide">
                        Filter Produk
                    </span>
                </div>
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={() => {
                            setMinPriceInput('');
                            setMaxPriceInput('');
                            onResetFilter();
                        }}
                        className="text-xs font-mono text-vgs-blue-electric hover:underline cursor-pointer"
                    >
                        Reset Semua
                    </button>
                )}
            </div>

            {/* Category Filter Section */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-vgs-silver-mid">
                        Kategori ({categories.length})
                    </span>
                </div>

                <div
                    className="flex flex-col gap-1 max-h-72 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-vgs-gray-border"
                    onWheel={(e) => e.stopPropagation()}
                >
                    {/* All Categories Option */}
                    <button
                        type="button"
                        onClick={() => handleCategoryClick(null)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                            !filter.categoryId
                                ? 'bg-vgs-blue-electric/15 text-vgs-blue-electric border border-vgs-blue-electric/30 font-semibold'
                                : 'text-vgs-silver-mid hover:text-vgs-silver-bright hover:bg-vgs-black-surface'
                        }`}
                    >
                        <span>Semua Kategori</span>
                        <span className="text-[11px] font-mono text-vgs-silver-muted">
                            {totalProductsCount}
                        </span>
                    </button>

                    {/* Category List */}
                    {categories.map((cat) => {
                        const isSelected = String(filter.categoryId) === String(cat.id);
                        return (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => handleCategoryClick(cat.id)}
                                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                                    isSelected
                                        ? 'bg-vgs-blue-electric/15 text-vgs-blue-electric border border-vgs-blue-electric/30 font-semibold'
                                        : 'text-vgs-silver-mid hover:text-vgs-silver-bright hover:bg-vgs-black-surface'
                                }`}
                            >
                                <span className="truncate pr-2">{cat.name}</span>
                                {typeof cat.productCount === 'number' && (
                                    <span className="text-[11px] font-mono text-vgs-silver-muted shrink-0">
                                        {cat.productCount}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Price Range Filter Section */}
            <div className="flex flex-col gap-3 pt-4 border-t border-vgs-gray-border/60">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-vgs-silver-mid">
                    Rentang Harga (IDR)
                </span>

                <form onSubmit={handleApplyPriceFilter} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                        <Input
                            type="number"
                            placeholder="Min"
                            value={minPriceInput}
                            onChange={(e) => setMinPriceInput(e.target.value)}
                            className="text-xs py-2 px-3 font-mono"
                        />
                        <Input
                            type="number"
                            placeholder="Maks"
                            value={maxPriceInput}
                            onChange={(e) => setMaxPriceInput(e.target.value)}
                            className="text-xs py-2 px-3 font-mono"
                        />
                    </div>

                    <Button variant="secondary" size="sm" block type="submit">
                        Terapkan Rentang
                    </Button>
                </form>

                {/* Quick Price Buckets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                    <button
                        type="button"
                        onClick={() => handleQuickPriceRange(null, 500000)}
                        className="px-2.5 py-1 rounded-lg bg-vgs-black-surface border border-vgs-gray-border text-[11px] font-mono text-vgs-silver-mid hover:border-vgs-blue-electric hover:text-white transition-all cursor-pointer"
                    >
                        &lt; 500rb
                    </button>
                    <button
                        type="button"
                        onClick={() => handleQuickPriceRange(500000, 1500000)}
                        className="px-2.5 py-1 rounded-lg bg-vgs-black-surface border border-vgs-gray-border text-[11px] font-mono text-vgs-silver-mid hover:border-vgs-blue-electric hover:text-white transition-all cursor-pointer"
                    >
                        500rb - 1.5jt
                    </button>
                    <button
                        type="button"
                        onClick={() => handleQuickPriceRange(1500000, null)}
                        className="px-2.5 py-1 rounded-lg bg-vgs-black-surface border border-vgs-gray-border text-[11px] font-mono text-vgs-silver-mid hover:border-vgs-blue-electric hover:text-white transition-all cursor-pointer"
                    >
                        &gt; 1.5jt
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Fixed Sidebar */}
            <aside
                className={`hidden lg:block w-72 shrink-0 bg-vgs-black-surface/50 border border-vgs-gray-border rounded-2xl p-5 backdrop-blur-sm self-start sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-vgs-gray-border ${className}`}
                onWheel={(e) => e.stopPropagation()}
                aria-label="Panel filter produk"
            >
                {sidebarContent}
            </aside>

            {/* Mobile / Tablet Slide Drawer Modal */}
            {isMobileDrawerOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/75 backdrop-blur-sm animate-in fade-in"
                        onClick={onCloseMobileDrawer}
                        aria-hidden="true"
                    />

                    {/* Drawer Panel */}
                    <div className="relative w-full max-h-[85vh] overflow-y-auto bg-vgs-black-elevated border-t border-vgs-gray-border rounded-t-3xl p-6 shadow-2xl z-10 animate-in slide-in-from-bottom duration-300">
                        {/* Drawer Header with Close Button */}
                        <div className="flex items-center justify-between pb-4 mb-4 border-b border-vgs-gray-border">
                            <span className="font-display font-extrabold text-xl text-vgs-silver-bright">
                                Filter & Urutan
                            </span>
                            <button
                                type="button"
                                onClick={onCloseMobileDrawer}
                                className="w-8 h-8 rounded-lg bg-vgs-black-surface text-vgs-silver-mid hover:text-white flex items-center justify-center cursor-pointer"
                                aria-label="Tutup filter"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {sidebarContent}

                        {/* Mobile Drawer Bottom Action */}
                        <div className="mt-8 pt-4 border-t border-vgs-gray-border">
                            <Button
                                variant="primary"
                                size="lg"
                                block
                                onClick={onCloseMobileDrawer}
                            >
                                Tampilkan Hasil
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductFilterSidebar;
