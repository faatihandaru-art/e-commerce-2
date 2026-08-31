import React, { createContext, useContext, useCallback, useState, useMemo } from 'react';

/**
 * Tipe data user admin yang sama dengan props.auth.user dari backend.
 *
 * Catatan (sementara): backend saat ini baru mengirim id, name, email,
 * phone, status di HandleInertiaRequests. Field `roles` akan ditambahkan
 * backend (lihat catatan di CATATAN_SISTEM_ROLE.md). Karena itu `roles`
 * dibuat OPTIONAL dan default-nya [], supaya frontend ini aman dipakai
 * baik sebelum maupun sesudah backend menambahkan field tersebut.
 */
export interface AdminUser {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    status?: string;
    roles?: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
}

interface SidebarContextValue {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

    const value = useMemo<SidebarContextValue>(
        () => ({ isOpen, open, close, toggle }),
        [isOpen, open, close, toggle],
    );

    return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};

export const useSidebar = (): SidebarContextValue => {
    const ctx = useContext(SidebarContext);
    if (!ctx) {
        throw new Error('useSidebar harus dipakai di dalam komponen yang dibungkus <SidebarProvider>.');
    }
    return ctx;
};
