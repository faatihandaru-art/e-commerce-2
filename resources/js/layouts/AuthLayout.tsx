import React from 'react';
import { Link } from '@inertiajs/react';

export interface AuthLayoutProps {
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
    title = 'Masuk ke Akun VGS',
    subtitle = '"Gear Up. Play Hard. Win."',
    children,
}) => {
    return (
        <div className="min-h-screen bg-vgs-black-void text-vgs-silver-bright flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans selection:bg-vgs-blue-electric selection:text-white">
            {/* Ambient Technical Hex Grid Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#1C1F26_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

            {/* Ambient Blue Glow Orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-vgs-blue-electric/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Floating Back Link */}
            <div className="absolute top-6 left-6 z-20">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-vgs-black-surface/80 border border-vgs-gray-border text-xs font-semibold text-vgs-silver-mid hover:text-white hover:border-vgs-blue-electric hover:bg-vgs-black-elevated transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-vgs-blue-electric"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Kembali ke Toko</span>
                </Link>
            </div>

            {/* Main Center Content */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                {/* VGS Brand Emblem */}
                <div className="flex flex-col items-center text-center mb-8">
                    <Link href="/" className="group inline-flex flex-col items-center">
                        <div className="w-30 h-30 ">
                            <img
                              src="/images/logo/logo..vgs2.png"
                              alt="Vortix Gaming Store"
                              className="w-30 h-30 object-contain drop-shadow-[0_0_30px_var(--vgs-blue-electric)]  "/>
                            </div>
                        <h2 className="font-display font-extrabold text-2xl tracking-wider text-vgs-silver-bright">
                            VORTIX <span className="text-vgs-blue-electric">GAMING</span> STORE
                        </h2>
                    </Link>
                    <p className="text-xs font-mono text-vgs-silver-muted uppercase tracking-widest mt-1">
                        {subtitle}
                    </p>
                </div>

                {/* Auth Card Container (dikerjakan Orang 2) */}
                <div className="bg-vgs-black-surface border border-vgs-gray-border rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-md">
                    {children}
                </div>

                {/* Footer Help Notice */}
                <div className="mt-6 text-center text-xs text-vgs-silver-muted">
                    <span>Butuh bantuan akun turnamen? </span>
                    <Link href="/about" className="text-vgs-blue-electric hover:underline font-semibold">
                        Hubungi Tim Support
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
