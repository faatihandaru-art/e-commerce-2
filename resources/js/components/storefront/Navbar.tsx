import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';

export interface NavbarProps {
    cartCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount = 0 }) => {
    const { url } = usePage();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { label: 'Home', path: '/' },
        { label: 'Product', path: '/products' },
        { label: 'About', path: '/about' },
    ];

    const isActive = (path: string) => {
        if (path === '/') return url === '/';
        return url.startsWith(path);
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`sticky top-0 z-40 w-full transition-all duration-300 border-b ${
                isScrolled
                    ? 'bg-vgs-black-elevated/95 backdrop-blur-md border-vgs-gray-border/80 shadow-lg shadow-black/40'
                    : 'bg-vgs-black-void/80 backdrop-blur-sm border-vgs-gray-border/30'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    
                    {/* Brand Logo (Simplified Navbar Wordmark) */}
                    <div className="flex items-center gap-8">
                        <Link
                            href="/"
                            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vgs-blue-electric rounded-lg px-1 py-0.5"
                        >
                            {/* Hexagonal Falcon V Icon */}
                            <div className="w-10 h-10 rounded-xl bg-vgs-black-surface border border-vgs-gray-border flex items-center justify-center group-hover:border-vgs-blue-electric transition-colors shadow-xs">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <polygon points="12 2, 21 7, 21 17, 12 22, 3 17, 3 7" stroke="#2B6FF6" strokeWidth="1.5" fill="#0A0A0C" />
                                    <path d="M7 8L12 17L17 8" stroke="#E8E9ED" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M10 8L12 12L14 8" stroke="#2B6FF6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                            {/* Wordmark */}
                            <div className="flex flex-col">
                                <div className="flex items-center font-display font-extrabold text-2xl tracking-wider leading-none">
                                    <span className="text-vgs-silver-bright">V</span>
                                    <span className="text-vgs-blue-electric">G</span>
                                    <span className="text-vgs-silver-bright">S</span>
                                </div>
                                <span className="text-[9px] font-mono tracking-widest text-vgs-silver-muted uppercase leading-tight mt-0.5">
                                    VORTIX GEAR
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation Links */}
                        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
                            {navItems.map((item) => {
                                const active = isActive(item.path);
                                return (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        className={`relative px-4 py-2 text-sm font-semibold tracking-wide transition-all rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vgs-blue-electric ${
                                            active
                                                ? 'text-vgs-blue-electric font-bold'
                                                : 'text-vgs-silver-mid hover:text-vgs-silver-bright hover:bg-vgs-black-surface/60'
                                        }`}
                                    >
                                        <span>{item.label}</span>
                                        {/* Active Underline indicator */}
                                        {active && (
                                            <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-vgs-blue-electric rounded-full shadow-[0_0_8px_var(--vgs-blue-electric)]" />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Right Side Actions (Cart, Login, Mobile Toggle) */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Cart Trigger with Badge */}
                        <Link
                            href="/cart"
                            className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-vgs-black-surface border border-vgs-gray-border text-vgs-silver-bright hover:text-white hover:border-vgs-blue-electric hover:bg-vgs-blue-electric/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vgs-blue-electric"
                            aria-label="Keranjang Belanja"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>

                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-vgs-blue-electric text-white text-[11px] font-mono font-bold flex items-center justify-center border-2 border-vgs-black-void shadow-sm animate-pulse">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Login Button (Leading to Login Orang 2) */}
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center px-4 sm:px-5 py-2.5 rounded-xl bg-vgs-blue-electric text-white text-xs sm:text-sm font-bold tracking-wide hover:bg-vgs-blue-deep transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-vgs-blue-electric min-h-[44px]"
                        >
                            Masuk
                        </Link>

                        {/* Mobile Hamburger Toggle */}
                        <button
                            type="button"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl bg-vgs-black-surface border border-vgs-gray-border text-vgs-silver-bright hover:text-white hover:border-vgs-blue-electric transition-colors focus-visible:ring-2 focus-visible:ring-vgs-blue-electric cursor-pointer"
                            aria-expanded={isMobileMenuOpen}
                            aria-label="Buka menu navigasi"
                        >
                            {!isMobileMenuOpen ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Slide-Down Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-vgs-gray-border bg-vgs-black-elevated px-4 pt-3 pb-5 space-y-1 shadow-2xl">
                    {navItems.map((item) => {
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
                                    active
                                        ? 'bg-vgs-blue-electric/15 text-vgs-blue-electric border border-vgs-blue-electric/30'
                                        : 'text-vgs-silver-mid hover:text-vgs-silver-bright hover:bg-vgs-black-surface'
                                }`}
                            >
                                <span>{item.label}</span>
                                <svg className="w-4 h-4 text-vgs-silver-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        );
                    })}
                </div>
            )}
        </header>
    );
};

export default Navbar;
