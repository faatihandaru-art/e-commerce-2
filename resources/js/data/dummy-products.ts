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
        name: 'Vortix Apex Pro Wireless Ultra-Light',
        slug: 'vortix-apex-pro-wireless',
        description: 'Mouse gaming nirkabel tingkat turnamen dengan berat hanya 49 gram, sensor optik V-Core 30K, polling rate 8000Hz, dan optical switch generasi ke-3 dengan ketahanan 90 juta klik.',
        categoryId: 1,
        images: [
            'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1563297007-0686b7003af7?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1626218174358-7769486c4b79?w=800&auto=format&fit=crop&q=80',
        ],
        price: 1399000,
        compareAtPrice: 1799000,
        variants: [
            { id: 'var-gm-1', name: 'Color', value: 'Matte Obsidian Black', priceModifier: 0, stock: 24 },
            { id: 'var-gm-2', name: 'Color', value: 'Titanium Silver', priceModifier: 50000, stock: 12 },
            { id: 'var-gm-3', name: 'Color', value: 'Arctic White', priceModifier: 0, stock: 8 },
        ],
        specifications: {
            'Sensor': 'V-Core Gen-4 Optical 30.000 DPI',
            'IPS / Akselerasi': '750 IPS / 70G',
            'Polling Rate': 'True 8000Hz Hyper-Polling',
            'Konektivitas': '2.4GHz Low-Latency Wireless, Type-C, BT 5.3',
            'Berat': '49 gram',
            'Baterai': 'Hingga 95 Jam pemakaian kompetitif',
        },
        rating: 4.9,
        reviewCount: 238,
        stock: 44,
        isFeatured: true,
        badge: 'Diskon',
        brand: 'VGS Pro Series',
        sku: 'VGS-M-APEX-WL',
    },
    {
        id: 'prod-gm-02',
        name: 'Vortix Striker X Ergonomic Wired Mouse',
        slug: 'vortix-striker-x-wired',
        description: 'Mouse gaming ergonomis bentuk palm-grip dengan kabel paracord super lentur, tombol optik instan, dan 6 tombol yang dapat diprogram sepenuhnya melalui VGS Synapse Core.',
        categoryId: 1,
        images: [
            'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1563297007-0686b7003af7?w=800&auto=format&fit=crop&q=80',
        ],
        price: 649000,
        compareAtPrice: 799000,
        variants: [
            { id: 'var-gm-4', name: 'Color', value: 'Stealth Black', priceModifier: 0, stock: 30 },
        ],
        specifications: {
            'Sensor': 'PixArt PMW3395 26.000 DPI',
            'IPS / Akselerasi': '650 IPS / 50G',
            'Polling Rate': '1000Hz / 1ms response',
            'Konektivitas': 'SpeedFlex Paracord 2m',
            'Berat': '58 gram',
        },
        rating: 4.7,
        reviewCount: 96,
        stock: 30,
        isFeatured: false,
        brand: 'VGS Core',
        sku: 'VGS-M-STRK-WD',
    },
    {
        id: 'prod-gm-03',
        name: 'Vortix Phantom Claw MMO 12-Button',
        slug: 'vortix-phantom-claw-mmo',
        description: 'Mouse khusus MMO / MOBA dengan keypad samping modular 12-tombol magnetik, sensor presisi, dan profile memory internal untuk macro kustom.',
        categoryId: 1,
        images: [
            'https://images.unsplash.com/photo-1563297007-0686b7003af7?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
        ],
        price: 1120000,
        compareAtPrice: null,
        specifications: {
            'Sensor': 'V-Core Optical 20.000 DPI',
            'Jumlah Tombol': '16 Tombol Programmable',
            'Konektivitas': 'Dual Wireless 2.4G & Bluetooth',
            'Berat': '85 gram (Adjustable weight kit included)',
        },
        rating: 4.8,
        reviewCount: 64,
        stock: 15,
        isFeatured: false,
        badge: 'Baru',
        brand: 'VGS Pro Series',
        sku: 'VGS-M-PHNT-MMO',
    },

    // 2. Mechanical Keyboard
    {
        id: 'prod-kb-01',
        name: 'Vortix Cypher 75% Custom Mechanical Keyboard',
        slug: 'vortix-cypher-75-mechanical',
        description: 'Keyboard mekanikal layout 75% dengan gasket-mount berperedam 5-lapis Poron, hot-swappable 5-pin PCB, knob volume metal CNC, dan baterai besar 4000mAh.',
        categoryId: 2,
        images: [
            'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80',
        ],
        price: 1850000,
        compareAtPrice: 2200000,
        variants: [
            { id: 'var-kb-1', name: 'Switch', value: 'Linear Silver Speed (Factory Lubed)', priceModifier: 0, stock: 18 },
            { id: 'var-kb-2', name: 'Switch', value: 'Tactile Ice Blue 45g', priceModifier: 50000, stock: 14 },
            { id: 'var-kb-3', name: 'Switch', value: 'Silent Linear Ghost 40g', priceModifier: 75000, stock: 7 },
        ],
        specifications: {
            'Layout': '75% Compact (82 Keys + Multi-Function Knob)',
            'Mounting': 'Silicone Gasket Mount with FR4 Plate',
            'Keycaps': 'Double-shot PBT Cherry Profile',
            'Konektivitas': 'Tri-mode (2.4G Wireless, Bluetooth 5.1, Type-C)',
            'Peredam': 'Poron Sandwich + IXPE Switch Pad + Bottom Silicone',
            'Baterai': '4000 mAh Li-ion Rechargeable',
        },
        rating: 4.95,
        reviewCount: 312,
        stock: 39,
        isFeatured: true,
        badge: 'Diskon',
        brand: 'VGS Forge',
        sku: 'VGS-KB-CYPHER75',
    },
    {
        id: 'prod-kb-02',
        name: 'Vortix Valkyrie TKL Rapid-Trigger Hall Effect',
        slug: 'vortix-valkyrie-tkl-hall-effect',
        description: 'Keyboard TKL esports dengan magnetic Hall-Effect switch, fitur Rapid Trigger dapat diatur 0.1mm - 4.0mm, polling rate 8000Hz sejati untuk respons gerak tak tertandingi di FPS.',
        categoryId: 2,
        images: [
            'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&auto=format&fit=crop&q=80',
        ],
        price: 2450000,
        compareAtPrice: 2800000,
        variants: [
            { id: 'var-kb-4', name: 'Color', value: 'Anodized Silver/Black', priceModifier: 0, stock: 10 },
        ],
        specifications: {
            'Switch': 'VGS Magnetic Hall Effect (Zero Contact Wear)',
            'Akurasi Rapid Trigger': '0.1mm step adjustable',
            'Polling Rate': '8000Hz (0.125ms latency)',
            'Frame Material': 'Aviation-Grade Anodized Aluminum Top',
        },
        rating: 5.0,
        reviewCount: 178,
        stock: 10,
        isFeatured: true,
        badge: 'Stok Terbatas',
        brand: 'VGS Pro Series',
        sku: 'VGS-KB-VALK-HE',
    },
    {
        id: 'prod-kb-03',
        name: 'Vortix Pulse 60 Compact Mechanical',
        slug: 'vortix-pulse-60-compact',
        description: 'Keyboard 60% ultra-portabel untuk gamer turnamen yang membutuhkan ruang mouse seluas mungkin. Dilengkapi kabel detachable braided dan switch hot-swap.',
        categoryId: 2,
        images: [
            'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&auto=format&fit=crop&q=80',
        ],
        price: 890000,
        compareAtPrice: null,
        specifications: {
            'Layout': '60% (61 Keys)',
            'Switch': 'Gateron Yellow Pro Pre-lubed',
            'Keycaps': 'PBT Dye-Sub OEM Profile',
        },
        rating: 4.6,
        reviewCount: 82,
        stock: 22,
        isFeatured: false,
        brand: 'VGS Core',
        sku: 'VGS-KB-PULSE60',
    },

    // 3. Gaming Headset
    {
        id: 'prod-hs-01',
        name: 'Vortix Sonar Elite 7.1 Spatial Wireless Headset',
        slug: 'vortix-sonar-elite-wireless',
        description: 'Headset gaming nirkabel lossless 2.4GHz dengan driver Titanium 50mm, spatial 3D audio tuning, bantalan memory foam pendingin bernapas, dan mic peredam bising AI bersertifikasi Discord.',
        categoryId: 3,
        images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
        ],
        price: 1599000,
        compareAtPrice: 1999000,
        variants: [
            { id: 'var-hs-1', name: 'Color', value: 'Midnight Carbon', priceModifier: 0, stock: 25 },
            { id: 'var-hs-2', name: 'Color', value: 'Gunmetal Silver', priceModifier: 0, stock: 15 },
        ],
        specifications: {
            'Driver': '50mm Custom Tuned Titanium Diaphragm',
            'Frekuensi Respon': '12Hz - 28.000Hz',
            'Impedansi': '32 Ohm @ 1kHz',
            'Spatial Audio': 'VGS TruePosition 7.1 Surround',
            'Mikrofon': 'Detachable 9.7mm Broadcast-grade AI Noise-Cancelling',
            'Baterai': '60+ Jam aktif per charge',
        },
        rating: 4.88,
        reviewCount: 194,
        stock: 40,
        isFeatured: true,
        badge: 'Diskon',
        brand: 'VGS Pro Series',
        sku: 'VGS-HS-SONAR-WL',
    },
    {
        id: 'prod-hs-02',
        name: 'Vortix Echo Studio Open-Back Audiophile Headset',
        slug: 'vortix-echo-studio-open-back',
        description: 'Headset gaming desain open-back dengan soundstage luar biasa luas untuk pelacakan posisi musuh paling akurat di game tactical shooter.',
        categoryId: 3,
        images: [
            'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
        ],
        price: 2150000,
        compareAtPrice: null,
        specifications: {
            'Driver': '53mm Planar Magnetic Hybrid',
            'Tipe Akustik': 'Open-Back Studio Grade',
            'Kabel': 'OFC Oxygen-Free Copper 3.5mm + 6.35mm adapter',
        },
        rating: 4.92,
        reviewCount: 77,
        stock: 14,
        isFeatured: false,
        brand: 'VGS Audiophile',
        sku: 'VGS-HS-ECHO-OB',
    },
    {
        id: 'prod-hs-03',
        name: 'Vortix Ranger In-Ear Gaming Monitors (IEM)',
        slug: 'vortix-ranger-iem-gaming',
        description: 'Earphone IEM gaming driver ganda (1 DD + 1 BA) dengan isolasi suara pasif maksimal untuk turnamen LAN arena panggung bising.',
        categoryId: 3,
        images: [
            'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        ],
        price: 490000,
        compareAtPrice: 590000,
        specifications: {
            'Driver': '10mm Beryllium DD + Knowles Balanced Armature',
            'Konektor': '2-Pin 0.78mm Detachable Cable with In-line Mic',
        },
        rating: 4.7,
        reviewCount: 110,
        stock: 35,
        isFeatured: false,
        brand: 'VGS Core',
        sku: 'VGS-HS-RNGR-IEM',
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
        name: 'Vortix GlideX Pro Cordura Control Pad (XL)',
        slug: 'vortix-glidex-pro-cordura-xl',
        description: 'Mousepad kain Cordura militer premium berukuran 490x420mm dengan ketahanan abrasi maksimal, tahan air, jahitan tepi sub-surface rata dan busa Poron Jepang 4mm.',
        categoryId: 7,
        images: [
            'https://images.unsplash.com/photo-1629429408209-1f912961dbd8?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
        ],
        price: 349000,
        compareAtPrice: 429000,
        specifications: {
            'Dimensi': '490mm x 420mm x 4mm',
            'Permukaan': 'Cordura 500D Hybrid Weave (Speed & Control balance)',
            'Base': 'Japanese Poron Foam Anti-Slip',
            'Edge': 'Precision Micro-Stitched Edge below surface',
        },
        rating: 4.9,
        reviewCount: 220,
        stock: 60,
        isFeatured: false,
        brand: 'VGS Surface',
        sku: 'VGS-MP-GLIDEX-XL',
    },
    {
        id: 'prod-mp-02',
        name: 'Vortix GlassZero Tempered Glass Esports Pad',
        slug: 'vortix-glasszero-tempered-glass',
        description: 'Mousepad kaca tempered khusus kecepatan mutlak dengan micro-etched surface untuk friksi statis mendekati nol.',
        categoryId: 7,
        images: [
            'https://images.unsplash.com/photo-1629429408209-1f912961dbd8?w=800&auto=format&fit=crop&q=80',
        ],
        price: 890000,
        compareAtPrice: 1100000,
        specifications: {
            'Dimensi': '500mm x 400mm x 3.8mm',
            'Bahan': 'Kaca Tempered Silikat Khusus dengan perlakuan panas CNC',
        },
        rating: 4.88,
        reviewCount: 79,
        stock: 16,
        isFeatured: false,
        badge: 'Baru',
        brand: 'VGS Surface',
        sku: 'VGS-MP-GLASS-PRO',
    },

    // 8. Gaming Chair
    {
        id: 'prod-ch-01',
        name: 'Vortix Throne Ergonomic Esports Chair',
        slug: 'vortix-throne-ergonomic-chair',
        description: 'Kursi gaming berstruktur baja dingin dengan penyangga lumbar magnetik 4-arah adaptif, sandaran 4D full metal, dan bahan SoftWeave Plus fabric anti gerah.',
        categoryId: 8,
        images: [
            'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1580481077197-285623ff0185?w=800&auto=format&fit=crop&q=80',
        ],
        price: 3890000,
        compareAtPrice: 4500000,
        specifications: {
            'Kapasitas Beban': 'Hingga 150 kg (Class 4 Heavy Duty Gas Lift)',
            'Material Cover': 'VGS SoftWeave Breathable Tech Fabric',
            'Armrest': '4D Metal Mechanism with Magnetic PU Armpad',
            'Recline': '90° hingga 165° Multi-tilt Mechanism',
        },
        rating: 4.86,
        reviewCount: 89,
        stock: 14,
        isFeatured: true,
        brand: 'VGS Living',
        sku: 'VGS-CH-THRN-01',
    },
    {
        id: 'prod-ch-02',
        name: 'Vortix Mesh-X Full Breathable Ergonomic Chair',
        slug: 'vortix-mesh-x-ergonomic',
        description: 'Kursi gaming full mesh elastis Jerman berkekuatan tinggi untuk sirkulasi udara maksimal selama sesi bermain berjam-jam di cuaca tropis.',
        categoryId: 8,
        images: [
            'https://images.unsplash.com/photo-1580481077197-285623ff0185?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&auto=format&fit=crop&q=80',
        ],
        price: 2950000,
        compareAtPrice: null,
        specifications: {
            'Material': 'German ElasMesh Full Back & Seat',
            'Fitur': 'Dynamic Lumbar Tracking & 3D Headrest',
        },
        rating: 4.78,
        reviewCount: 56,
        stock: 19,
        isFeatured: false,
        brand: 'VGS Living',
        sku: 'VGS-CH-MESHX-02',
    },

    // 9. Gaming Desk
    {
        id: 'prod-dk-01',
        name: 'Vortix Battlestation Motorized Dual-Motor Standing Desk',
        slug: 'vortix-battlestation-standing-desk',
        description: 'Meja gaming elektrik dual-motor dengan memori 4 ketinggian, permukaan serat karbon luas 160x80cm, tray manajemen kabel tersembunyi, dan gantungan headset terintegrasi.',
        categoryId: 9,
        images: [
            'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80',
        ],
        price: 4690000,
        compareAtPrice: 5490000,
        specifications: {
            'Dimensi Daun Meja': '160cm x 80cm x 2.5cm (Carbon Texture)',
            'Rentang Tinggi': '62cm - 128cm (Dual Fast Motors)',
            'Kapasitas Beban': '120 kg',
            'Fitur Khusus': 'Anti-Collision Sensor & Integrated Cable Net',
        },
        rating: 4.92,
        reviewCount: 63,
        stock: 8,
        isFeatured: false,
        badge: 'Diskon',
        brand: 'VGS Living',
        sku: 'VGS-DK-BATTLE-160',
    },
    {
        id: 'prod-dk-02',
        name: 'Vortix Fortress Z-Frame 120cm Desk',
        slug: 'vortix-fortress-z-frame-desk',
        description: 'Meja gaming rangka baja Z tebal dengan dudukan monitor ganda, cup holder, dan headset hanger.',
        categoryId: 9,
        images: [
            'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80',
        ],
        price: 1590000,
        compareAtPrice: 1890000,
        specifications: {
            'Dimensi': '120cm x 60cm x 75cm',
            'Rangka': 'Cold-rolled Carbon Steel Z-Legs',
        },
        rating: 4.72,
        reviewCount: 41,
        stock: 12,
        isFeatured: false,
        brand: 'VGS Living',
        sku: 'VGS-DK-FRTRSS-120',
    },

    // 10. Laptop Cooling Pad
    {
        id: 'prod-cp-01',
        name: 'Vortix Blizzard Turbo Sealing Laptop Cooler',
        slug: 'vortix-blizzard-laptop-cooler',
        description: 'Cooling pad bertekanan udara tinggi dengan busa penyegel memory foam, kipas turbo 2800 RPM, filter debu magnetik ganda, dan layar LCD pemantau kecepatan.',
        categoryId: 10,
        images: [
            'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=800&auto=format&fit=crop&q=80',
        ],
        price: 780000,
        compareAtPrice: 950000,
        specifications: {
            'Kecepatan Kipas': '600 - 2800 RPM Stepless Adjustable',
            'Penurunan Suhu': 'Mampu menurunkan suhu CPU/GPU hingga 15-20°C',
            'Kompatibilitas': 'Laptop 14 inci hingga 18 inci',
            'Konektivitas': 'Adaptor Daya 12V 2A dedicated + USB Passthrough',
        },
        rating: 4.88,
        reviewCount: 134,
        stock: 25,
        isFeatured: false,
        brand: 'VGS Cooling',
        sku: 'VGS-CP-BLZZRD-01',
    },
    {
        id: 'prod-cp-02',
        name: 'Vortix FrostFlow Aluminium Quiet Pad',
        slug: 'vortix-frostflow-quiet-cooler',
        description: 'Cooling pad bodi aluminium penerus panas dengan 5 kipas hening berkecepatan 1400 RPM.',
        categoryId: 10,
        images: [
            'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=800&auto=format&fit=crop&q=80',
        ],
        price: 320000,
        compareAtPrice: null,
        specifications: {
            'Bahan': 'Brushed Metal Mesh Plate',
            'Tingkat Kebisingan': 'Hanya 21 dBA pada kecepatan penuh',
        },
        rating: 4.6,
        reviewCount: 78,
        stock: 30,
        isFeatured: false,
        brand: 'VGS Cooling',
        sku: 'VGS-CP-FROST-02',
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
