<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Product;
use App\Models\ProductOption;
use App\Models\ProductOptionValue;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductOptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create brands
        $brands = [
            ['name' => 'Nike', 'slug' => 'nike'],
            ['name' => 'Adidas', 'slug' => 'adidas'],
            ['name' => 'Puma', 'slug' => 'puma'],
            ['name' => 'Reebok', 'slug' => 'reebok'],
        ];

        foreach ($brands as $brand) {
            Brand::firstOrCreate(['slug' => $brand['slug']], $brand);
        }

        // Product data dengan options
        $productsData = [
            [
                'name' => 'Nike Air Max 90',
                'brand' => 'Nike',
                'options' => [
                    [
                        'name' => 'Size',
                        'values' => ['6', '7', '8', '9', '10', '11', '12']
                    ],
                    [
                        'name' => 'Color',
                        'values' => ['White', 'Black', 'Red', 'Blue']
                    ]
                ]
            ],
            [
                'name' => 'Adidas Ultraboost',
                'brand' => 'Adidas',
                'options' => [
                    [
                        'name' => 'Size',
                        'values' => ['6', '7', '8', '9', '10', '11', '12']
                    ],
                    [
                        'name' => 'Color',
                        'values' => ['White', 'Black', 'Grey', 'Purple']
                    ]
                ]
            ],
            [
                'name' => 'Puma RS-X',
                'brand' => 'Puma',
                'options' => [
                    [
                        'name' => 'Size',
                        'values' => ['5', '6', '7', '8', '9', '10', '11']
                    ],
                    [
                        'name' => 'Color',
                        'values' => ['Black', 'White', 'Yellow']
                    ]
                ]
            ],
            [
                'name' => 'Reebok Classic Leather',
                'brand' => 'Reebok',
                'options' => [
                    [
                        'name' => 'Size',
                        'values' => ['6', '7', '8', '9', '10', '11']
                    ],
                    [
                        'name' => 'Color',
                        'values' => ['White', 'Navy', 'Maroon']
                    ]
                ]
            ],
            [
                'name' => 'Cotton T-Shirt',
                'brand' => 'Nike',
                'options' => [
                    [
                        'name' => 'Size',
                        'values' => ['XS', 'S', 'M', 'L', 'XL', 'XXL']
                    ],
                    [
                        'name' => 'Color',
                        'values' => ['White', 'Black', 'Grey', 'Blue', 'Red']
                    ]
                ]
            ],
        ];

        // Create products with options
        foreach ($productsData as $productData) {
            $brand = Brand::where('name', $productData['brand'])->first();
            
            $product = Product::firstOrCreate(
                ['slug' => Str::slug($productData['name'])],
                [
                    'name' => $productData['name'],
                    'brand_id' => $brand->id,
                    'type' => 'variable',
                    'status' => 'published',
                    'short_description' => 'Premium ' . $productData['name'],
                    'description' => 'High-quality ' . $productData['name'] . ' with various options.',
                    'published_at' => now(),
                ]
            );

            // Create product options and their values
            foreach ($productData['options'] as $index => $optionData) {
                $option = ProductOption::firstOrCreate(
                    [
                        'product_id' => $product->id,
                        'name' => $optionData['name']
                    ],
                    [
                        'sort_order' => $index
                    ]
                );

                // Create option values
                foreach ($optionData['values'] as $valueIndex => $value) {
                    ProductOptionValue::firstOrCreate(
                        [
                            'option_id' => $option->id,
                            'value' => $value
                        ],
                        [
                            'sort_order' => $valueIndex
                        ]
                    );
                }
            }

            // Create sample variants for each product
            $this->createVariants($product, $productsData);
        }

        $this->command->info('Product options seeded successfully!');
    }

    /**
     * Create product variants
     */
    private function createVariants(Product $product, $productsData): void
    {
        // Create basic variant
        $sku = Str::upper(Str::slug($product->name, '')) . '-001';
        
        ProductVariant::firstOrCreate(
            [
                'product_id' => $product->id,
                'sku' => $sku
            ],
            [
                'price' => 999000, // Default price
                'status' => 'active'
            ]
        );
    }
}
