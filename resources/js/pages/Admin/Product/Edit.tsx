import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import ProductForm, {
    BrandOption,
    CategoryOption,
    ProductInitialData,
} from '@/components/admin/ProductForm';
import type { AdminPageProps } from '@/types/admin';

interface EditProps extends AdminPageProps {
    product: ProductInitialData & { id: number | string };
    categories: CategoryOption[];
    brands: BrandOption[];
}

export default function Edit() {
    const { product, categories, brands, flash } = usePage<EditProps>().props;

    return (
        <AdminLayout title="Edit Produk">
            <Head title="Edit Produk" />

            <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6">
                {flash?.success && (
                    <p className="text-sm text-vgs-success border border-vgs-success/30 bg-vgs-success/10 rounded-lg px-3 py-2">
                        {flash.success}
                    </p>
                )}

                <div>
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-vgs-silver-bright">
                        Edit Produk
                    </h2>
                    <p className="text-sm text-vgs-silver-mid mt-1">
                        Perbarui informasi produk lalu simpan perubahan.
                    </p>
                </div>

                <ProductForm
                    mode="edit"
                    categories={categories ?? []}
                    brands={brands ?? []}
                    initialProduct={product}
                />
            </div>
        </AdminLayout>
    );
}
