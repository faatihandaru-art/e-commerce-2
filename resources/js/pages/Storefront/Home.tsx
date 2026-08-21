import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import HeroSection from '@/components/storefront/HeroSection';
import CategoryGrid from '@/components/storefront/CategoryGrid';
import PromoBanner from '@/components/storefront/PromoBanner';
import ProductCard from '@/components/product/ProductCard';
import { getFeaturedProducts } from '@/data/dummy-products';

export default function Home() {
    const featuredProducts = getFeaturedProducts().slice(0, 8);

    const features = [
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
            title: '100% Original & Garansi Resmi',
            desc: 'Semua unit didistribusikan resmi dengan garansi penggantian langsung 1-to-1 replacement jika terjadi cacat pabrik.',
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <polygon
                        points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
            title: 'Standar Kalibrasi Turnamen',
            desc: 'Setiap mouse, keyboard, dan monitor telah lolos uji latensi input dan stabilitas polling rate sub-millisecond.',
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="1" y="3" width="15" height="13" rx="2" strokeWidth="2" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" strokeWidth="2" />
                    <circle cx="5.5" cy="18.5" r="2.5" strokeWidth="2" />
                    <circle cx="18.5" cy="18.5" r="2.5" strokeWidth="2" />
                </svg>
            ),
            title: 'Pengiriman Aman Anti-Guncang',
            desc: 'Kemasan protektif berlapis foam tebal khusus peripheral presisi, siap dikirim cepat ke seluruh Indonesia.',
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="2" />
                    <circle cx="9" cy="7" r="4" strokeWidth="2" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="2" />
                </svg>
            ),
            title: 'Komunitas & Dukungan Teknis',
            desc: 'Akses langsung ke forum tuning firmware, preset audio turnamen, dan customer support teknikal 24/7.',
        },
    ];

    return (
        <StorefrontLayout>
            <Head title="Home — Professional Esports Gear" />

            <div className="space-y-4">
                {/* a. HERO SECTION with Layered Products & Hexagonal Geometry */}
                <HeroSection />

                {/* b. FEATURED CATEGORIES GRID (8 Selected of 14 Categories) */}
                <CategoryGrid />

                {/* c. PRODUK UNGGULAN / TERLARIS */}
                <section className="py-14 sm:py-20 border-t border-vgs-gray-border/60">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Section Header */}
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                            <div>
                                <div className="inline-flex items-center gap-2 text-xs font-mono text-vgs-blue-electric font-semibold uppercase tracking-wider mb-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-vgs-blue-electric" />
                                    <span>Pilihan Pro Player</span>
                                </div>
                                <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-vgs-silver-bright tracking-tight">
                                    Produk Unggulan Turnamen
                                </h2>
                                <p className="text-sm text-vgs-silver-mid mt-1.5 max-w-lg">
                                    Perangkat dengan performa teruji di panggung kompetisi esports global.
                                </p>
                            </div>

                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-vgs-blue-electric hover:text-vgs-blue-glow transition-colors self-start sm:self-auto group py-2"
                            >
                                <span>Lihat Semua Produk</span>
                                <svg
                                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>

                        {/* Featured Products Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* d. BANNER PROMOSI BUNDLE */}
                <PromoBanner />

                {/* e. KENAPA MEMILIH VGS (Pillars / Keunggulan) */}
                <section className="py-14 sm:py-20 border-t border-vgs-gray-border/60 bg-vgs-black-surface/40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-12">
                            <div className="inline-flex items-center gap-2 text-xs font-mono text-vgs-blue-electric font-semibold uppercase tracking-wider mb-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-vgs-blue-electric" />
                                <span>Standar Laboratorium VGS</span>
                            </div>
                            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-vgs-silver-bright tracking-tight">
                                Kenapa Atlet Esports Memilih VGS?
                            </h2>
                            <p className="text-sm text-vgs-silver-mid mt-2">
                                Kami menguji setiap sensor, switch, dan frame untuk memastikan kesiapan kompetitif tanpa cela.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature) => (
                                <div
                                    key={feature.title}
                                    className="p-6 rounded-2xl bg-vgs-black-surface border border-vgs-gray-border hover:border-vgs-blue-electric/60 transition-all duration-300 hover:-translate-y-1 group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-vgs-black-void border border-vgs-gray-border flex items-center justify-center text-vgs-blue-electric mb-5 group-hover:border-vgs-blue-electric transition-colors shadow-xs">
                                        {feature.icon}
                                    </div>
                                    <h3 className="font-bold text-base text-vgs-silver-bright mb-2 group-hover:text-vgs-blue-electric transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-xs text-vgs-silver-mid leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </StorefrontLayout>
    );
}
