import React from 'react';
import { Head } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import Button from '@/components/ui/Button';

export default function About() {
    const pillars = [
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M9 12l2 2 4-4"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
            title: 'Garansi Resmi 1-to-1 Replacement',
            desc: 'Kami bermitra langsung dengan manufaktur resmi. Jika terjadi kerusakan teknis selama masa garansi, kami berikan penggantian unit baru tanpa proses birokrasi berbelit.',
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" />
                    <rect x="9" y="9" width="6" height="6" strokeWidth="2" />
                    <line x1="9" y1="1" x2="9" y2="4" strokeWidth="2" />
                    <line x1="15" y1="1" x2="15" y2="4" strokeWidth="2" />
                    <line x1="9" y1="20" x2="9" y2="23" strokeWidth="2" />
                    <line x1="15" y1="20" x2="15" y2="23" strokeWidth="2" />
                    <line x1="20" y1="9" x2="23" y2="9" strokeWidth="2" />
                    <line x1="20" y1="14" x2="23" y2="14" strokeWidth="2" />
                    <line x1="1" y1="9" x2="4" y2="9" strokeWidth="2" />
                    <line x1="1" y1="14" x2="4" y2="14" strokeWidth="2" />
                </svg>
            ),
            title: 'Standar Pengujian Hardware Ketat',
            desc: 'Setiap mouse, keyboard, dan monitor diuji di lab internal kami untuk memastikan konsistensi sakelar, akurasi sensor optik, dan ketiadaan ghosting atau jitter.',
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" strokeWidth="2" />
                    <path
                        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                        strokeWidth="2"
                    />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" strokeWidth="2" />
                    <line x1="12" y1="22.08" x2="12" y2="12" strokeWidth="2" />
                </svg>
            ),
            title: 'Pengemasan Khusus Anti-Benturan',
            desc: 'Semua periferal dikemas menggunakan heavy-duty protective foam & bubble cushion tebal untuk memastikan barang sampai dalam kondisi presisi turnamen.',
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6" strokeWidth="2" />
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" strokeWidth="2" />
                </svg>
            ),
            title: 'Dukungan Komunitas & Teknisi Berpengalaman',
            desc: 'Tim teknis kami adalah gamer dan modder aktif yang siap membantu kalibrasi DPI, switch lubing guide, hingga firmware debugging kapan saja.',
        },
    ];

    return (
        <StorefrontLayout>
            <Head title="Tentang Kami — Vortix Gaming Store" />

            <div className="py-10 sm:py-16 space-y-16 sm:space-y-24">
                {/* Hero / Brand Origin Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Left Text (Cols 1-7) */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-vgs-black-surface border border-vgs-gray-border text-xs font-mono text-vgs-blue-electric">
                                <span className="w-2 h-2 rounded-full bg-vgs-blue-electric" />
                                <span className="font-bold tracking-wider uppercase">
                                    TENTANG VORTIX GAMING STORE
                                </span>
                            </div>

                            <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-vgs-silver-bright tracking-tight leading-[1.1]">
                                PILIH GEAR TERBAIK,<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-vgs-silver-bright via-vgs-blue-glow to-vgs-blue-electric">
                                    MAIN LEBIH MAKSIMAL.
                                </span>
                            </h1>

                            <p className="text-base sm:text-lg text-vgs-silver-mid leading-relaxed">
                                Vortix Gaming Store (VGS) adalah toko yang menyediakan berbagai kebutuhan gaming untuk membantu gamer mendapatkan perangkat yang tepat sesuai gaya bermain dan kebutuhan mereka.
                            </p>

                            <p className="text-base sm:text-base text-vgs-silver-mid leading-relaxed">
                                Kami menghadirkan berbagai pilihan gaming gear mulai dari mouse, keyboard, headset, microphone, monitor, controller, hingga berbagai peripheral gaming lainnya dari brand-brand terpercaya.
                            </p>
                             <p className="text-base sm:text-base text-vgs-silver-mid leading-relaxed">
                                Kami percaya bahwa perlengkapan gaming bukan sekadar aksesori. Mouse yang presisi, keyboard yang responsif, headset yang jernih, dan monitor dengan refresh rate tinggi dapat membuat pengalaman bermain menjadi lebih nyaman dan maksimal.
                            </p>
                            <p className="text-base sm:text-base text-vgs-silver-mid leading-relaxed">
                                Di VGS, kami berfokus menyediakan produk gaming berkualitas dengan informasi spesifikasi yang jelas, sehingga kamu bisa memilih gear dengan lebih mudah dan percaya diri.
                            </p>

                            {/* Core Tagline Box */}
                            <div className="p-5 rounded-2xl bg-vgs-black-surface border-l-4 border-vgs-blue-electric border-y border-r border-vgs-gray-border">
                                <p className="font-mono font-bold text-sm sm:text-base text-vgs-silver-bright">
                                    "Gear Up. Play Hard. Win."
                                </p>
                                <p className="text-xs text-vgs-silver-muted mt-1">
                                    Temukan gaming gear yang sesuai dengan kebutuhanmu dan siap membawa pengalaman bermain ke level berikutnya.
                                </p>
                            </div>
                        </div>

                        {/* Right Visual (Cols 8-12): Gaming Battlestation & Lab Visual */}
                        <div className="lg:col-span-5 relative">
                            <div className="relative rounded-3xl overflow-hidden border border-vgs-gray-border bg-vgs-black-surface shadow-2xl group">
                                <img
                                    src='/images/products/logo_vortix_VGS.jpeg'
                                    alt="VGS Esports Testing Lab & Battlestation"
                                    className="w-full h-80 sm:h-96 object-contain transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-vgs-black-void via-vgs-black-void/30 to-transparent" />

                                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-vgs-black-elevated/90 border border-vgs-gray-border backdrop-blur-md">
                                    <div className="text-xs font-mono text-vgs-blue-electric font-bold uppercase">
                                       VGS PERFORMANCE LAB
                                    </div>
                                    <div className="text-xs text-vgs-silver-mid mt-0.5">
                                        Precision tested. Built for competitive play.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Lab Metrics / Numbers */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        <div className="p-6 rounded-2xl bg-vgs-black-surface border border-vgs-gray-border">
                            <div className="font-display font-extrabold text-3xl sm:text-4xl text-vgs-blue-electric font-mono">
                               100%
                            </div>
                            <div className="font-bold text-sm text-vgs-silver-bright mt-1">
                               Fokus Gaming
                            </div>
                            <p className="text-xs text-vgs-silver-muted mt-1 leading-relaxed">
                                Kami fokus menyediakan kebutuhan gaming dalam satu tempat.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-vgs-black-surface border border-vgs-gray-border">
                            <div className="font-display font-extrabold text-3xl sm:text-4xl text-vgs-blue-electric font-mono">
                                100%
                            </div>
                            <div className="font-bold text-sm text-vgs-silver-bright mt-1">
                                Garansi Resmi 1-to-1
                            </div>
                            <p className="text-xs text-vgs-silver-muted mt-1 leading-relaxed">
                                Penggantian unit baru langsung jika ditemukan cacat pabrik atau sensor.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-vgs-black-surface border border-vgs-gray-border">
                            <div className="font-display font-extrabold text-3xl sm:text-4xl text-vgs-blue-electric font-mono">
                                14
                            </div>
                            <div className="font-bold text-sm text-vgs-silver-bright mt-1">
                                Kategori Terkurasi
                            </div>
                            <p className="text-xs text-vgs-silver-muted mt-1 leading-relaxed">
                                Dari mouse ultra-light 49g hingga monitor Fast-IPS 360Hz.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-vgs-black-surface border border-vgs-gray-border">
                            <div className="font-display font-extrabold text-3xl sm:text-4xl text-vgs-blue-electric font-mono">
                                24 / 7
                            </div>
                            <div className="font-bold text-sm text-vgs-silver-bright mt-1">
                                Dukungan Komunitas
                            </div>
                            <p className="text-xs text-vgs-silver-muted mt-1 leading-relaxed">
                                Bantuan tuning sensitivitas, firmware custom, dan profile audio.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Why Buy from VGS (Section with simple technical icons) */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <div className="inline-flex items-center gap-2 text-xs font-mono text-vgs-blue-electric font-semibold uppercase tracking-wider mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-vgs-blue-electric" />
                            <span>Keunggulan Layanan</span>
                        </div>
                        <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-vgs-silver-bright tracking-tight">
                            Kenapa Belanja di Vortix Gaming Store?
                        </h2>
                        <p className="text-sm text-vgs-silver-mid mt-2">
                            Empat pilar jaminan kualitas untuk kepuasan dan performa maksimal para gamer.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {pillars.map((pillar) => (
                            <div
                                key={pillar.title}
                                className="p-7 rounded-2xl bg-vgs-black-surface border border-vgs-gray-border hover:border-vgs-blue-electric/60 transition-all duration-300 flex items-start gap-5"
                            >
                                <div className="w-12 h-12 rounded-xl bg-vgs-black-void border border-vgs-gray-border flex items-center justify-center text-vgs-blue-electric shrink-0 shadow-xs">
                                    {pillar.icon}
                                </div>
                                <div className="space-y-1.5">
                                    <h3 className="font-bold text-base sm:text-lg text-vgs-silver-bright">
                                        {pillar.title}
                                    </h3>
                                    <p className="text-sm text-vgs-silver-mid leading-relaxed">
                                        {pillar.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-3xl bg-vgs-black-surface border border-vgs-gray-border p-8 sm:p-12 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(#2B6FF6_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

                        <div className="relative z-10 max-w-xl mx-auto space-y-5">
                            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-vgs-silver-bright tracking-tight">
                                Siap Meningkatkan Performa Game-mu?
                            </h3>
                            <p className="text-sm text-vgs-silver-mid">
                                Jelajahi 14 kategori periferal esports berkualitas tinggi dengan garansi resmi dan pengiriman aman.
                            </p>
                            <div className="pt-2">
                                <Button
                                    href="/products"
                                    variant="primary"
                                    size="lg"
                                    className="px-8 shadow-lg shadow-vgs-blue-electric/25"
                                    rightIcon={
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    }
                                >
                                    <span>Jelajahi Produk Kami</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </StorefrontLayout>
    );
}
