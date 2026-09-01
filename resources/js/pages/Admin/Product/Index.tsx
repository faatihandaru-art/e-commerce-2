import React from 'react';
import { Head, usePage, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatRupiah } from '@/lib/format';
import type { AdminPageProps } from '@/types/admin';

interface ProductRow {
    id: number;
    name: string;
    slug: string;
    status: string;
    brand?: string | null;
    category_names?: string[];
    image?: string | null;
    variants?: { sku: string; price: number }[];
    created_at?: string | null;
}

interface Paginator {
    data: ProductRow[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

interface IndexProps extends AdminPageProps {
    products: Paginator;
}

const statusVariant: Record<string, 'success' | 'neutral' | 'warning'> = {
    published: 'success',
    draft: 'neutral',
    archived: 'warning',
};

export default function Index() {
    const { products, flash } = usePage<IndexProps>().props;
    const rows = products?.data ?? [];

    const handleDelete = (product: ProductRow) => {
        if (window.confirm(`Hapus produk "${product.name}"? Tindakan ini tidak bisa dibatalkan.`)) {
            router.delete(`/admin/products/${product.id}`);
        }
    };

    return (
        <AdminLayout title="Katalog Produk">
            <Head title="Katalog Produk" />

            <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6">
                {flash?.success && (
                    <p className="text-sm text-vgs-success border border-vgs-success/30 bg-vgs-success/10 rounded-lg px-3 py-2">
                        {flash.success}
                    </p>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-display font-bold text-vgs-silver-bright">
                            Produk
                        </h2>
                        <p className="text-sm text-vgs-silver-mid mt-1">
                            {products?.total ?? 0} produk di katalog.
                        </p>
                    </div>
                    <Button href="/admin/products/create" variant="primary">
                        + Tambah Produk
                    </Button>
                </div>

                <div className="rounded-2xl bg-vgs-black-surface border border-vgs-gray-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left border-b border-vgs-gray-border bg-vgs-black-elevated/40">
                                    <th className="px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                                        Produk
                                    </th>
                                    <th className="px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                                        Kategori
                                    </th>
                                    <th className="px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                                        Harga Mulai
                                    </th>
                                    <th className="px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                                        Dibuat
                                    </th>
                                    <th className="px-6 py-3 text-right text-[10px] font-mono uppercase tracking-widest text-vgs-silver-muted">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-vgs-gray-border/60">
                                {rows.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-vgs-silver-muted">
                                            Belum ada produk. Klik "Tambah Produk" untuk membuat yang pertama.
                                        </td>
                                    </tr>
                                )}
                                {rows.map((product) => {
                                    const minPrice = product.variants?.length
                                        ? Math.min(...product.variants.map((v) => v.price))
                                        : 0;
                                    return (
                                        <tr key={product.id} className="hover:bg-vgs-black-elevated/40 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-xl bg-vgs-black-void border border-vgs-gray-border overflow-hidden shrink-0">
                                                        {product.image ? (
                                                            <img
                                                                src={`/storage/${product.image}`}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-vgs-silver-muted text-xs">
                                                                —
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-vgs-silver-bright truncate">
                                                            {product.name}
                                                        </p>
                                                        <p className="text-xs font-mono text-vgs-silver-muted truncate">
                                                            {product.brand || 'Tanpa brand'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {product.category_names?.length ? (
                                                        product.category_names.map((c) => (
                                                            <span
                                                                key={c}
                                                                className="text-[11px] px-2 py-0.5 rounded bg-vgs-black-elevated border border-vgs-gray-border text-vgs-silver-mid"
                                                            >
                                                                {c}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-vgs-silver-muted">—</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-vgs-silver-bright font-semibold">
                                                {formatRupiah(minPrice)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={statusVariant[product.status] ?? 'neutral'} dot>
                                                    {product.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-vgs-silver-muted">
                                                {product.created_at ?? '—'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/products/${product.id}/edit`}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-vgs-blue-electric border border-vgs-blue-electric/30 hover:bg-vgs-blue-electric/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vgs-blue-electric"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(product)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-vgs-danger border border-vgs-danger/30 hover:bg-vgs-danger/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vgs-danger cursor-pointer"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {products && products.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-vgs-gray-border flex items-center justify-between">
                            <span className="text-xs text-vgs-silver-muted">
                                Halaman {products.current_page} dari {products.last_page}
                            </span>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    href={
                                        products.current_page > 1
                                            ? `/admin/products?page=${products.current_page - 1}`
                                            : undefined
                                    }
                                    disabled={products.current_page <= 1}
                                >
                                    Sebelumnya
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    href={
                                        products.current_page < products.last_page
                                            ? `/admin/products?page=${products.current_page + 1}`
                                            : undefined
                                    }
                                    disabled={products.current_page >= products.last_page}
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
