import React from 'react';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import CartDropdown from '@/components/cart/CartDropdown';
import Toast from '@/components/ui/Toast';
import { useCart } from '@/context/CartContext';

export interface StorefrontLayoutProps {
    children: React.ReactNode;
}

export const StorefrontLayout: React.FC<StorefrontLayoutProps> = ({ children }) => {
    const { cartCount, isCartOpen, openCart, closeCart, toast, hideToast } = useCart();

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

            {/* Global Toast Notification */}
            <Toast toast={toast} onClose={hideToast} />
        </div>
    );
};

export default StorefrontLayout;
