<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Catalog\Actions\CreateProductAction;
use App\Domain\Catalog\Actions\DeleteProductAction;
use App\Domain\Catalog\Actions\UpdateProductAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Models\Product;
use App\Support\Admin\CatalogPresenter;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        $paginator = Product::query()
            ->with([
                'brand',
                'categories',
                'images' => fn ($q) => $q->orderBy('sort_order'),
                'variants',
            ])
            ->latest('id')
            ->paginate(10);

        $paginator->setCollection(
            $paginator->getCollection()
                ->map(fn (Product $product) => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'status' => $product->status,
                    'brand' => $product->brand?->name,
                    'category_names' => $product->categories->pluck('name')->values(),
                    'image' => $product->images->firstWhere('is_primary', true)?->path
                        ?? $product->images->first()?->path,
                    'variants' => $product->variants->map(fn ($v) => [
                        'sku' => $v->sku,
                        'price' => (int) $v->price,
                        'stock' => (int) $v->stock,
                    ])->values(),
                    'created_at' => $product->created_at?->format('d M Y'),
                ])
                ->values()
        );

        return Inertia::render('Admin/Product/Index', [
            'products' => $paginator,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Product/Create', [
            'categories' => CatalogPresenter::categories(),
            'brands' => CatalogPresenter::brands(),
        ]);
    }

    public function store(StoreProductRequest $request, CreateProductAction $action): RedirectResponse
    {
        $action->execute($request->validated());

        return redirect()->route('admin.products.index')->with('success', 'Produk berhasil disimpan.');
    }

    public function edit(Product $product): Response
    {
        return Inertia::render('Admin/Product/Edit', [
            'product' => CatalogPresenter::product($product),
            'categories' => CatalogPresenter::categories(),
            'brands' => CatalogPresenter::brands(),
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product, UpdateProductAction $action): RedirectResponse
    {
        $action->execute($product, $request->validated());

        return redirect()->route('admin.products.index')->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroy(Product $product, DeleteProductAction $action): RedirectResponse
    {
        $action->execute($product);

        return redirect()->route('admin.products.index')->with('success', 'Produk berhasil dihapus.');
    }
}
