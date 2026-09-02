<?php

namespace App\Domain\Catalog\Actions;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

final class UpdateProductAction
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(Product $product, array $data): Product
    {
        return DB::transaction(function () use ($product, $data) {
            $product->update([
                'brand_id' => $data['brand_id'] ?? $product->brand_id,
                'name' => $data['name'],
                'slug' => $this->resolveSlug($data['slug'] ?? null, $data['name'], $product->id),
                'status' => $data['status'] ?? $product->status,
                'short_description' => $data['short_description'] ?? $product->short_description,
                'description' => $data['description'] ?? $product->description,
                'meta_title' => $data['meta_title'] ?? $product->meta_title,
                'meta_description' => $data['meta_description'] ?? $product->meta_description,
                'published_at' => ($data['status'] ?? $product->status) === 'published'
                    ? ($product->published_at ?? now())
                    : null,
            ]);

            $this->syncCategories($product, $data['category_ids'] ?? []);
            $this->saveVariants($product, $data['variants'] ?? [], $data['delete_variant_ids'] ?? []);
            $this->saveImages($product, $data);

            return $product->refresh();
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
     * @param  array<int, int|string>  $deleteVariantIds
     */
    private function saveVariants(Product $product, array $variants, array $deleteVariantIds): void
    {
        $deleteVariantIds = array_map('intval', array_values((array) $deleteVariantIds));

        foreach ($variants as $v) {
            $payload = [
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
            ];

            if (! empty($v['id'])) {
                $product->variants()->whereKey($v['id'])->update($payload);
            } else {
                $product->variants()->create($payload);
            }
        }

        if (! empty($deleteVariantIds)) {
            $product->variants()->whereIn('id', $deleteVariantIds)->delete();
        }
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function saveImages(Product $product, array $data): void
    {
        $deleteImageIds = array_map('intval', array_values((array) ($data['delete_image_ids'] ?? [])));

        if (! empty($deleteImageIds)) {
            $toDelete = ProductImage::where('product_id', $product->id)
                ->whereIn('id', $deleteImageIds)
                ->get();

            foreach ($toDelete as $image) {
                if ($image->path) {
                    Storage::disk('public')->delete($image->path);
                }
                $image->delete();
            }
        }

        // Reset semua ke non-primary dulu; nanti ditandai ulang sesuai primary_ref.
        $product->images()->update(['is_primary' => false, 'sort_order' => 0]);

        $keptImages = array_values((array) ($data['kept_images'] ?? []));

        foreach ($keptImages as $i => $item) {
            $product->images()
                ->whereKey($item['id'])
                ->update(['sort_order' => $i]);
        }

        $newImages = array_values(array_filter((array) ($data['new_images'] ?? [])));

        $baseOrder = count($keptImages);

        foreach ($newImages as $i => $file) {
            $path = $file->store('products', 'public');

            ProductImage::create([
                'product_id' => $product->id,
                'path' => $path,
                'sort_order' => $baseOrder + $i,
            ]);
        }

        $this->applyPrimary($product, $data, $keptImages);
    }

    /**
     * @param  array<string, mixed>  $data
     * @param  array<int, array<string, mixed>>  $keptImages
     */
    private function applyPrimary(Product $product, array $data, array $keptImages): void
    {
        $primaryRef = $data['primary_ref'] ?? null;

        if ($primaryRef) {
            $segments = explode(':', (string) $primaryRef);

            if (($segments[0] ?? '') === 'existing' && isset($segments[1])) {
                $product->images()->whereKey((int) $segments[1])->update(['is_primary' => true]);
                return;
            }

            if (($segments[0] ?? '') === 'new' && isset($segments[1])) {
                $relativeIndex = (int) $segments[1];
                $sortOrder = count($keptImages) + $relativeIndex;

                $image = $product->images()->where('sort_order', $sortOrder)->first();
                if ($image) {
                    $image->update(['is_primary' => true]);
                    return;
                }
            }
        }

        // Fallback: gambar pertama (sort_order terendah).
        $product->images()->orderBy('sort_order')->orderBy('id')->first()?->update(['is_primary' => true]);
    }

    private function resolveSlug(?string $slug, string $name, int $ignoreId): string
    {
        $base = $slug && trim($slug) !== '' ? $slug : Str::slug($name);

        $candidate = $base;
        $counter = 1;
        while (Product::where('slug', $candidate)->where('id', '!=', $ignoreId)->exists()) {
            $candidate = $base.'-'.$counter;
            $counter++;
        }

        return $candidate;
    }
}
