<?php

namespace App\Domain\Catalog\Actions;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Inventory;
use App\Models\Warehouse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

final class CreateProductAction
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data): Product
    {
        return DB::transaction(function () use ($data) {
            $product = Product::create([
                'brand_id' => $data['brand_id'] ?? null,
                'name' => $data['name'],
                'slug' => $this->resolveSlug($data['slug'] ?? null, $data['name']),
                'type' => $data['type'] ?? 'simple',
                'status' => $data['status'] ?? 'draft',
                'short_description' => $data['short_description'] ?? null,
                'description' => $data['description'] ?? null,
                'meta_title' => $data['meta_title'] ?? null,
                'meta_description' => $data['meta_description'] ?? null,
                'published_at' => ($data['status'] ?? 'draft') === 'published' ? now() : null,
            ]);

            $this->syncCategories($product, $data['category_ids'] ?? []);
            $this->saveVariants($product, $data['variants'] ?? []);
            $this->saveImages($product, $data['images'] ?? [], $data['primary_index'] ?? 0);

            return $product;
        });
    }

    /**
     * @param  array<int|string, mixed>  $categoryIds
     */
    private function syncCategories(Product $product, array $categoryIds): void
    {
        $product->categories()->sync(array_map('intval', array_values((array) $categoryIds)));
    }

    /**
     * @param  array<int, array<string, mixed>>  $variants
     */
    private function saveVariants(Product $product, array $variants): void
    {
        foreach ($variants as $v) {
            $variant = ProductVariant::create([
                'product_id' => $product->id,
                'sku' => $v['sku'],
                'barcode' => $v['barcode'] ?? null,
                'price' => (int) round($v['price']),
                'compare_at_price' => isset($v['compare_at_price']) && $v['compare_at_price'] !== '' && $v['compare_at_price'] !== null
                    ? (int) round($v['compare_at_price'])
                    : null,
                'cost_price' => isset($v['cost_price']) && $v['cost_price'] !== '' ? (int) round($v['cost_price']) : null,
                'stock' => isset($v['stock']) && $v['stock'] !== '' && $v['stock'] !== null
                    ? (int) $v['stock']
                    : 0,
                'status' => 'active',
            ]);

            $this->syncVariantInventory($variant, (int) ($v['stock'] ?? 0));
        }
    }

    /**
     * Menyalin nilai stok dari form produk ke catatan inventory gudang default,
     * supaya stok yang ditampilkan di storefront & halaman inventory konsisten.
     */
    private function syncVariantInventory(ProductVariant $variant, int $stock): void
    {
        $warehouse = Warehouse::query()->where('status', 'active')->orderBy('id')->first();

        if (! $warehouse) {
            return;
        }

        Inventory::updateOrCreate(
            [
                'warehouse_id' => $warehouse->id,
                'product_variant_id' => $variant->id,
            ],
            [
                'quantity_on_hand' => max(0, $stock),
                'quantity_reserved' => 0,
            ]
        );
    }

    /**
     * @param  array<int, \Illuminate\Http\UploadedFile>  $files
     */
    private function saveImages(Product $product, array $files, int $primaryIndex): void
    {
        $files = array_values(array_filter($files));

        foreach ($files as $i => $file) {
            $path = $file->store('products', 'public');

            ProductImage::create([
                'product_id' => $product->id,
                'path' => $path,
                'sort_order' => $i,
                'is_primary' => $i === $primaryIndex,
            ]);
        }
    }

    private function resolveSlug(?string $slug, string $name): string
    {
        $base = $slug && trim($slug) !== '' ? $slug : Str::slug($name);

        $candidate = $base;
        $counter = 1;
        while (Product::where('slug', $candidate)->exists()) {
            $candidate = $base.'-'.$counter;
            $counter++;
        }

        return $candidate;
    }
}
