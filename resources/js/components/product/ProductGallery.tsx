import React, { useState, useRef, useEffect, useCallback } from 'react';
import ProductGalleryThumbnail from './ProductGalleryThumbnail';

export interface ProductGalleryProps {
    images: string[];
    productName: string;
    badge?: string;
    className?: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
    images = [],
    productName,
    badge,
    className = '',
}) => {
    const safeImages = images.length > 0
        ? images
        : ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80'];

    const [activeIndex, setActiveIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    // Touch swipe state for mobile
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [touchEndX, setTouchEndX] = useState<number | null>(null);

    const thumbnailsContainerRef = useRef<HTMLDivElement>(null);

    const nextImage = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % safeImages.length);
    }, [safeImages.length]);

    const prevImage = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
    }, [safeImages.length]);

    // Handle keyboard navigation when gallery has focus
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextImage();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevImage();
        }
    };

    // Auto-scroll active thumbnail into view
    useEffect(() => {
        if (!thumbnailsContainerRef.current) return;
        const container = thumbnailsContainerRef.current;
        const activeThumbnail = container.children[activeIndex] as HTMLElement;
        if (activeThumbnail) {
            const containerLeft = container.scrollLeft;
            const containerWidth = container.clientWidth;
            const thumbLeft = activeThumbnail.offsetLeft;
            const thumbWidth = activeThumbnail.clientWidth;

            if (thumbLeft < containerLeft) {
                container.scrollTo({ left: thumbLeft - 8, behavior: 'smooth' });
            } else if (thumbLeft + thumbWidth > containerLeft + containerWidth) {
                container.scrollTo({ left: thumbLeft + thumbWidth - containerWidth + 8, behavior: 'smooth' });
            }
        }
    }, [activeIndex]);

    // Touch swipe handlers for mobile
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.targetTouches[0].clientX);
        setTouchEndX(null);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEndX(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStartX || !touchEndX) return;
        const diff = touchStartX - touchEndX;
        const minSwipeDistance = 45; // px

        if (diff > minSwipeDistance) {
            nextImage();
        } else if (diff < -minSwipeDistance) {
            prevImage();
        }
        setTouchStartX(null);
        setTouchEndX(null);
    };

    // Close lightbox on Escape
    useEffect(() => {
        if (!isLightboxOpen) return;
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsLightboxOpen(false);
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isLightboxOpen, nextImage, prevImage]);

    return (
        <div className={`flex flex-col gap-4 select-none ${className}`} onKeyDown={handleKeyDown} tabIndex={0} aria-label={`Galeri foto produk ${productName}`}>
            {/* Main Image Stage */}
            <div
                className="relative w-full aspect-[4/3] sm:aspect-[1/1] md:aspect-[4/3] rounded-2xl bg-vgs-black-surface border border-vgs-gray-border overflow-hidden flex items-center justify-center cursor-pointer group shadow-lg"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={() => setIsLightboxOpen(true)}
                role="region"
                aria-label="Tampilan gambar utama produk"
            >
                {/* Background Grid Pattern Accent */}
                <div className="absolute inset-0 bg-[radial-gradient(#2A2D35_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

                {/* Normal Main Image */}
                <img
                    src={safeImages[activeIndex]}
                    alt={`${productName} - Tampilan ${activeIndex + 1}`}
                    className="w-full h-full object-contain p-6"
                />

                {/* Image Counter Badge (Top Right) */}
                <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-lg bg-vgs-black-void/80 backdrop-blur-sm border border-vgs-gray-border text-[11px] font-mono text-vgs-silver-bright font-semibold shadow-sm">
                    {activeIndex + 1} / {safeImages.length}
                </div>

                {/* Badge Overlay (Top Left) */}
                {badge && (
                    <div className="absolute top-3 left-3 z-10">
                        <span className="px-2.5 py-1 rounded-md bg-vgs-blue-electric text-white text-[11px] font-mono font-bold uppercase tracking-wider shadow-sm">
                            {badge}
                        </span>
                    </div>
                )}

                {/* Quick Navigation Arrows (Visible on hover on desktop, always visible on mobile) */}
                {safeImages.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                prevImage();
                            }}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-vgs-black-elevated/90 hover:bg-vgs-blue-electric text-vgs-silver-bright hover:text-white border border-vgs-gray-border flex items-center justify-center transition-all duration-150 z-20 shadow-md md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-vgs-blue-electric cursor-pointer"
                            aria-label="Gambar sebelumnya"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                nextImage();
                            }}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-vgs-black-elevated/90 hover:bg-vgs-blue-electric text-vgs-silver-bright hover:text-white border border-vgs-gray-border flex items-center justify-center transition-all duration-150 z-20 shadow-md md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-vgs-blue-electric cursor-pointer"
                            aria-label="Gambar selanjutnya"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}

            </div>

            {/* Mobile Carousel Dots Indicator */}
            {safeImages.length > 1 && (
                <div className="flex md:hidden items-center justify-center gap-1.5 py-1">
                    {safeImages.map((_, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveIndex(idx)}
                            aria-label={`Pindah ke gambar ${idx + 1}`}
                            className={`h-2 rounded-full transition-all duration-200 cursor-pointer ${
                                activeIndex === idx
                                    ? 'w-6 bg-vgs-blue-electric shadow-[0_0_6px_var(--vgs-blue-electric)]'
                                    : 'w-2 bg-vgs-gray-border hover:bg-vgs-silver-muted'
                            }`}
                        />
                    ))}
                </div>
            )}

            {/* Thumbnail Strip (Scrollable on desktop & tablet) */}
            {safeImages.length > 1 && (
                <div className="relative flex items-center">
                    <div
                        ref={thumbnailsContainerRef}
                        className="flex items-center gap-3 overflow-x-auto py-1 px-0.5 scrollbar-thin scrollbar-thumb-vgs-gray-border no-scrollbar w-full"
                    >
                        {safeImages.map((img, index) => (
                            <ProductGalleryThumbnail
                                key={index}
                                src={img}
                                alt={productName}
                                index={index}
                                isActive={activeIndex === index}
                                onClick={setActiveIndex}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Fullscreen Lightbox Modal */}
            {isLightboxOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Tampilan penuh gambar ${productName}`}
                >
                    {/* Top Bar with Title & Close */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-50">
                        <div className="flex items-center gap-3">
                            <span className="font-display font-bold text-lg text-vgs-silver-bright truncate max-w-xs sm:max-w-md">
                                {productName}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-vgs-black-elevated border border-vgs-gray-border text-xs font-mono text-vgs-silver-mid">
                                {activeIndex + 1} / {safeImages.length}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsLightboxOpen(false)}
                            className="w-10 h-10 rounded-xl bg-vgs-black-elevated hover:bg-vgs-danger hover:text-white text-vgs-silver-bright border border-vgs-gray-border flex items-center justify-center transition-colors cursor-pointer"
                            aria-label="Tutup pratinjau"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Main High-Res Image */}
                    <div className="relative max-w-4xl max-h-[75vh] flex items-center justify-center p-4">
                        <img
                            src={safeImages[activeIndex]}
                            alt={`${productName} - Tampilan Resolusi Penuh`}
                            className="max-h-[70vh] max-w-full object-contain rounded-xl shadow-2xl"
                        />

                        {safeImages.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={prevImage}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-vgs-black-elevated/90 hover:bg-vgs-blue-electric text-vgs-silver-bright hover:text-white border border-vgs-gray-border flex items-center justify-center transition-all cursor-pointer shadow-lg"
                                    aria-label="Gambar sebelumnya"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={nextImage}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-vgs-black-elevated/90 hover:bg-vgs-blue-electric text-vgs-silver-bright hover:text-white border border-vgs-gray-border flex items-center justify-center transition-all cursor-pointer shadow-lg"
                                    aria-label="Gambar selanjutnya"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Bottom Thumbnail Strip in Lightbox */}
                    {safeImages.length > 1 && (
                        <div className="absolute bottom-6 flex items-center gap-2 max-w-md overflow-x-auto px-4 py-2 bg-vgs-black-surface/80 rounded-2xl border border-vgs-gray-border">
                            {safeImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setActiveIndex(idx)}
                                    className={`w-12 h-12 rounded-lg overflow-hidden border transition-all p-1 bg-vgs-black-void shrink-0 cursor-pointer ${
                                        activeIndex === idx
                                            ? 'border-vgs-blue-electric ring-2 ring-vgs-blue-electric/50'
                                            : 'border-vgs-gray-border opacity-60 hover:opacity-100'
                                    }`}
                                >
                                    <img src={img} alt="thumb" className="w-full h-full object-contain" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductGallery;
