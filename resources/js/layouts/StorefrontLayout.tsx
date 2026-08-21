import React from 'react';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';

export interface StorefrontLayoutProps {
    cartCount?: number;
    children: React.ReactNode;
}

export const StorefrontLayout: React.FC<StorefrontLayoutProps> = ({ cartCount = 0, children }) => {
    return (
        <div className="min-h-screen bg-vgs-black-void text-vgs-silver-bright flex flex-col font-sans selection:bg-vgs-blue-electric selection:text-white antialiased">
            {/* Sticky Top Navigation */}
            <Navbar cartCount={cartCount} />

            {/* Main Content */}
            <main className="flex-1 w-full">{children}</main>

            {/* Global Storefront Footer */}
            <Footer />
        </div>
    );
};

export default StorefrontLayout;
