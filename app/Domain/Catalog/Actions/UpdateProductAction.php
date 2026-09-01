<?php

namespace App\Domain\Catalog\Actions;

use App\Models\Product;
<<<<<<< HEAD
use App\Models\ProductImage;
use App\Models\ProductVariant;
=======
use Illuminate\Http\UploadedFile;
>>>>>>> 98c2ebd8d06ed9a1a4efbe10f036d25a05958aba
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

<<<<<<< HEAD
final class UpdateProductAction
{
    /**
     * @param  array<string, mixed>  $data
=======
class UpdateProductAction
{
    /**
     * Update an existing product, updating images, variants, and category relations.
     *
     * @param Product $product
     * @param array<string, mixed> $data
     * @return Product
>>>>>>> 98c2ebd8d06ed9a1a4efbe10f036d25a05958aba
     */
    public function execute(Product $product, array $data): Product
    {
        return DB::transaction(function () use ($product, $data) {
<<<<<<< HEAD
            $product->update([
                'brand_id' => $data['brand_id'] ?? $product->brand_id,
                'name' => $data['name'],
                'slug' => $this->resolveSlug($data['slug'] ?? null, $data['name'], $product->id),
                'status' => $data['status'] ?? $product->status,
=======
            $slug = !empty($data['slug']) ? Str::slug($data['slug']) : Str::slug($data['name']);

            if ($slug !== $product->slug) {
                $originalSlug = $slug;
                $count = 1;
                while (Product::where('slug', $slug)->where('id', '!=', $product->id)->exists()) {
                    $slug = "{$originalSlug}-{$count}";
                    $count++;
                }
            }

            $status = $data['status'] ?? $product->status;
            $publishedAt = ($status === 'published')
                ? ($product->published_at ?? now())
                : null;

            $product->update([
                'brand_id' => $data['brand_id'] ?? null,
                'name' => $data['name'] ?? $product->name,
                'slug' => $slug,
                'type' => $data['type'] ?? $product->type,
                'status' => $status,
>>>>>>> 98c2ebd8d06ed9a1a4efbe10f036d25a05958aba
                'short_description' => $data['short_description'] ?? $product->short_description,
                'description' => $data['description'] ?? $product->description,
                'meta_title' => $data['meta_title'] ?? $product->meta_title,
                'meta_description' => $data['meta_description'] ?? $product->meta_description,
<<<<<<< HEAD
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
=======
                'published_at' => $publishedAt,
            ]);

            // Sync Categories
            if (isset($data['category_ids'])) {
                $product->categories()->sync($data['category_ids']);
            }

            // Handle Variants
            if (isset($data['variants']) && is_array($data['variants'])) {
                $incomingVariantIds = [];
                foreach ($data['variants'] as $variantData) {
                    $variantId = $variantData['id'] ?? null;

                    $variantPayload = [
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
                    ];

                    if ($variantId) {
                        $variant = $product->variants()->find($variantId);
                        if ($variant) {
                            $variant->update($variantPayload);
                            $incomingVariantIds[] = $variant->id;
                        } else {
                            $newVariant = $product->variants()->create($variantPayload);
                            $incomingVariantIds[] = $newVariant->id;
                        }
                    } else {
                        $newVariant = $product->variants()->create($variantPayload);
                        $incomingVariantIds[] = $newVariant->id;
                    }
                }

                if (!empty($incomingVariantIds)) {
                    $product->variants()->whereNotIn('id', $incomingVariantIds)->delete();
                }
            }

            // Handle Image Deletions & Addition
            $keptImageIds = $data['existing_image_ids'] ?? null;
            if (is_array($keptImageIds)) {
                $imagesToDelete = $product->images()->whereNotIn('id', $keptImageIds)->get();
                foreach ($imagesToDelete as $deletedImg) {
                    if ($deletedImg->path && Storage::disk('public')->exists($deletedImg->path)) {
                        Storage::disk('public')->delete($deletedImg->path);
                    }
                    $deletedImg->delete();
                }
            }

            // Save new uploaded images
            if (!empty($data['images']) && is_array($data['images'])) {
                $maxSortOrder = (int) $product->images()->max('sort_order');
                foreach ($data['images'] as $index => $imageItem) {
                    $file = null;
                    $altText = null;
                    $isPrimary = false;

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
                            'sort_order' => $maxSortOrder + $index + 1,
                            'is_primary' => $isPrimary,
                        ]);
                    }
                }
            }

            // Primary image designation
            if (isset($data['primary_image_id'])) {
                $product->images()->update(['is_primary' => false]);
                $product->images()->where('id', $data['primary_image_id'])->update(['is_primary' => true]);
            }

            if ($product->images()->where('is_primary', true)->count() === 0) {
                $firstImg = $product->images()->first();
                if ($firstImg) {
                    $firstImg->update(['is_primary' => true]);
                }
            }

            return $product->fresh(['brand', 'categories', 'images', 'variants']);
        });
    }
>>>>>>> 98c2ebd8d06ed9a1a4efbe10f036d25a05958aba
}
