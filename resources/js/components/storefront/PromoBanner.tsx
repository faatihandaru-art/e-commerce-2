import React from 'react';
import Button from '@/components/ui/Button';

export const PromoBanner: React.FC = () => {
    return (
        <section className="py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Flat Technical Banner with Electric Blue Accents */}
                <div className="relative rounded-3xl bg-vgs-black-surface border border-vgs-blue-electric/40 p-8 sm:p-10 lg:p-12 overflow-hidden shadow-2xl shadow-vgs-blue-electric/5">
                    
                    {/* Left Electric Blue Decorative Accent Bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-vgs-blue-electric" />

                    {/* Ambient Technical Pattern */}
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(#2B6FF6_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* Text Info (Cols 1-8) */}
                        <div className="lg:col-span-8 space-y-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="inline-flex items-center px-3 py-1 rounded-md bg-vgs-blue-electric text-white text-xs font-mono font-bold uppercase tracking-wider">
                                    PROMO BUNDLE ESPORTS
                                </span>
                                <span className="text-xs font-mono text-vgs-warning flex items-center gap-1.5 font-semibold">
                                    <span className="w-2 h-2 rounded-full bg-vgs-warning animate-pulse" />
                                    Penawaran Terbatas Musim Turnamen 2026
                                </span>
                            </div>

                            <h3 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-vgs-silver-bright tracking-tight leading-tight">
                                HEMAT HINGGA <span className="text-vgs-blue-electric">Rp 450.000</span> UNTUK PAKET PRO SETUP
                            </h3>

                            <p className="text-sm sm:text-base text-vgs-silver-mid max-w-2xl leading-relaxed">
                                Dapatkan kombo mouse Apex Pro Wireless + keyboard Cypher 75% Gasket dengan potongan harga langsung. Gunakan kode kupon di checkout:
                            </p>

                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-vgs-black-void border border-vgs-gray-border">
                                    <span className="text-xs text-vgs-silver-muted font-mono uppercase">KODE KUPON:</span>
                                    <span className="font-mono font-bold text-sm text-vgs-blue-electric tracking-widest">
                                        VGS-CHAMP-2026
                                    </span>
                                </div>
                                <span className="text-xs font-mono text-vgs-silver-muted">
                                    *Berlaku untuk 100 transaksi pertama
                                </span>
                            </div>
                        </div>

                        {/* Right CTA Action (Cols 9-12) */}
                        <div className="lg:col-span-4 flex lg:justify-end">
                            <Button
                                href="/products"
                                variant="primary"
                                size="lg"
                                className="w-full sm:w-auto px-8"
                                rightIcon={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                }
                            >
                                <span>Klaim Penawaran</span>
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default PromoBanner;
