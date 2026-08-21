import React, { useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { useCart } from '@/context/CartContext';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import Button from '@/components/ui/Button';

export interface CartDropdownProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CartDropdown: React.FC<CartDropdownProps> = ({ isOpen, onClose }) => {
    const { items, cartCount, cartSubtotal, updateQuantity, removeFromCart } = useCart();
    const panelRef = useRef<HTMLDivElement>(null);

    // Close on escape key
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Keranjang Belanja">
            {/* Dark Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Slide-over Panel from Right */}
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
                <div
                    ref={panelRef}
                    className="w-screen max-w-md bg-vgs-black-elevated border-l border-vgs-gray-border flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-vgs-gray-border bg-vgs-black-surface">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-vgs-blue-electric/15 border border-vgs-blue-electric/30 flex items-center justify-center text-vgs-blue-electric">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="font-display font-bold text-lg text-vgs-silver-bright">
                                    Keranjang Belanja
                                </h2>
                                <p className="text-[11px] font-mono text-vgs-silver-muted">
                                    {cartCount} {cartCount === 1 ? 'item' : 'items'} terpilih
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="w-8 h-8 rounded-lg text-vgs-silver-mid hover:text-white hover:bg-vgs-black-elevated flex items-center justify-center transition-colors cursor-pointer"
                            aria-label="Tutup keranjang"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Cart Items Content */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center py-16 px-4">
                                <div className="w-16 h-16 rounded-2xl bg-vgs-black-surface border border-vgs-gray-border flex items-center justify-center text-vgs-silver-muted mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <h3 className="font-display font-bold text-lg text-vgs-silver-bright mb-1">
                                    Keranjang Masih Kosong
                                </h3>
                                <p className="text-xs text-vgs-silver-muted max-w-xs mb-6">
                                    Pilih perangkat gaming terbaik untuk melengkapi setup kemenangan Anda.
                                </p>
                                <Button
                                    variant="primary"
                                    size="md"
                                    href="/products"
                                    onClick={onClose}
                                >
                                    Eksplor Katalog Produk
                                </Button>
                            </div>
                        ) : (
                            items.map((item) => (
                                <CartItem
                                    key={`${item.productId}-${item.variantId || 'default'}`}
                                    item={item}
                                    compact
                                    onUpdateQuantity={(qty) =>
                                        updateQuantity(item.productId, item.variantId, qty)
                                    }
                                    onRemove={() =>
                                        removeFromCart(item.productId, item.variantId)
                                    }
                                />
                            ))
                        )}
                    </div>

                    {/* Footer Summary */}
                    {items.length > 0 && (
                        <div className="border-t border-vgs-gray-border p-4 sm:p-6 bg-vgs-black-surface">
                            <CartSummary
                                subtotal={cartSubtotal}
                                showPromoInput={false}
                                showViewCartButton={true}
                                onViewCart={onClose}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartDropdown;
