/**
 * Vortix Gaming Store (VGS) - Admin Type Definitions
 * Shared types for AdminLayout, Sidebar, Header, and Admin Dashboard
 */

export interface Role {
    id: number;
    name: string;
    slug: string;
}

export interface AdminUser {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    status?: string;
    roles?: Role[];
}

export interface AdminPageProps {
    [key: string]: unknown;
    auth: {
        user: AdminUser | null;
    };
    flash?: {
        success?: string | null;
        error?: string | null;
    };
}

export interface AdminNavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    isPlaceholder?: boolean;
    badge?: string;
}

export interface AdminNavGroup {
    groupLabel?: string;
    items: AdminNavItem[];
}
