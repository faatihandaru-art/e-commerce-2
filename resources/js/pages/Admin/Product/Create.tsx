import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import ProductForm, { BrandOption, CategoryOption } from '@/components/admin/ProductForm';
import type { AdminPageProps } from '@/types/admin';

interface CreateProps extends AdminPageProps {
    categories: CategoryOption[];
    brands: BrandOption[];
}

export default function Create() {
    const { categories, brands, flash } = usePage<CreateProps>().props;

    return (
        <AdminLayout title="Tambah Produk">
            <Head title="Tambah Produk" />

            <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6">
                {flash?.success && (
                    <p className="text-sm text-vgs-success border border-vgs-success/30 bg-vgs-success/10 rounded-lg px-3 py-2">
                        {flash.success}
                    </p>
                )}

                <div>
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-vgs-silver-bright">
                        Tambah Produk Baru
                    </h2>
                    <p className="text-sm text-vgs-silver-mid mt-1">
                        Isi informasi dasar, unggah galeri gambar, dan tambahkan minimal satu varian.
                    </p>
                </div>

                <ProductForm
                    mode="create"
                    categories={categories ?? []}
                    brands={brands ?? []}
                />
            </div>
        </AdminLayout>
    );
}
