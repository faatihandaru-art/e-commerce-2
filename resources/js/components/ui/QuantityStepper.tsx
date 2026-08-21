import React from 'react';

export interface QuantityStepperProps {
    value: number;
    onChange: (val: number) => void;
    min?: number;
    max?: number;
    disabled?: boolean;
    className?: string;
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
    value,
    onChange,
    min = 1,
    max = 99,
    disabled = false,
    className = '',
}) => {
    const handleDecrement = () => {
        if (value > min && !disabled) {
            onChange(value - 1);
        }
    };

    const handleIncrement = () => {
        if (value < max && !disabled) {
            onChange(value + 1);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = parseInt(e.target.value, 10);
        if (isNaN(val) || val < min) val = min;
        if (val > max) val = max;
        onChange(val);
    };

    return (
        <div className={`inline-flex items-center rounded-xl bg-vgs-black-surface border border-vgs-gray-border p-1 ${className}`}>
            <button
                type="button"
                disabled={disabled || value <= min}
                onClick={handleDecrement}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-vgs-silver-bright hover:bg-vgs-black-elevated hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors focus-visible:ring-2 focus-visible:ring-vgs-blue-electric cursor-pointer"
                aria-label="Kurangi jumlah"
            >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4" />
                </svg>
            </button>

            <input
                type="number"
                value={value}
                min={min}
                max={max}
                disabled={disabled}
                onChange={handleInputChange}
                className="w-12 text-center bg-transparent text-vgs-silver-bright font-mono text-sm font-semibold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                aria-label="Jumlah produk"
            />

            <button
                type="button"
                disabled={disabled || value >= max}
                onClick={handleIncrement}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-vgs-silver-bright hover:bg-vgs-black-elevated hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors focus-visible:ring-2 focus-visible:ring-vgs-blue-electric cursor-pointer"
                aria-label="Tambah jumlah"
            >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
            </button>
        </div>
    );
};

export default QuantityStepper;
