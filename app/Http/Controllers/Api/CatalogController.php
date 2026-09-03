<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Support\ProductPresenter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CatalogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::query()
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->with('brand', 'categories', 'images', 'variants.optionValues.option', 'variants.inventories', 'options.values')
            ->withMin('variants', 'price')
            ->withCount('reviews');

        if ($categorySlug = $request->string('category')->toString()) {
            $query->whereHas('categories', function ($q) use ($categorySlug) {
                $q->where('categories.slug', $categorySlug)
                  ->orWhere('categories.id', $categorySlug);
            });
        }

        if ($request->filled('q')) {
            $search = trim($request->string('q')->toString());
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('short_description', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('brand', fn ($b) => $b->where('name', 'like', "%{$search}%"));
            });
        }

        if ($request->filled('minPrice')) {
            $minPrice = (int) $request->integer('minPrice');
            $query->whereHas('variants', fn ($v) => $v->where('price', '>=', $minPrice));
        }

        if ($request->filled('maxPrice')) {
            $maxPrice = (int) $request->integer('maxPrice');
            $query->whereHas('variants', fn ($v) => $v->where('price', '<=', $maxPrice));
        }

        if ($request->boolean('inStock')) {
            $query->whereHas('variants', fn ($v) => $v->where('status', 'active'));
        }

        $sort = $request->string('sort')->toString() ?: 'newest';

        match ($sort) {
            'price-asc' => $query->orderBy('variants_min_price', 'asc'),
            'price-desc' => $query->orderBy('variants_min_price', 'desc'),
            'rating' => $query->orderByDesc('reviews_count'),
            'newest' => $query->orderByDesc('published_at'),
            default => $query->orderByDesc('published_at'),
        };

        $paginator = $query->paginate($request->integer('per_page', 12));

        return response()->json([
            'data' => $paginator->getCollection()->map(fn (Product $p) => ProductPresenter::product($p))->values(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    public function show(Request $request, string $idOrSlug): JsonResponse
    {
        $product = Product::query()
            ->where('status', 'published')
            ->where(fn ($q) => $q->where('id', $idOrSlug)->orWhere('slug', $idOrSlug))
            ->with('brand', 'categories', 'images', 'variants.optionValues.option', 'variants.inventories', 'options.values')
            ->with([
                'reviews' => fn ($q) => $q->where('status', 'approved')->orderByDesc('created_at')->with('user'),
            ])
            ->first();

        if (! $product) {
            return response()->json(['message' => 'Produk tidak ditemukan.'], 404);
        }

        return response()->json([
            'data' => ProductPresenter::product($product),
            'reviews' => $product->reviews->map(fn ($r) => [
                'id' => $r->id,
                'author' => $r->user?->name ?? 'Pembeli terverifikasi',
                'rating' => $r->rating,
                'comment' => $r->review,
                'date' => $r->created_at?->diffForHumans(),
            ])->values(),
        ]);
    }

    public function categories(): JsonResponse
    {
        $categories = Category::query()
            ->where('status', 'published')
            ->withCount('products')
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => $categories->map(fn (Category $c) => ProductPresenter::category($c))->values(),
        ]);
    }
}