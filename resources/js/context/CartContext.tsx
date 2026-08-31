import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { router } from '@inertiajs/react';
import type { CartItem, Product, ProductVariant } from '@/types/product';
import type { ToastData } from '@/components/ui/Toast';
import {
    fetchCart,
    addCartItem,
    updateCartItem,
    removeCartItem,
    clearCartApi,
    type CartPayload,
} from '@/lib/api';

export interface AddToCartOptions {
    openDrawer?: boolean;
    showToast?: boolean;
}

export const getCartItemKey = (item: Pick<CartItem, 'productId' | 'variantId'>) =>
    `${item.productId}-${item.variantId || 'default'}`;

interface CartContextType {
    items: CartItem[];
    cartCount: number;
    cartSubtotal: number;
    selectedKeys: string[];
    selectedItems: CartItem[];
    selectedCount: number;
    selectedSubtotal: number;
    isAllSelected: boolean;
    toggleSelect: (item: CartItem) => void;
    setSelectAll: (selected: boolean) => void;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
    openCart: () => void;
    closeCart: () => void;
    isAuthenticated: boolean;
    isLoginModalOpen: boolean;
    openLoginModal: () => void;
    closeLoginModal: () => void;
    addToCart: (
        product: Product,
        quantity?: number,
        variant?: ProductVariant | null,
        options?: AddToCartOptions
    ) => boolean;
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

const itemUnitPrice = (item: CartItem) => {
    if (!item.product) return 0;
    return item.product.price + (item.variant?.priceModifier || 0);
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export interface CartProviderProps {
    children: React.ReactNode;
    initialUser?: unknown;
}

const toCartItem = (server: CartPayload['items'][number]): CartItem => ({
    id: server.id,
    productId: server.productId,
    variantId: server.variantId,
    quantity: server.quantity,
    product: server.product || undefined,
    variant: server.variant || undefined,
});

export const CartProvider: React.FC<CartProviderProps> = ({ children, initialUser }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(initialUser));

    // Pantau perubahan status login (misal setelah login / logout) lewat
    // event navigasi Inertia, agar keranjang selalu konsisten dengan sesi.
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handler = (event: any) => {
            const user = event?.detail?.page?.props?.auth?.user ?? null;
            setIsAuthenticated(Boolean(user));
        };
        const offSuccess = router.on('success', handler);
        const offError = router.on('error', handler);
        return () => {
            offSuccess();
            offError();
        };
    }, []);

    const [items, setItems] = useState<CartItem[]>([]);
    const isAuthenticatedRef = useRef(isAuthenticated);
    isAuthenticatedRef.current = isAuthenticated;

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [toast, setToast] = useState<ToastData | null>(null);
    const [selectedKeys, setSelectedKeys] = useState<string[]>(() => {
        if (typeof window === 'undefined') return [];
        try {
            const saved = localStorage.getItem('vgs_cart_selected_v1');
            if (saved) return JSON.parse(saved) as string[];
        } catch {
            // ignore
        }
        return [];
    });

    useEffect(() => {
        try {
            localStorage.setItem('vgs_cart_selected_v1', JSON.stringify(selectedKeys));
        } catch {
            // ignore
        }
    }, [selectedKeys]);

    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);

    const syncFromServer = useCallback(async (payload?: CartPayload) => {
        let data = payload;
        if (!data) {
            data = await fetchCart();
        }
        setItems(data.items.map(toCartItem));
    }, []);

    const applyServerPayload = useCallback(
        (payload: CartPayload) => {
            setItems(payload.items.map(toCartItem));
        },
        []
    );

    // Muat keranjang dari server saat pengguna login; kosongkan saat logout.
    useEffect(() => {
        let cancelled = false;
        if (isAuthenticated) {
            syncFromServer()
                .catch(() => {
                    if (cancelled) return;
                    setItems([]);
                });
        } else {
            setItems([]);
        }
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    const showToast = (toastData: Omit<ToastData, 'id'>) => {
        setToast({
            ...toastData,
            id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        });
    };

    const hideToast = () => {
        setToast(null);
    };

    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

    const cartSubtotal = items.reduce((acc, item) => acc + itemUnitPrice(item) * item.quantity, 0);

    const addToCart = (
        product: Product,
        quantity: number = 1,
        variant: ProductVariant | null = null,
        options: AddToCartOptions = { openDrawer: false, showToast: true }
    ): boolean => {
        if (quantity <= 0) return false;

        // Tamu / pengguna yang belum login tidak boleh menambahkan produk.
        if (!isAuthenticatedRef.current) {
            openLoginModal();
            return false;
        }

        const variantId = variant?.id || product.variants?.[0]?.id;

        // Produk tanpa varian tidak dapat ditambahkan (DB cart memerlukan variant).
        if (variantId === undefined) {
            showToast({
                type: 'error',
                title: 'Produk ini belum tersedia untuk dibeli.',
            });
            return false;
        }

        const maxStock = variant?.stock ?? product.stock ?? 99;

        addCartItem(variantId, quantity)
            .then((payload) => {
                applyServerPayload(payload);
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
            })
            .catch((err: Error) => {
                showToast({
                    type: 'error',
                    title: err.message || 'Gagal menambahkan produk ke keranjang.',
                });
            });

        if (options.openDrawer) {
            setIsCartOpen(true);
        }

        return true;
    };

    const updateQuantity = (
        productId: number | string,
        variantId: number | string | null | undefined,
        quantity: number
    ): void => {
        const target = items.find(
            (item) =>
                String(item.productId) === String(productId) &&
                String(item.variantId || '') === String(variantId || '')
        );

        if (!target || target.id === undefined) return;

        const maxStock = target.variant?.stock ?? target.product?.stock ?? 99;

        if (quantity <= 0) {
            setItems((prev) => prev.filter((item) => item.id !== target.id));
            removeCartItem(target.id).then(applyServerPayload).catch(() => syncFromServer());
            return;
        }

        setItems((prev) =>
            prev.map((item) =>
                item.id === target.id ? { ...item, quantity: Math.min(quantity, maxStock) } : item
            )
        );
        updateCartItem(target.id, Math.min(quantity, maxStock))
            .then(applyServerPayload)
            .catch(() => syncFromServer());
    };

    const removeFromCart = (
        productId: number | string,
        variantId: number | string | null | undefined
    ): void => {
        const target = items.find(
            (item) =>
                String(item.productId) === String(productId) &&
                String(item.variantId || '') === String(variantId || '')
        );

        if (!target || target.id === undefined) return;

        if (selectedKeys.includes(getCartItemKey(target))) {
            setSelectedKeys((prev) => prev.filter((key) => key !== getCartItemKey(target)));
        }

        setItems((prev) => prev.filter((item) => item.id !== target.id));
        removeCartItem(target.id).then(applyServerPayload).catch(() => syncFromServer());
    };

    const clearCart = (): void => {
        setItems([]);
        setSelectedKeys([]);
        clearCartApi().then(applyServerPayload).catch(() => syncFromServer());
    };

    const toggleSelect = (item: CartItem) => {
        const key = getCartItemKey(item);
        setSelectedKeys((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        );
    };

    const setSelectAll = (selected: boolean) => {
        setSelectedKeys(selected ? items.map((i) => getCartItemKey(i)) : []);
    };

    const selectedItems = items.filter((i) => selectedKeys.includes(getCartItemKey(i)));

    const selectedCount = selectedItems.reduce((acc, item) => acc + item.quantity, 0);

    const selectedSubtotal = selectedItems.reduce(
        (acc, item) => acc + itemUnitPrice(item) * item.quantity,
        0
    );

    const isAllSelected = items.length > 0 && selectedKeys.length === items.length;

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    return (
        <CartContext.Provider
            value={{
                items,
                cartCount,
                cartSubtotal,
                selectedKeys,
                selectedItems,
                selectedCount,
                selectedSubtotal,
                isAllSelected,
                toggleSelect,
                setSelectAll,
                isCartOpen,
                setIsCartOpen,
                openCart,
                closeCart,
                isAuthenticated,
                isLoginModalOpen,
                openLoginModal,
                closeLoginModal,
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
    selectedKeys: [],
    selectedItems: [],
    selectedCount: 0,
    selectedSubtotal: 0,
    isAllSelected: false,
    toggleSelect: () => {},
    setSelectAll: () => {},
    isCartOpen: false,
    setIsCartOpen: () => {},
    openCart: () => {},
    closeCart: () => {},
    isAuthenticated: false,
    isLoginModalOpen: false,
    openLoginModal: () => {},
    closeLoginModal: () => {},
    addToCart: () => false,
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