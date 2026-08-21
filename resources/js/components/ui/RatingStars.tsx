import React from 'react';

export interface RatingStarsProps {
    /** Nilai rating desimal 0-5, misal 4.5 */
    rating: number;
    /** Tampilkan angka rating di samping bintang */
    showValue?: boolean;
    /** Tampilkan jumlah review, misal "(238)" */
    reviewCount?: number;
    size?: 'xs' | 'sm' | 'md';
    className?: string;
}

const SIZE_CLASSES = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4.5 h-4.5',
} as const;

function Star({ fillPercent, sizeClass }: { fillPercent: number; sizeClass: string }) {
    return (
        <span className={`relative inline-block shrink-0 ${sizeClass}`} aria-hidden="true">
            <svg className={`absolute inset-0 text-vgs-silver-muted ${sizeClass}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.539 1.118l-3.366-2.445a1 1 0 00-1.176 0l-3.367 2.445c-.783.57-1.838-.196-1.538-1.118l1.286-3.957a1 1 0 00-.363-1.118L2.063 9.385c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.285-3.958z" />
            </svg>
            <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercent}%` }}
            >
                <svg className={`${sizeClass} text-vgs-warning`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.539 1.118l-3.366-2.445a1 1 0 00-1.176 0l-3.367 2.445c-.783.57-1.838-.196-1.538-1.118l1.286-3.957a1 1 0 00-.363-1.118L2.063 9.385c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.285-3.958z" />
                </svg>
            </span>
        </span>
    );
}

export const RatingStars: React.FC<RatingStarsProps> = ({
    rating,
    showValue = false,
    reviewCount,
    size = 'sm',
    className = '',
}) => {
    const clamped = Math.max(0, Math.min(5, rating));
    const sizeClass = SIZE_CLASSES[size];

    return (
        <div
            className={`inline-flex items-center gap-1.5 ${className}`}
            role="img"
            aria-label={`Rating ${clamped.toFixed(1)} dari 5`}
        >
            <div className="inline-flex items-center gap-0.5">
                {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} fillPercent={(clamped - i) * 100} sizeClass={sizeClass} />
                ))}
            </div>
            {showValue && (
                <span className="font-mono text-xs font-semibold text-vgs-silver-bright">
                    {clamped.toFixed(1)}
                </span>
            )}
            {typeof reviewCount === 'number' && (
                <span className="text-xs text-vgs-silver-muted">({reviewCount})</span>
            )}
        </div>
    );
};

export default RatingStars;
