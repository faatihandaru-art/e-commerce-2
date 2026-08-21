import React from 'react';
import { Link } from '@inertiajs/react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    href?: string;
    loading?: boolean;
    block?: boolean;
    icon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    href,
    loading = false,
    disabled = false,
    block = false,
    icon,
    rightIcon,
    children,
    className = '',
    type = 'button',
    ...props
}) => {
    const variantClasses = {
        primary: 'bg-vgs-blue-electric text-white hover:bg-vgs-blue-deep shadow-sm hover:shadow-md hover:shadow-vgs-blue-electric/20 font-semibold',
        secondary: 'bg-vgs-black-surface/80 text-vgs-silver-bright border border-vgs-gray-border hover:border-vgs-blue-electric hover:bg-vgs-blue-electric/10 hover:text-white',
        outline: 'bg-transparent text-vgs-silver-bright border border-vgs-gray-border hover:border-vgs-blue-electric hover:bg-vgs-blue-electric/10 hover:text-white',
        ghost: 'bg-transparent text-vgs-silver-mid hover:text-vgs-silver-bright hover:bg-vgs-black-elevated',
        danger: 'bg-vgs-danger text-white hover:bg-vgs-danger/90 shadow-sm',
    }[variant];

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5 min-h-[32px]',
        md: 'px-5 py-2.5 text-sm rounded-xl gap-2 min-h-[44px]',
        lg: 'px-7 py-3.5 text-base rounded-xl gap-2.5 min-h-[48px] font-bold tracking-wide',
        icon: 'p-2.5 text-sm rounded-xl min-w-[40px] min-h-[40px] aspect-square',
    }[size];

    const baseClasses = `inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vgs-blue-electric focus-visible:ring-offset-2 focus-visible:ring-offset-vgs-black-void active:scale-[0.98] ${variantClasses} ${sizeClasses} ${block ? 'w-full' : ''} ${disabled || loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''} ${className}`;

    const content = (
        <>
            {loading && (
                <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}
            {!loading && icon && <span className="mr-2 inline-flex items-center">{icon}</span>}
            {children}
            {rightIcon && <span className="ml-2 inline-flex items-center">{rightIcon}</span>}
        </>
    );

    if (href) {
        return (
            <Link href={href} className={baseClasses} {...(props as any)}>
                {content}
            </Link>
        );
    }

    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={baseClasses}
            {...props}
        >
            {content}
        </button>
    );
};

export default Button;
