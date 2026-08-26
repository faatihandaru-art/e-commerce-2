import React, { useState, useRef, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';

export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    status?: string;
}

export interface ProfileDropdownProps {
    user: User;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const initials = user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        setIsOpen(false);
        router.post('/logout');
    };

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
            badge: user.status === 'active' ? 'Active' : user.status === 'inactive' ? 'Inactive' : null,
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

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Profile Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-11 h-11 rounded-xl bg-vgs-blue-electric/15 border border-vgs-blue-electric/30 text-vgs-blue-electric hover:bg-vgs-blue-electric/25 hover:border-vgs-blue-electric/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vgs-blue-electric cursor-pointer"
                aria-label="Menu profil pengguna"
                aria-expanded={isOpen}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-vgs-black-elevated border border-vgs-gray-border rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-50">
                    {/* User Info Header */}
                    <div className="px-5 py-4 border-b border-vgs-gray-border bg-vgs-black-surface/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-vgs-blue-electric/20 border border-vgs-blue-electric/30 flex items-center justify-center text-vgs-blue-electric font-display font-bold text-sm">
                                {initials}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-vgs-silver-bright truncate">
                                    {user.name}
                                </p>
                                <p className="text-xs text-vgs-silver-muted font-mono truncate">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-5 py-2.5 text-sm text-vgs-silver-mid hover:text-vgs-silver-bright hover:bg-vgs-black-surface/60 transition-colors"
                            >
                                <span className="text-vgs-silver-muted">{item.icon}</span>
                                <span className="flex-1">{item.label}</span>
                                {item.badge && (
                                    <span
                                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                                            item.badge === 'Active'
                                                ? 'bg-vgs-success/15 text-vgs-success'
                                                : 'bg-vgs-danger/15 text-vgs-danger'
                                        }`}
                                    >
                                        {item.badge}
                                    </span>
                                )}
                                <svg className="w-3.5 h-3.5 text-vgs-silver-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        ))}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-vgs-gray-border py-2">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-5 py-2.5 text-sm text-vgs-danger hover:bg-vgs-danger/10 transition-colors cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="font-semibold">Keluar</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;
