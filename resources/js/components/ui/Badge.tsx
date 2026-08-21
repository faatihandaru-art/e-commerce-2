import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'primary' | 'new' | 'sale' | 'warning' | 'danger' | 'success' | 'neutral';
    size?: 'xs' | 'sm' | 'md';
    dot?: boolean;
    children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
    variant = 'neutral',
    size = 'sm',
    dot = false,
    children,
    className = '',
    ...props
}) => {
    const variantClasses = {
        primary: 'bg-vgs-blue-electric/15 text-vgs-blue-electric border border-vgs-blue-electric/30',
        new: 'bg-vgs-blue-electric/15 text-vgs-blue-electric border border-vgs-blue-electric/30',
        sale: 'bg-vgs-blue-electric text-white border border-vgs-blue-glow shadow-xs',
        warning: 'bg-vgs-warning/15 text-vgs-warning border border-vgs-warning/30',
        danger: 'bg-vgs-danger/15 text-vgs-danger border border-vgs-danger/30',
        success: 'bg-vgs-success/15 text-vgs-success border border-vgs-success/30',
        neutral: 'bg-vgs-black-elevated text-vgs-silver-mid border border-vgs-gray-border',
    }[variant];

    const dotColorClasses = {
        primary: 'bg-vgs-blue-electric',
        new: 'bg-vgs-blue-electric',
        sale: 'bg-white',
        warning: 'bg-vgs-warning',
        danger: 'bg-vgs-danger',
        success: 'bg-vgs-success',
        neutral: 'bg-vgs-silver-muted',
    }[variant];

    const sizeClasses = {
        xs: 'text-[10px] px-2 py-0.5 rounded-sm font-mono',
        sm: 'text-[11px] px-2.5 py-0.5 rounded font-mono',
        md: 'text-xs px-3 py-1 rounded-md font-mono',
    }[size];

    return (
        <span
            className={`inline-flex items-center font-semibold uppercase tracking-wider select-none ${variantClasses} ${sizeClasses} ${className}`}
            {...props}
        >
            {dot && <span className={`w-1.5 h-1.5 rounded-full mr-1.5 shrink-0 ${dotColorClasses}`} />}
            {children}
        </span>
    );
};

export default Badge;
