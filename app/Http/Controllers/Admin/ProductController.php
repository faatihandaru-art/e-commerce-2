<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Catalog\Actions\CreateProductAction;
use App\Domain\Catalog\Actions\DeleteProductAction;
use App\Domain\Catalog\Actions\UpdateProductAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
<<<<<<< HEAD
use App\Models\Product;
use App\Support\Admin\CatalogPresenter;
use Illuminate\Http\RedirectResponse;
=======
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
>>>>>>> 98c2ebd8d06ed9a1a4efbe10f036d25a05958aba
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
<<<<<<< HEAD
    public function index(): Response
    {
        $products = Product::query()
            ->with(['images' => fn ($q) => $q->orderBy('sort_order'), 'variants'])
            ->latest('id')
            ->paginate(10)
            ->through(fn (Product $product) => [
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
                ])->values(),
                'created_at' => $product->created_at?->format('d M Y'),
            ]);

        return Inertia::render('Admin/Product/Index', [
            'products' => $products,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Product/Create', [
            'categories' => CatalogPresenter::categories(),
            'brands' => CatalogPresenter::brands(),
        ]);
    }

=======
    /**
     * Display a paginated listing of the products.
     */
    public function index(Request $request): Response
    {
        $query = Product::query()
            ->with(['brand', 'categories', 'images', 'variants'])
            ->latest();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%")
                  ->orWhereHas('brand', fn ($b) => $b->where('name', 'like', "%{$search}%"));
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($categoryId = $request->input('category_id')) {
            $query->whereHas('categories', fn ($c) => $c->where('categories.id', $categoryId));
        }

        $products = $query->paginate(10)->withQueryString();

        return Inertia::render('Admin/Product/Index', [
            'products' => $products,
            'filters' => $request->only(['search', 'status', 'category_id']),
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create(): Response
    {
        $categories = Category::query()
            ->select('id', 'name', 'parent_id', 'status')
            ->orderBy('name')
            ->get();

        $brands = Brand::query()
            ->select('id', 'name', 'status')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Product/Create', [
            'categories' => $categories,
            'brands' => $brands,
        ]);
    }

    /**
     * Store a newly created product in storage.
     */
>>>>>>> 98c2ebd8d06ed9a1a4efbe10f036d25a05958aba
    public function store(StoreProductRequest $request, CreateProductAction $action): RedirectResponse
    {
        $action->execute($request->validated());

<<<<<<< HEAD
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

=======
        return redirect()->route('admin.products.index')
            ->with('success', 'Produk berhasil dibuat.');
    }

    /**
     * Show the form for editing the specified product.
     */
    public function edit(Product $product): Response
    {
        $product->load(['brand', 'categories', 'images', 'variants']);

        $categories = Category::query()
            ->select('id', 'name', 'parent_id', 'status')
            ->orderBy('name')
            ->get();

        $brands = Brand::query()
            ->select('id', 'name', 'status')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Product/Edit', [
            'product' => $product,
            'categories' => $categories,
            'brands' => $brands,
        ]);
    }

    /**
     * Update the specified product in storage.
     */
>>>>>>> 98c2ebd8d06ed9a1a4efbe10f036d25a05958aba
    public function update(UpdateProductRequest $request, Product $product, UpdateProductAction $action): RedirectResponse
    {
        $action->execute($product, $request->validated());

<<<<<<< HEAD
        return redirect()->route('admin.products.index')->with('success', 'Produk berhasil diperbarui.');
    }

=======
        return redirect()->route('admin.products.index')
            ->with('success', 'Produk berhasil diperbarui.');
    }

    /**
     * Remove the specified product from storage.
     */
>>>>>>> 98c2ebd8d06ed9a1a4efbe10f036d25a05958aba
    public function destroy(Product $product, DeleteProductAction $action): RedirectResponse
    {
        $action->execute($product);

<<<<<<< HEAD
        return redirect()->route('admin.products.index')->with('success', 'Produk berhasil dihapus.');
=======
        return redirect()->route('admin.products.index')
            ->with('success', 'Produk berhasil dihapus.');
>>>>>>> 98c2ebd8d06ed9a1a4efbe10f036d25a05958aba
    }
}
