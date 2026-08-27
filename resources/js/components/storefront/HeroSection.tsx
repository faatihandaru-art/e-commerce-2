import React from 'react';
import Button from '@/components/ui/Button';

export const HeroSection: React.FC = () => {
    return (
        <section className="relative pt-6 pb-16 lg:pt-12 lg:pb-24 overflow-hidden">
            {/* Ambient Technical Grid with subtle radial vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(#1C1F26_1px,transparent_1px)] [background-size:32px_32px] opacity-30 pointer-events-none" />

            {/* Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    
                    {/* Left Text Content (Cols 1-7) */}
                    <div className="lg:col-span-7 space-y-6 text-left">
                        {/* Signature Tournament Ready Badge with Hexagonal Accent */}
                        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-lg bg-vgs-black-surface border border-vgs-gray-border text-xs font-mono">
                            <span className="w-2 h-2 rounded-sm bg-vgs-blue-electric shadow-[0_0_8px_var(--vgs-blue-electric)]" />
                            <span className="text-vgs-silver-bright font-semibold uppercase tracking-wider">
                                VGS OFFICIAL TOURNAMENT SPEC 2029
                            </span>
                        </div>

                        {/* Main Technical Hero Headline */}
                        <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-vgs-silver-bright tracking-tight leading-[1.1]">
                            GEAR UNTUK MENANG,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-vgs-silver-bright via-vgs-blue-glow to-vgs-blue-electric">
                                BUKAN SEKADAR GAYA.
                            </span>
                        </h1>

                        {/* Body Copy */}
                        <p className="text-base sm:text-lg text-vgs-silver-mid max-w-xl leading-relaxed font-normal">
                            Perlengkapan esports kelas profesional dengan sensor optik 30K DPI, polling rate 8000Hz, dan switch magnetik respon instan 0.1ms. Presisi tanpa kompromi untuk gamer kompetitif sejati.
                        </p>

                        {/* Key Technical Badges */}
                        <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-lg py-2">
                            <div className="p-3 rounded-xl bg-vgs-black-surface/70 border border-vgs-gray-border">
                                <div className="text-lg sm:text-xl font-bold font-mono text-vgs-blue-electric leading-none">
                                    8000Hz
                                </div>
                                <div className="text-[11px] font-mono text-vgs-silver-muted mt-1 uppercase">
                                    Hyper Polling
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-vgs-black-surface/70 border border-vgs-gray-border">
                                <div className="text-lg sm:text-xl font-bold font-mono text-vgs-blue-electric leading-none">
                                    0.125ms
                                </div>
                                <div className="text-[11px] font-mono text-vgs-silver-muted mt-1 uppercase">
                                    Instant Trigger
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-vgs-black-surface/70 border border-vgs-gray-border">
                                <div className="text-lg sm:text-xl font-bold font-mono text-vgs-blue-electric leading-none">
                                    100%
                                </div>
                                <div className="text-[11px] font-mono text-vgs-silver-muted mt-1 uppercase">
                                    Original Garansi
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

                    {/* Right Visual Showcase (Cols 8-12): VGS Logo */}
                    <div className="lg:col-span-5 relative mt-6 lg:mt-0 flex justify-center">
                        <img
                            src="/images/products/logo..vgs2.png"
                            alt="VGS Logo"
                            className="w-64 sm:w-80 object-contain drop-shadow-[0_0_30px_var(--vgs-blue-electric)] transition-transform duration-500 hover:scale-105"
                        />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HeroSection;
