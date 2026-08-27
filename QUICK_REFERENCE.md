# 📚 Referensi Cepat - Product Options

Panduan singkat untuk menggunakan Product Options di aplikasi e-commerce.

---

## 🎯 Cara Penggunaan

### 1️⃣ Populate Data Sample (Langsung Jalan)

```bash
php artisan product-options:populate
```

Atau tanpa konfirmasi:
```bash
php artisan product-options:populate --force
```

Apa yang akan terjadi:
- ✅ Membuat 4 brand (Nike, Adidas, Puma, Reebok)
- ✅ Membuat 5 produk sample
- ✅ Setiap produk punya opsi Size dan Color
- ✅ Data siap digunakan

---

## 💻 Penggunaan di Code

### Ambil Produk dengan Options
```php
use App\Models\Product;

$product = Product::with('options.values')->find(1);

// Akses options
foreach ($product->options as $option) {
    echo $option->name; // "Size", "Color", dll
    
    foreach ($option->values as $value) {
        echo $value->value; // "S", "M", "L", dll
    }
}
```

### Buat Options untuk Produk
```php
use App\Domain\Product\Actions\CreateProductOptionsAction;
use App\Models\Product;

$product = Product::find(1);
$action = new CreateProductOptionsAction();

$options = $action->execute($product, [
    [
        'name' => 'Size',
        'values' => ['S', 'M', 'L', 'XL']
    ],
    [
        'name' => 'Color',
        'values' => ['Red', 'Blue', 'Green']
    ]
]);

echo "Berhasil membuat {$options->count()} opsi";
```

### Copy Options dari Produk Lain
```php
$source = Product::find(1);  // Produk yang punya options
$target = Product::find(2);  // Produk target

$action = new CreateProductOptionsAction();
$copiedOptions = $action->copyFromProduct($source, $target);

echo "Berhasil copy {$copiedOptions->count()} opsi";
```

### Buat Options untuk Multiple Produk Sekaligus
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
            ['name' => 'Warna', 'values' => ['Merah', 'Biru', 'Hijau']]
        ]
    ]
];

$results = $action->executeBulk($productsData);
```

---

## 🌐 REST API

### 1. Get Semua Options Produk
```bash
GET /api/products/1/options
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "product_id": 1,
      "name": "Size",
      "sort_order": 0,
      "values": [
        {"id": 1, "option_id": 1, "value": "S", "sort_order": 0},
        {"id": 2, "option_id": 1, "value": "M", "sort_order": 1}
      ]
    }
  ],
  "count": 2
}
```

### 2. Create Options
```bash
POST /api/products/1/options
Content-Type: application/json

{
  "options": [
    {
      "name": "Size",
      "values": ["S", "M", "L", "XL"]
    },
    {
      "name": "Color",
      "values": ["Red", "Blue", "Green"]
    }
  ]
}
```

### 3. Update Option
```bash
PATCH /api/products/options/1
Content-Type: application/json

{
  "name": "Ukuran",
  "sort_order": 2
}
```

### 4. Delete Option
```bash
DELETE /api/products/options/1
```

### 5. Copy Options Antar Produk
```bash
POST /api/products/1/options/copy
Content-Type: application/json

{
  "target_product_id": 2
}
```

### 6. Bulk Create
```bash
POST /api/products/options/bulk-create
Content-Type: application/json

{
  "products": [
    {
      "product_id": 1,
      "options": [
        {"name": "Size", "values": ["S", "M", "L"]}
      ]
    },
    {
      "product_id": 2,
      "options": [
        {"name": "Color", "values": ["Red", "Blue"]}
      ]
    }
  ]
}
```

---

## 🧪 Testing dengan Tinker

```bash
php artisan tinker
```

```php
# Ambil produk pertama dengan options
$p = App\Models\Product::with('options.values')->first();

# Lihat semua produk
App\Models\Product::all();

# Lihat options produk pertama
$p->options;

# Lihat values dari option pertama
$p->options[0]->values;

# Create option baru
$action = new App\Domain\Product\Actions\CreateProductOptionsAction();
$action->execute($p, [['name' => 'Material', 'values' => ['Cotton', 'Polyester']]]);

# Exit
exit
```

---

## 📊 Model Relationships

```php
// Product
Product::first()->options();        // Semua options
Product::first()->variants();       // Semua variants
Product::first()->images();         // Semua images
Product::first()->brand();          // Brand produk

// ProductOption
$option = ProductOption::first();
$option->product();                 // Produk parent
$option->values();                  // Semua values

// ProductOptionValue
$value = ProductOptionValue::first();
$value->option();                   // Option parent
```

---

## 📁 Struktur File

```
app/
  ├── Models/
  │   ├── Product.php
  │   ├── ProductOption.php
  │   ├── ProductOptionValue.php
  │   ├── ProductVariant.php
  │   ├── ProductImage.php
  │   └── Brand.php
  ├── Domain/Product/Actions/
  │   └── CreateProductOptionsAction.php
  ├── Console/Commands/
  │   └── PopulateProductOptionsCommand.php
  └── Http/Controllers/Api/Product/
      └── ProductOptionController.php

database/
  └── seeders/
      └── ProductOptionSeeder.php

PRODUCT_OPTIONS_GUIDE.md           # Dokumentasi Lengkap
IMPLEMENTATION_SUMMARY.md          # Ringkasan Implementasi
QUICK_REFERENCE.md                 # File ini
```

---

## ⚙️ Setup Routes (Opsional)

Tambahkan ke `routes/api.php`:

```php
Route::prefix('products')->group(function () {
    Route::get('{product}/options', [ProductOptionController::class, 'index']);
    Route::post('{product}/options', [ProductOptionController::class, 'store']);
    Route::get('options/{option}', [ProductOptionController::class, 'show']);
    Route::patch('options/{option}', [ProductOptionController::class, 'update']);
    Route::delete('options/{option}', [ProductOptionController::class, 'destroy']);
    Route::post('{sourceProduct}/options/copy', [ProductOptionController::class, 'copy']);
    Route::post('options/bulk-create', [ProductOptionController::class, 'bulkCreate']);
});
```

---

## 💡 Contoh Real-World

### Produk Sepatu dengan Ukuran dan Warna

```php
use App\Models\Product;
use App\Domain\Product\Actions\CreateProductOptionsAction;

// Ambil atau buat produk
$product = Product::firstOrCreate(
    ['slug' => 'nike-air-max-90'],
    [
        'name' => 'Nike Air Max 90',
        'type' => 'variable',
        'status' => 'published'
    ]
);

// Tambah options
$action = new CreateProductOptionsAction();
$action->execute($product, [
    [
        'name' => 'Size',
        'values' => ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']
    ],
    [
        'name' => 'Color',
        'values' => ['Black', 'White', 'Red', 'Blue', 'Grey', 'Navy']
    ]
]);
```

### Produk Baju dengan Ukuran dan Material

```php
$product = Product::firstOrCreate(
    ['slug' => 'cotton-tshirt'],
    [
        'name' => 'Cotton T-Shirt',
        'type' => 'variable',
        'status' => 'published'
    ]
);

$action->execute($product, [
    [
        'name' => 'Size',
        'values' => ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    ],
    [
        'name' => 'Color',
        'values' => ['White', 'Black', 'Grey', 'Blue', 'Red']
    ],
    [
        'name' => 'Material',
        'values' => ['100% Cotton', '80% Cotton 20% Polyester']
    ]
]);
```

---

## 🔍 Debugging

### Lihat Query SQL
```php
DB::enableQueryLog();
Product::with('options.values')->get();
dd(DB::getQueryLog());
```

### Validate Data
```php
$product = Product::find(1);
echo $product->options()->count();      // Jumlah options
echo $product->options[0]->values()->count(); // Jumlah values
```

---

## 📞 Bantuan

Jika ada error atau pertanyaan:

1. Baca **PRODUCT_OPTIONS_GUIDE.md** - Dokumentasi lengkap
2. Baca **IMPLEMENTATION_SUMMARY.md** - Ringkasan teknis
3. Lihat file kode di `/app/Models` dan `/app/Domain/Product/Actions`

---

## 🚀 Checklist Setup

- [ ] Run `php artisan product-options:populate`
- [ ] Cek produk di database: `SELECT * FROM products`
- [ ] Cek options: `SELECT * FROM product_options`
- [ ] Test dengan tinker: `php artisan tinker`
- [ ] Baca dokumentasi lengkap: `PRODUCT_OPTIONS_GUIDE.md`
- [ ] Setup API routes jika diperlukan
- [ ] Test API endpoints

---

**Last Updated:** 2026-08-27
**Status:** ✅ Ready to Use
