import React, { useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { formatRupiah } from '@/data/dummy-products';

export interface ToastData {
    id: string;
    type?: 'success' | 'info' | 'warning' | 'error';
    title: string;
    message?: string;
    productName?: string;
    productImage?: string;
    variantName?: string;
    quantity?: number;
    price?: number;
    actionUrl?: string;
    actionText?: string;
    duration?: number;
}

export interface ToastProps {
    toast: ToastData | null;
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
    useEffect(() => {
        if (!toast) return;
        const duration = toast.duration ?? 3500;
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [toast, onClose]);

    if (!toast) return null;

    return (
        <div className="fixed bottom-5 right-4 left-4 sm:left-auto sm:right-6 z-[9999] flex justify-center sm:justify-end pointer-events-none">
            <div className="pointer-events-auto w-full max-w-sm sm:max-w-md bg-vgs-black-elevated/95 backdrop-blur-md border border-vgs-blue-electric/40 text-vgs-silver-bright p-4 rounded-2xl shadow-2xl shadow-vgs-blue-electric/15 flex items-center gap-3.5 animate-in fade-in slide-in-from-bottom-5 duration-300">
                {/* Product Image or Status Icon */}
                {toast.productImage ? (
                    <div className="w-12 h-12 rounded-xl bg-vgs-black-surface border border-vgs-gray-border p-1 shrink-0 overflow-hidden flex items-center justify-center">
                        <img
                            src={toast.productImage}
                            alt={toast.productName || 'Produk'}
                            className="w-full h-full object-contain"
                        />
                    </div>
                ) : (
                    <div className="w-10 h-10 rounded-xl bg-vgs-success/20 text-vgs-success border border-vgs-success/30 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-vgs-success shrink-0" />
                        <h4 className="text-xs font-bold text-white tracking-wide truncate">
                            {toast.title}
                        </h4>
                    </div>

                    {toast.productName && (
                        <p className="text-xs font-medium text-vgs-silver-bright truncate mt-0.5">
                            {toast.productName}
                        </p>
                    )}

                    <div className="flex items-center gap-2 text-[11px] font-mono text-vgs-silver-muted mt-0.5 truncate">
                        {toast.quantity && (
                            <span className="text-vgs-blue-electric font-semibold">
                                {toast.quantity}x
                            </span>
                        )}
                        {toast.variantName && (
                            <span className="truncate">Varian: {toast.variantName}</span>
                        )}
                        {toast.price !== undefined && (
                            <span>• {formatRupiah(toast.price)}</span>
                        )}
                    </div>
                </div>

                {/* Action CTA & Close Button */}
                <div className="flex items-center gap-2 shrink-0">
                    {toast.actionUrl && (
                        <Link
                            href={toast.actionUrl}
                            onClick={onClose}
                            className="px-3 py-1.5 rounded-lg bg-vgs-blue-electric/20 hover:bg-vgs-blue-electric text-vgs-blue-electric hover:text-white border border-vgs-blue-electric/40 text-xs font-semibold font-mono transition-colors"
                        >
                            {toast.actionText || 'Lihat'}
                        </Link>
                    )}

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-7 h-7 rounded-lg text-vgs-silver-muted hover:text-white hover:bg-vgs-black-surface flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Tutup notifikasi"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Toast;
