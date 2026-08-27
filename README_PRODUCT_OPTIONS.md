# Product Options - E-Commerce 2

**Sistem lengkap untuk mengelola Product Options di aplikasi e-commerce Laravel**

---

## 📖 Apa Itu Project Ini?

Project ini menyediakan implementasi lengkap untuk **Product Options** - fitur yang memungkinkan produk memiliki beberapa pilihan seperti Size, Color, Material, dll.

### Contoh:
```
Produk: Nike Air Max 90
├── Option 1: Size
│   ├── S
│   ├── M
│   ├── L
│   └── XL
└── Option 2: Color
    ├── Red
    ├── Blue
    └── Black
```

---

## ✨ Fitur Utama

✅ **Model Eloquent** - Semua model sudah dengan relasi  
✅ **Seeder** - Contoh data 5 produk dengan options  
✅ **Console Command** - Populate data dari terminal  
✅ **REST API** - Full CRUD endpoints  
✅ **Business Logic** - Reusable Action class  
✅ **Documentation** - Panduan lengkap Bahasa Indonesia  

---

## 🚀 Instalasi Cepat

### 1. Populate Data Sample
```bash
php artisan product-options:populate
```

### 2. Test dengan Tinker
```bash
php artisan tinker
>>> $product = App\Models\Product::with('options.values')->first();
>>> $product->options;
```

### 3. Gunakan di Code
```php
use App\Models\Product;
use App\Domain\Product\Actions\CreateProductOptionsAction;

$product = Product::find(1);
$action = new CreateProductOptionsAction();

$options = $action->execute($product, [
    ['name' => 'Size', 'values' => ['S', 'M', 'L']],
    ['name' => 'Color', 'values' => ['Red', 'Blue']]
]);
```

---

## 📁 Struktur File

```
e-commerce-2/
├── app/
│   ├── Models/
│   │   ├── Product.php                    (Model Produk)
│   │   ├── ProductOption.php              (Model Opsi)
│   │   ├── ProductOptionValue.php         (Model Nilai Opsi)
│   │   ├── ProductVariant.php             (Model Varian)
│   │   ├── ProductImage.php               (Model Gambar)
│   │   └── Brand.php                      (Model Brand)
│   │
│   ├── Domain/Product/Actions/
│   │   └── CreateProductOptionsAction.php (Business Logic)
│   │
│   ├── Console/Commands/
│   │   └── PopulateProductOptionsCommand.php (CLI Command)
│   │
│   └── Http/Controllers/Api/Product/
│       └── ProductOptionController.php    (REST API)
│
├── database/seeders/
│   ├── ProductOptionSeeder.php            (Data Seeder)
│   └── DatabaseSeeder.php                 (Updated)
│
├── QUICK_REFERENCE.md                     (Referensi Cepat) ⭐
├── PRODUCT_OPTIONS_GUIDE.md               (Panduan Lengkap) ⭐
├── IMPLEMENTATION_SUMMARY.md              (Ringkasan Teknis)
├── DATA_STRUCTURE_DIAGRAM.md              (Diagram Relasi)
└── README.md                              (File ini)
```

---

## 📚 Dokumentasi

Silakan baca dokumentasi sesuai kebutuhan:

| File | Untuk | Isi |
|------|-------|-----|
| **QUICK_REFERENCE.md** ⭐ | Penggunaan cepat | Commands, code snippets, API examples |
| **PRODUCT_OPTIONS_GUIDE.md** ⭐ | Panduan lengkap | Setup, API docs, troubleshooting |
| **IMPLEMENTATION_SUMMARY.md** | Ringkasan teknis | File structure, checklist, technical details |
| **DATA_STRUCTURE_DIAGRAM.md** | Memahami struktur | ER diagram, relationships, database schema |

---

## 🔥 Quick Examples

### Get Products dengan Options
```php
$products = Product::with('options.values')->get();

foreach ($products as $product) {
    echo $product->name;
    foreach ($product->options as $option) {
        echo "  - {$option->name}";
    }
}
```

### Create Options untuk Satu Produk
```php
$action = new CreateProductOptionsAction();
$options = $action->execute($product, [
    ['name' => 'Size', 'values' => ['S', 'M', 'L', 'XL']],
    ['name' => 'Color', 'values' => ['Red', 'Blue', 'Green']],
    ['name' => 'Material', 'values' => ['Cotton', 'Polyester']]
]);
```

### Copy Options Antar Produk
```php
$sourceProduct = Product::find(1);
$targetProduct = Product::find(2);
$action->copyFromProduct($sourceProduct, $targetProduct);
```

### Bulk Create untuk Multiple Produk
```php
$results = $action->executeBulk([
    [
        'product_id' => 1,
        'options' => [
            ['name' => 'Size', 'values' => ['S', 'M', 'L']]
        ]
    ],
    [
        'product_id' => 2,
        'options' => [
            ['name' => 'Color', 'values' => ['Red', 'Blue']]
        ]
    ]
]);
```

---

## 🌐 REST API

### Setup Routes
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

### Endpoints

**1. GET /api/products/{product}/options**
```bash
curl -X GET "http://localhost/api/products/1/options"
```

**2. POST /api/products/{product}/options**
```bash
curl -X POST "http://localhost/api/products/1/options" \
  -H "Content-Type: application/json" \
  -d '{
    "options": [
      {"name": "Size", "values": ["S", "M", "L"]}
    ]
  }'
```

**3. PATCH /api/products/options/{option}**
```bash
curl -X PATCH "http://localhost/api/products/options/1" \
  -H "Content-Type: application/json" \
  -d '{"name": "Ukuran"}'
```

**4. POST /api/products/{sourceProduct}/options/copy**
```bash
curl -X POST "http://localhost/api/products/1/options/copy" \
  -H "Content-Type: application/json" \
  -d '{"target_product_id": 2}'
```

---

## 📊 Database Schema

### products
```sql
id | brand_id | name | slug | type | status | published_at | created_at
```

### product_options
```sql
id | product_id | name | sort_order
```

### product_option_values
```sql
id | option_id | value | sort_order
```

---

## 🎯 Sample Data setelah Seeding

### Brands (4)
- Nike
- Adidas  
- Puma
- Reebok

### Products (5)
1. **Nike Air Max 90**
   - Options: Size (6-12), Color (4 warna)

2. **Adidas Ultraboost**
   - Options: Size (6-12), Color (4 warna)

3. **Puma RS-X**
   - Options: Size (5-11), Color (3 warna)

4. **Reebok Classic Leather**
   - Options: Size (6-11), Color (3 warna)

5. **Cotton T-Shirt**
   - Options: Size (XS-XXL), Color (5 warna)

---

## 🔧 Action Class Methods

### CreateProductOptionsAction

#### execute()
Membuat options untuk satu produk
```php
$action->execute($product, $optionsData)
```

#### executeBulk()
Membuat options untuk multiple produk
```php
$action->executeBulk($productsData)
```

#### copyFromProduct()
Copy options dari satu produk ke produk lain
```php
$action->copyFromProduct($sourceProduct, $targetProduct)
```

---

## 🧪 Testing

### Dengan Tinker
```bash
php artisan tinker
```

```php
# Get semua produk
App\Models\Product::all();

# Get produk dengan options
$p = App\Models\Product::with('options.values')->find(1);

# Lihat options
$p->options;

# Lihat values dari option pertama
$p->options[0]->values;

# Create options
$action = new App\Domain\Product\Actions\CreateProductOptionsAction();
$action->execute($p, [['name' => 'Material', 'values' => ['Cotton', 'Wool']]]);

# Copy options
$action->copyFromProduct(App\Models\Product::find(1), App\Models\Product::find(2));

# Exit
exit
```

---

## 🛠️ Console Commands

### Populate Product Options
```bash
php artisan product-options:populate

# Dengan force flag (tanpa konfirmasi)
php artisan product-options:populate --force
```

Output:
```
Memulai populate product options...

Command ini akan:
  1. Membuat data brand jika belum ada
  2. Membuat 5 produk sample dengan opsi
  3. Menambahkan opsi dan nilai ke setiap produk

Lanjutkan? (yes/no) [yes]: yes

✓ Product options berhasil di-populate!
  - 4 brand telah dibuat
  - 5 produk dengan opsi telah dibuat
```

---

## 📝 Model Relationships

```php
// Product
$product->brand()      // BelongsTo Brand
$product->options()    // HasMany ProductOption
$product->variants()   // HasMany ProductVariant
$product->images()     // HasMany ProductImage

// ProductOption
$option->product()     // BelongsTo Product
$option->values()      // HasMany ProductOptionValue

// ProductOptionValue
$value->option()       // BelongsTo ProductOption
```

---

## ⚡ Performance Tips

### Eager Loading
```php
// ✅ GOOD - Menggunakan eager loading
$products = Product::with('options.values')->get();

// ❌ BAD - N+1 query problem
$products = Product::all();
foreach ($products as $product) {
    $product->options; // Extra query!
}
```

### Caching
```php
$options = Cache::remember(
    "product_{$productId}_options",
    86400, // 24 hours
    fn() => Product::find($productId)->options()->with('values')->get()
);
```

---

## 🐛 Troubleshooting

### Command tidak ditemukan?
Pastikan file sudah di-save dan jalankan:
```bash
php artisan list
```

### Data tidak ter-seed?
Cek koneksi database dan jalankan migration:
```bash
php artisan migrate
```

### Duplikasi data?
Tidak akan terjadi karena seeder menggunakan `firstOrCreate`.

### Query lambat?
Gunakan eager loading seperti contoh di atas.

---

## 📋 Checklist

- [x] Models dibuat (6 files)
- [x] Action class dibuat (1 file)
- [x] Seeder dibuat (1 file)
- [x] Console command dibuat (1 file)
- [x] API controller dibuat (1 file)
- [x] Dokumentasi lengkap (4 files)
- [x] DatabaseSeeder diupdate
- [x] Sample data tersedia
- [x] Semua relasi sudah benar

---

## 🚀 Next Steps

1. **Review Files**
   ```bash
   ls -la app/Models/
   ls -la app/Domain/Product/Actions/
   ```

2. **Run Seeder**
   ```bash
   php artisan product-options:populate
   ```

3. **Verify Data**
   ```bash
   php artisan tinker
   >>> App\Models\Product::with('options.values')->get();
   ```

4. **Read Documentation**
   - QUICK_REFERENCE.md
   - PRODUCT_OPTIONS_GUIDE.md

5. **Setup API Routes** (opsional)
   ```bash
   # Edit routes/api.php dan add routes
   ```

6. **Customize**
   - Ubah ProductOptionSeeder.php dengan data Anda
   - Customize API responses
   - Add validations jika perlu

---

## 📞 Support

Jika ada pertanyaan atau error:

1. Lihat **QUICK_REFERENCE.md** - Jawaban cepat
2. Lihat **PRODUCT_OPTIONS_GUIDE.md** - Dokumentasi lengkap
3. Lihat **DATA_STRUCTURE_DIAGRAM.md** - Memahami relasi data
4. Check file source code di `/app/Models` dan `/app/Domain`

---

## 📄 License

Implementasi ini dibuat untuk keperluan project e-commerce.

---

## 👨‍💻 Created By

**GitHub Copilot**  
Date: 2026-08-27  
Version: 1.0.0  
Status: ✅ Production Ready

---

## 🎉 Selamat Menggunakan!

Semoga implementasi Product Options ini membantu mempercepat development aplikasi e-commerce Anda.

**Happy Coding! 🚀**

---

### Quick Links
- 📖 [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Referensi Cepat
- 📘 [PRODUCT_OPTIONS_GUIDE.md](./PRODUCT_OPTIONS_GUIDE.md) - Panduan Lengkap
- 📊 [DATA_STRUCTURE_DIAGRAM.md](./DATA_STRUCTURE_DIAGRAM.md) - Diagram & Schema
- 📋 [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Ringkasan Teknis
