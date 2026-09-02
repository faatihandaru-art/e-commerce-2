import React from 'react';

export interface InputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'suffix'> {
    label?: string;
    error?: string;
    hint?: string;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    labelRight?: React.ReactNode;
    containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    hint,
    prefix,
    suffix,
    labelRight,
    containerClassName = '',
    className = '',
    id,
    disabled,
    required,
    ...props
}) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
        <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-xs font-semibold uppercase tracking-wider text-vgs-silver-mid flex items-center justify-between"
                >
                    <span>
                        {label} {required && <span className="text-vgs-danger">*</span>}
                    </span>
                    {labelRight}
                </label>
            )}

            <div className="relative flex items-center w-full">
                {prefix && (
                    <div className="absolute left-3.5 flex items-center pointer-events-none text-vgs-silver-muted text-sm">
                        {prefix}
                    </div>
                )}

                <input
                    id={inputId}
                    disabled={disabled}
                    required={required}
                    className={`w-full bg-vgs-black-surface text-vgs-silver-bright placeholder:text-vgs-silver-muted text-sm rounded-xl px-4 py-3 border transition-[border-color,box-shadow,background-color] duration-200 focus:outline-none min-h-[44px] ${
                        prefix ? 'pl-10' : ''
                    } ${suffix ? 'pr-10' : ''} ${
                        error
                            ? 'border-vgs-danger focus:border-vgs-danger focus:ring-2 focus:ring-vgs-danger/20'
                            : 'border-vgs-gray-border hover:border-vgs-silver-muted/50 focus:border-vgs-blue-electric focus:ring-2 focus:ring-vgs-blue-electric/30 focus:bg-vgs-black-elevated'
                    } ${disabled ? 'opacity-50 cursor-not-allowed bg-vgs-black-void' : ''} ${className}`}
                    {...props}
                />

                {suffix && (
                    <div className="absolute right-3.5 flex items-center text-vgs-silver-muted text-sm">
                        {suffix}
                    </div>
                )}
            </div>

            {error && (
                <p className="text-xs text-vgs-danger flex items-center gap-1 mt-0.5">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span>{error}</span>
                </p>
            )}

            {!error && hint && <p className="text-xs text-vgs-silver-muted mt-0.5">{hint}</p>}
        </div>
    );
};

export default React.memo(Input);
