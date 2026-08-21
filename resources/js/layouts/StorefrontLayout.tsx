import React from 'react';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import CartDropdown from '@/components/cart/CartDropdown';
import { CartProvider, useCart } from '@/context/CartContext';

export interface StorefrontLayoutProps {
    children: React.ReactNode;
}

const StorefrontLayoutContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { cartCount, isCartOpen, openCart, closeCart } = useCart();

    return (
        <div className="min-h-screen bg-vgs-black-void text-vgs-silver-bright flex flex-col font-sans selection:bg-vgs-blue-electric selection:text-white antialiased">
            {/* Sticky Top Navigation */}
            <Navbar cartCount={cartCount} onOpenCart={openCart} />

            {/* Main Content */}
            <main className="flex-1 w-full">{children}</main>

            {/* Global Storefront Footer */}
            <Footer />

            {/* Cart Slide-in Drawer */}
            <CartDropdown isOpen={isCartOpen} onClose={closeCart} />
        </div>
    );
};

export const StorefrontLayout: React.FC<StorefrontLayoutProps> = ({ children }) => {
    return (
        <CartProvider>
            <StorefrontLayoutContent>{children}</StorefrontLayoutContent>
        </CartProvider>
    );
};

export default StorefrontLayout;
