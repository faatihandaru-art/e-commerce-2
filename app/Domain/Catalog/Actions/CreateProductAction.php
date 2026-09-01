<?php

namespace App\Domain\Catalog\Actions;

use App\Models\Product;
<<<<<<< HEAD
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

final class CreateProductAction
{
    /**
     * @param  array<string, mixed>  $data
=======
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CreateProductAction
{
    /**
     * Create a new product with images, variants, and category relations.
     *
     * @param array<string, mixed> $data
     * @return Product
>>>>>>> 98c2ebd8d06ed9a1a4efbe10f036d25a05958aba
     */
    public function execute(array $data): Product
    {
        return DB::transaction(function () use ($data) {
<<<<<<< HEAD
            $product = Product::create([
                'brand_id' => $data['brand_id'] ?? null,
                'name' => $data['name'],
                'slug' => $this->resolveSlug($data['slug'] ?? null, $data['name']),
                'type' => $data['type'] ?? 'simple',
                'status' => $data['status'] ?? 'draft',
=======
            $slug = !empty($data['slug']) ? Str::slug($data['slug']) : Str::slug($data['name']);

            $originalSlug = $slug;
            $count = 1;
            while (Product::where('slug', $slug)->exists()) {
                $slug = "{$originalSlug}-{$count}";
                $count++;
            }

            $status = $data['status'] ?? 'draft';
            $publishedAt = ($status === 'published') ? ($data['published_at'] ?? now()) : null;

            $product = Product::create([
                'brand_id' => $data['brand_id'] ?? null,
                'name' => $data['name'],
                'slug' => $slug,
                'type' => $data['type'] ?? 'simple',
                'status' => $status,
>>>>>>> 98c2ebd8d06ed9a1a4efbe10f036d25a05958aba
                'short_description' => $data['short_description'] ?? null,
                'description' => $data['description'] ?? null,
                'meta_title' => $data['meta_title'] ?? null,
                'meta_description' => $data['meta_description'] ?? null,
<<<<<<< HEAD
                'published_at' => ($data['status'] ?? 'draft') === 'published' ? now() : null,
            ]);

            $this->syncCategories($product, $data['category_ids'] ?? []);
            $this->saveVariants($product, $data['variants'] ?? []);
            $this->saveImages($product, $data['images'] ?? [], $data['primary_index'] ?? 0);
=======
                'published_at' => $publishedAt,
            ]);

            // Sync Categories
            if (!empty($data['category_ids'])) {
                $product->categories()->sync($data['category_ids']);
            }

            // Create Variants
            if (!empty($data['variants']) && is_array($data['variants'])) {
                foreach ($data['variants'] as $variantData) {
                    $product->variants()->create([
                        'sku' => $variantData['sku'],
                        'barcode' => $variantData['barcode'] ?? null,
                        'price' => $variantData['price'],
                        'compare_at_price' => $variantData['compare_at_price'] ?? null,
                        'cost_price' => $variantData['cost_price'] ?? null,
                        'weight_grams' => $variantData['weight_grams'] ?? null,
                        'length_mm' => $variantData['length_mm'] ?? null,
                        'width_mm' => $variantData['width_mm'] ?? null,
                        'height_mm' => $variantData['height_mm'] ?? null,
                        'status' => $variantData['status'] ?? 'active',
                    ]);
                }
            }

            // Save Images
            if (!empty($data['images']) && is_array($data['images'])) {
                foreach ($data['images'] as $index => $imageItem) {
                    $file = null;
                    $altText = null;
                    $isPrimary = ($index === 0);

                    if ($imageItem instanceof UploadedFile) {
                        $file = $imageItem;
                    } elseif (is_array($imageItem)) {
                        $file = $imageItem['file'] ?? null;
                        $altText = $imageItem['alt_text'] ?? null;
                        if (isset($imageItem['is_primary'])) {
                            $isPrimary = (bool) $imageItem['is_primary'];
                        }
                    }

                    if ($file instanceof UploadedFile) {
                        $path = $file->store('products', 'public');
                        $product->images()->create([
                            'path' => $path,
                            'alt_text' => $altText ?? $product->name,
                            'sort_order' => $index,
                            'is_primary' => $isPrimary,
                        ]);
                    } elseif (is_string($imageItem)) {
                        $product->images()->create([
                            'path' => $imageItem,
                            'alt_text' => $product->name,
                            'sort_order' => $index,
                            'is_primary' => $isPrimary,
                        ]);
                    }
                }
            }

            // Ensure primary image exists
            if ($product->images()->where('is_primary', true)->count() === 0) {
                $firstImage = $product->images()->first();
                if ($firstImage) {
                    $firstImage->update(['is_primary' => true]);
                }
            }
>>>>>>> 98c2ebd8d06ed9a1a4efbe10f036d25a05958aba

            return $product;
        });
    }
<<<<<<< HEAD

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
            ProductVariant::create([
                'product_id' => $product->id,
                'sku' => $v['sku'],
                'barcode' => $v['barcode'] ?? null,
                'price' => (int) round($v['price']),
                'compare_at_price' => isset($v['compare_at_price']) && $v['compare_at_price'] !== '' && $v['compare_at_price'] !== null
                    ? (int) round($v['compare_at_price'])
                    : null,
                'cost_price' => isset($v['cost_price']) && $v['cost_price'] !== '' ? (int) round($v['cost_price']) : null,
                'status' => 'active',
            ]);
        }
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
=======
>>>>>>> 98c2ebd8d06ed9a1a4efbe10f036d25a05958aba
}
