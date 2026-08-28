import React, { useState, useEffect } from 'react';
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
    const [showGoTop, setShowGoTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowGoTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-vgs-black-void text-vgs-silver-bright flex flex-col font-sans selection:bg-vgs-blue-electric selection:text-white antialiased">
            {/* Sticky Top Navigation */}
            <Navbar cartCount={cartCount} onOpenCart={openCart} />

            {/* Main Content */}
            <main className="flex-1 w-full">{children}</main>

            {/* Global Storefront Footer */}
            <Footer />

            {/* Go to Top Button */}
            {showGoTop && (
                <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-xl bg-vgs-blue-electric text-white shadow-lg /30 flex items-center justify-center hover:bg-vgs-blue-deep transition-all cursor-pointer"
                    aria-label="Kembali ke atas"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" />
                    </svg>
                </button>
            )}

            {/* Cart Slide-in Drawer */}
            <CartDropdown isOpen={isCartOpen} onClose={closeCart} />

            {/* Global Toast Notification */}
            <Toast toast={toast} onClose={hideToast} />
        </div>
    );
};

export default StorefrontLayout;
