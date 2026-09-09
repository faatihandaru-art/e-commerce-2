import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Badge } from '@/components/ui/Badge';
import { formatRupiah, timeAgo } from '@/lib/format';
import type { ActivityItem, AdminPageProps, ActivityTone } from '@/types/admin';

interface StatCardProps {
    label: string;
    value: string;
    icon: React.ReactNode;
    hint: string;
    accent?: 'primary' | 'warning' | 'danger' | 'success';
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, hint, accent = 'primary' }) => {
    const accentClasses = {
        primary: 'text-vgs-blue-electric border-vgs-blue-electric/30 bg-vgs-blue-electric/10',
        warning: 'text-vgs-warning border-vgs-warning/30 bg-vgs-warning/10',
        danger: 'text-vgs-danger border-vgs-danger/30 bg-vgs-danger/10',
        success: 'text-vgs-success border-vgs-success/30 bg-vgs-success/10',
    }[accent];

    return (
        <div className="p-5 rounded-2xl bg-vgs-black-surface border border-vgs-gray-border hover:border-vgs-blue-electric/40 transition-colors">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-xs font-mono uppercase tracking-wider text-vgs-silver-muted">
                        {label}
                    </p>
                    <p className="mt-2 text-2xl font-display font-bold text-vgs-silver-bright truncate">
                        {value}
                    </p>
                    <p className="mt-1 text-xs text-vgs-silver-muted">{hint}</p>
                </div>
                <div className={`shrink-0 w-11 h-11 rounded-xl border flex items-center justify-center ${accentClasses}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

const activityToneDot = {
    success: 'bg-vgs-success',
    danger: 'bg-vgs-danger',
    info: 'bg-vgs-blue-electric',
    warning: 'bg-vgs-warning',
} satisfies Record<ActivityTone, string>;

export default function Dashboard() {
    const { auth, flash, stats, recent_activity } = usePage<{
        auth?: AdminPageProps['auth'];
        flash?: AdminPageProps['flash'];
        stats?: {
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
        };
        recent_activity?: ActivityItem[];
    }>().props;

    const user = auth?.user ?? null;
    const roles = user?.roles ?? [];
    const roleName = roles[0]?.name ?? 'Staf';

    const s = stats ?? {
        total_products: 0,
        total_categories: 0,
        total_customers: 0,
        total_orders: 0,
        orders_today: 0,
        pending_payments: 0,
        perlu_diproses: 0,
        revenue_this_month: 0,
        revenue_last_month: 0,
        revenue_change_pct: null,
        low_stock: 0,
    };

    const changePct = s.revenue_change_pct;
    const revenueHint =
        changePct === null
            ? `Bulan lalu: ${formatRupiah(s.revenue_last_month)}`
            : changePct >= 0
              ? `Naik ${changePct}% dari bulan lalu`
              : `Turun ${Math.abs(changePct)}% dari bulan lalu`;

    const activities = recent_activity ?? [];

    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />

            <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6">
                {/* Sambutan pengguna */}
                <div className="p-6 rounded-2xl bg-vgs-black-surface border border-vgs-gray-border">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-display font-bold text-vgs-silver-bright">
                                Selamat Datang, {user?.name ?? 'Administrator'}!
                            </h2>
                            <p className="text-sm text-vgs-silver-mid mt-1.5 flex items-center flex-wrap gap-2">
                                Anda masuk sebagai
                                <Badge variant="primary" size="sm" dot={Boolean(roles.length)}>
                                    {roleName}
                                </Badge>
                            </p>
                        </div>
                        <p className="text-xs font-mono text-vgs-silver-muted">
                            {user?.email ?? '—'}
                        </p>
                    </div>
                    {flash?.success && (
                        <p className="mt-4 text-sm text-vgs-success border border-vgs-success/30 bg-vgs-success/10 rounded-lg px-3 py-2">
                            {flash.success}
                        </p>
                    )}
                </div>

                {/* Kartu ringkasan — data nyata dari DashboardController */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <StatCard
                        label="Total Produk"
                        value={String(s.total_products)}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        }
                        hint={`${s.total_categories} kategori, ${s.total_customers} customer`}
                    />
                    <StatCard
                        label="Pesanan Hari Ini"
                        value={String(s.orders_today)}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        }
                        hint={`${s.perlu_diproses} perlu diproses`}
                        accent="primary"
                    />
                    <StatCard
                        label="Pendapatan Bulan Ini"
                        value={formatRupiah(s.revenue_this_month)}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        hint={revenueHint}
                        accent="success"
                    />
                    <StatCard
                        label="Stok Menipis"
                        value={String(s.low_stock)}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        }
                        hint="Perlu restock segera"
                        accent="danger"
                    />
                </div>

                {/* Aktivitas terbaru — data nyata dari audit log + pesanan */}
                <div className="rounded-2xl bg-vgs-black-surface border border-vgs-gray-border overflow-hidden">
                    <div className="px-6 py-4 border-b border-vgs-gray-border flex items-center justify-between">
                        <h3 className="font-display font-bold text-vgs-silver-bright">Aktivitas Terbaru</h3>
                        <a
                            href="/admin/notifications"
                            className="text-xs font-mono text-vgs-blue-electric hover:text-vgs-silver-bright transition-colors"
                        >
                            Lihat notifikasi →
                        </a>
                    </div>
                    {activities.length === 0 ? (
                        <p className="px-6 py-8 text-sm text-vgs-silver-muted">
                            Belum ada aktivitas.
                        </p>
                    ) : (
                        <ul className="divide-y divide-vgs-gray-border/60">
                            {activities.map((item) => (
                                <li key={item.id} className="px-6 py-3.5 flex items-center gap-3">
                                    <span
                                        className={`w-2 h-2 rounded-full shrink-0 ${activityToneDot[item.tone] ?? 'bg-vgs-blue-electric'}`}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm text-vgs-silver-bright truncate">
                                            {item.message || item.title}
                                        </p>
                                        <p className="text-xs font-mono text-vgs-silver-muted">{item.title}</p>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className="text-xs text-vgs-silver-muted whitespace-nowrap">
                                            {timeAgo(item.time)}
                                        </span>
                                        {item.link && (
                                            <a
                                                href={item.link}
                                                className="text-xs font-mono text-vgs-blue-electric hover:text-vgs-silver-bright transition-colors"
                                            >
                                                buka →
                                            </a>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}