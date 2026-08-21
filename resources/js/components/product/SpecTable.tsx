import React from 'react';

export interface SpecTableProps {
    specifications: Record<string, string>;
    className?: string;
}

export const SpecTable: React.FC<SpecTableProps> = ({
    specifications = {},
    className = '',
}) => {
    const entries = Object.entries(specifications);

    if (entries.length === 0) {
        return (
            <div className="p-6 text-center text-sm text-vgs-silver-muted bg-vgs-black-surface rounded-xl border border-vgs-gray-border">
                Spesifikasi teknis belum tersedia untuk produk ini.
            </div>
        );
    }

    return (
        <div className={`overflow-hidden rounded-2xl border border-vgs-gray-border bg-vgs-black-surface shadow-sm ${className}`}>
            <div className="px-5 py-3.5 bg-vgs-black-elevated/70 border-b border-vgs-gray-border flex items-center justify-between">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-vgs-silver-mid">
                    Parameter Teknis
                </span>
                <span className="text-xs font-mono text-vgs-silver-muted">
                    {entries.length} Spesifikasi
                </span>
            </div>

            <div className="divide-y divide-vgs-gray-border/60">
                {entries.map(([key, value], index) => (
                    <div
                        key={key}
                        className={`grid grid-cols-1 sm:grid-cols-3 gap-2 px-5 py-3.5 text-sm transition-colors hover:bg-vgs-black-elevated/30 ${
                            index % 2 === 1 ? 'bg-vgs-black-surface/50' : 'bg-transparent'
                        }`}
                    >
                        <div className="font-mono text-xs uppercase tracking-wide text-vgs-silver-muted sm:col-span-1 flex items-center">
                            {key}
                        </div>
                        <div className="text-vgs-silver-bright font-medium sm:col-span-2 break-words">
                            {value}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SpecTable;
