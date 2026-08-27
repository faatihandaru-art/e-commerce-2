import React from 'react';
import Button from '@/components/ui/Button';

export const HeroSection: React.FC = () => {
    return (
        <section className="relative pt-6 pb-16 lg:pt-12 lg:pb-24 overflow-hidden">
            {/* Ambient Technical Grid with subtle radial vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(#1C1F26_1px,transparent_1px)] [background-size:32px_32px] opacity-30 pointer-events-none" />

            {/* Signature Hexagonal Geometric Accent in Background */}
            <div className="absolute top-10 right-5 lg:right-24 w-96 h-96 pointer-events-none opacity-20">
                <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-vgs-blue-electric">
                    <polygon
                        points="100 10, 180 55, 180 145, 100 190, 20 145, 20 55"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeDasharray="8 6"
                    />
                    <polygon
                        points="100 35, 160 70, 160 130, 100 165, 40 130, 40 70"
                        stroke="currentColor"
                        strokeWidth="0.8"
                    />
                </svg>
            </div>

            {/* Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    
                    {/* Left Text Content (Cols 1-7) */}
                    <div className="lg:col-span-7 space-y-6 text-left">
                        {/* Signature Tournament Ready Badge with Hexagonal Accent */}
                        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-lg bg-vgs-black-surface border border-vgs-gray-border text-xs font-mono">
                            <span className="w-2 h-2 rounded-sm bg-vgs-blue-electric shadow-[0_0_8px_var(--vgs-blue-electric)]" />
                            <span className="text-vgs-silver-bright font-semibold uppercase tracking-wider">
                                VGS OFFICIAL TOURNAMENT SPEC 2026
                            </span>
                        </div>

                        {/* Main Technical Hero Headline */}
                        <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-vgs-silver-bright tracking-tight leading-[1.1]">
                            GEAR PILIHAN UNTUK<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-vgs-silver-bright via-vgs-blue-glow to-vgs-blue-electric">
                                 SETUP ANDALAN.
                            </span>
                        </h1>

                        {/* Body Copy */}
                        <p className="text-base sm:text-lg text-vgs-silver-mid max-w-xl leading-relaxed font-normal">
                            Temukan berbagai gaming gear pilihan mulai dari mouse, keyboard, headset, microphone, monitor, controller, hingga aksesori untuk melengkapi setup gaming kamu. Kami menghadirkan produk dari berbagai brand terpercaya dengan spesifikasi yang jelas, sehingga kamu bisa memilih gear yang sesuai dengan kebutuhan dan gaya bermainmu
                        </p>

                        {/* Key Technical Badges */}
                        <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-lg py-2">
                            <div className="p-3 rounded-xl bg-vgs-black-surface/70 border border-vgs-gray-border">
                                <div className="text-lg sm:text-xl font-bold font-mono text-vgs-blue-electric leading-none">
                                   10+
BRAND TERPERCAYA
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-vgs-black-surface/70 border border-vgs-gray-border">
                                <div className="text-lg sm:text-xl font-bold font-mono text-vgs-blue-electric leading-none">
                                    50+
PRODUK GAMING
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-vgs-black-surface/70 border border-vgs-gray-border">
                                <div className="text-lg sm:text-xl font-bold font-mono text-vgs-blue-electric leading-none">
                                    100% -----Original Garansi
                                </div>
                            </div>
                        </div>

                        {/* CTAs Row */}
                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            <Button
                                href="/products"
                                variant="primary"
                                size="lg"
                                className="shadow-lg shadow-vgs-blue-electric/25"
                                rightIcon={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                }
                            >
                                <span>Belanja Sekarang</span>
                            </Button>

                            <Button href="/about" variant="secondary" size="lg">
                                <span>Tentang VGS</span>
                            </Button>
                        </div>
                    </div>

                    {/* Right Visual Showcase (Cols 8-12): Multi-layered Overlapping Hardware Stage */}
                    <div className="lg:col-span-5 relative mt-6 lg:mt-0 flex justify-center">
                        <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
                            
                            {/* Technical Stage Box */}
                            <div className="absolute inset-4 rounded-3xl bg-gradient-to-b from-vgs-black-elevated to-vgs-black-surface border border-vgs-gray-border shadow-2xl overflow-hidden">
                                <div className="absolute top-0 right-0 px-3 py-1 bg-vgs-blue-electric/20 border-b border-l border-vgs-blue-electric/40 text-[10px] font-mono text-vgs-blue-glow">
                                    FLAGSHIP SETUP
                                </div>
                                <div className="absolute inset-0 bg-[radial-gradient(#2B6FF6_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
                            </div>

                            {/* Layer 1 (Back-Left): 75% Custom Mechanical Keyboard */}
                            <div className="absolute -left-3 top-6 w-56 sm:w-64 rounded-2xl bg-vgs-black-void/90 border border-vgs-gray-border p-2.5 shadow-2xl -rotate-6 transition-transform duration-500 hover:rotate-0 hover:z-30 hover:border-vgs-blue-glow">
                                <img
                                    src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80"
                                    alt="VGS Cypher Mechanical Keyboard"
                                    className="w-full h-28 sm:h-32 object-cover rounded-xl"
                                />
                                <div className="mt-2 flex items-center justify-between px-1">
                                    <span className="text-[11px] font-mono font-bold text-vgs-silver-bright truncate">
                                        Cypher 75% Gasket
                                    </span>
                                    <span className="text-[10px] font-mono text-vgs-blue-electric font-bold">
                                        1850K
                                    </span>
                                </div>
                            </div>

                            {/* Layer 2 (Back-Right): 7.1 Spatial Headset */}
                            <div className="absolute -right-2 top-2 w-48 sm:w-52 rounded-2xl bg-vgs-black-void/90 border border-vgs-gray-border p-2.5 shadow-2xl rotate-6 transition-transform duration-500 hover:rotate-0 hover:z-30 hover:border-vgs-blue-glow">
                                <img
                                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
                                    alt="VGS Sonar Elite Wireless Headset"
                                    className="w-full h-28 sm:h-32 object-cover rounded-xl"
                                />
                                <div className="mt-2 flex items-center justify-between px-1">
                                    <span className="text-[11px] font-mono font-bold text-vgs-silver-bright truncate">
                                        Sonar Elite 7.1
                                    </span>
                                    <span className="text-[10px] font-mono text-vgs-blue-electric font-bold">
                                        1599K
                                    </span>
                                </div>
                            </div>

                            {/* Layer 3 (Center-Front Highlight): Apex Pro Wireless Mouse */}
                            <div className="relative z-20 w-64 sm:w-72 mt-20 rounded-2xl bg-vgs-black-surface border-2 border-vgs-blue-electric/60 p-3 shadow-2xl shadow-vgs-blue-electric/20 transition-all duration-500 hover:scale-105 hover:border-vgs-blue-electric">
                                <div className="relative rounded-xl overflow-hidden bg-vgs-black-void p-2">
                                    <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded bg-vgs-blue-electric text-white text-[10px] font-mono font-bold uppercase">
                                        TOP CHOICE
                                    </span>
                                    <img
                                        src="/images/products/mouse.jpg"
                                        alt="Vortix Apex Pro Wireless Ultra-Light Mouse"
                                        className="w-full h-36 sm:h-40 object-contain"
                                    />
                                </div>
                                <div className="mt-2.5 flex items-center justify-between px-1">
                                    <div>
                                        <h3 className="text-xs font-bold text-vgs-silver-bright leading-tight">
                                            Apex Pro Wireless 49g
                                        </h3>
                                        <p className="text-[10px] font-mono text-vgs-silver-muted">
                                            Sensor 30K DPI • 8000Hz
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-mono font-bold text-vgs-blue-electric">
                                            Rp 1.399.000
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HeroSection;
