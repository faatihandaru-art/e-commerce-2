<?php

namespace App\Domain\Product\Actions;

use App\Models\Product;
use App\Models\ProductOption;
use App\Models\ProductOptionValue;
use Illuminate\Support\Collection;

class CreateProductOptionsAction
{
    /**
     * Create product options from provided data.
     *
     * @param Product $product
     * @param array $optionsData Array of options with format:
     *        [
     *            ['name' => 'Size', 'values' => ['S', 'M', 'L']],
     *            ['name' => 'Color', 'values' => ['Red', 'Blue']]
     *        ]
     * @return Collection
     */
    public function execute(Product $product, array $optionsData): Collection
    {
        $createdOptions = collect();

        foreach ($optionsData as $index => $optionData) {
            $option = $this->createOption($product, $optionData, $index);
            $this->createOptionValues($option, $optionData['values'] ?? []);
            $createdOptions->push($option);
        }

        return $createdOptions;
    }

    /**
     * Create a single product option
     */
    private function createOption(Product $product, array $optionData, int $sortOrder): ProductOption
    {
        return ProductOption::firstOrCreate(
            [
                'product_id' => $product->id,
                'name' => $optionData['name']
            ],
            [
                'sort_order' => $sortOrder
            ]
        );
    }

    /**
     * Create option values for an option
     */
    private function createOptionValues(ProductOption $option, array $values): void
    {
        foreach ($values as $index => $value) {
            ProductOptionValue::firstOrCreate(
                [
                    'option_id' => $option->id,
                    'value' => $value
                ],
                [
                    'sort_order' => $index
                ]
            );
        }
    }

    /**
     * Create options for multiple products
     *
     * @param array $productsData Array of products with options:
     *        [
     *            'product_id' => 1,
     *            'options' => [
     *                ['name' => 'Size', 'values' => ['S', 'M', 'L']]
     *            ]
     *        ]
     */
    public function executeBulk(array $productsData): Collection
    {
        $results = collect();

        foreach ($productsData as $data) {
            $product = Product::findOrFail($data['product_id']);
            $options = $this->execute($product, $data['options'] ?? []);
            $results->push([
                'product_id' => $product->id,
                'product_name' => $product->name,
                'options_count' => $options->count(),
                'options' => $options
            ]);
        }

        return $results;
    }

    /**
     * Copy options from one product to another
     */
    public function copyFromProduct(Product $sourceProduct, Product $targetProduct): Collection
    {
        $sourceOptions = $sourceProduct->options()->with('values')->get();
        $createdOptions = collect();

        foreach ($sourceOptions as $sourceOption) {
            $optionData = [
                'name' => $sourceOption->name,
                'values' => $sourceOption->values->pluck('value')->toArray()
            ];

            $option = $this->createOption($targetProduct, $optionData, $sourceOption->sort_order);
            $this->createOptionValues($option, $optionData['values']);
            $createdOptions->push($option);
        }

        return $createdOptions;
    }
}
