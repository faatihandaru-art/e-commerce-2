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
    auth?: {
        user: AdminUser | null;
    };
    flash?: {
        success?: string | null;
        error?: string | null;
    };
    notifications?: NotificationFeed;
}

export interface NotificationItem {
    id: string;
    read: boolean;
    title: string;
    message: string;
    link?: string | null;
    time: string;
}

export interface NotificationFeed {
    unread: number;
    items: NotificationItem[];
}

export interface DashboardStats {
    total_products: number;
    total_categories: number;
    total_customers: number;
    total_orders: number;
    orders_today: number;
    pending_payments: number;
    perlu_diproses: number;
    revenue_this_month: number;
    revenue_last_month: number;
    revenue_change_pct: number | null;
    low_stock: number;
}

export type ActivityTone = 'success' | 'danger' | 'info' | 'warning';

export interface ActivityItem {
    id: string;
    kind: 'order' | 'audit';
    title: string;
    message: string;
    time: string;
    link?: string | null;
    tone: ActivityTone;
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
