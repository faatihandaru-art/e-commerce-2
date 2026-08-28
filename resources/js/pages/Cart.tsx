import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import Button from '@/components/ui/Button';
import { useCart, getCartItemKey } from '@/context/CartContext';

export default function Cart() {
    const {
        items,
        cartCount,
        selectedItems,
        selectedSubtotal,
        isAllSelected,
        setSelectAll,
        toggleSelect,
        updateQuantity,
        removeFromCart,
        clearCart,
    } = useCart();

    const handleCheckout = () => {
        if (selectedItems.length === 0) return;
        router.visit('/checkout');
    };

    const hasSelection = selectedItems.length > 0;

    return (
        <StorefrontLayout>
            <Head title="Keranjang Belanja — Vortix Gaming Store" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs font-mono text-vgs-silver-muted mb-6">
                    <Link href="/" className="hover:text-vgs-silver-bright transition-colors">
                        Home
                    </Link>
                    <span>/</span>
                    <span className="text-vgs-silver-bright font-medium">Keranjang Belanja</span>
                </nav>

                {/* Page Title & Item Count Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 border-b border-vgs-gray-border/80">
                    <div>
                        <span className="text-xs font-mono font-bold text-vgs-blue-electric uppercase tracking-widest">
                            RINGKASAN PEMBELIAN
                        </span>
                        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-vgs-silver-bright tracking-wide mt-1">
                            Keranjang Belanja Anda
                        </h1>
                    </div>

                    {items.length > 0 && (
                        <div className="flex items-center gap-4">
                            {/* Select All Checkbox */}
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <button
                                    type="button"
                                    role="checkbox"
                                    aria-checked={isAllSelected}
                                    onClick={() => setSelectAll(!isAllSelected)}
                                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer ${
                                        isAllSelected
                                            ? 'bg-vgs-blue-electric border-vgs-blue-electric text-white'
                                            : 'border-vgs-gray-border text-transparent hover:border-vgs-silver-mid'
                                    }`}
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </button>
                                <span className="text-xs font-mono text-vgs-silver-mid">
                                    {isAllSelected ? 'Semua Terpilih' : 'Pilih Semua'}
                                </span>
                            </label>

                            <span className="text-xs font-mono text-vgs-silver-mid">
                                Total: <span className="text-vgs-blue-electric font-bold">{cartCount}</span> item
                            </span>
                            <button
                                type="button"
                                onClick={clearCart}
                                className="text-xs font-mono text-vgs-silver-muted hover:text-vgs-danger underline cursor-pointer"
                            >
                                Kosongkan Keranjang
                            </button>
                        </div>
                    )}
                </div>

                {/* Cart Body */}
                {items.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left Column: Cart Items List */}
                        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
                            {items.map((item) => (
                                <CartItem
                                    key={getCartItemKey(item)}
                                    item={item}
                                    selectable
                                    selected={selectedItems.some(
                                        (s) => getCartItemKey(s) === getCartItemKey(item)
                                    )}
                                    onToggleSelect={() => toggleSelect(item)}
                                    onUpdateQuantity={(qty) =>
                                        updateQuantity(item.productId, item.variantId, qty)
                                    }
                                    onRemove={() =>
                                        removeFromCart(item.productId, item.variantId)
                                    }
                                />
                            ))}

                            {/* Back to Shopping Button */}
                            <div className="pt-4">
                                <Link
                                    href="/products"
                                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-vgs-blue-electric hover:underline"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    <span>Lanjut Belanja Gear Lainnya</span>
                                </Link>
                            </div>
                        </div>

                        {/* Right Column: Sticky Cart Summary */}
                        <div className="lg:col-span-5 xl:col-span-4 sticky top-28">
                            <div className="flex flex-col gap-3 mb-3">
                                <div className="rounded-2xl bg-vgs-black-elevated border border-vgs-gray-border p-4">
                                    <p className="text-xs font-mono text-vgs-silver-muted mb-1">
                                        PRODUK TERPILIH
                                    </p>
                                    <p className="font-display font-bold text-vgs-silver-bright text-lg">
                                        {hasSelection ? (
                                            <>
                                                {selectedItems.length} dari {items.length} produk dipilih
                                                <span className="block text-sm font-mono text-vgs-blue-electric mt-0.5">
                                                    ({selectedItems.reduce((a, i) => a + i.quantity, 0)} item)
                                                </span>
                                            </>
                                        ) : (
                                            'Belum ada produk dipilih'
                                        )}
                                    </p>
                                </div>
                            </div>

                            <CartSummary
                                subtotal={selectedSubtotal}
                                showPromoInput={true}
                                showViewCartButton={false}
                                onCheckout={handleCheckout}
                            />

                            {!hasSelection && items.length > 0 && (
                                <p className="text-xs text-vgs-silver-muted text-center mt-3">
                                    Centang produk yang ingin di-checkout terlebih dahulu.
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Empty Cart State */
                    <div className="flex flex-col items-center justify-center text-center py-16 sm:py-24 px-4 bg-vgs-black-surface/40 rounded-3xl border border-dashed border-vgs-gray-border max-w-2xl mx-auto">
                        <div className="w-20 h-20 rounded-3xl bg-vgs-black-surface border border-vgs-gray-border flex items-center justify-center text-vgs-silver-muted mb-6 shadow-xl">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-vgs-silver-bright mb-2">
                            Keranjang Belanja Anda Kosong
                        </h2>
                        <p className="text-sm text-vgs-silver-muted max-w-md mb-8">
                            Belum ada gear turnamen yang ditambahkan. Temukan mouse, keyboard, monitor, dan aksesoris pro untuk setup Anda sekarang.
                        </p>
                        <Button
                            variant="primary"
                            size="lg"
                            href="/products"
                            icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            }
                        >
                            Jelajahi Katalog Gear
                        </Button>
                    </div>
                )}
            </div>
        </StorefrontLayout>
    );
}
