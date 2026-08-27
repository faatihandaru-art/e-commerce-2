# Panduan Product Options

Dokumentasi lengkap untuk populate dan mengelola product options di aplikasi e-commerce.

## Daftar Isi
1. [Instalasi dan Setup](#instalasi-dan-setup)
2. [Menggunakan Product Options](#menggunakan-product-options)
3. [API dan Methods](#api-dan-methods)
4. [Contoh Penggunaan](#contoh-penggunaan)
5. [Struktur Data](#struktur-data)

---

## Instalasi dan Setup

### 1. Jalankan Seeder untuk Populate Data

Untuk membuat produk sample dengan product options:

```bash
# Menggunakan command artisan (recommended)
php artisan product-options:populate

# Atau menggunakan seeder langsung
php artisan db:seed --class=ProductOptionSeeder
```

### 2. Struktur Model

Aplikasi sudah dilengkapi dengan model-model berikut:

- **Product** - Model untuk produk
- **ProductOption** - Model untuk opsi produk (Size, Color, dll)
- **ProductOptionValue** - Model untuk nilai dari setiap opsi
- **ProductVariant** - Model untuk varian produk
- **ProductImage** - Model untuk gambar produk
- **Brand** - Model untuk brand

---

## Menggunakan Product Options

### Membaca Product Options

```php
use App\Models\Product;

// Get product dengan options dan values
$product = Product::with('options.values')->find(1);

// Loop melalui options
foreach ($product->options as $option) {
    echo $option->name; // "Size"
    
    foreach ($option->values as $value) {
        echo $value->value; // "S", "M", "L"
    }
}
```

### Membuat Product Options Manual

```php
use App\Domain\Product\Actions\CreateProductOptionsAction;
use App\Models\Product;

$action = new CreateProductOptionsAction();
$product = Product::find(1);

// Define options data
$optionsData = [
    [
        'name' => 'Size',
        'values' => ['S', 'M', 'L', 'XL', 'XXL']
    ],
    [
        'name' => 'Color',
        'values' => ['Red', 'Blue', 'Green', 'Black', 'White']
    ]
];

// Create options for product
$createdOptions = $action->execute($product, $optionsData);

echo "Created {$createdOptions->count()} options";
```

### Membuat Options untuk Multiple Products

```php
$action = new CreateProductOptionsAction();

$productsData = [
    [
        'product_id' => 1,
        'options' => [
            ['name' => 'Size', 'values' => ['S', 'M', 'L']],
            ['name' => 'Color', 'values' => ['Red', 'Blue']]
        ]
    ],
    [
        'product_id' => 2,
        'options' => [
            ['name' => 'Storage', 'values' => ['64GB', '128GB', '256GB']],
            ['name' => 'Color', 'values' => ['Gold', 'Silver', 'Space Gray']]
        ]
    ]
];

$results = $action->executeBulk($productsData);

foreach ($results as $result) {
    echo "Product: {$result['product_name']}, Options: {$result['options_count']}";
}
```

### Copy Options dari Product Lain

```php
$action = new CreateProductOptionsAction();

$sourceProduct = Product::find(1);  // Product dengan opsi yang sudah ada
$targetProduct = Product::find(2);  // Product target

// Copy semua options dari source ke target
$copiedOptions = $action->copyFromProduct($sourceProduct, $targetProduct);

echo "Copied {$copiedOptions->count()} options";
```

---

## API dan Methods

### CreateProductOptionsAction

#### execute()
```php
public function execute(Product $product, array $optionsData): Collection
```

Membuat product options untuk satu produk.

**Parameters:**
- `$product` (Product): Model produk
- `$optionsData` (array): Array opsi dengan struktur:
  ```php
  [
      [
          'name' => 'Nama Opsi',
          'values' => ['Nilai 1', 'Nilai 2', ...]
      ],
      ...
  ]
  ```

**Returns:** Collection of ProductOption models

#### executeBulk()
```php
public function executeBulk(array $productsData): Collection
```

Membuat product options untuk multiple produk sekaligus.

**Parameters:**
- `$productsData` (array): Array data produk

**Returns:** Collection dengan hasil untuk setiap produk

#### copyFromProduct()
```php
public function copyFromProduct(Product $sourceProduct, Product $targetProduct): Collection
```

Meng-copy semua options dari satu produk ke produk lain.

**Parameters:**
- `$sourceProduct` (Product): Produk sumber
- `$targetProduct` (Product): Produk target

**Returns:** Collection of ProductOption models yang telah dicopy

---

## Contoh Penggunaan

### Contoh 1: Membuat Produk Sepatu dengan Opsi

```php
use App\Models\Product, Brand;
use App\Domain\Product\Actions\CreateProductOptionsAction;

// Create product
$brand = Brand::where('name', 'Nike')->first();
$product = Product::create([
    'brand_id' => $brand->id,
    'name' => 'Nike Zoom Fly',
    'slug' => 'nike-zoom-fly',
    'type' => 'variable',
    'status' => 'published',
    'description' => 'Professional running shoes',
]);

// Add options
$action = new CreateProductOptionsAction();
$options = $action->execute($product, [
    [
        'name' => 'Size',
        'values' => ['6', '7', '8', '9', '10', '11', '12', '13']
    ],
    [
        'name' => 'Color',
        'values' => ['Black', 'White', 'Red', 'Blue', 'Yellow']
    ]
]);

echo "Product {$product->name} created with {$options->count()} options";
```

### Contoh 2: Batch Populate untuk Multiple Toko

```php
$action = new CreateProductOptionsAction();

$stores = [
    [
        'product_id' => 1,
        'options' => [
            ['name' => 'Size', 'values' => ['XS', 'S', 'M', 'L', 'XL', 'XXL']],
            ['name' => 'Material', 'values' => ['Cotton', 'Polyester', 'Wool']]
        ]
    ],
    [
        'product_id' => 2,
        'options' => [
            ['name' => 'Warna', 'values' => ['Merah', 'Biru', 'Hijau']],
            ['name' => 'Ukuran', 'values' => ['Kecil', 'Sedang', 'Besar']]
        ]
    ],
];

$results = $action->executeBulk($stores);
```

### Contoh 3: Mengakses Product Options di View

```blade
@foreach($product->options as $option)
    <div class="option-group">
        <label>{{ $option->name }}</label>
        <select name="option_{{ $option->id }}">
            @foreach($option->values as $value)
                <option value="{{ $value->id }}">{{ $value->value }}</option>
            @endforeach
        </select>
    </div>
@endforeach
```

---

## Struktur Data

### Tabel: products
```
id                  - Primary key
brand_id            - Foreign key ke brands
name                - Nama produk
slug                - URL slug
type                - Tipe: simple, variable, digital, service
status              - Status: draft, published, archived
short_description   - Deskripsi singkat
description         - Deskripsi lengkap
meta_title          - Meta title untuk SEO
meta_description    - Meta description untuk SEO
published_at        - Tanggal publikasi
deleted_at          - Soft delete timestamp
created_at          - Timestamp pembuatan
updated_at          - Timestamp update
```

### Tabel: product_options
```
id              - Primary key
product_id      - Foreign key ke products
name            - Nama opsi (Size, Color, dll)
sort_order      - Urutan penampilan (0, 1, 2, ...)
```

### Tabel: product_option_values
```
id              - Primary key
option_id       - Foreign key ke product_options
value           - Nilai opsi (S, M, L, etc)
sort_order      - Urutan penampilan
```

### Tabel: product_variants
```
id                  - Primary key
product_id          - Foreign key ke products
sku                 - Stock Keeping Unit
barcode             - Barcode produk
price               - Harga
compare_at_price    - Harga perbandingan
cost                - Harga cost
weight              - Berat
status              - Status: active, inactive
```

---

## Catatan Penting

1. **Soft Delete**: Product menggunakan soft delete, jadi produk yang dihapus masih bisa di-restore.

2. **Timestamps**: ProductOption dan ProductOptionValue tidak menggunakan timestamps (created_at, updated_at).

3. **Sort Order**: Gunakan `sort_order` untuk mengatur urutan tampilan opsi dan nilainya.

4. **Product Type**: Gunakan type `variable` untuk produk yang memiliki options/variants.

5. **Unique Constraint**: Slug produk harus unik di seluruh aplikasi.

---

## Troubleshooting

### Q: Command artisan tidak ditemukan?
A: Pastikan file ConsoleKernel.php sudah ter-register. Atau jalankan:
```bash
php artisan list
```

### Q: Data tidak ter-seed?
A: Cek koneksi database dan jalankan migration dulu:
```bash
php artisan migrate
```

### Q: Duplikasi data saat menjalankan seeder?
A: Seeder menggunakan `firstOrCreate`, jadi tidak akan membuat duplikasi. Aman dijalankan berkali-kali.

---

## Referensi Model

```php
// Product model
$product->options()->get()              // Get all options
$product->options()->with('values')->get() // Get options with values
$product->variants()->get()             // Get all variants

// ProductOption model
$option->values()->get()                // Get all values for this option
$option->product()->get()               // Get parent product

// ProductOptionValue model
$value->option()->get()                 // Get parent option
```
