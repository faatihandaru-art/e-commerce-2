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
            ['name' => 'Attack Shark', 'slug' => 'attack-shark'],
            ['name' => 'ASUS ROG', 'slug' => 'asus-rog'],
            ['name' => 'CSI-ZONE', 'slug' => 'csi-zone'],
            ['name' => 'FIFINE', 'slug' => 'fifine'],
            ['name' => 'Maono', 'slug' => 'maono'],
            ['name' => 'MSI', 'slug' => 'msi'],
            ['name' => 'Flydigi', 'slug' => 'flydigi'],
            ['name' => 'Fantech', 'slug' => 'fantech'],
            ['name' => 'TALONGAMES', 'slug' => 'talongames'],
            ['name' => 'ARTISAN', 'slug' => 'artisan'],
            ['name' => 'Herman Miller', 'slug' => 'herman-miller'],
            ['name' => 'Secretlab', 'slug' => 'secretlab'],
            ['name' => 'Thermaltake', 'slug' => 'thermaltake'],
            ['name' => 'Llano', 'slug' => 'llano'],
            ['name' => 'IETS', 'slug' => 'iets'],
            ['name' => 'UGREEN', 'slug' => 'ugreen'],
            ['name' => 'Anker', 'slug' => 'anker'],
            ['name' => 'Silkland', 'slug' => 'silkland'],
            ['name' => 'IVANKY', 'slug' => 'ivanky'],
            ['name' => 'Colta', 'slug' => 'colta'],
            ['name' => 'Presplay', 'slug' => 'presplay'],
        ];

        foreach ($brands as $brand) {
            Brand::firstOrCreate(
                ['slug' => $brand['slug']],
                $brand
            );
        }
    }

    private function createCategories(): void
    {
        $categories = [
            [
                'name' => 'Gaming Mouse',
                'slug' => 'gaming-mouse',
                'sort_order' => 1,
                'icon' => 'Mouse',
                'description' => 'Mouse gaming ultra-ringan dengan sensor optik presisi tinggi hingga 30.000 DPI.',
            ],
            [
                'name' => 'Mechanical Keyboard',
                'slug' => 'mechanical-keyboard',
                'sort_order' => 2,
                'icon' => 'Keyboard',
                'description' => 'Keyboard mekanikal hot-swappable dengan switch responsif dan casing aluminium teredam.',
            ],
            [
                'name' => 'Gaming Headset',
                'slug' => 'gaming-headset',
                'sort_order' => 3,
                'icon' => 'Headphones',
                'description' => 'Headset surround spatial audio 7.1 dengan driver Neodymium 50mm dan mic noise-cancelling.',
            ],
            [
                'name' => 'Gaming Microphone',
                'slug' => 'gaming-microphone',
                'sort_order' => 4,
                'icon' => 'Mic',
                'description' => 'Mikrofon kondenser kelas siaran esports dengan kapsul cardioid dan shock mount terintegrasi.',
            ],
            [
                'name' => 'Gaming Monitor',
                'slug' => 'gaming-monitor',
                'sort_order' => 5,
                'icon' => 'Monitor',
                'description' => 'Monitor Fast-IPS refresh rate hingga 360Hz dengan response time 0.5ms dan akurasi warna 99% sRGB.',
            ],
            [
                'name' => 'Game Controller',
                'slug' => 'game-controller',
                'sort_order' => 6,
                'icon' => 'Gamepad2',
                'description' => 'Gamepad pro-level dengan Hall-Effect trigger, zero deadzone, dan remappable back paddles.',
            ],
            [
                'name' => 'Gaming Mousepad',
                'slug' => 'gaming-mousepad',
                'sort_order' => 7,
                'icon' => 'Square',
                'description' => 'Mousepad surface mikro-tekstur berkecepatan tinggi dengan alas karet anti-slip ekstra tebal.',
            ],
            [
                'name' => 'Gaming Chair',
                'slug' => 'gaming-chair',
                'sort_order' => 8,
                'icon' => 'Armchair',
                'description' => 'Kursi gaming ergonomis dengan penyangga lumbar magnetik dan kulit sintetis berpori dingin.',
            ],
            [
                'name' => 'Gaming Desk',
                'slug' => 'gaming-desk',
                'sort_order' => 9,
                'icon' => 'Table',
                'description' => 'Meja gaming konstruksi baja Z-shape dengan manajemen kabel tersembunyi dan permukaan serat karbon.',
            ],
            [
                'name' => 'Laptop Cooling Pad',
                'slug' => 'laptop-cooling-pad',
                'sort_order' => 10,
                'icon' => 'Fan',
                'description' => 'Cooling pad turbo blower bertekanan tinggi dengan filter debu dan pengatur kecepatan digital.',
            ],
            [
                'name' => 'USB Hub',
                'slug' => 'usb-hub',
                'sort_order' => 11,
                'icon' => 'Usb',
                'description' => 'Hub USB-C 10Gbps bertenaga aluminium anodized dengan port transfer data latensi rendah.',
            ],
            [
                'name' => 'DisplayPort Cable',
                'slug' => 'displayport-cable',
                'sort_order' => 12,
                'icon' => 'Tv',
                'description' => 'Kabel DP 2.1 braided berkepala metalik mendukung resolusi 8K@60Hz dan 4K@240Hz tanpa lag.',
            ],
            [
                'name' => 'USB Type-C Cable',
                'slug' => 'usb-type-c-cable',
                'sort_order' => 13,
                'icon' => 'Cable',
                'description' => 'Kabel USB-C paracord ultra-fleksibel 100W PD dengan konektor gold-plated tahan 30.000 lekukan.',
            ],
            [
                'name' => 'Desk Mat',
                'slug' => 'desk-mat',
                'sort_order' => 14,
                'icon' => 'Layers',
                'description' => 'Desk mat ukuran ekstra besar (900x400mm) tahan air dengan jahitan tepi presisi anti-fray.',
            ],
        ];

        foreach ($categories as $data) {
            Category::firstOrCreate(
                ['slug' => $data['slug']],
                [
                    'name' => $data['name'],
                    'icon' => $data['icon'],
                    'description' => $data['description'],
                    'status' => 'published',
                    'sort_order' => $data['sort_order'],
                ]
            );
        }
    }

    private function productsData(): array
    {
        return [

            // =========================================================
            // 1. GAMING MOUSE - 3 PRODUK
            // =========================================================

            [
                'name' => 'HyperX Pulsefire Haste 2 Pro - Mouse Gaming Nirkabel 4K',
                'brand' => 'hyperx',
                'price' => 2300000,
                'compare_at_price' => 2800000,
                'image' => '/images/products/hyperx-mouse.jpg',
                'sku' => 'HYX-MOUSE-PULSEFIRE-HASTE-2-PRO',
                'featured' => true,
                'stock' => 44,
                'category' => 'gaming-mouse',
                'short_description' => 'Mouse gaming nirkabel ringan dengan bobot 61 gram, sensor HyperX 26K, polling rate hingga 4000Hz, dan daya tahan baterai hingga 90 jam.',
                'options' => [
                    ['name' => 'Color', 'values' => ['Slate Grey']],
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
                'stock' => 30,
                'category' => 'gaming-mouse',
                'short_description' => 'Mouse gaming nirkabel ringan dengan bobot 60 gram, sensor HERO 2 hingga 44.000 DPI, polling rate hingga 4000Hz, dan daya tahan baterai hingga 95 jam.',
                'options' => [
                    ['name' => 'Varian', 'values' => [
                        'Logitech G PRO X Superlight 2',
                        'Logitech G PRO X Superlight 2 DEX',
                        'Logitech G PRO X Superlight 2c (Compact)',
                    ]],
                ],
            ],

            [
                'name' => 'Razer Viper V3 Pro',
                'brand' => 'razer',
                'price' => 2990000,
                'compare_at_price' => null,
                'image' => '/images/products/razerv3pro.jpeg',
                'sku' => 'RZR-M-VIPER-V3-PRO',
                'featured' => false,
                'stock' => 30,
                'category' => 'gaming-mouse',
                'short_description' => 'Mouse gaming nirkabel ultra-ringan dengan bobot 54 gram, sensor Focus Pro 35K Optical Gen-2, polling rate hingga 8000Hz, dan daya tahan baterai hingga 95 jam.',
                'options' => [
                    ['name' => 'Color', 'values' => [
                        'Black (Hitam)',
                        'White / Mercury (Putih)',
                        'Logitech G PRO X Superlight 2c (Compact)',
                    ]],
                ],
            ],

            // =========================================================
            // 2. MECHANICAL KEYBOARD - 3 PRODUK
            // =========================================================

            [
                'name' => 'AULA F75 Wireless Mechanical',
                'brand' => 'aula',
                'price' => 700000,
                'compare_at_price' => 799000,
                'image' => '/images/products/AULA-F75.jpg',
                'sku' => 'AUL-KB-F75',
                'featured' => true,
                'stock' => 39,
                'category' => 'mechanical-keyboard',
                'short_description' => 'Keyboard mechanical 75% dengan 80 tombol, gasket mount, hot-swappable, koneksi 2.4GHz, Bluetooth 5.0, USB-C, knob multifungsi, dan baterai 4000mAh.',
                'options' => [
                    ['name' => 'Switch', 'values' => [
                        'Reaper switch',
                        'Reaper Axis',
                    ]],
                ],
            ],

            [
                'name' => 'Ajazz AK820 MAX HE',
                'brand' => 'ajazz',
                'price' => 970000,
                'compare_at_price' => 1109000,
                'image' => '/images/products/ajazz_ak820_MAX.webp',
                'sku' => 'AJZ-KB-AK820-HE',
                'featured' => true,
                'stock' => 10,
                'category' => 'mechanical-keyboard',
                'short_description' => 'Keyboard magnetic 75% dengan 82 tombol, magnetic switch, rapid trigger, adjustable actuation, polling rate hingga 8000Hz, dan koneksi 3-mode.',
                'options' => [
                    ['name' => 'Color', 'values' => [
                        'FogSea PurpleSeaSalt',
                        'V1-PRO-STARRY-FLYING',
                        'Blackbarry Pink',
                    ]],
                ],
            ],

            [
                'name' => 'Attack Shark X820 Ultra',
                'brand' => 'attack-shark',
                'price' => 2450000,
                'compare_at_price' => 2650000,
                'image' => '/images/products/serangan-hiu.webp',
                'sku' => 'ATK-SHK-KB-X820-ULTRA',
                'featured' => false,
                'stock' => 22,
                'category' => 'mechanical-keyboard',
                'short_description' => 'Keyboard gaming 82-key dengan koneksi tri-mode, layar TFT, dan fitur hot-swappable untuk pengalaman gaming yang fleksibel.',
                'options' => [
                    ['name' => 'Switch', 'values' => [
                        'Shark Switch',
                        'Gift Switch',
                    ]],
                ],
            ],

            // =========================================================
            // 3. GAMING HEADSET - 3 PRODUK
            // =========================================================

            [
                'name' => 'ROG Kithara Gaming Headset',
                'brand' => 'asus-rog',
                'price' => 5899000,
                'compare_at_price' => 6299000,
                'image' => '/images/products/Rog_kithara.jpg',
                'sku' => 'ROG-HS-KTHR-2.4G',
                'featured' => true,
                'stock' => 40,
                'category' => 'gaming-headset',
                'short_description' => 'Headset gaming nirkabel lossless 2.4GHz dengan driver Titanium 50mm, spatial 3D audio tuning, memory foam, dan mic AI noise-cancelling.',
                'options' => [
                    ['name' => 'Color', 'values' => ['Midnight Carbon']],
                ],
            ],

            [
                'name' => 'Tanchjim Force',
                'brand' => 'csi-zone',
                'price' => 4899000,
                'compare_at_price' => null,
                'image' => '/images/products/tanchjim_forece.webp',
                'sku' => 'TNCJM-HS-FORCE',
                'featured' => false,
                'stock' => 14,
                'category' => 'gaming-headset',
                'short_description' => 'Headphone open-back dengan driver planar magnetic hybrid 53mm, tuning studio-grade, dan kabel OFC dengan konektor 3.5mm serta adapter 6.35mm.',
                'options' => [
                    ['name' => 'Color', 'values' => ['Standard']],
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
                'stock' => 35,
                'category' => 'gaming-headset',
                'short_description' => 'Headset gaming nirkabel dengan driver Razer TriForce Titanium 50mm, HyperSpeed Wireless, mikrofon HyperClear Super Wideband, dan desain ringan.',
                'options' => [
                    ['name' => 'Color', 'values' => ['Black']],
                ],
            ],

            // =========================================================
            // 4. GAMING MICROPHONE - 2 PRODUK
            // =========================================================

            [
                'name' => 'Fifine AM8 / AM Pro',
                'brand' => 'fifine',
                'price' => 950000,
                'compare_at_price' => null,
                'image' => '/images/products/fifineAM8.jpg',
                'sku' => 'FFN-MC-AM8-PRO',
                'featured' => true,
                'stock' => 18,
                'category' => 'gaming-microphone',
                'short_description' => 'Mikrofon dynamic gaming dan streaming dengan USB-C dan XLR, pola cardioid, RGB, tap-to-mute, dan monitoring headphone real-time.',
                'options' => [
                    ['name' => 'Varian', 'values' => [
                        'Fifine AM8 Standar',
                        'Fifine AM8 Pro Stand Meja RGB',
                        'Fifine AM8 Pro Paket Boom Arm',
                    ]],
                ],
            ],

            [
                'name' => 'Maono PD200X',
                'brand' => 'maono',
                'price' => 950000,
                'compare_at_price' => 1250000,
                'image' => '/images/products/maono_pd200.webp',
                'sku' => 'MAONO-MC-PD200X',
                'featured' => false,
                'stock' => 28,
                'category' => 'gaming-microphone',
                'short_description' => 'Mikrofon dynamic untuk gaming, streaming, dan podcast dengan USB-C dan XLR, pickup cardioid, RGB, serta dukungan MAONO Link.',
                'options' => [
                    ['name' => 'Color', 'values' => ['Black']],
                ],
            ],

            // =========================================================
            // 5. GAMING MONITOR - 2 PRODUK
            // =========================================================

            [
                'name' => 'ASUS ROG Swift OLED PG32UCDM Gen3 (PG32UCDM3)',
                'brand' => 'asus-rog',
                'price' => 34150000,
                'compare_at_price' => 34650000,
                'image' => '/images/products/ROG_monitor.webp',
                'sku' => 'ROG-MN-PG32UCDM3',
                'featured' => true,
                'stock' => 12,
                'category' => 'gaming-monitor',
                'short_description' => 'Monitor gaming 4K 31,5 inci dengan panel Tandem QD-OLED, refresh rate 240Hz, response time 0,03ms, HDR hingga 1.000 nits, dan Dolby Vision.',
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
                'sku' => 'MSI-MN-MPG271QR-QD-OLED-X50',
                'featured' => false,
                'stock' => 5,
                'category' => 'gaming-monitor',
                'short_description' => 'Monitor gaming QD-OLED 26,5 inci dengan resolusi WQHD, refresh rate 500Hz, response time 0,03ms, HDR hingga 1000 nits, dan DisplayPort 2.1a.',
                'options' => [
                    ['name' => 'Ukuran', 'values' => ['26.5 inch']],
                ],
            ],

            // =========================================================
            // 6. GAME CONTROLLER - 2 PRODUK
            // =========================================================

            [
                'name' => 'Flydigi Vader 4 Pro',
                'brand' => 'flydigi',
                'price' => 1300000,
                'compare_at_price' => null,
                'image' => '/images/products/controller_vader4.avif',
                'sku' => 'FLY-GC-VADER4-PRO',
                'featured' => true,
                'stock' => 35,
                'category' => 'game-controller',
                'short_description' => 'Controller gaming profesional dengan Hall Effect joystick dan trigger, force-adjustable joystick, koneksi 2.4GHz, Bluetooth, dan wired.',
                'options' => [
                    ['name' => 'Color', 'values' => [
                        'Stealth Carbon',
                        'Cyber White',
                    ]],
                ],
            ],

            [
                'name' => 'Fantech Shooter 3 WGP13S',
                'brand' => 'fantech',
                'price' => 250000,
                'compare_at_price' => null,
                'image' => '/images/products/Fantech_WGP13S_2.png',
                'sku' => 'FNT-GC-SHOOTER3-WGP13S',
                'featured' => false,
                'stock' => 15,
                'category' => 'game-controller',
                'short_description' => 'Controller gaming multi-platform dengan Hall-Effect stick dan trigger, polling rate hingga 1000Hz, StrikeSpeed Wireless, wired, dan motion sensor.',
                'options' => [
                    ['name' => 'Color', 'values' => ['Black']],
                ],
            ],

            // =========================================================
            // 7. GAMING MOUSEPAD - 2 PRODUK
            // =========================================================

            [
                'name' => 'TALONGAMES SEN Soft Rubber Base Gaming Mousepad',
                'brand' => 'talongames',
                'price' => 125000,
                'compare_at_price' => 189000,
                'image' => '/images/products/mousepad.webp',
                'sku' => 'TAL-SEN-ZERO-HC',
                'featured' => false,
                'stock' => 60,
                'category' => 'gaming-mousepad',
                'short_description' => 'Mousepad gaming dengan permukaan Hybrid-Control yang menyeimbangkan kecepatan gerakan mouse dan kontrol presisi, dilengkapi soft rubber base.',
                'options' => [
                    ['name' => 'Varian', 'values' => [
                        'Raku/Raku SE Soft Rubber Base',
                        'sho Soft Rubber Base',
                        'sen Soft Rubber Base',
                        'hong Soft Rubber Base',
                        'shibu Soft Rubber Base',
                    ]],
                ],
            ],

            [
                'name' => 'Artisan Ninja FX Zero XL',
                'brand' => 'artisan',
                'price' => 945000,
                'compare_at_price' => 1150000,
                'image' => '/images/products/mousepad2.jpg',
                'sku' => 'FX-ZERO-XL',
                'featured' => false,
                'stock' => 16,
                'category' => 'gaming-mousepad',
                'short_description' => 'Mousepad gaming premium asal Jepang dengan keseimbangan kecepatan, kontrol, dan presisi untuk gaming FPS.',
                'options' => [
                    ['name' => 'Base', 'values' => [
                        'Zero XL SOFT',
                        'Zero XL XSOFT',
                        'Zero XL MID',
                    ]],
                ],
            ],

            // =========================================================
            // 8. GAMING CHAIR - 2 PRODUK
            // =========================================================

            [
                'name' => 'Herman Miller',
                'brand' => 'herman-miller',
                'price' => 10944000,
                'compare_at_price' => 43272000,
                'image' => '/images/products/chair1.avif',
                'sku' => 'HM-AERON',
                'featured' => true,
                'stock' => 14,
                'category' => 'gaming-chair',
                'short_description' => 'Kursi ergonomis premium Herman Miller yang dirancang untuk memberikan kenyamanan dan dukungan optimal saat bekerja maupun bermain dalam waktu lama.',
                'options' => [
                    ['name' => 'Model', 'values' => [
                        'Herman Miller Verus',
                        'Herman Miller Sayl',
                        'Herman Miller Mirra 2',
                        'Herman Miller Cosm High Back',
                        'Herman Miller Aeron',
                        'Herman Miller Embody',
                    ]],
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
                'stock' => 19,
                'category' => 'gaming-chair',
                'short_description' => 'Kursi gaming premium dengan 4D Armrests, Cold-Cure Foam, dan sistem 4-way L-ADAPT Lumbar Support yang dapat disesuaikan.',
                'options' => [
                    ['name' => 'Material', 'values' => [
                        'SoftWeave Plus',
                        'Neo Hybrid Leatherette',
                    ]],
                    ['name' => 'Ukuran', 'values' => [
                        'Regular',
                        'XL',
                    ]],
                ],
            ],

            // =========================================================
            // 9. GAMING DESK - 2 PRODUK
            // =========================================================

            [
                'name' => 'Secretlab Magnus Pro',
                'brand' => 'secretlab',
                'price' => 21500000,
                'compare_at_price' => 24000000,
                'image' => '/images/products/gamingdesk1.webp',
                'sku' => 'SL-MAGNUS-PRO',
                'featured' => false,
                'stock' => 8,
                'category' => 'gaming-desk',
                'short_description' => 'Meja gaming sit-to-stand premium dengan konstruksi full-metal, electric height adjustment, cable management terintegrasi, dan integrated power supply column.',
                'options' => [
                    ['name' => 'Ukuran', 'values' => ['1500mm x 700mm']],
                ],
            ],

            [
                'name' => 'Thermaltake ToughDesk 500L RGB Battlestation',
                'brand' => 'thermaltake',
                'price' => 3900000,
                'compare_at_price' => null,
                'image' => '/images/products/gamingdesk2.jpg',
                'sku' => 'TT-TOUGHDESK-500L-RGB',
                'featured' => false,
                'stock' => 12,
                'category' => 'gaming-desk',
                'short_description' => 'Meja gaming berbentuk L dengan electric height adjustment, full-surface RGB mouse pad, cable management, dan software iTAKE.',
                'options' => [
                    ['name' => 'Model', 'values' => ['500L RGB Battlestation']],
                ],
            ],

            // =========================================================
            // 10. LAPTOP COOLING PAD - 2 PRODUK
            // =========================================================

            [
                'name' => 'Llano V12 Ultra Laptop Cooling Pad',
                'brand' => 'llano',
                'price' => 1870000,
                'compare_at_price' => 2250000,
                'image' => '/images/products/coolingpad1.jpg',
                'sku' => 'LLANO-V12-ULTRA',
                'featured' => false,
                'stock' => 25,
                'category' => 'laptop-cooling-pad',
                'short_description' => 'Cooling pad laptop gaming dengan turbo fan 2800 hingga 3500 RPM, intelligent software control, RGB, dan 3 port USB 3.0.',
                'options' => [
                    ['name' => 'Model', 'values' => [
                        'Llano V12 Ultra',
                        'Llano V12 Standar',
                        'Llano V10',
                    ]],
                ],
            ],

            [
                'name' => 'IETS GT500',
                'brand' => 'iets',
                'price' => 1850000,
                'compare_at_price' => 2700000,
                'image' => '/images/products/coolingpad2.jpg',
                'sku' => 'IETS-GT500',
                'featured' => false,
                'stock' => 30,
                'category' => 'laptop-cooling-pad',
                'short_description' => 'Cooling pad laptop berperforma tinggi dengan turbo fan hingga 5000 RPM, sealed foam duct, dan kontrol kecepatan kipas.',
                'options' => [
                    ['name' => 'Model', 'values' => [
                        'IETS GT500 B0 (Basic)',
                        'IETS GT500 V1 (Kipas Kencang + USB Hub)',
                        'IETS GT500 V2 (Premium / Fitur Penuh)',
                    ]],
                ],
            ],

            // =========================================================
            // 11. USB HUB - 2 PRODUK
            // =========================================================

            [
                'name' => 'UGREEN USB 3.0 Hub 4-Port',
                'brand' => 'ugreen',
                'price' => 135000,
                'compare_at_price' => 199000,
                'image' => '/images/products/usbhub1.jpg',
                'sku' => 'UGREEN-USB3-HUB-4PORT',
                'featured' => false,
                'stock' => 22,
                'category' => 'usb-hub',
                'short_description' => 'USB hub yang menambahkan hingga 4 port USB 3.0 dengan kecepatan transfer hingga 5 Gbps.',
                'options' => [
                    ['name' => 'Varian', 'values' => [
                        'UGREEN USB Hub 3.0 4-Port (Standar)',
                        'UGREEN USB 3.0 Hub dengan Port Daya Eksternal',
                        'UGREEN USB Hub Type-C to USB 3.0 4-Port',
                    ]],
                ],
            ],

            [
                'name' => 'Anker 4-Port USB 3.0',
                'brand' => 'anker',
                'price' => 139000,
                'compare_at_price' => 149000,
                'image' => '/images/products/usbhub2.webp',
                'sku' => 'ANKER-A7516',
                'featured' => false,
                'stock' => 40,
                'category' => 'usb-hub',
                'short_description' => 'USB hub 4-port dengan dukungan USB 3.0 hingga 5 Gbps untuk keyboard, mouse, flash drive, hard drive, dan perangkat USB lainnya.',
                'options' => [
                    ['name' => 'Varian', 'values' => [
                        'Anker Ultra Slim (A7516) USB-A (Standar)',
                        'Anker Portable Aluminum (A8305) USB-C',
                        'Anker Portable Aluminum (A7507) USB-A',
                    ]],
                ],
            ],

            // =========================================================
            // 12. DISPLAYPORT CABLE - 2 PRODUK
            // =========================================================

            [
                'name' => 'Silkland 80Gbps DisplayPort Cable 2.1',
                'brand' => 'silkland',
                'price' => 1200000,
                'compare_at_price' => null,
                'image' => '/images/products/display1.webp',
                'sku' => 'SILKLAND-S1334',
                'featured' => false,
                'stock' => 80,
                'category' => 'displayport-cable',
                'short_description' => 'Kabel DisplayPort 2.1 berbandwidth hingga 80Gbps untuk monitor gaming resolusi dan refresh rate tinggi.',
                'options' => [
                    ['name' => 'Varian', 'values' => [
                        'Silkland DisplayPort 2.1 VESA Certified',
                        'Silkland DisplayPort 2.1 DP80 (8K/16K)',
                        'Silkland DisplayPort 2.1 Versi Panjang (5 Meter / 16.5Ft)',
                        'Silkland DisplayPort 2.1 Seri Premium',
                    ]],
                ],
            ],

            [
                'name' => 'IVANKY 8K DisplayPort Cable 1.4',
                'brand' => 'ivanky',
                'price' => 185000,
                'compare_at_price' => null,
                'image' => '/images/products/display2.jpg',
                'sku' => 'IVANKY-IC31',
                'featured' => false,
                'stock' => 95,
                'category' => 'displayport-cable',
                'short_description' => 'Kabel DisplayPort 1.4 yang mendukung hingga 8K 60Hz dan 4K 144Hz dengan bandwidth HBR3 hingga 32,4Gbps.',
                'options' => [
                    ['name' => 'Panjang', 'values' => [
                        '3 Feet (0,9 Meter)',
                        '6.6 Feet (2 Meter)',
                        '10 Feet (3 Meter)',
                        '15 Feet (4,5 Meter)',
                    ]],
                ],
            ],

            // =========================================================
            // 13. USB TYPE-C CABLE - 2 PRODUK
            // =========================================================

            [
                'name' => 'UGREEN 240W USB-C to USB-C Cable',
                'brand' => 'ugreen',
                'price' => 122000,
                'compare_at_price' => null,
                'image' => '/images/products/typec1.webp',
                'sku' => 'UGREEN-90440',
                'featured' => false,
                'stock' => 60,
                'category' => 'usb-type-c-cable',
                'short_description' => 'Kabel USB-C berdaya tinggi dengan dukungan pengisian hingga 240W melalui USB Power Delivery 3.1.',
                'options' => [
                    ['name' => 'Panjang', 'values' => [
                        '1 meter',
                        '2 meter',
                    ]],
                ],
            ],

            [
                'name' => 'Anker 765 USB-C Cable',
                'brand' => 'anker',
                'price' => 274000,
                'compare_at_price' => null,
                'image' => '/images/products/typec2.webp',
                'sku' => 'ANKER-A8866',
                'featured' => false,
                'stock' => 50,
                'category' => 'usb-type-c-cable',
                'short_description' => 'Kabel USB-C berperforma tinggi untuk pengisian cepat dan transfer data dengan konstruksi nylon braided.',
                'options' => [
                    ['name' => 'Panjang', 'values' => [
                        '0.9 meter',
                        '1.8 meter',
                    ]],
                ],
            ],

            // =========================================================
            // 14. DESK MAT - 2 PRODUK
            // =========================================================

            [
                'name' => 'Colta Desk Mat Pro Mouse Pad 680 x 370 x 4 mm',
                'brand' => 'colta',
                'price' => 369000,
                'compare_at_price' => 459000,
                'image' => '/images/products/desk_mat.jpg',
                'sku' => 'CLT-DESKMAT-PRO-680X370X4MM',
                'featured' => false,
                'stock' => 75,
                'category' => 'desk-mat',
                'short_description' => 'Desk mat premium berbahan kulit sintetis dengan permukaan halus dan luas untuk pergerakan mouse sekaligus melindungi meja.',
                'options' => [
                    ['name' => 'Color', 'values' => [
                        'black',
                        'blue navy',
                        'beige',
                        'pink',
                    ]],
                ],
            ],

            [
                'name' => 'CUTTING MAT Gaming Mousepad Deskmat 40x90cm',
                'brand' => 'presplay',
                'price' => 229000,
                'compare_at_price' => null,
                'image' => '/images/products/desk_mateeeee.webp',
                'sku' => 'PRSPLAY-DESKMAT-40X90CM',
                'featured' => false,
                'stock' => 45,
                'category' => 'desk-mat',
                'short_description' => 'Deskmat gaming berukuran luas dengan permukaan nyaman untuk pergerakan mouse sekaligus memberikan perlindungan pada permukaan meja.',
                'options' => [
                    ['name' => 'Color', 'values' => [
                        'green',
                        'blue',
                        'white',
                        'black',
                    ]],
                ],
            ],
        ];
    }

    private function createProduct(array $productData): void
    {
        $brand = Brand::where('slug', $productData['brand'])->firstOrFail();

        $product = Product::firstOrCreate(
            [
                'slug' => Str::slug($productData['name']),
            ],
            [
                'brand_id' => $brand->id,
                'name' => $productData['name'],
                'type' => 'variable',
                'status' => 'published',
                'featured' => $productData['featured'] ?? false,
                'short_description' => $productData['short_description'],
                'description' => $productData['short_description'],
                'meta_title' => 'Jual ' . $productData['name'] . ' | Vortix Gaming Store',
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
                $product->categories()->syncWithoutDetaching([
                    $category->id
                ]);
            }
        }

        $this->createVariants($product, $productData);
        $this->createImages($product, $productData);
    }

    private function createOption(
        Product $product,
        array $optionData,
        int $sortOrder
    ): void {
        $option = ProductOption::firstOrCreate(
            [
                'product_id' => $product->id,
                'name' => $optionData['name'],
            ],
            [
                'sort_order' => $sortOrder,
            ]
        );

        foreach ($optionData['values'] as $valueIndex => $value) {
            ProductOptionValue::firstOrCreate(
                [
                    'option_id' => $option->id,
                    'value' => $value,
                ],
                [
                    'sort_order' => $valueIndex,
                ]
            );
        }
    }

    private function createVariants(
        Product $product,
        array $productData
    ): void {
        $valueLists = $product->options()
            ->orderBy('sort_order')
            ->with('values')
            ->get()
            ->map(
                fn(ProductOption $option) =>
                $option->values->values()->all()
            )
            ->all();

        $combinations = [[]];

        foreach ($valueLists as $values) {
            $next = [];

            foreach ($combinations as $combination) {
                foreach ($values as $value) {
                    $next[] = array_merge(
                        $combination,
                        [$value]
                    );
                }
            }

            $combinations = $next;
        }

        // Maksimal 24 kombinasi variant per produk.
        $combinations = array_slice($combinations, 0, 24);

        $skuPrefix = strtoupper(
            preg_replace(
                '/[^A-Za-z0-9]/',
                '',
                $productData['sku']
            )
        );

        foreach ($combinations as $index => $combination) {
            $variant = ProductVariant::firstOrCreate(
                [
                    'product_id' => $product->id,
                    'sku' => $skuPrefix . '-' .
                        str_pad(
                            (string) ($index + 1),
                            3,
                            '0',
                            STR_PAD_LEFT
                        ),
                ],
                [
                    'price' => $productData['price'],
                    'compare_at_price' =>
                    $productData['compare_at_price'],
                    'stock' => $productData['stock'] ?? 0,
                    'status' => 'active',
                ]
            );

            $variant->optionValues()->sync(
                collect($combination)
                    ->pluck('id')
                    ->all()
            );
        }
    }

    private function createImages(
        Product $product,
        array $productData
    ): void {
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
