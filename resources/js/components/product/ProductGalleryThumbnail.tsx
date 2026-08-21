import React from 'react';

export interface ProductGalleryThumbnailProps {
    src: string;
    alt: string;
    index: number;
    isActive: boolean;
    onClick: (index: number) => void;
    className?: string;
}

export const ProductGalleryThumbnail: React.FC<ProductGalleryThumbnailProps> = ({
    src,
    alt,
    index,
    isActive,
    onClick,
    className = '',
}) => {
    return (
        <button
            type="button"
            onClick={() => onClick(index)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick(index);
                }
            }}
            aria-label={`Lihat gambar ${index + 1}: ${alt}`}
            aria-current={isActive ? 'true' : undefined}
            className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-vgs-black-surface border transition-all duration-200 cursor-pointer p-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vgs-blue-electric ${
                isActive
                    ? 'border-vgs-blue-electric ring-2 ring-vgs-blue-electric/40 shadow-sm shadow-vgs-blue-electric/20 scale-100'
                    : 'border-vgs-gray-border hover:border-vgs-silver-muted/60 opacity-70 hover:opacity-100'
            } ${className}`}
        >
            <img
                src={src}
                alt={`${alt} - Thumbnail ${index + 1}`}
                loading="lazy"
                className="w-full h-full object-contain object-center rounded-lg"
            />
            {isActive && (
                <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-vgs-blue-electric" />
            )}
        </button>
    );
};

export default ProductGalleryThumbnail;
