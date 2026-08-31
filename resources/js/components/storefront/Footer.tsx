import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import type { Category } from '@/types/product';
import { getCategories, ApiError } from '@/lib/api';

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        let cancelled = false;
        getCategories()
            .then((list) => {
                if (cancelled) return;
                setCategories(list);
            })
            .catch((err: unknown) => {
                if (cancelled) return;
                console.error('[Footer] Gagal memuat kategori:', err instanceof ApiError ? err.message : err);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const popularCategories = categories.slice(0, 6);

    return (
        <footer className="mt-28 bg-vgs-black-surface border-t border-vgs-gray-border relative overflow-hidden">
            {/* Subtle Ambient Top Glow for technical depth */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-px bg-gradient-to-r from-transparent via-vgs-blue-electric/40 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-14">
                    
                    {/* Brand Info & Mission (Cols 1-2) */}
                    <div className="lg:col-span-2 space-y-5">
                        <Link href="/" className="flex items-center gap-3 group inline-flex">
                            <div className="w-10 h-10 rounded-xl r flex items-center justify-center group-hover:border-vgs-blue-electric transition-colors shadow-xs">
                               <img
                                    src="/images/products/logo..vgs2.png"
                                    alt="VORTIX STORE"
                                    className="w-14 h-14 object-contain drop-shadow-[0_0_30px_var()] transition-transform duration-500 hover:scale-105"
/>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-display font-black text-2xl tracking-wider text-vgs-silver-bright leading-none">
                                    VORTIX <span className="text-vgs-blue-electric">GAMING</span> STORE
                                </span>
                                <span className="text-[10px] font-mono tracking-widest text-vgs-silver-muted uppercase mt-0.5">
                                    
                                </span>
                            </div>
                        </Link>

                        <p className="text-sm text-vgs-silver-mid leading-relaxed max-w-sm">
                            Destinasi perlengkapan esports kompetitif & setup gaming profesional. Dibuat dengan presisi teknikal untuk performa turnamen tertinggi.
                        </p>

                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-vgs-black-void border border-vgs-gray-border text-xs font-mono text-vgs-silver-muted">
                            <span className="w-2 h-2 rounded-full bg-vgs-success animate-pulse" />
                            <span>"Gear Up. Play Hard. Win."</span>
                        </div>

                        {/* Social media links */}
                        <div className="flex items-center gap-2.5 pt-2">
                            <a
                                href="https://discord.gg"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-vgs-black-void border border-vgs-gray-border text-vgs-silver-muted flex items-center justify-center hover:text-vgs-blue-electric hover:border-vgs-blue-electric hover:bg-vgs-blue-electric/5 transition-colors"
                                aria-label="Discord VGS"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                                </svg>
                            </a>
                            <a
                                href="https://twitch.tv"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-vgs-black-void border border-vgs-gray-border text-vgs-silver-muted flex items-center justify-center hover:text-vgs-blue-electric hover:border-vgs-blue-electric hover:bg-vgs-blue-electric/5 transition-colors"
                                aria-label="Twitch VGS"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
                                </svg>
                            </a>
                            <a
                                href="https://whatsapp.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-vgs-black-void border border-vgs-gray-border text-vgs-silver-muted flex items-center justify-center hover:text-vgs-blue-electric hover:border-vgs-blue-electric hover:bg-vgs-blue-electric/5 transition-colors"
                                aria-label="YouTube VGS"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.48 0 .14 5.34.14 11.9c0 2.1.55 4.15 1.6 5.96L.04 24l6.28-1.65a11.9 11.9 0 0 0 5.71 1.46h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.42-8.43zM12.04 21.82h-.01a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.73.98 1-3.64-.24-.37a9.88 9.88 0 0 1-1.52-5.3C2.13 6.44 6.57 2 12.04 2c2.64 0 5.12 1.03 6.98 2.9a9.84 9.84 0 0 1 2.9 7c0 5.47-4.45 9.92-9.88 9.92zm5.43-7.43c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.91-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z"/>
                                </svg>
                            </a>
                            <a
                                href="https://x.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-vgs-black-void border border-vgs-gray-border text-vgs-silver-muted flex items-center justify-center hover:text-vgs-blue-electric hover:border-vgs-blue-electric hover:bg-vgs-blue-electric/5 transition-colors"
                                aria-label="X VGS"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Kolom 1: Kategori Populer */}
                    <div className="space-y-4">
                        <h4 className="font-display font-bold text-sm tracking-wider uppercase text-vgs-silver-bright">
                            Kategori Gear
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            {popularCategories.map((cat) => (
                                <li key={cat.slug}>
                                    <Link
                                        href={`/products?category=${cat.slug}`}
                                        className="text-vgs-silver-mid hover:text-vgs-blue-electric transition-colors inline-block"
                                    >
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Kolom 2: Bantuan */}
                    <div className="space-y-4">
                        <h4 className="font-display font-bold text-sm tracking-wider uppercase text-vgs-silver-bright">
                            Bantuan
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link href="/about" className="text-vgs-silver-mid hover:text-vgs-blue-electric transition-colors">
                                    Garansi Resmi VGS
                                </Link>
                            </li>
        
                            <li>
                                <Link href="/about" className="text-vgs-silver-mid hover:text-vgs-blue-electric transition-colors">
                                    FAQ & Pertanyaan Umum
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Kolom 3: Tentang Kami */}
                    <div className="space-y-4">
                        <h4 className="font-display font-bold text-sm tracking-wider uppercase text-vgs-silver-bright">
                            Tentang VGS
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link href="/about" className="text-vgs-silver-mid hover:text-vgs-blue-electric transition-colors">
                                    Cerita Brand Kami
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-vgs-silver-mid hover:text-vgs-blue-electric transition-colors">
                                    Standar Laboratorium Lab
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-vgs-silver-mid hover:text-vgs-blue-electric transition-colors">
                                    Kemitraan Turnamen
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-vgs-silver-mid hover:text-vgs-blue-electric transition-colors">
                                    Kebijakan Privasi
                                </Link>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Copyright Bar (paling gelap: vgs-black-void) */}
                <div className="pt-8 mt-8 border-t border-vgs-gray-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-vgs-silver-muted bg-vgs-black-void -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-2">
                        <span>&copy; {currentYear} Vortix Gaming Store (VGS). All rights reserved.</span>
                    </div>
                    <div className="flex items-center gap-4 text-vgs-silver-muted">
                        <span>ESPORTS GRADE HARDWARE</span>
                        <span className="text-vgs-gray-border">•</span>
                        <span className="text-vgs-blue-electric">100% ORIGINAL GUARANTEED</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
