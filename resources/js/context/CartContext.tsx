import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem, Product, ProductVariant } from '@/types/product';
import type { ToastData } from '@/components/ui/Toast';
import { getProductById } from '@/data/dummy-products';

export interface AddToCartOptions {
    openDrawer?: boolean;
    showToast?: boolean;
}

interface CartContextType {
    items: CartItem[];
    cartCount: number;
    cartSubtotal: number;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
    openCart: () => void;
    closeCart: () => void;
    addToCart: (
        product: Product,
        quantity?: number,
        variant?: ProductVariant | null,
        options?: AddToCartOptions
    ) => void;
    updateQuantity: (
        productId: number | string,
        variantId: number | string | null | undefined,
        quantity: number
    ) => void;
    removeFromCart: (
        productId: number | string,
        variantId: number | string | null | undefined
    ) => void;
    clearCart: () => void;
    toast: ToastData | null;
    showToast: (toastData: Omit<ToastData, 'id'>) => void;
    hideToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'vgs_cart_items_v1';

// Initial default items for previewing if storage is empty
const INITIAL_DEFAULT_ITEMS: CartItem[] = [
    {
        id: 'cart-init-1',
        productId: 'prod-gm-01',
        variantId: 'var-gm-1',
        quantity: 1,
    },
    {
        id: 'cart-init-2',
        productId: 'prod-mp-01',
        variantId: undefined,
        quantity: 1,
    },
];

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>(() => {
        if (typeof window === 'undefined') return [];
        try {
            const saved = localStorage.getItem(CART_STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved) as CartItem[];
                return parsed;
            }
        } catch {
            // fallback if JSON parse fails
        }
        return INITIAL_DEFAULT_ITEMS;
    });

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [toast, setToast] = useState<ToastData | null>(null);

    const showToast = (toastData: Omit<ToastData, 'id'>) => {
        setToast({
            ...toastData,
            id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        });
    };

    const hideToast = () => {
        setToast(null);
    };

    // Save to localStorage when items change
    useEffect(() => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        } catch {
            // ignore localStorage quota errors
        }
    }, [items]);

    // Hydrate product and variant details
    const hydratedItems: CartItem[] = items.map((item) => {
        const product = item.product || getProductById(item.productId);
        const variant =
            item.variant ||
            (product && item.variantId
                ? product.variants?.find((v) => String(v.id) === String(item.variantId))
                : undefined);
        return {
            ...item,
            product,
            variant,
        };
    });

    const cartCount = hydratedItems.reduce((acc, item) => acc + item.quantity, 0);

    const cartSubtotal = hydratedItems.reduce((acc, item) => {
        if (!item.product) return acc;
        const basePrice = item.product.price;
        const modifier = item.variant?.priceModifier || 0;
        const finalUnitPrice = basePrice + modifier;
        return acc + finalUnitPrice * item.quantity;
    }, 0);

    const addToCart = (
        product: Product,
        quantity: number = 1,
        variant: ProductVariant | null = null,
        options: AddToCartOptions = { openDrawer: false, showToast: true }
    ) => {
        if (quantity <= 0) return;
        const variantId = variant?.id || undefined;

        setItems((prev) => {
            const existingIndex = prev.findIndex(
                (item) =>
                    String(item.productId) === String(product.id) &&
                    String(item.variantId || '') === String(variantId || '')
            );

            if (existingIndex > -1) {
                const updated = [...prev];
                const maxStock = variant?.stock ?? product.stock ?? 99;
                const newQty = Math.min(updated[existingIndex].quantity + quantity, maxStock);
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: newQty,
                    product,
                    variant: variant || undefined,
                };
                return updated;
            }

            return [
                ...prev,
                {
                    id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                    productId: product.id,
                    variantId: variantId,
                    quantity: Math.min(quantity, variant?.stock ?? product.stock ?? 99),
                    product,
                    variant: variant || undefined,
                },
            ];
        });

        // Trigger toast feedback if enabled (default true)
        if (options.showToast !== false) {
            const unitPrice = product.price + (variant?.priceModifier || 0);
            showToast({
                type: 'success',
                title: 'Produk berhasil ditambahkan ke keranjang!',
                productName: product.name,
                productImage: product.images && product.images.length > 0 ? product.images[0] : undefined,
                variantName: variant ? variant.value : undefined,
                quantity: quantity,
                price: unitPrice * quantity,
                actionUrl: '/cart',
                actionText: 'Lihat Keranjang',
            });
        }

        if (options.openDrawer) {
            setIsCartOpen(true);
        }
    };

    const updateQuantity = (
        productId: number | string,
        variantId: number | string | null | undefined,
        quantity: number
    ) => {
        setItems((prev) => {
            if (quantity <= 0) {
                return prev.filter(
                    (item) =>
                        !(
                            String(item.productId) === String(productId) &&
                            String(item.variantId || '') === String(variantId || '')
                        )
                );
            }

            return prev.map((item) => {
                if (
                    String(item.productId) === String(productId) &&
                    String(item.variantId || '') === String(variantId || '')
                ) {
                    const maxStock = item.variant?.stock ?? item.product?.stock ?? 99;
                    return {
                        ...item,
                        quantity: Math.min(quantity, maxStock),
                    };
                }
                return item;
            });
        });
    };

    const removeFromCart = (
        productId: number | string,
        variantId: number | string | null | undefined
    ) => {
        setItems((prev) =>
            prev.filter(
                (item) =>
                    !(
                        String(item.productId) === String(productId) &&
                        String(item.variantId || '') === String(variantId || '')
                    )
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    return (
        <CartContext.Provider
            value={{
                items: hydratedItems,
                cartCount,
                cartSubtotal,
                isCartOpen,
                setIsCartOpen,
                openCart,
                closeCart,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                toast,
                showToast,
                hideToast,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

const fallbackCartContext: CartContextType = {
    items: [],
    cartCount: 0,
    cartSubtotal: 0,
    isCartOpen: false,
    setIsCartOpen: () => {},
    openCart: () => {},
    closeCart: () => {},
    addToCart: () => {},
    updateQuantity: () => {},
    removeFromCart: () => {},
    clearCart: () => {},
    toast: null,
    showToast: () => {},
    hideToast: () => {},
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        console.warn('useCart was called outside of a CartProvider. Using default fallback cart state.');
        return fallbackCartContext;
    }
    return context;
};
