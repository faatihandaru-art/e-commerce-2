import React from 'react';
import { usePage } from '@inertiajs/react';
import { useSidebar } from '@/components/admin/SidebarContext';
import type { AdminUser } from '@/components/admin/SidebarContext';

export interface HeaderProps {
    title?: string;
    user?: AdminUser | null;
    onOpenSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title = 'Admin', user, onOpenSidebar }) => {
    const { toggle, isOpen } = useSidebar();
    const authUser = usePage<{ auth: { user?: AdminUser | null } }>().props.auth?.user ?? null;
    const displayUser: AdminUser | null = user ?? authUser;

    const initials = displayUser?.name
        ? displayUser.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
        : 'VG';

    const handleToggle = () => {
        if (onOpenSidebar) {
            onOpenSidebar();
        } else {
            toggle();
        }
    };

    return (
        <header className="sticky top-0 z-30 w-full bg-vgs-black-elevated/95 backdrop-blur-md border-b border-vgs-gray-border/80">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6">
                {/* Left: toggle + title */}
                <div className="flex items-center gap-3 min-w-0">
                    <button
                        type="button"
                        onClick={handleToggle}
                        className="md:hidden flex items-center justify-center w-11 h-11 shrink-0 rounded-xl bg-vgs-black-surface border border-vgs-gray-border text-vgs-silver-bright hover:text-white hover:border-vgs-blue-electric hover:bg-vgs-blue-electric/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vgs-blue-electric cursor-pointer"
                        aria-label={isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
                        aria-expanded={isOpen}
                    >
                        {!isOpen ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                    </button>

                    <div className="min-w-0">
                        <h1 className="font-display font-bold text-lg sm:text-xl tracking-wide text-vgs-silver-bright truncate">
                            {title}
                        </h1>
                    </div>
                </div>

                {/* Right: notifications + user */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    {/* Notifications (placeholder, icon only) */}
                    <button
                        type="button"
                        className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-vgs-black-surface border border-vgs-gray-border text-vgs-silver-mid hover:text-vgs-silver-bright hover:border-vgs-blue-electric transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vgs-blue-electric cursor-pointer"
                        aria-label="Notifikasi"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-vgs-blue-electric border-2 border-vgs-black-void" />
                    </button>

                    {/* User avatar + name */}
                    <div className="hidden sm:flex items-center gap-2.5 px-2">
                        <div className="w-9 h-9 rounded-lg bg-vgs-blue-electric/20 border border-vgs-blue-electric/30 flex items-center justify-center text-vgs-blue-electric font-display font-bold text-xs shrink-0">
                            {initials}
                        </div>
                        <div className="flex flex-col leading-none min-w-0">
                            <span className="text-sm font-semibold text-vgs-silver-bright truncate">
                                {displayUser?.name ?? 'Pengguna'}
                            </span>
                            <span className="text-[10px] font-mono text-vgs-silver-muted truncate">
                                {displayUser?.email ?? '—'}
                            </span>
                        </div>
                    </div>

                    {/* Mobile avatar only */}
                    <div className="sm:hidden flex items-center justify-center w-11 h-11 rounded-xl bg-vgs-blue-electric/20 border border-vgs-blue-electric/30 text-vgs-blue-electric font-display font-bold text-xs shrink-0">
                        {initials}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
