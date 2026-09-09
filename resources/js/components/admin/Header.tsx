import React, { useCallback, useEffect, useRef, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { useSidebar } from '@/components/admin/SidebarContext';
import { timeAgo } from '@/lib/format';
import type { NotificationFeed } from '@/types/admin';
import type { AdminUser } from '@/components/admin/SidebarContext';

export interface HeaderProps {
    title?: string;
    user?: AdminUser | null;
    onOpenSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title = 'Admin', user, onOpenSidebar }) => {
    const { toggle, isOpen } = useSidebar();
    const authUser = usePage<{ auth: { user?: AdminUser | null } }>().props.auth?.user ?? null;
    const notificationFeed = usePage<{ notifications?: NotificationFeed }>().props.notifications;
    const displayUser: AdminUser | null = user ?? authUser;

    const [notifOpen, setNotifOpen] = useState(false);
    const [marking, setMarking] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    const unread = notificationFeed?.unread ?? 0;
    const items = notificationFeed?.items ?? [];

    const closeNotif = useCallback(() => setNotifOpen(false), []);

    useEffect(() => {
        if (!notifOpen) return;

        const handleClick = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                closeNotif();
            }
        };
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') closeNotif();
        };

        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleKey);
        };
    }, [notifOpen, closeNotif]);

    const markAllRead = () => {
        if (unread === 0 || marking) return;
        setMarking(true);
        router.post('/admin/notifications/read-all', {}, {
            preserveScroll: true,
            onFinish: () => setMarking(false),
        });
    };

    const openNotification = (id: string, link?: string | null) => {
        closeNotif();
        if (link) {
            router.post(`/admin/notifications/${id}/read`, {}, {
                preserveScroll: true,
                onFinish: () => router.visit(link),
            });
        }
    };

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
        <header className="sticky top-0 z-40 w-full bg-vgs-black-elevated/95 backdrop-blur-md border-b border-vgs-gray-border/80">
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
                    {/* Notifications */}
                    <div className="relative" ref={notifRef}>
                        <button
                            type="button"
                            onClick={() => setNotifOpen((prev) => !prev)}
                            aria-expanded={notifOpen}
                            aria-label="Notifikasi"
                            className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-vgs-black-surface border border-vgs-gray-border text-vgs-silver-mid hover:text-vgs-silver-bright hover:border-vgs-blue-electric transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vgs-blue-electric cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            {unread > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-vgs-danger border-2 border-vgs-black-void text-white text-[10px] font-mono font-bold flex items-center justify-center">
                                    {unread > 99 ? '99+' : unread}
                                </span>
                            )}
                        </button>

                        {notifOpen && (
                            <div className="absolute right-0 mt-2 w-[min(92vw,380px)] rounded-2xl bg-vgs-black-elevated border border-vgs-gray-border shadow-2xl shadow-black/50 overflow-hidden">
                                <div className="px-4 py-3 border-b border-vgs-gray-border flex items-center justify-between gap-2">
                                    <p className="font-display font-bold text-sm text-vgs-silver-bright">
                                        Notifikasi
                                    </p>
                                    <div className="flex items-center gap-3">
                                        {unread > 0 && (
                                            <button
                                                type="button"
                                                onClick={markAllRead}
                                                disabled={marking}
                                                className="text-xs font-mono text-vgs-blue-electric hover:text-vgs-silver-bright transition-colors disabled:opacity-50 cursor-pointer"
                                            >
                                                {marking ? 'Memproses…' : 'Tandai semua dibaca'}
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={closeNotif}
                                            aria-label="Tutup notifikasi"
                                            className="w-6 h-6 flex items-center justify-center rounded-md text-vgs-silver-muted hover:text-vgs-silver-bright hover:bg-vgs-black-surface transition-colors cursor-pointer"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {items.length === 0 ? (
                                    <p className="px-4 py-8 text-sm text-vgs-silver-muted text-center">
                                        Belum ada notifikasi.
                                    </p>
                                ) : (
                                    <ul className="max-h-80 overflow-y-auto divide-y divide-vgs-gray-border/60">
                                        {items.map((item) => (
                                            <li key={item.id}>
                                                <button
                                                    type="button"
                                                    onClick={() => openNotification(item.id, item.link)}
                                                    className={`w-full text-left px-4 py-3 block transition-colors hover:bg-vgs-black-surface cursor-pointer ${
                                                        item.read ? '' : 'bg-vgs-blue-electric/[0.04]'
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-2.5">
                                                        <span
                                                            className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                                                                item.read
                                                                    ? 'bg-vgs-gray-border'
                                                                    : 'bg-vgs-blue-electric'
                                                            }`}
                                                        />
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-sm font-semibold text-vgs-silver-bright truncate">
                                                                {item.title}
                                                            </p>
                                                            <p className="text-xs text-vgs-silver-mid line-clamp-2">
                                                                {item.message}
                                                            </p>
                                                            <p className="text-[10px] font-mono text-vgs-silver-muted mt-1">
                                                                {timeAgo(item.time)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <a
                                    href="/admin/notifications"
                                    className="block px-4 py-2.5 text-center text-xs font-mono text-vgs-blue-electric border-t border-vgs-gray-border hover:text-vgs-silver-bright hover:bg-vgs-black-surface transition-colors"
                                >
                                    Lihat semua notifikasi →
                                </a>
                            </div>
                        )}
                    </div>

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