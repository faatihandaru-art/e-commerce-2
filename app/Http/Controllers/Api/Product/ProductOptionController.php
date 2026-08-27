<?php

namespace App\Http\Controllers\Api\Product;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductOption;
use App\Domain\Product\Actions\CreateProductOptionsAction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductOptionController extends Controller
{
    private CreateProductOptionsAction $action;

    public function __construct()
    {
        $this->action = new CreateProductOptionsAction();
    }

    /**
     * Get all options for a product
     */
    public function index(Product $product): JsonResponse
    {
        $options = $product->options()
            ->with('values')
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $options,
            'count' => $options->count(),
        ]);
    }

    /**
     * Get a specific option
     */
    public function show(ProductOption $option): JsonResponse
    {
        $option->load('values');

        return response()->json([
            'success' => true,
            'data' => $option,
        ]);
    }

    /**
     * Create options for a product
     */
    public function store(Request $request, Product $product): JsonResponse
    {
        $validated = $request->validate([
            'options' => 'required|array',
            'options.*.name' => 'required|string|max:100',
            'options.*.values' => 'required|array',
            'options.*.values.*' => 'required|string|max:100',
        ]);

        try {
            $createdOptions = $this->action->execute($product, $validated['options']);

            return response()->json([
                'success' => true,
                'message' => 'Options created successfully',
                'data' => $createdOptions,
                'count' => $createdOptions->count(),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create options: ' . $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Update an option
     */
    public function update(Request $request, ProductOption $option): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'sort_order' => 'sometimes|integer|min:0',
        ]);

        $option->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Option updated successfully',
            'data' => $option,
        ]);
    }

    /**
     * Delete an option
     */
    public function destroy(ProductOption $option): JsonResponse
    {
        $productId = $option->product_id;
        $option->delete();

        return response()->json([
            'success' => true,
            'message' => 'Option deleted successfully',
            'product_id' => $productId,
        ]);
    }

    /**
     * Copy options from one product to another
     */
    public function copy(Request $request, Product $sourceProduct): JsonResponse
    {
        $validated = $request->validate([
            'target_product_id' => 'required|exists:products,id',
        ]);

        try {
            $targetProduct = Product::findOrFail($validated['target_product_id']);
            $copiedOptions = $this->action->copyFromProduct($sourceProduct, $targetProduct);

            return response()->json([
                'success' => true,
                'message' => 'Options copied successfully',
                'source_product_id' => $sourceProduct->id,
                'target_product_id' => $targetProduct->id,
                'options_copied' => $copiedOptions->count(),
                'data' => $copiedOptions,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to copy options: ' . $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Bulk create options for multiple products
     */
    public function bulkCreate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'products' => 'required|array',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.options' => 'required|array',
            'products.*.options.*.name' => 'required|string|max:100',
            'products.*.options.*.values' => 'required|array',
            'products.*.options.*.values.*' => 'required|string|max:100',
        ]);

        try {
            $results = $this->action->executeBulk($validated['products']);

            return response()->json([
                'success' => true,
                'message' => 'Options created for products successfully',
                'total_products' => $results->count(),
                'data' => $results,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create options: ' . $e->getMessage(),
            ], 422);
        }
    }
}
