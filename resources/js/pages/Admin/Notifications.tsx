import React, { useMemo } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/Button';
import { timeAgo } from '@/lib/format';
import type { NotificationItem } from '@/types/admin';

interface Paginator {
    data: NotificationItem[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from: number | null;
    to: number | null;
}

export default function Notifications() {
    const { notifications } = usePage<{ notifications: Paginator }>().props;
    const rows = notifications?.data ?? [];
    const unreadCount = useMemo(() => rows.filter((item) => !item.read).length, [rows]);

    const markAllRead = () => {
        router.post('/admin/notifications/read-all', {}, { preserveScroll: true });
    };

    const openNotification = (item: NotificationItem) => {
        if (!item.read) {
            router.post(`/admin/notifications/${item.id}/read`, {}, {
                preserveScroll: true,
                onFinish: () => {
                    if (item.link) router.visit(item.link);
                },
            });
            return;
        }
        if (item.link) router.visit(item.link);
    };

    const buildPageUrl = (page: number) => `/admin/notifications?page=${page}`;

    return (
        <AdminLayout title="Notifikasi">
            <Head title="Notifikasi" />

            <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-display font-bold text-vgs-silver-bright">
                            Notifikasi
                        </h2>
                        <p className="text-sm text-vgs-silver-mid mt-1">
                            Semua aktivitas perubahan data: ditambahkan, diperbarui, dan dihapus.
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <Button variant="outline" size="sm" onClick={markAllRead}>
                            Tandai semua dibaca
                        </Button>
                    )}
                </div>

                {/* Daftar notifikasi */}
                <div className="rounded-2xl bg-vgs-black-surface border border-vgs-gray-border overflow-hidden">
                    {rows.length === 0 ? (
                        <p className="px-6 py-16 text-sm text-vgs-silver-muted text-center">
                            Belum ada notifikasi.
                        </p>
                    ) : (
                        <ul className="divide-y divide-vgs-gray-border/60">
                            {rows.map((item) => (
                                <li key={item.id}>
                                    <button
                                        type="button"
                                        onClick={() => openNotification(item)}
                                        className={`w-full text-left px-6 py-4 flex items-start gap-3 transition-colors hover:bg-vgs-black-elevated/40 cursor-pointer ${
                                            item.read ? '' : 'bg-vgs-blue-electric/[0.04]'
                                        }`}
                                    >
                                        <span
                                            className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                                                item.read ? 'bg-vgs-gray-border' : 'bg-vgs-blue-electric'
                                            }`}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="text-sm font-semibold text-vgs-silver-bright truncate">
                                                    {item.title}
                                                </p>
                                                <span className="text-[10px] font-mono text-vgs-silver-muted whitespace-nowrap shrink-0">
                                                    {timeAgo(item.time)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-vgs-silver-mid mt-1 leading-relaxed">
                                                {item.message}
                                            </p>
                                            {item.link && (
                                                <span className="text-xs font-mono text-vgs-blue-electric hover:text-vgs-silver-bright mt-1.5 inline-flex items-center gap-1">
                                                    Buka halaman terkait →
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {notifications && notifications.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-vgs-gray-border flex items-center justify-between">
                            <span className="text-xs text-vgs-silver-muted">
                                Halaman {notifications.current_page} dari {notifications.last_page} (
                                {notifications.total} notifikasi)
                            </span>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    href={notifications.current_page > 1 ? buildPageUrl(notifications.current_page - 1) : undefined}
                                    disabled={notifications.current_page <= 1}
                                >
                                    Sebelumnya
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    href={notifications.current_page < notifications.last_page ? buildPageUrl(notifications.current_page + 1) : undefined}
                                    disabled={notifications.current_page >= notifications.last_page}
                                >
                                    Berikutnya
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}