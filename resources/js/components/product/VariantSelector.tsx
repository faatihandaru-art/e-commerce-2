import React from 'react';
import type { ProductVariant } from '@/types/product';
import Chip from '@/components/ui/Chip';
import { formatRupiah } from '@/data/dummy-products';

export interface VariantSelectorProps {
    variants: ProductVariant[];
    selectedVariant: ProductVariant | null;
    onSelectVariant: (variant: ProductVariant) => void;
    className?: string;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
    variants = [],
    selectedVariant,
    onSelectVariant,
    className = '',
}) => {
    if (!variants || variants.length === 0) return null;

    // Group variants by variant name (e.g., 'Color', 'Switch')
    const groupedVariants = variants.reduce<Record<string, ProductVariant[]>>((acc, variant) => {
        const groupName = variant.name || 'Pilihan';
        if (!acc[groupName]) {
            acc[groupName] = [];
        }
        acc[groupName].push(variant);
        return acc;
    }, {});

    return (
        <div className={`flex flex-col gap-4 ${className}`}>
            {Object.entries(groupedVariants).map(([groupName, items]) => (
                <div key={groupName} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold uppercase tracking-wider text-vgs-silver-mid font-mono">
                            {groupName}:
                        </span>
                        {selectedVariant && items.some(i => i.id === selectedVariant.id) && (
                            <span className="font-medium text-vgs-silver-bright">
                                {selectedVariant.value}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                        {items.map((variant) => {
                            const isSelected = selectedVariant?.id === variant.id;
                            const isOutOfStock = variant.stock === 0;

                            return (
                                <div key={variant.id} className="relative">
                                    <Chip
                                        selected={isSelected}
                                        disabled={isOutOfStock}
                                        showCheck={isSelected}
                                        onClick={() => !isOutOfStock && onSelectVariant(variant)}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <span>{variant.value}</span>
                                            {variant.priceModifier && variant.priceModifier > 0 ? (
                                                <span className="text-[11px] font-mono text-vgs-blue-electric">
                                                    (+{formatRupiah(variant.priceModifier)})
                                                </span>
                                            ) : null}
                                        </div>
                                    </Chip>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default VariantSelector;
