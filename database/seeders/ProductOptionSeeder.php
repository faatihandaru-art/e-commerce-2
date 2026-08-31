<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductOption;
use App\Models\ProductOptionValue;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductOptionSeeder extends Seeder
{
    public function run(): void
    {
        $this->createBrands();
        $this->createCategories();

        foreach ($this->productsData() as $productData) {
            $this->createProduct($productData);
        }

        $this->command->info(sprintf(
            'Seeded %d gaming products, %d brands, %d categories (options, variants, images).',
            Product::count(),
            Brand::count(),
            Category::count()
        ));
    }

    private function createBrands(): void
    {
        $brands = [
            ['name' => 'HyperX', 'slug' => 'hyperx'],
            ['name' => 'Logitech G', 'slug' => 'logitech'],
            ['name' => 'Razer', 'slug' => 'razer'],
            ['name' => 'AULA', 'slug' => 'aula'],
            ['name' => 'Ajazz', 'slug' => 'ajazz'],
            ['name' => 'ASUS ROG', 'slug' => 'asus-rog'],
            ['name' => 'MSI', 'slug' => 'msi'],
            ['name' => 'Flydigi', 'slug' => 'flydigi'],
            ['name' => 'Fantech', 'slug' => 'fantech'],
            ['name' => 'ARTISAN', 'slug' => 'artisan'],
            ['name' => 'Secretlab', 'slug' => 'secretlab'],
            ['name' => 'UGREEN', 'slug' => 'ugreen'],
        ];

        foreach ($brands as $brand) {
            Brand::firstOrCreate(['slug' => $brand['slug']], $brand);
        }
    }

    private function createCategories(): void
    {
        $categories = [
            ['name' => 'Gaming Mouse', 'slug' => 'gaming-mouse', 'sort_order' => 1, 'icon' => 'Mouse', 'description' => 'Mouse gaming ultra-ringan dengan sensor optik presisi tinggi hingga 30.000 DPI.'],
            ['name' => 'Mechanical Keyboard', 'slug' => 'mechanical-keyboard', 'sort_order' => 2, 'icon' => 'Keyboard', 'description' => 'Keyboard mekanikal hot-swappable dengan switch responsif dan casing aluminium teredam.'],
            ['name' => 'Gaming Headset', 'slug' => 'gaming-headset', 'sort_order' => 3, 'icon' => 'Headphones', 'description' => 'Headset surround spatial audio 7.1 dengan driver Neodymium 50mm dan mic noise-cancelling.'],
            ['name' => 'Gaming Microphone', 'slug' => 'gaming-microphone', 'sort_order' => 4, 'icon' => 'Mic', 'description' => 'Mikrofon kondenser kelas siaran esports dengan kapsul cardioid dan shock mount terintegrasi.'],
            ['name' => 'Gaming Monitor', 'slug' => 'gaming-monitor', 'sort_order' => 5, 'icon' => 'Monitor', 'description' => 'Monitor Fast-IPS refresh rate hingga 360Hz dengan response time 0.5ms dan akurasi warna 99% sRGB.'],
            ['name' => 'Game Controller', 'slug' => 'game-controller', 'sort_order' => 6, 'icon' => 'Gamepad2', 'description' => 'Gamepad pro-level dengan Hall-Effect trigger, zero deadzone, dan remappable back paddles.'],
            ['name' => 'Gaming Mousepad', 'slug' => 'gaming-mousepad', 'sort_order' => 7, 'icon' => 'Square', 'description' => 'Mousepad surface mikro-tekstur berkecepatan tinggi dengan alas karet anti-slip ekstra tebal.'],
            ['name' => 'Gaming Chair', 'slug' => 'gaming-chair', 'sort_order' => 8, 'icon' => 'Armchair', 'description' => 'Kursi gaming ergonomis dengan penyangga lumbar magnetik dan kulit sintetis berpori dingin.'],
            ['name' => 'Gaming Desk', 'slug' => 'gaming-desk', 'sort_order' => 9, 'icon' => 'Table', 'description' => 'Meja gaming konstruksi baja Z-shape dengan manajemen kabel tersembunyi dan permukaan serat karbon.'],
            ['name' => 'Laptop Cooling Pad', 'slug' => 'laptop-cooling-pad', 'sort_order' => 10, 'icon' => 'Fan', 'description' => 'Cooling pad turbo blower bertekanan tinggi dengan filter debu dan pengatur kecepatan digital.'],
            ['name' => 'USB Hub', 'slug' => 'usb-hub', 'sort_order' => 11, 'icon' => 'Usb', 'description' => 'Hub USB-C 10Gbps bertenaga aluminium anodized dengan port transfer data latensi rendah.'],
            ['name' => 'DisplayPort Cable', 'slug' => 'displayport-cable', 'sort_order' => 12, 'icon' => 'Tv', 'description' => 'Kabel DP 2.1 braided berkepala metalik mendukung resolusi 8K@60Hz dan 4K@240Hz tanpa lag.'],
            ['name' => 'USB Type-C Cable', 'slug' => 'usb-type-c-cable', 'sort_order' => 13, 'icon' => 'Cable', 'description' => 'Kabel USB-C paracord ultra-fleksibel 100W PD dengan konektor gold-plated tahan 30.000 lekukan.'],
            ['name' => 'Desk Mat', 'slug' => 'desk-mat', 'sort_order' => 14, 'icon' => 'Layers', 'description' => 'Desk mat ukuran ekstra besar (900x400mm) tahan air dengan jahitan tepi presisi anti-fray.'],
        ];

        foreach ($categories as $data) {
            Category::firstOrCreate(['slug' => $data['slug']], [
                'name' => $data['name'],
                'icon' => $data['icon'],
                'description' => $data['description'],
                'status' => 'published',
                'sort_order' => $data['sort_order'],
            ]);
        }
    }

    /**
     * Product data yang selaras dengan katalog Vortix Gaming Store.
     */
    private function productsData(): array
    {
        return [
            [
                'name' => 'HyperX Pulsefire Haste 2 Pro - Mouse Gaming Nirkabel 4K',
                'brand' => 'hyperx',
                'price' => 2300000,
                'compare_at_price' => 2800000,
                'image' => '/images/products/hyperx-mouse.jpg',
                'sku' => 'VGS-M-APEX-WL',
                'featured' => true,
                'stock' => 12,
                'category' => 'gaming-mouse',
                'short_description' => 'Mouse gaming nirkabel ringan 61 gram dengan polling rate 4000Hz.',
                'options' => [
                    ['name' => 'Color', 'values' => ['Slate Grey', 'Phantom Red', 'Arctic White']],
                ],
            ],
            [
                'name' => 'Logitech G Pro X Superlight 2',
                'brand' => 'logitech',
                'price' => 2110000,
                'compare_at_price' => null,
                'image' => '/images/products/logitechGpro.jpg',
                'sku' => 'LGT-M-PRO-X-SL2',
                'featured' => false,
                'stock' => 20,
                'category' => 'gaming-mouse',
                'short_description' => 'Mouse gaming nirkabel 60 gram dengan sensor HERO 2 hingga 44.000 DPI.',
                'options' => [
                    ['name' => 'Varian', 'values' => ['Standard', 'DEX', '2c Compact']],
                ],
            ],
            [
                'name' => 'Razer Viper V3 Pro',
                'brand' => 'razer',
                'price' => 2990000,
                'compare_at_price' => null,
                'image' => '/images/products/razerv3pro.jpeg',
                'sku' => 'RZR-M-VIPER-V3',
                'featured' => true,
                'stock' => 10,
                'category' => 'gaming-mouse',
                'short_description' => 'Mouse gaming nirkabel ultra-ringan 54 gram dengan sensor Focus Pro 35K Gen-2.',
                'options' => [
                    ['name' => 'Color', 'values' => ['Black', 'Mercury White']],
                ],
            ],
            [
                'name' => 'AULA F75 Wireless Mechanical Keyboard',
                'brand' => 'aula',
                'price' => 700000,
                'compare_at_price' => 799000,
                'image' => '/images/products/AULA-F75.jpg',
                'sku' => 'AUL-KB-F75',
                'featured' => true,
                'stock' => 15,
                'category' => 'mechanical-keyboard',
                'short_description' => 'Keyboard mekanikal 75% hot-swappable dengan koneksi tri-mode dan baterai 4000mAh.',
                'options' => [
                    ['name' => 'Switch', 'values' => ['Reaper', 'Reaper Axis']],
                    ['name' => 'Color', 'values' => ['Black', 'White', 'Pink']],
                ],
            ],
            [
                'name' => 'Ajazz AK820 MAX HE Magnetic Keyboard',
                'brand' => 'ajazz',
                'price' => 970000,
                'compare_at_price' => 1109000,
                'image' => '/images/products/ajazz_ak820_max.webp',
                'sku' => 'AJZ-KB-AK820-HE',
                'featured' => false,
                'stock' => 6,
                'category' => 'mechanical-keyboard',
                'short_description' => 'Keyboard magnetic switch 75% dengan rapid trigger dan polling rate 8000Hz.',
                'options' => [
                    ['name' => 'Color', 'values' => ['FogSea Purple', 'Starry Flying', 'Blackberry Pink']],
                ],
            ],
            [
                'name' => 'ROG Kithara Gaming Headset',
                'brand' => 'asus-rog',
                'price' => 5899000,
                'compare_at_price' => 6299000,
                'image' => '/images/products/Rog_kithara.jpg',
                'sku' => 'ROG-HS-KTHR-2.4G',
                'featured' => true,
                'stock' => 9,
                'category' => 'gaming-headset',
                'short_description' => 'Headset nirkabel lossless 2.4GHz dengan driver Titanium 50mm dan spatial 3D audio.',
                'options' => [
                    ['name' => 'Color', 'values' => ['Midnight Carbon']],
                ],
            ],
            [
                'name' => 'Razer BlackShark V2',
                'brand' => 'razer',
                'price' => 3323050,
                'compare_at_price' => 3499000,
                'image' => '/images/products/razer_headset_blackshark_v2.webp',
                'sku' => 'RZR-HS-BLCKSHK-V2',
                'featured' => false,
                'stock' => 7,
                'category' => 'gaming-headset',
                'short_description' => 'Headset gaming nirkabel dengan driver TriForce Titanium 50mm dan THX Spatial Audio.',
                'options' => [
                    ['name' => 'Color', 'values' => ['Black', 'White']],
                ],
            ],
            [
                'name' => 'ASUS ROG Swift OLED PG32UCDM Gen 3',
                'brand' => 'asus-rog',
                'price' => 34150000,
                'compare_at_price' => 34650000,
                'image' => '/images/products/ROG_monitor.webp',
                'sku' => 'ROG-MN-PG32UCDM3',
                'featured' => true,
                'stock' => 5,
                'category' => 'gaming-monitor',
                'short_description' => 'Monitor gaming 4K 31,5 inci Tandem QD-OLED dengan refresh rate 240Hz.',
                'options' => [
                    ['name' => 'Ukuran', 'values' => ['31.5 inch']],
                ],
            ],
            [
                'name' => 'MSI MPG 271QR QD-OLED X50',
                'brand' => 'msi',
                'price' => 14000000,
                'compare_at_price' => null,
                'image' => '/images/products/MSI_monitor.webp',
                'sku' => 'MSI-MN-MPG271QR-X50',
                'featured' => false,
                'stock' => 8,
                'category' => 'gaming-monitor',
                'short_description' => 'Monitor gaming QD-OLED 26,5 inci WQHD dengan refresh rate 500Hz.',
                'options' => [
                    ['name' => 'Ukuran', 'values' => ['26.5 inch']],
                ],
            ],
            [
                'name' => 'Flydigi Vader 4 Pro',
                'brand' => 'flydigi',
                'price' => 1300000,
                'compare_at_price' => null,
                'image' => '/images/products/controller_vader4.avif',
                'sku' => 'FLY-GC-VADER4-PRO',
                'featured' => true,
                'stock' => 14,
                'category' => 'game-controller',
                'short_description' => 'Controller profesional dengan Hall Effect joystick dan force-adjustable stick.',
                'options' => [
                    ['name' => 'Color', 'values' => ['Stealth Carbon', 'Cyber White']],
                ],
            ],
            [
                'name' => 'Fantech Shooter 3 WGP13S',
                'brand' => 'fantech',
                'price' => 250000,
                'compare_at_price' => null,
                'image' => '/images/products/Fantech_WGP13S_2.png',
                'sku' => 'FNT-GC-SHOOTER3',
                'featured' => false,
                'stock' => 25,
                'category' => 'game-controller',
                'short_description' => 'Controller multi-platform dengan Hall-Effect stick, trigger dan polling rate 1000Hz.',
                'options' => [
                    ['name' => 'Color', 'values' => ['Black', 'White']],
                ],
            ],
            [
                'name' => 'Artisan Ninja FX Zero XL',
                'brand' => 'artisan',
                'price' => 945000,
                'compare_at_price' => 1150000,
                'image' => '/images/products/mousepad2.jpg',
                'sku' => 'ART-MP-FX-ZERO-XL',
                'featured' => false,
                'stock' => 1,
                'category' => 'gaming-mousepad',
                'short_description' => 'Mousepad gaming premium Jepang dengan keseimbangan kecepatan dan kontrol.',
                'options' => [
                    ['name' => 'Softness', 'values' => ['SOFT', 'XSOFT', 'MID']],
                ],
            ],
            [
                'name' => 'Secretlab Titan Evo',
                'brand' => 'secretlab',
                'price' => 7380000,
                'compare_at_price' => 9750000,
                'image' => '/images/products/chair2.webp',
                'sku' => 'SL-TITAN-EVO',
                'featured' => false,
                'stock' => 2,
                'category' => 'gaming-chair',
                'short_description' => 'Kursi gaming premium dengan 4D armrests, Cold-Cure Foam dan L-ADAPT lumbar support.',
                'options' => [
                    ['name' => 'Material', 'values' => ['SoftWeave Plus', 'Neo Hybrid Leatherette']],
                    ['name' => 'Ukuran', 'values' => ['Regular', 'XL']],
                ],
            ],
            [
                'name' => 'UGREEN USB 3.0 Hub 4-Port',
                'brand' => 'ugreen',
                'price' => 135000,
                'compare_at_price' => 199000,
                'image' => '/images/products/usbhub1.jpg',
                'sku' => 'UGRN-USB3-HUB-4P',
                'featured' => false,
                'stock' => 40,
                'category' => 'usb-hub',
                'short_description' => 'USB hub 4-port dengan kecepatan transfer hingga 5 Gbps.',
                'options' => [
                    ['name' => 'Tipe', 'values' => ['Standar', 'External Power', 'Type-C to USB-A']],
                ],
            ],
            [
                'name' => 'UGREEN 240W USB-C to USB-C Cable',
                'brand' => 'ugreen',
                'price' => 122000,
                'compare_at_price' => null,
                'image' => '/images/products/typec1.webp',
                'sku' => 'UGRN-TC-240W',
                'featured' => false,
                'stock' => 50,
                'category' => 'usb-type-c-cable',
                'short_description' => 'Kabel USB-C dengan dukungan Power Delivery 3.1 hingga 240W.',
                'options' => [
                    ['name' => 'Panjang', 'values' => ['1 Meter', '2 Meter']],
                ],
            ],
        ];
    }

    private function createProduct(array $productData): void
    {
        $brand = Brand::where('slug', $productData['brand'])->firstOrFail();

        $product = Product::firstOrCreate(
            ['slug' => Str::slug($productData['name'])],
            [
                'brand_id' => $brand->id,
                'name' => $productData['name'],
                'type' => 'variable',
                'status' => 'published',
                'featured' => $productData['featured'] ?? false,
                'short_description' => $productData['short_description'],
                'description' => $productData['short_description'],
                'meta_title' => 'Jual '.$productData['name'].' | Vortix Gaming Store',
                'meta_description' => $productData['short_description'],
                'published_at' => now(),
            ]
        );

        foreach ($productData['options'] as $index => $optionData) {
            $this->createOption($product, $optionData, $index);
        }

        if (isset($productData['category'])) {
            $category = Category::where('slug', $productData['category'])->first();
            if ($category) {
                $product->categories()->syncWithoutDetaching([$category->id]);
            }
        }

        $this->createVariants($product, $productData);
        $this->createImages($product, $productData);
    }

    private function createOption(Product $product, array $optionData, int $sortOrder): void
    {
        $option = ProductOption::firstOrCreate(
            [
                'product_id' => $product->id,
                'name' => $optionData['name'],
            ],
            ['sort_order' => $sortOrder]
        );

        foreach ($optionData['values'] as $valueIndex => $value) {
            ProductOptionValue::firstOrCreate(
                [
                    'option_id' => $option->id,
                    'value' => $value,
                ],
                ['sort_order' => $valueIndex]
            );
        }
    }

    /**
     * Generate variants from the cartesian product of all option values,
     * linking each variant to its combination via product_variant_option_values.
     */
    private function createVariants(Product $product, array $productData): void
    {
        $valueLists = $product->options()
            ->orderBy('sort_order')
            ->with('values')
            ->get()
            ->map(fn (ProductOption $option) => $option->values->values()->all())
            ->all();

        $combinations = [[]];
        foreach ($valueLists as $values) {
            $next = [];
            foreach ($combinations as $combination) {
                foreach ($values as $value) {
                    $next[] = array_merge($combination, [$value]);
                }
            }
            $combinations = $next;
        }

        $combinations = array_slice($combinations, 0, 24);
        $skuPrefix = strtoupper(preg_replace('/[^A-Za-z0-9]/', '', $productData['sku']));

        foreach ($combinations as $index => $combination) {
            $variant = ProductVariant::firstOrCreate(
                [
                    'product_id' => $product->id,
                    'sku' => $skuPrefix.'-'.str_pad((string) ($index + 1), 3, '0', STR_PAD_LEFT),
                ],
                [
                    'price' => $productData['price'],
                    'compare_at_price' => $productData['compare_at_price'],
                    'stock' => $productData['stock'] ?? 0,
                    'status' => 'active',
                ]
            );

            $variant->optionValues()->sync(
                collect($combination)->pluck('id')->all()
            );
        }
    }

    private function createImages(Product $product, array $productData): void
    {
        ProductImage::firstOrCreate(
            [
                'product_id' => $product->id,
                'path' => $productData['image'],
            ],
            [
                'alt_text' => $productData['name'],
                'sort_order' => 0,
                'is_primary' => true,
            ]
        );
    }
}
