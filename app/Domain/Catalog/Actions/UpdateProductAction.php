<?php

namespace App\Domain\Catalog\Actions;

use App\Models\Product;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UpdateProductAction
{
    /**
     * Update an existing product, updating images, variants, and category relations.
     *
     * @param Product $product
     * @param array<string, mixed> $data
     * @return Product
     */
    public function execute(Product $product, array $data): Product
    {
        return DB::transaction(function () use ($product, $data) {
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
                'short_description' => $data['short_description'] ?? $product->short_description,
                'description' => $data['description'] ?? $product->description,
                'meta_title' => $data['meta_title'] ?? $product->meta_title,
                'meta_description' => $data['meta_description'] ?? $product->meta_description,
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
}
