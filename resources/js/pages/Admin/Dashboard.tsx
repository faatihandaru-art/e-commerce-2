import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Badge } from '@/components/ui/Badge';
import { formatRupiah } from '@/lib/format';
import type { AdminPageProps } from '@/types/admin';

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

export default function Dashboard() {
    const { auth, flash } = usePage<AdminPageProps>().props;
    const user = auth?.user ?? null;

    // User dianggap punya satu role aktif. Ambil roles[0]; jika backend belum
    // mengirim field roles (atau array kosong), tampilkan fallback "Staf".
    const roles = user?.roles ?? [];
    const roleName = roles[0]?.name ?? 'Staf';

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

                {/* Kartu ringkasan.
                    TODO: Data di bawah masih DUMMY/statis. Ganti dengan nilai
                    nyata dari backend setelah fitur kelola produk, pesanan,
                    dan laporan dibangun di tahap berikutnya. */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <StatCard
                        label="Total Produk"
                        value="248"
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        }
                        hint="Terdaftar di katalog"
                    />
                    <StatCard
                        label="Pesanan Hari Ini"
                        value="32"
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        }
                        hint="5 menunggu pembayaran"
                        accent="primary"
                    />
                    <StatCard
                        label="Pendapatan Bulan Ini"
                        value={formatRupiah(128650000)}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        hint="Naik 12% dari bulan lalu"
                        accent="success"
                    />
                    <StatCard
                        label="Stok Menipis"
                        value="18"
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        }
                        hint="Perlu restock segera"
                        accent="danger"
                    />
                </div>

                {/* Panel placeholder aktivitas terbaru.
                    TODO: Ganti dengan data pesanan/aktivitas nyata dari backend
                    setelah fitur manajemen pesanan dibangun. */}
                <div className="rounded-2xl bg-vgs-black-surface border border-vgs-gray-border overflow-hidden">
                    <div className="px-6 py-4 border-b border-vgs-gray-border flex items-center justify-between">
                        <h3 className="font-display font-bold text-vgs-silver-bright">Aktivitas Terbaru</h3>
                        <span className="text-xs font-mono text-vgs-silver-muted">placeholder</span>
                    </div>
                    <ul className="divide-y divide-vgs-gray-border/60">
                        {[
                            ['#VGS-20260831-XK4Q2T', 'Pesanan baru dari Budi Santoso', 'sukses'],
                            ['#VGS-20260831-9WDR7M', 'Pembayaran dikonfirmasi via QRIS', 'sukses'],
                            ['#VGS-20260831-3PZQ8L', 'Produk "VGS Mouse Pro X" stok menipis', 'warning'],
                            ['#VGS-20260831-QW2Z6T', 'Kupon VGSWIN dipakai oleh 3 pelanggan', 'info'],
                            ['#VGS-20260830-MN8X2C', 'Pesanan dikirim ke DKI Jakarta', 'sukses'],
                        ].map(([code, text, tone]) => (
                            <li key={code} className="px-6 py-3.5 flex items-center gap-3">
                                <span
                                    className={`w-2 h-2 rounded-full shrink-0 ${
                                        tone === 'warning'
                                            ? 'bg-vgs-warning'
                                            : tone === 'info'
                                              ? 'bg-vgs-blue-electric'
                                              : 'bg-vgs-success'
                                    }`}
                                />
                                <div className="min-w-0">
                                    <p className="text-sm text-vgs-silver-bright truncate">{text}</p>
                                    <p className="text-xs font-mono text-vgs-silver-muted">{code}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </AdminLayout>
    );
}