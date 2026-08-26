import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/StorefrontLayout';

interface PageProps {
    [key: string]: unknown;
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            phone?: string;
            status?: string;
        } | null;
    };
}

export interface AccountLayoutProps {
    children: React.ReactNode;
    title: string;
}

export const AccountLayout: React.FC<AccountLayoutProps> = ({ children, title }) => {
    const { url, props } = usePage<PageProps>();
    const user = props.auth?.user;

    const menuItems = [
        {
            label: 'Profil Saya',
            href: '/account/profile',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
        },
        {
            label: 'Alamat Saya',
            href: '/account/addresses',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        },
        {
            label: 'Status Akun',
            href: '/account/status',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            label: 'Pesanan Saya',
            href: '/account/orders',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            ),
        },
    ];

    const isActive = (href: string) => url === href;

    const initials = user
        ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    return (
        <StorefrontLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-72 shrink-0">
                        <div className="bg-vgs-black-surface border border-vgs-gray-border rounded-2xl p-5 sticky top-28">
                            {/* User Info */}
                            <div className="flex items-center gap-3 pb-5 mb-5 border-b border-vgs-gray-border">
                                <div className="w-12 h-12 rounded-xl bg-vgs-blue-electric/20 border border-vgs-blue-electric/30 flex items-center justify-center text-vgs-blue-electric font-display font-bold text-base">
                                    {initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-vgs-silver-bright truncate">
                                        {user?.name || 'Guest'}
                                    </p>
                                    <p className="text-xs text-vgs-silver-muted font-mono truncate">
                                        {user?.email || ''}
                                    </p>
                                </div>
                            </div>

                            {/* Nav Items */}
                            <nav className="space-y-1">
                                {menuItems.map((item) => {
                                    const active = isActive(item.href);
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                                active
                                                    ? 'bg-vgs-blue-electric/15 text-vgs-blue-electric border border-vgs-blue-electric/30'
                                                    : 'text-vgs-silver-mid hover:text-vgs-silver-bright hover:bg-vgs-black-elevated/60 border border-transparent'
                                            }`}
                                        >
                                            <span className={active ? 'text-vgs-blue-electric' : 'text-vgs-silver-muted'}>
                                                {item.icon}
                                            </span>
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* Back to Store */}
                            <div className="mt-5 pt-5 border-t border-vgs-gray-border">
                                <Link
                                    href="/"
                                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-vgs-silver-muted hover:text-vgs-silver-bright hover:bg-vgs-black-elevated/60 transition-all"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    <span>Kembali ke Toko</span>
                                </Link>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        <h1 className="font-display font-bold text-2xl text-vgs-silver-bright mb-6">
                            {title}
                        </h1>
                        {children}
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
};

export default AccountLayout;
