<?php

namespace App\Support;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\ProductVariant;

/**
 * Maps Eloquent catalog models into the JSON shape consumed by the React storefront.
 */
class ProductPresenter
{
    /**
     * Full product payload (list & detail pages).
     *
     * @return array<string, mixed>
     */
    public static function product(Product $product): array
    {
        if ($product->relationLoaded('images')) {
            $images = $product->images->sortBy('sort_order')->sortByDesc('is_primary');
        } else {
            $images = $product->images()->orderBy('is_primary', 'desc')->orderBy('sort_order')->get();
        }

        $variants = $product->variants ?? $product->variants()->with('optionValues.option')->orderBy('price')->get();
        $basePrice = (int) $variants->filter(fn ($v) => $v->status === 'active')->min('price') ?? 0;
        $compareAt = $variants->filter(fn ($v) => $v->compare_at_price)->max('compare_at_price');

        $category = $product->categories->first();
        $brandName = $product->brand?->name;

        $reviews = $product->reviews ?? collect();
        $approved = $reviews->filter(fn (ProductReview $r) => $r->status === 'approved');

        $activeVariants = $variants->filter(fn ($v) => $v->status === 'active');
        $stock = $activeVariants->isNotEmpty() ? 100 : 0;
        $isNew = (bool) $product->published_at && $product->published_at->gte(now()->subDays(30));

        $formattedImages = $images->map(function ($img) {
            if (empty($img->path)) return '';
            if (str_starts_with($img->path, 'http://') || str_starts_with($img->path, 'https://')) {
                return $img->path;
            }
            return asset('storage/' . ltrim($img->path, '/'));
        })->filter()->values()->all();

        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'description' => $product->description ?? $product->short_description ?? '',
            'categoryId' => $category?->id,
            'category' => $category ? self::category($category) : null,
            'images' => $formattedImages,
            'price' => $basePrice,
            'compareAtPrice' => $compareAt ?: null,
            'variants' => $variants->map(fn (ProductVariant $v) => self::variant($v, $basePrice))->values()->all(),
            'specifications' => self::specifications($product, $category?->name, $brandName),
            'rating' => $approved->isEmpty() ? 0 : (float) round($approved->avg('rating'), 1),
            'reviewCount' => $approved->count(),
            'stock' => $stock,
            'isFeatured' => false,
            'isNew' => $isNew,
            'badge' => self::badge($basePrice, $compareAt, $stock, $isNew),
            'brand' => $brandName,
            'sku' => $variants->first()?->sku,
        ];
    }

    /**
     * Lighter payload used for cart hydration.
     *
     * @return array<string, mixed>
     */
    public static function summary(Product $product): array
    {
        $productData = self::product($product);
        unset($productData['variants'], $productData['specifications'], $productData['rating'], $productData['reviewCount'], $productData['badge']);

        return $productData;
    }

    /**
     * @return array<string, mixed>
     */
    public static function variant(ProductVariant $variant, ?int $basePrice = null): array
    {
        $optionValues = $variant->optionValues ?? $variant->optionValues()->with('option')->get();
        $optionNames = $optionValues->pluck('option.name')->unique()->values();
        $optionLiteral = $optionValues->pluck('value')->unique()->values();

        $base = $basePrice ?? $variant->price;

        return [
            'id' => $variant->id,
            'productId' => $variant->product_id,
            'name' => $optionNames->implode(' · ') ?: 'Pilihan',
            'value' => $optionLiteral->implode(' / ') ?: $variant->sku,
            'priceModifier' => $variant->price - $base,
            'stock' => $variant->status === 'active' ? 100 : 0,
            'sku' => $variant->sku,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function category(Category $category, ?int $productCount = null): array
    {
        return [
            'id' => $category->id,
            'name' => $category->name,
            'slug' => $category->slug,
            'icon' => $category->icon,
            'image' => $category->image,
            'description' => $category->description ?? $category->meta_description,
            'productCount' => $productCount ?? $category->products_count ?? null,
        ];
    }

    /**
     * @return array<string, string>
     */
    private static function specifications(Product $product, ?string $categoryName, ?string $brandName): array
    {
        $specs = [];

        if ($brandName) {
            $specs['Brand'] = $brandName;
        }

        if ($categoryName) {
            $specs['Kategori'] = $categoryName;
        }

        $options = $product->options()->with('values')->orderBy('sort_order')->get();
        foreach ($options as $option) {
            $literal = $option->values->pluck('value')->unique()->values();
            if ($option->name && $literal->isNotEmpty()) {
                $specs[$option->name] = $literal->implode(', ');
            }
        }

        return $specs;
    }

    private static function badge(int $price, ?int $compareAt, int $stock, bool $isNew): ?string
    {
        if ($compareAt && $compareAt > $price) {
            return 'Diskon';
        }

        if ($isNew) {
            return 'Baru';
        }

        if ($stock > 0 && $stock <= 5) {
            return 'Stok Terbatas';
        }

        return null;
    }
}