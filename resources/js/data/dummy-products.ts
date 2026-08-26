import type { Category, Product, ProductFilter } from '@/types/product';

/**
 * 14 KATEGORI PRODUK VORTIX GAMING STORE
 * Sesuai Bagian 5 BRIEF_ORANG1 & BRIEF_ORANG2
 */
export const categories: Category[] = [
    {
        id: 1,
        name: 'Gaming Mouse',
        slug: 'gaming-mouse',
        icon: 'Mouse',
        description: 'Mouse gaming ultra-ringan dengan sensor optik presisi tinggi hingga 30.000 DPI.',
        productCount: 3,
    },
    {
        id: 2,
        name: 'Mechanical Keyboard',
        slug: 'mechanical-keyboard',
        icon: 'Keyboard',
        description: 'Keyboard mekanikal hot-swappable dengan switch responsif dan casing aluminium teredam.',
        productCount: 3,
    },
    {
        id: 3,
        name: 'Gaming Headset',
        slug: 'gaming-headset',
        icon: 'Headphones',
        description: 'Headset surround spatial audio 7.1 dengan driver Neodymium 50mm dan mic noise-cancelling.',
        productCount: 3,
    },
    {
        id: 4,
        name: 'Gaming Microphone',
        slug: 'gaming-microphone',
        icon: 'Mic',
        description: 'Mikrofon kondenser kelas siaran esports dengan kapsul cardioid dan shock mount terintegrasi.',
        productCount: 2,
    },
    {
        id: 5,
        name: 'Gaming Monitor',
        slug: 'gaming-monitor',
        icon: 'Monitor',
        description: 'Monitor Fast-IPS refresh rate hingga 360Hz dengan response time 0.5ms dan akurasi warna 99% sRGB.',
        productCount: 2,
    },
    {
        id: 6,
        name: 'Game Controller',
        slug: 'game-controller',
        icon: 'Gamepad2',
        description: 'Gamepad pro-level dengan Hall-Effect trigger, zero deadzone, dan remappable back paddles.',
        productCount: 2,
    },
    {
        id: 7,
        name: 'Gaming Mousepad',
        slug: 'gaming-mousepad',
        icon: 'Square',
        description: 'Mousepad surface mikro-tekstur berkecepatan tinggi dengan alas karet anti-slip ekstra tebal.',
        productCount: 2,
    },
    {
        id: 8,
        name: 'Gaming Chair',
        slug: 'gaming-chair',
        icon: 'Armchair',
        description: 'Kursi gaming ergonomis dengan penyangga lumbar magnetik dan kulit sintetis berpori dingin.',
        productCount: 2,
    },
    {
        id: 9,
        name: 'Gaming Desk',
        slug: 'gaming-desk',
        icon: 'Table',
        description: 'Meja gaming konstruksi baja Z-shape dengan manajemen kabel tersembunyi dan permukaan serat karbon.',
        productCount: 2,
    },
    {
        id: 10,
        name: 'Laptop Cooling Pad',
        slug: 'laptop-cooling-pad',
        icon: 'Fan',
        description: 'Cooling pad turbo blower bertekanan tinggi dengan filter debu dan pengatur kecepatan digital.',
        productCount: 2,
    },
    {
        id: 11,
        name: 'USB Hub',
        slug: 'usb-hub',
        icon: 'Usb',
        description: 'Hub USB-C 10Gbps bertenaga aluminium anodized dengan port transfer data latensi rendah.',
        productCount: 2,
    },
    {
        id: 12,
        name: 'DisplayPort Cable',
        slug: 'displayport-cable',
        icon: 'Tv',
        description: 'Kabel DP 2.1 braided berkepala metalik mendukung resolusi 8K@60Hz dan 4K@240Hz tanpa lag.',
        productCount: 2,
    },
    {
        id: 13,
        name: 'USB Type-C Cable',
        slug: 'usb-type-c-cable',
        icon: 'Cable',
        description: 'Kabel USB-C paracord ultra-fleksibel 100W PD dengan konektor gold-plated tahan 30.000 lekukan.',
        productCount: 2,
    },
    {
        id: 14,
        name: 'Desk Mat',
        slug: 'desk-mat',
        icon: 'Layers',
        description: 'Desk mat ukuran ekstra besar (900x400mm) tahan air dengan jahitan tepi presisi anti-fray.',
        productCount: 2,
    },
];

/**
 * DUMMY PRODUCTS LIST
 * Minimal 2-3 produk per kategori (total 31 produk).
 * Masing-masing memiliki 3-4 foto URL HD untuk galeri produk Orang 2.
 */
export const products: Product[] = [
    // 1. Gaming Mouse
    {
        id: 'prod-gm-01',
        name: 'HyperX Pulsefire Haste 2 Pro - Mouse Gaming Nirkabel 4K',
        slug: 'HyperX-Pulsefire-Haste-2-Pro',
        description: 'Mouse gaming nirkabel ringan dengan bobot 61 gram, sensor HyperX 26K, polling rate hingga 4000Hz, dan daya tahan baterai hingga 90 jam.',
        categoryId: 1,
        images: [
            '/images/products/hyperx-mouse.jpg',
        ],
        price:2300000,
        compareAtPrice: 2800000,
        variants: [
            { id: 'var-gm-1', name: 'Color', value: 'Matte Obsidian Black', priceModifier: 0, stock: 24 },
            { id: 'var-gm-2', name: 'Color', value: 'Titanium Silver', priceModifier: 50000, stock: 12 },
            { id: 'var-gm-3', name: 'Color', value: 'Arctic White', priceModifier: 0, stock: 8 },
        ],
        specifications: {
            'Sensor': 'hyperX 26k 26.000 DPI',
            'IPS / Akselerasi': '650 IPS / 50G',
            'Polling Rate': '4000Hz Hyper-Polling',
            'Konektivitas': 'irkabel 2.4GHz, Bluetooth, dan Mode Berkabel (Wired) USB-C',
            'Berat': '61 gram',
            'Baterai': 'Hingga 90 Jam pemakaian kompetitif',
        },
        rating: 4.9,
        reviewCount: 238,
        stock: 44,
        isFeatured: true,
        badge: 'Diskon',
        brand: 'hyperX',
        sku: 'VGS-M-APEX-WL',
    },
    {
        id: 'prod-gm-02',
        name: 'Logitech G pro X Superligt 2',
        slug: 'Logitech G pro X Superligt 2',
        description: 'Mouse gaming nirkabel ringan dengan bobot 60 gram, sensor HERO 2 hingga 44.000 DPI, polling rate hingga 4000Hz, dan daya tahan baterai hingga 95 jam',
        categoryId: 1,
        images: [
            '/images/products/logitechGpro.jpg',
        ],
        price: 2110000,
        compareAtPrice: 2550000,
        variants: [
            { id: 'var-gm-4', name: 'Color', value: 'Stealth Black', priceModifier: 0, stock: 30 },
        ],
        specifications: {
            'Sensor': 'HERO 2 44.000 DPI',
            'IPS / Akselerasi': '888 IPS / 88G',
            'Polling Rate': '8000Hz / 0,5ms response',
            'Konektivitas': 'Nirkabel LIGHTSPEED / Kabel (USB-C) 2m',
            'Berat': '60 gram',
            'Baterai': 'Hingga 95 Jam pemakaian kompetitif',
        },
        rating: 4.7,
        reviewCount: 96,
        stock: 30,
        isFeatured: false,
        brand: 'Logitech',
        sku: 'LGT-M-PRO-X-SL2',
    },
    {
        id: 'prod-gm-03',
        name: 'Razer Viper V3 Pro ',
        slug: 'Razer VIper V3 Pro',
        description: 'Mouse gaming nirkabel ultra-ringan dengan bobot 54 gram, sensor Focus Pro 35K Optical Gen-2, polling rate hingga 8000Hz, dan daya tahan baterai hingga 95 jam',
        categoryId: 1,
        images: [
            '/images/products/razerv3pro.jpeg',
        ],
        price: 3800000,
        compareAtPrice: 4030000,
        specifications: {
            'Sensor': 'optik Focus Pro 35K Gen-2 35.000 DPI',
            'IPS / Akselerasi': '750 IPS / 70G',
            'Polling Rate': '8000Hz',
            'Konektivitas': ' Nirkabel Razer HyperSpeed dan Kabel USB Type-C',
            'Berat': '54 gram',
            'Baterai': 'Hingga 95 Jam pemakaian kompetitif ',
        },
        rating: 4.8,
        reviewCount: 64,
        stock: 15,
        isFeatured: false,
        badge: 'Baru',
        brand: 'Razer',
        sku: 'VGS-M-PHNT-MMO',
    },

    // 2. Mechanical Keyboard
    {
        id: 'prod-kb-01',
        name: 'AULA-F75 wireless mechanical ',
        slug: 'AULA-F75-wireless-mechanical',
        description: 'Keyboard mechanical 75% dengan 80 tombol, gasket mount, hot-swappable, koneksi 2.4GHz, Bluetooth 5.0, dan USB-C, serta dilengkapi knob multifungsi dan baterai 4000mAh',
        categoryId: 2,
        images: [
            '/images/products/AULA-F75.jpg',
        ],
        price: 700000,
        compareAtPrice: 799000,
        variants: [
            { id: 'var-kb-1', name: 'Switch', value: 'Reaper switch', priceModifier: 0, stock: 18 },
            { id: 'var-kb-2', name: 'Switch', value: 'Reaper Axis', priceModifier: 50000, stock: 14 },
        ],
        specifications: {
    'Layout': '75% Compact (80-84 Keys + arrow keys + 1 Multimedia Knob)',
    'Mounting': 'Multi-layer foam/silencing pads',
    'Keycaps': 'PBT Double-shot',
    'Konektivitas': 'Triple-mode (Kabel USB Type-C, Wireless 2.4GHz dengan dongle, dan Bluetooth 5.0)',
    'Peredam': 'Poron Sandwich + IXPE Switch Pad + Bottom Silicone + PET Sound Enhancement Pad + PCB Case Foam',
    'Baterai': '4000 mAh Li-ion Rechargeable',

    'Switch': 'Hot-swappable Mechanical Switch',
    'RGB': 'RGB Backlight',
    'Polling Rate': '1000Hz (Wired & 2.4GHz)',
    'Display': 'Smart TFT Display',
    'Knob': 'Multimedia Knob',
    'Kompatibilitas': 'Windows / macOS',
},
        rating: 4.95,
        reviewCount: 312,
        stock: 39,
        isFeatured: true,
        badge: 'Diskon',
        brand: 'AULA',
        sku: 'aul-KB-F75',
    },
    {
        id: 'prod-kb-02',
        name: 'Ajazz AK820 MAX',
        slug: 'ajazz-ak820-max-magnetic',
        description: 'Keyboard magnetic 75% dengan 82 tombol, magnetic switch, rapid trigger, adjustable actuation, polling rate hingga 8000Hz, dan koneksi 3-mode.',
        categoryId: 2,
        images: [
            '/images/products/ajazz_ak820_MAX.webp',
        ],
        price: 970000,
        compareAtPrice: 1109000,
        variants: [
            { id: 'var-kb-4', name: 'Color', value: 'FogSea PurpleSeaSalt', priceModifier: 0, stock: 10 },
            { id: 'var-kb-4', name: 'Color', value: 'V1-PRO-STARRY-FLYING', priceModifier: 0, stock: 10 },
        ],
        specifications: {
            'Switch': 'Magnetic Hall Effect Switch',
    'Akurasi Rapid Trigger': '0.1mm adjustable',
    'Polling Rate': '8000Hz (0.125ms latency)',
    'Frame Material': 'Aluminum Alloy Top Case',
    'Layout': '75% (82 Keys)',
    'Rapid Trigger': '0.1–4.0mm adjustable',
    'Actuation Point': '0.1–4.0mm adjustable',
    'Mounting': 'Gasket Mount',
    'Keycaps': 'PBT Cherry Profile',
    'Hot-Swap': 'Magnetic Switch Hot-Swap',
    'Backlight': 'South-facing RGB',
    'Anti-Ghosting': 'NKRO',
    'Knob': 'Multifunctional Volume Knob',
    'Connectivity': 'USB Type-C Wired',
    'Plate': 'PC Plate',
    'Stabilizer': 'Pre-lubed Plate-Mount',

        },
        rating: 5.0,
        reviewCount: 178,
        stock: 10,
        isFeatured: true,
        badge: 'Stok Terbatas',
        brand: 'Ajazz',
        sku: 'AJZ-KB-AK820-HE',
    },
    {
       id: 'prod-kb-03',
name: 'Attack Shark X820 Ultra',
slug: 'attack-shark-x820-ultra',
description: 'Keyboard gaming 82-key dengan desain compact yang dilengkapi koneksi tri-mode, layar TFT, dan fitur hot-swappable untuk pengalaman gaming yang fleksibel.',
        categoryId: 2,
        images: [
              '/images/products/serangan-hiu.webp',
        ],
        price: 2450000,
        compareAtPrice: 2650000,
        specifications: {
    'Layout': '75% ANSI (80 Keys + 1 Knob)',
    'Switch': 'Shark Switch / Gift Switch',
    'Keycaps': 'PBT OEM Profile',
    'Connectivity': '2.4G Wireless / Bluetooth 5.0 / USB-C Wired',
    'Hot-Swap': '3-Pin & 5-Pin Compatible',
    'Display': '0.85" TFT Smart Display',
    'Backlight': '16 Million RGB',
    'Mounting': 'Upgraded Gasket Mount',
    'Sound Absorbing': '5-Layer Foam',
    'PCB': '1.2mm Single-Key Slotted PCB',
    'Battery': '4000mAh Li-Battery',
    'Dimensions': '327 × 136 × 40 mm',
    'Weight': '0.8 kg',
    'Compatibility': 'PC / Mac / Smartphone / Tablet',
},
        rating: 4.6,
        reviewCount: 82,
        stock: 22,
        isFeatured: false,
        brand: 'Attack shark',
        sku: 'atk shk-kb-x820-ultra',
    },

    // 3. Gaming Headset
    {
        id: 'prod-hs-01',
        name: 'ROG Kithara gaming headset',
        slug: 'rog-kithara-gaming-headset',
description: 'Headset gaming nirkabel lossless 2.4GHz dengan driver Titanium 50mm, spatial 3D audio tuning, bantalan memory foam pendingin bernapas, dan mic peredam bising AI bersertifikasi Discord.',
        categoryId: 3,
        images: [
            '/images/products/Rog_kithara.jpg',
        ],
        price: 5899000,
        compareAtPrice: 6299000,
        variants: [
            { id: 'var-hs-1', name: 'Color', value: 'Midnight Carbon', priceModifier: 0, stock: 25 },
        ],
        specifications: {
    'Driver': '50mm Custom Tuned Titanium Diaphragm',
    'Frekuensi Respon': '12Hz - 28.000Hz',
    'Impedansi': '32 Ohm @ 1kHz',
    'Spatial Audio': '3D Spatial Audio',
    'Mikrofon': 'Detachable 9.7mm Broadcast-grade AI Noise-Cancelling',
    'Baterai': '60+ Jam aktif per charge',

        },
        rating: 4.88,
        reviewCount: 194,
        stock: 40,
        isFeatured: true,
        badge: 'Diskon',
        brand: 'ROG ',
        sku: 'ROG-HS-KTHR-2.4G',
    },
    {
        id: 'prod-hs-02',
        name: 'tanchjim force',
        slug: 'tanchjim force',
        description:  'Headphone open-back dengan driver planar magnetic hybrid 53mm, tuning studio-grade, dan kabel OFC berkualitas dengan konektor 3.5mm serta adapter 6.35mm untuk pengalaman audio detail dan natural.',
        categoryId: 3,
        images: [
           '/images/products/tanchjim_forece.webp',
        ],
        price: 4899000,
        compareAtPrice: null,
        specifications: {
    'Driver': '53mm Planar Magnetic Hybrid',
    'Tipe Akustik': 'Open-Back Studio Grade',
    'Kabel': 'OFC Oxygen-Free Copper 3.5mm + 6.35mm adapter',
    'Konektor': '3.5mm + 6.35mm Adapter',
    'Kompatibilitas': 'PC, Laptop, Smartphone, DAC/AMP',
},
        rating: 4.92,
        reviewCount: 77,
        stock: 14,
        isFeatured: false,
        brand: 'CSI-ZONE',
        sku: 'tncjm-HS-FORCE',
    },
    {
        id: 'prod-hs-03',
        name: 'Razer black shark V2',
        slug: 'Razer-black-shark-v2',
        description: 'Headset gaming nirkabel dengan driver Razer TriForce Titanium 50mm, koneksi HyperSpeed Wireless, mikrofon HyperClear Super Wideband, dan desain ringan untuk komunikasi serta gaming kompetitif.',
        categoryId: 3,
        images: [
            '/images/products/razer_headset_blackshark_v2.webp',
        ],
        price: 3323050,
        compareAtPrice: 3499000,
        specifications: {
    'Driver': 'Razer TriForce Titanium 50mm',
    'Frekuensi Respon': '12Hz - 28kHz',
    'Impedansi': '32 Ohm @ 1kHz',
    'Koneksi': 'Razer HyperSpeed Wireless 2.4GHz + Bluetooth 5.2',
    'Spatial Audio': 'THX Spatial Audio',
    'Mikrofon': 'Razer HyperClear Super Wideband Mic',
    'Baterai': 'Hingga 70 Jam',
    'Berat': '320g',
    'Kompatibilitas': 'PC, PlayStation, iOS, Android',
},
        rating: 4.7,
        reviewCount: 110,
        stock: 35,
        isFeatured: false,
        brand: 'Razer',
        sku: 'Rzr-HS-BLCKSHK-V2',
    },

    // 4. Gaming Microphone
    {
        id: 'prod-mic-01',
        name: 'Vortix StreamCore XLR/USB Dynamic Broadcast Mic',
        slug: 'vortix-streamcore-broadcast-mic',
        description: 'Mikrofon siaran profesional berkapsul dinamis dengan dual output USB-C & XLR, built-in preamp gain ultra-bersih, serta headphone monitoring tanpa latency.',
        categoryId: 4,
        images: [
            'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1583775253835-f094589255db?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1520523839898-507121287c91?w=800&auto=format&fit=crop&q=80',
        ],
        price: 1950000,
        compareAtPrice: 2300000,
        specifications: {
            'Kapsul': 'Cardioid Dynamic Broadcast Capsule',
            'Sampling Rate': '24-bit / 96kHz High-Resolution',
            'Output': 'USB-C & XLR Dual Interface',
            'DSP Internal': 'High-Pass Filter, Limiter, Compressor onboard',
        },
        rating: 4.9,
        reviewCount: 145,
        stock: 18,
        isFeatured: true,
        badge: 'Baru',
        brand: 'VGS Studio',
        sku: 'VGS-MC-STRM-XLR',
    },
    {
        id: 'prod-mic-02',
        name: 'Vortix Wave Mini USB Condenser Mic',
        slug: 'vortix-wave-mini-condenser',
        description: 'Mikrofon kondenser plug-and-play kompak dengan tap-to-mute capacitive sensor dan shock mount bawaan meja.',
        categoryId: 4,
        images: [
            'https://images.unsplash.com/photo-1583775253835-f094589255db?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
        ],
        price: 650000,
        compareAtPrice: 750000,
        specifications: {
            'Kapsul': '14mm Electret Condenser',
            'Polar Pattern': 'Supercardioid',
            'Konektivitas': 'USB Type-C Plug & Play',
        },
        rating: 4.65,
        reviewCount: 92,
        stock: 28,
        isFeatured: false,
        brand: 'VGS Core',
        sku: 'VGS-MC-WAVE-MN',
    },

    // 5. Gaming Monitor
    {
        id: 'prod-mon-01',
        name: 'Vortix Horizon 27" Fast-IPS 360Hz Esports Monitor',
        slug: 'vortix-horizon-27-360hz-monitor',
        description: 'Monitor gaming turnamen 27 inci 2560x1440 QHD Fast-IPS dengan refresh rate super mulus 360Hz, response time 0.5ms GtG, G-Sync Compatible, dan sertifikasi DisplayHDR 600.',
        categoryId: 5,
        images: [
            'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1547119957-637f8679db1e?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800&auto=format&fit=crop&q=80',
        ],
        price: 7499000,
        compareAtPrice: 8999000,
        specifications: {
            'Ukuran & Resolusi': '27 Inci QHD (2560 x 1440) 16:9',
            'Panel Type': 'Fast IPS with Anti-Glare 3H Coating',
            'Refresh Rate': '360Hz Native (DisplayPort 1.4 DSC)',
            'Response Time': '0.5ms GtG min.',
            'Color Gamut': '99% sRGB, 95% DCI-P3, HDR600',
            'Port Input': '2x DP 1.4, 2x HDMI 2.1, USB 3.2 Hub Hub 4-port',
        },
        rating: 4.95,
        reviewCount: 88,
        stock: 12,
        isFeatured: true,
        badge: 'Diskon',
        brand: 'VGS Horizon',
        sku: 'VGS-MN-HRZN-360',
    },
    {
        id: 'prod-mon-02',
        name: 'Vortix Curve 34" Ultrawide OLED 175Hz',
        slug: 'vortix-curve-34-ultrawide-oled',
        description: 'Monitor ultrawide lengkung 1800R QD-OLED dengan rasio kontras tak terbatas, response time 0.03ms, dan kedalaman warna 10-bit sejati.',
        categoryId: 5,
        images: [
            'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
        ],
        price: 12800000,
        compareAtPrice: null,
        specifications: {
            'Ukuran & Resolusi': '34 Inci UWQHD (3440 x 1440) 21:9',
            'Panel Type': 'Quantum Dot OLED (Curvature 1800R)',
            'Refresh Rate & RT': '175Hz / 0.03ms GtG',
        },
        rating: 4.98,
        reviewCount: 42,
        stock: 5,
        isFeatured: false,
        badge: 'Stok Terbatas',
        brand: 'VGS Horizon',
        sku: 'VGS-MN-CURV-OLED',
    },

    // 6. Game Controller
    {
        id: 'prod-gc-01',
        name: 'Vortix Vector Elite Hall-Effect Pro Controller',
        slug: 'vortix-vector-elite-controller',
        description: 'Gamepad pro tanpa risiko drift berkat stick dan trigger Hall-Effect magnetik, 4 tombol back paddle yang dapat dipetakan ulang, dan hair-trigger lock fisik.',
        categoryId: 6,
        images: [
            'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
        ],
        price: 1250000,
        compareAtPrice: 1550000,
        variants: [
            { id: 'var-gc-1', name: 'Color', value: 'Stealth Carbon', priceModifier: 0, stock: 20 },
            { id: 'var-gc-2', name: 'Color', value: 'Cyber White', priceModifier: 0, stock: 15 },
        ],
        specifications: {
            'Thumbstick': 'Electromagnetic Hall-Effect (Anti-Drift)',
            'Trigger Mode': 'Dual (Full analog + Instant Mechanical Hair Trigger)',
            'Kompatibilitas': 'PC Windows 10/11, Steam, Nintendo Switch, Android/iOS',
            'Polling Rate': '1000Hz via 2.4G Wireless Dongle / USB Cable',
        },
        rating: 4.85,
        reviewCount: 167,
        stock: 35,
        isFeatured: true,
        brand: 'VGS Pro Series',
        sku: 'VGS-GC-VCTR-HE',
    },
    {
        id: 'prod-gc-02',
        name: 'Vortix Arcade Hitbox Leverless Fightstick',
        slug: 'vortix-arcade-hitbox-fightstick',
        description: 'Controller arcade tanpa tuas (all-button layout) khusus game fighting (Tekken 8, Street Fighter 6) dengan Sanwa Denshi switches dan chassis aluminium ramping.',
        categoryId: 6,
        images: [
            'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&auto=format&fit=crop&q=80',
        ],
        price: 2350000,
        compareAtPrice: null,
        specifications: {
            'Tombol': 'Sanwa OBSF-24 & OBSF-30',
            'Board Controller': 'Raspberry Pi Pico GP2040-CE (Sub-1ms Latency)',
            'Material': 'CNC Acrylic Sandwiched Brushed Aluminium',
        },
        rating: 4.94,
        reviewCount: 51,
        stock: 8,
        isFeatured: false,
        brand: 'VGS Arcade',
        sku: 'VGS-GC-FIGHT-HB',
    },

    // 7. Gaming Mousepad
    {
        id: 'prod-mp-01',
        name: 'TALONGAMES SEN Soft Rubber Base Gaming Mousepad Artisan Zero Clone (Hybrid-Control)',
        slug: 'vortix-glidex-pro-cordura-xl',
        description: 'TALONGAMES SEN adalah mousepad gaming dengan permukaan Hybrid-Control yang dirancang untuk memberikan keseimbangan antara kecepatan gerakan mouse dan kontrol yang presisi. Dilengkapi soft rubber base untuk membantu menjaga mousepad tetap stabil di meja saat digunakan untuk gaming.',
        categoryId: 7,
        images: [
            '/images/products/mousepad.webp',
        ],
        price: 159000,
        compareAtPrice: 189000,
        specifications: {
            'Dimensi': '490mm x 420mm x 4mm',
            'Permukaan': 'Fabric Smooth Surface',
            'Base': 'Natural Rubber Soft Base',
            'Edge': 'Stitching Sedikit di Atas Permukaan',
        },
        rating: 4.9,
        reviewCount: 220,
        stock: 60,
        isFeatured: false,
        brand: 'TALONGAMES',
        sku: 'TAL-SEN-ZERO-HC',
    },
    {
        id: 'prod-mp-02',
        name: 'Artisan Ninja FX Zero XL',
        slug: 'vortix-glasszero-tempered-glass',
        description: 'ARTISAN NINJA FX Zero XL adalah mousepad gaming premium asal Jepang yang menawarkan keseimbangan antara kecepatan, kontrol, dan presisi. Permukaannya memiliki tekstur halus dengan stopping power yang baik, sehingga cocok untuk gaming FPS dan penggunaan mouse dengan sensitivitas rendah maupun tinggi. Base anti-slip membantu mousepad tetap stabil selama digunakan.',
        categoryId: 7,
        images: [
            '/images/products/mousepad2.jpg',
        ],
        price: 999000,
        compareAtPrice: 1299000,
        specifications: {
            'Dimensi': '490mm x 420mm x 4mm',
            'Permukaan': 'Balanced Textured Cloth Surface',
            'Base': 'XSOFT / SOFT / MID',
            'Material': '100% Polyester',
        },
        rating: 4.88,
        reviewCount: 79,
        stock: 16,
        isFeatured: false,
        badge: 'Baru',
        brand: 'ARTISAN',
        sku: 'FX-ZERO-XL',
    },

    // 8. Gaming Chair
    {
        id: 'prod-ch-01',
        name: 'Herman Miller',
        slug: 'vortix-throne-ergonomic-chair',
        description: 'Herman Miller adalah kursi ergonomis premium yang dirancang untuk memberikan kenyamanan dan dukungan optimal saat bekerja atau bermain dalam waktu lama. Dengan desain modern dan fitur ergonomis, kursi ini membantu menjaga posisi duduk tetap nyaman serta mendukung postur tubuh.',
        categoryId: 8,
        images: [
            '/images/products/chair1.avif',
        ],
        price: 38000000,
        compareAtPrice: null,
        specifications: {
            'Kapasitas Beban': 'Hingga 159 kg',
            'Material':'8Z Pellicle Suspension',
            'penopang punggung': 'PostureFit SL',
            'Recline': 'Harmonic 2 Tilt',
        },
        rating: 4.86,
        reviewCount: 89,
        stock: 14,
        isFeatured: true,
        brand: 'Herman Miller',
        sku: 'HM-AERON',
    },
    {
        id: 'prod-ch-02',
        name: 'Secretlab Titan Evo',
        slug: 'secretlab-titan-evo',
        description: 'Secretlab TITAN Evo adalah kursi gaming premium yang dirancang untuk memberikan kenyamanan dan dukungan saat bermain game maupun bekerja. Kursi ini dilengkapi 4D Armrests, Cold-Cure Foam, serta sistem 4-way L-ADAPT™ Lumbar Support yang dapat disesuaikan dengan posisi tubuh.',
        categoryId: 8,
        images: [
            '/images/products/chair2.webp',
        ],
        price: 9000000,
        compareAtPrice: null,
        specifications: {
            'Material': 'Neo Hybrid Leatherette / SoftWeave Fabric',
            'Recline': 'Hingga 165°',
            'Armrest': '4D Adjustable',
            'Lumbar Support': '4-way adjustable',
        },
        rating: 4.78,
        reviewCount: 56,
        stock: 19,
        isFeatured: false,
        brand: 'Secretlab',
        sku: 'SL-TITAN-EVO',
    },

    // 9. Gaming Desk
    {
        id: 'prod-dk-01',
        name: 'Secretlab Magnus Pro',
        slug: 'vortix-battlestation-standing-desk',
        description: 'Secretlab MAGNUS Pro adalah meja gaming sit-to-stand premium dengan konstruksi full-metal yang dilengkapi electric height adjustment, sistem cable management terintegrasi, serta integrated power supply column untuk membantu merapikan kabel dan perangkat di setup. Meja ini juga mendukung ekosistem aksesori magnetik Secretlab untuk personalisasi workspace.',
        categoryId: 9,
        images: [
            '/images/products/gamingdesk1.webp',
        ],
        price: 21500000,
        compareAtPrice: 24000000,
        specifications: {
            'Dimensi Daun Meja': '150cm x 70cm',
            'Rentang Tinggi': '65cm - 125cm',
            'Kapasitas Beban': '120 kg',
            'Fitur Khusus': 'Integrated Power Supply Column & Cable Management Tray',
        },
        rating: 4.92,
        reviewCount: 63,
        stock: 8,
        isFeatured: false,
        badge: 'Diskon',
        brand: 'Secretlab',
        sku: 'SL-MAGNUS-PRO',
    },
    {
        id: 'prod-dk-02',
        name: 'Thermaltake ToughDesk 500L RGB Battlestation',
        slug: 'vortix-fortress-z-frame-desk',
        description: 'Thermaltake ToughDesk 500L RGB Battlestation adalah meja gaming berbentuk L dengan sistem electric height adjustment yang memungkinkan pengguna mengatur posisi meja dari duduk hingga berdiri. Meja ini dilengkapi full-surface RGB mouse pad pada meja utama, mouse pad non-RGB pada meja samping, sistem cable management, serta dukungan software iTAKE untuk mengatur pencahayaan RGB.',
        categoryId: 9,
        images: [
            '/images/products/gamingdesk2.jpg',
        ],
        price: 24400000,
        compareAtPrice: null,
        specifications: {
            'Dimensi Daun Meja': '160cm x 80cm (Meja Utama) + 80cm x 60cm (Meja Samping)',
            'Rentang Tinggi': '70cm - 110cm',
            'Kapasitas Beban': '150 kg',
            'Fitur Khusus': '3 Motor, Anti-Collision Sensor & Full-Surface RGB Mouse Pad',
        },
        rating: 4.72,
        reviewCount: 41,
        stock: 12,
        isFeatured: false,
        brand: 'Thermaltake',
        sku: 'TT-TOUGHDESK-500L-RGB',
    },

    // 10. Laptop Cooling Pad
    {
        id: 'prod-cp-01',
        name: 'Llano V12 ultra laptop Cooling Pad',
        slug: 'vortix-blizzard-laptop-cooler',
        description: 'llano V12 Ultra adalah cooling pad laptop gaming dengan 5,5-inch turbo fan hingga 2800 RPM, dilengkapi intelligent software control, RGB, dan 3 port USB 3.0. Software-nya menyediakan pengaturan otomatis berdasarkan beban laptop serta pilihan mode Low, Medium, dan High. V12 Ultra mendukung laptop 15,6 inci ke atas dan memiliki 3 tingkat pengaturan ketinggian.',
        categoryId: 10,
        images: [
            '/images/products/coolingpad1.jpg',
        ],
        price: 1279000,
        compareAtPrice: null,
        specifications: {
            'Kecepatan Kipas': 'Hingga 2800 RPM',
            'Ukuran Kipas': '5.5-inch Turbo Fan',
            'Kompatibilitas': 'Laptop 15.6 - 21 inci',
            'Konektivitas': '3 × USB 3.0',
        },
        rating: 4.88,
        reviewCount: 134,
        stock: 25,
        isFeatured: false,
        brand: 'llano',
        sku: 'LLANO-V12-ULTRA',
    },
    {
        id: 'prod-cp-02',
        name: 'IETS GT500',
        slug: 'vortix-frostflow-quiet-cooler',
        description: 'IETS GT500 adalah laptop cooling pad berperforma tinggi yang dirancang untuk membantu menjaga suhu laptop gaming tetap optimal. Menggunakan turbo fan berkecepatan tinggi hingga 5000 RPM, sistem sealed foam duct untuk mengarahkan aliran udara langsung ke ventilasi laptop, serta kontrol kecepatan kipas yang dapat disesuaikan. Cocok untuk laptop gaming berukuran hingga 17,3 inci.',
        categoryId: 10,
        images: [
            '/images/products/coolingpad2.jpg'
        ],
        price: 1800000,
        compareAtPrice: 2000000,
        specifications: {
            'Kecepatan Kipas': 'Hingga 4200-5000 RPM',
            'Kompatibilitas': 'Laptop 13 - 17.3 inci',
            'Dimensi': '400mm x 312mm x 70mm',
            'Material': 'ABS',
        },
        rating: 4.6,
        reviewCount: 78,
        stock: 30,
        isFeatured: false,
        brand: 'IETS',
        sku: 'IETS-GT500',
    },

    // 11. USB Hub
    {
        id: 'prod-hub-01',
        name: 'Vortix Nexus 8-in-1 10Gbps Powered Gaming Hub',
        slug: 'vortix-nexus-8-in-1-usb-hub',
        description: 'Hub desktop gaming aluminium berdaya dengan 4x USB-A 3.2 Gen 2 (10Gbps), 2x USB-C 10Gbps, SD/TF card slot, dan port audio DAC terintegrasi dengan isolasi interferensi frekuensi tinggi.',
        categoryId: 11,
        images: [
            'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
        ],
        price: 850000,
        compareAtPrice: 1050000,
        specifications: {
            'Kecepatan Transfer': 'Up to 10 Gbps Ultra Fast',
            'Daya Tambahan': 'Port DC 12V 36W untuk stabilisasi polling rate perangkat',
            'Material Housing': 'Anodized Dark Gray Aluminum CNC',
        },
        rating: 4.84,
        reviewCount: 95,
        stock: 22,
        isFeatured: false,
        brand: 'VGS Tech',
        sku: 'VGS-HB-NEXUS-8',
    },
    {
        id: 'prod-hub-02',
        name: 'Vortix Clamping Desk-Edge 4-Port USB 3.2 Hub',
        slug: 'vortix-clamping-desk-hub',
        description: 'Hub jepit sisi meja yang praktis untuk colok flashdisk dan dongle mouse tepat di jangkauan tangan.',
        categoryId: 11,
        images: [
            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
        ],
        price: 290000,
        compareAtPrice: 350000,
        specifications: {
            'Klem Meja': 'Adjustable 10mm - 32mm tebal meja',
            'Port': '4x USB 3.2 Gen 1 (5Gbps)',
        },
        rating: 4.75,
        reviewCount: 68,
        stock: 40,
        isFeatured: false,
        brand: 'VGS Tech',
        sku: 'VGS-HB-CLMP-04',
    },

    // 12. DisplayPort Cable
    {
        id: 'prod-dp-01',
        name: 'Vortix UltraLink DisplayPort 2.1 UHBR20 Cable (2M)',
        slug: 'vortix-ultralink-dp-2-1-cable',
        description: 'Kabel DisplayPort 2.1 bersertifikasi VESA resmi mendukung bandwidth raksasa 80Gbps, 16K@60Hz, 8K@120Hz, dan 4K@240Hz dengan pin berlapis emas 24K dan pelindung EMI 4-lapis.',
        categoryId: 12,
        images: [
            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&auto=format&fit=crop&q=80',
        ],
        price: 260000,
        compareAtPrice: 320000,
        specifications: {
            'Standar DP': 'VESA DisplayPort 2.1 (UHBR20 - 80Gbps)',
            'Dukungan Resolusi': '4K @ 240Hz / 8K @ 120Hz / 16K @ 60Hz DSC',
            'Panjang Kabel': '2 Meter High Density Braided Nylon',
            'Shielding': 'Quad-Layer Aluminum Foil + Tin Plated Copper Braid',
        },
        rating: 4.96,
        reviewCount: 310,
        stock: 80,
        isFeatured: false,
        brand: 'VGS Cable Lab',
        sku: 'VGS-CB-DP21-2M',
    },
    {
        id: 'prod-dp-02',
        name: 'Vortix UltraLink DisplayPort 1.4 Cable (1.5M)',
        slug: 'vortix-ultralink-dp-1-4-cable',
        description: 'Kabel DP 1.4 standar esports 32.4Gbps mendukung 2K@240Hz dan 4K@144Hz HDR.',
        categoryId: 12,
        images: [
            'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&auto=format&fit=crop&q=80',
        ],
        price: 145000,
        compareAtPrice: null,
        specifications: {
            'Standar': 'DisplayPort 1.4 HBR3 (32.4Gbps)',
            'Panjang': '1.5 Meter Braided',
        },
        rating: 4.85,
        reviewCount: 154,
        stock: 95,
        isFeatured: false,
        brand: 'VGS Cable Lab',
        sku: 'VGS-CB-DP14-15M',
    },

    // 13. USB Type-C Cable
    {
        id: 'prod-tc-01',
        name: 'Vortix HyperFlex Coiled Aviator USB-C Cable',
        slug: 'vortix-hyperflex-coiled-aviator-cable',
        description: 'Kabel custom keyboard melingkar (coiled) dengan konektor metalik GX16 Aviator 5-pin, selongsong ganda PET + Techflex anti kendur, dan transmisi data berkecepatan tinggi.',
        categoryId: 13,
        images: [
            'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
        ],
        price: 285000,
        compareAtPrice: 350000,
        variants: [
            { id: 'var-tc-1', name: 'Color', value: 'Vortix Electric Blue & Black', priceModifier: 0, stock: 35 },
            { id: 'var-tc-2', name: 'Color', value: 'All Stealth Black', priceModifier: 0, stock: 25 },
        ],
        specifications: {
            'Konektor': 'USB Type-A to Type-C with GX16 5-Pin Aviator Quick Release',
            'Panjang Coil': '15cm Inner Coil + 1.2m Straight Cable',
            'Lapisan': 'Double-sleeved Paracord + Pet Techflex',
        },
        rating: 4.91,
        reviewCount: 180,
        stock: 60,
        isFeatured: false,
        brand: 'VGS Forge',
        sku: 'VGS-CB-COIL-AV1',
    },
    {
        id: 'prod-tc-02',
        name: 'Vortix AirCord Ultra-Lightweight Mouse Paracord (2M)',
        slug: 'vortix-aircord-mouse-paracord',
        description: 'Kabel pengganti mouse ultra-lentur dengan berat mendekati nol untuk sensasi gerak layaknya wireless.',
        categoryId: 13,
        images: [
            'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&auto=format&fit=crop&q=80',
        ],
        price: 120000,
        compareAtPrice: 150000,
        specifications: {
            'Panjang': '2 Meter Super Soft Paracord Wire',
            'Konektor': 'USB-A to Type-C Gold Plated',
        },
        rating: 4.79,
        reviewCount: 88,
        stock: 50,
        isFeatured: false,
        brand: 'VGS Cable Lab',
        sku: 'VGS-CB-AIR-2M',
    },

    // 14. Desk Mat
    {
        id: 'prod-dm-01',
        name: 'Vortix Vector Stealth XXL Desk Mat (900x400mm)',
        slug: 'vortix-vector-stealth-xxl-desk-mat',
        description: 'Desk mat ukuran besar 900x400x4mm dengan aksen garis heksagonal grafis minimalis, lapisan nano tahan air spill-resistant, dan jahitan tepi presisi.',
        categoryId: 14,
        images: [
            'https://images.unsplash.com/photo-1629429408209-1f912961dbd8?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
        ],
        price: 299000,
        compareAtPrice: 380000,
        specifications: {
            'Ukuran': '900mm x 400mm x 4mm Extra Thick',
            'Permukaan': 'Water-Repellent Microfiber Smooth Glide',
            'Alas': 'Natural Rubber Herringbone Anti-Slip Grip',
        },
        rating: 4.93,
        reviewCount: 245,
        stock: 75,
        isFeatured: false,
        badge: 'Diskon',
        brand: 'VGS Surface',
        sku: 'VGS-DM-VCTR-XXL',
    },
    {
        id: 'prod-dm-02',
        name: 'Vortix HexaGrid Pro Desk Mat 1000x500mm',
        slug: 'vortix-hexagrid-pro-desk-mat',
        description: 'Desk mat super lapang 1000x500mm menampung seluruh setup keyboard, mouse, mic stand, dan monitor arm dengan estetika technical gaming clean.',
        categoryId: 14,
        images: [
            'https://images.unsplash.com/photo-1629429408209-1f912961dbd8?w=800&auto=format&fit=crop&q=80',
        ],
        price: 360000,
        compareAtPrice: null,
        specifications: {
            'Ukuran': '1000mm x 500mm x 4mm',
            'Bahan': 'High-Density Fine Woven Textile',
        },
        rating: 4.87,
        reviewCount: 112,
        stock: 45,
        isFeatured: false,
        brand: 'VGS Surface',
        sku: 'VGS-DM-HEXA-100',
    },
];

/**
 * HELPER FUNCTIONS
 * Dipakai oleh Orang 1 (Home, About) & Orang 2 (Product List, Detail, Cart, Filters).
 */

export function getCategories(): Category[] {
    return categories;
}

export function getCategoryBySlug(slug: string): Category | undefined {
    return categories.find(c => c.slug === slug);
}

export function getCategoryById(id: number | string): Category | undefined {
    return categories.find(c => String(c.id) === String(id));
}

export function getProducts(filter?: ProductFilter): Product[] {
    let result = products.map(p => {
        const cat = categories.find(c => String(c.id) === String(p.categoryId));
        return { ...p, category: cat };
    });

    if (!filter) return result;

    if (filter.categoryId) {
        result = result.filter(p => String(p.categoryId) === String(filter.categoryId));
    }

    if (filter.minPrice != null) {
        result = result.filter(p => p.price >= filter.minPrice!);
    }

    if (filter.maxPrice != null) {
        result = result.filter(p => p.price <= filter.maxPrice!);
    }

    if (filter.search && filter.search.trim() !== '') {
        const q = filter.search.toLowerCase().trim();
        result = result.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.brand?.toLowerCase().includes(q) ||
            p.sku?.toLowerCase().includes(q)
        );
    }

    if (filter.sortBy) {
        switch (filter.sortBy) {
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                result.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
                break;
            case 'featured':
            default:
                result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
                break;
        }
    }

    return result;
}

export function getProductBySlug(slug: string): Product | undefined {
    const p = products.find(prod => prod.slug === slug);
    if (!p) return undefined;
    const cat = categories.find(c => String(c.id) === String(p.categoryId));
    return { ...p, category: cat };
}

export function getProductById(id: number | string): Product | undefined {
    const p = products.find(prod => String(prod.id) === String(id));
    if (!p) return undefined;
    const cat = categories.find(c => String(c.id) === String(p.categoryId));
    return { ...p, category: cat };
}

export function getProductsByCategory(categoryId: number | string): Product[] {
    return getProducts({ categoryId });
}

export function getFeaturedProducts(): Product[] {
    return getProducts().filter(p => p.isFeatured);
}

/**
 * Format currency helper (IDR / Rupiah)
 */
export function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}
