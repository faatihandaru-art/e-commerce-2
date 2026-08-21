import React from 'react';

export interface ChipProps {
    label?: string;
    selected?: boolean;
    disabled?: boolean;
    colorHex?: string | null;
    showCheck?: boolean;
    size?: 'sm' | 'md';
    onClick?: () => void;
    children?: React.ReactNode;
    className?: string;
}

export const Chip: React.FC<ChipProps> = ({
    label,
    selected = false,
    disabled = false,
    colorHex = null,
    showCheck = false,
    size = 'md',
    onClick,
    children,
    className = '',
}) => {
    const sizeClasses = size === 'sm' ? 'px-3 py-1.5 min-h-[32px]' : 'px-4 py-2 min-h-[38px]';

    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className={`inline-flex items-center gap-2 rounded-xl text-xs font-medium border transition-all duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vgs-blue-electric ${sizeClasses} ${
                selected
                    ? 'border-vgs-blue-electric bg-vgs-blue-electric/10 text-white shadow-xs font-semibold'
                    : 'border-vgs-gray-border bg-vgs-black-surface text-vgs-silver-mid hover:border-vgs-silver-muted/60 hover:text-vgs-silver-bright hover:bg-vgs-black-elevated'
            } ${disabled ? 'opacity-40 cursor-not-allowed line-through hover:border-vgs-gray-border' : ''} ${className}`}
        >
            {colorHex && (
                <span
                    className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                    style={{ backgroundColor: colorHex }}
                />
            )}

            <span>{children || label}</span>

            {selected && showCheck && (
                <svg className="w-3.5 h-3.5 text-vgs-blue-electric shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                    />
                </svg>
            )}
        </button>
    );
};

export default Chip;
