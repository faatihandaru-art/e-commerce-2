<?php

namespace App\Support\Admin;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;

/**
 * Menyusun data yang dikirim ke halaman admin Catalog (Create / Edit).
 */
class CatalogPresenter
{
    /**
     * Daftar brand untuk dropdown.
     *
     * @return array<int, array<string, mixed>>
     */
    public static function brands(): array
    {
        return Brand::query()
            ->where('status', 'active')
            ->orderBy('name')
            ->get()
            ->map(fn (Brand $b) => [
                'id' => $b->id,
                'name' => $b->name,
            ])
            ->values()
            ->all();
    }

    /**
     * Daftar kategori (parent + children) untuk pilihan.
     *
     * @return array<int, array<string, mixed>>
     */
    public static function categories(): array
    {
        return Category::query()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(fn (Category $c) => [
                'id' => $c->id,
                'name' => $c->name,
                'parent_id' => $c->parent_id,
            ])
            ->values()
            ->all();
    }

    /**
     * Produk lengkap untuk form edit, termasuk gambar & varian yang sudah ada.
     *
     * @return array<string, mixed>
     */
    public static function product(Product $product): array
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'brand_id' => $product->brand_id,
            'category_ids' => $product->categories()->pluck('categories.id')->values()->all(),
            'description' => $product->description,
            'short_description' => $product->short_description,
            'status' => $product->status,
            'images' => self::images($product),
            'variants' => self::variants($product),
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private static function images(Product $product): array
    {
        $images = $product->images ?? $product->images()->orderBy('sort_order')->get();

        return $images
            ->sortBy('sort_order')
            ->values()
            ->map(fn (ProductImage $img) => [
                'id' => $img->id,
                'url' => \App\Support\ProductPresenter::imageUrl($img->path),
                'sort_order' => $img->sort_order,
                'is_primary' => (bool) $img->is_primary,
            ])
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private static function variants(Product $product): array
    {
        $variants = $product->variants ?? $product->variants()->orderBy('created_at')->get();

        return $variants
            ->sortBy('id')
            ->values()
            ->map(fn (ProductVariant $v) => [
                'id' => $v->id,
                'sku' => $v->sku,
                'price' => (int) $v->price,
                'compare_at_price' => $v->compare_at_price !== null ? (int) $v->compare_at_price : null,
                'stock' => (int) $v->stock,
            ])
            ->all();
    }
}
