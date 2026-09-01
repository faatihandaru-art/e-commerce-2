# Dokumen Dokumentasi: System CRUD Product Backend (Vortix Gaming Store)

Dokumen ini berisi rincian teknis backend CRUD produk untuk toko online **Vortix Gaming Store (VGS)**, termasuk konfirmasi database, daftar route, struktur data Inertia Props, cara kerja penyimpanan gambar, serta panduan integrasi untuk Rekan 2 (Frontend Form) dan Rekan 3 (Frontend Table & Storefront).

---

## 1. Konfirmasi Struktur Kolom Database Aktual

Berdasarkan pengecekan langsung pada schema database (`db_e_commerce`), berikut adalah nama-nama kolom aktual untuk setiap tabel:

### A. Tabel `products`
- `id` (bigint, Primary Key, Auto Increment)
- `brand_id` (bigint, Nullable, Foreign Key -> `brands.id`)
- `name` (varchar 255)
- `slug` (varchar 255, Unique)
- `type` (varchar, default 'simple')
- `status` (varchar, 'draft' / 'published')
- `short_description` (text, Nullable)
- `description` (text, Nullable)
- `meta_title` (varchar 255, Nullable)
- `meta_description` (text, Nullable)
- `published_at` (timestamp, Nullable)
- `deleted_at` (timestamp, Nullable -> SoftDeletes)
- `created_at`, `updated_at` (timestamp)

*Catatan: Kolom `featured` TIDAK ADA di database fisik, sehingga penanda produk baru/unggulan ditangani lewat kriteria `published_at`.*

### B. Tabel `product_images`
- `id` (bigint, Primary Key, Auto Increment)
- `product_id` (bigint, Foreign Key -> `products.id`)
- `variant_id` (bigint, Nullable, Foreign Key -> `product_variants.id`)
- `path` (varchar, menyimpan path relatif seperti `products/abc123.jpg`)
- `alt_text` (varchar, Nullable)
- `sort_order` (integer, default 0)
- `is_primary` (boolean, default false)
- `created_at` (timestamp)

### C. Tabel `product_variants`
- `id` (bigint, Primary Key, Auto Increment)
- `product_id` (bigint, Foreign Key -> `products.id`)
- `sku` (varchar 100, Unique)
- `barcode` (varchar 100, Nullable)
- `price` (bigint/numeric, Harga jual)
- `compare_at_price` (bigint/numeric, Nullable, Harga awal/sebelum diskon)
- `cost_price` (bigint/numeric, Nullable, Harga modal)
- `weight_grams` (integer/numeric, Nullable)
- `length_mm` (integer/numeric, Nullable)
- `width_mm` (integer/numeric, Nullable)
- `height_mm` (integer/numeric, Nullable)
- `status` (varchar, 'active' / 'inactive')
- `deleted_at` (timestamp, Nullable -> SoftDeletes)
- `created_at`, `updated_at` (timestamp)

### D. Tabel `categories`
- `id`, `parent_id`, `name`, `slug`, `status`, `sort_order`, `meta_title`, `meta_description`, `created_at`, `updated_at`

### E. Tabel `brands`
- `id`, `name`, `slug`, `logo`, `status`, `created_at`, `updated_at`

### F. Tabel Pivot `category_product`
- `category_id` (bigint)
- `product_id` (bigint)

---

## 2. Daftar Route Admin Product (`admin.products.*`)

Semua route dilindungi middleware `['auth', 'staff']` dengan prefix URL `/admin`:

| Method HTTP | URL Endpoint | Nama Route (`route()`) | Controller Method | Fungsi / Deskripsi |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/admin/products` | `admin.products.index` | `ProductController@index` | Menampilkan tabel paginasi daftar produk admin |
| `GET` | `/admin/products/create` | `admin.products.create` | `ProductController@create` | Menampilkan form tambah produk baru |
| `POST` | `/admin/products` | `admin.products.store` | `ProductController@store` | Menyimpan produk baru (proses upload gambar & varian) |
| `GET` | `/admin/products/{product}/edit` | `admin.products.edit` | `ProductController@edit` | Menampilkan form edit produk beserta data existing |
| `PUT/PATCH` | `/admin/products/{product}` | `admin.products.update` | `ProductController@update` | Memperbarui data produk, kelola gambar & varian |
| `DELETE` | `/admin/products/{product}` | `admin.products.destroy` | `ProductController@destroy` | Hapus produk & hapus fisik file gambar dari storage |

---

## 3. Bentuk Props Inertia pada Setiap Halaman Admin

### A. Halaman `Admin/Product/Index`
Props yang dikirim oleh `ProductController@index`:
```json
{
  "products": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "brand_id": 13,
        "name": "Vortix Wireless Pro RGB Headset",
        "slug": "vortix-wireless-pro-rgb-headset",
        "type": "simple",
        "status": "published",
        "short_description": "Headset nirkabel 2.4GHz ultra-low latency.",
        "description": "Suara surround 7.1 presisi tinggi.",
        "published_at": "2026-09-01T11:36:58.000000Z",
        "brand": {
          "id": 13,
          "name": "Vortix",
          "slug": "vortix"
        },
        "categories": [
          {
            "id": 1,
            "name": "Gaming Headsets",
            "slug": "gaming-headsets"
          }
        ],
        "images": [
          {
            "id": 1,
            "product_id": 1,
            "path": "https://images.unsplash.com/photo-1546435770-a3e426bf472b",
            "url": "https://images.unsplash.com/photo-1546435770-a3e426bf472b",
            "is_primary": true,
            "sort_order": 0
          }
        ],
        "variants": [
          {
            "id": 1,
            "product_id": 1,
            "sku": "VGS-HEADSET-01",
            "price": 1299000,
            "compare_at_price": 1599000,
            "status": "active"
          }
        ]
      }
    ],
    "per_page": 10,
    "total": 5,
    "last_page": 1
  },
  "filters": {
    "search": null,
    "status": null,
    "category_id": null
  }
}
```

### B. Halaman `Admin/Product/Create`
Props yang dikirim oleh `ProductController@create`:
```json
{
  "categories": [
    { "id": 1, "name": "Gaming Headsets", "parent_id": null, "status": "published" },
    { "id": 2, "name": "Mechanical Keyboards", "parent_id": null, "status": "published" }
  ],
  "brands": [
    { "id": 13, "name": "Vortix", "status": "active" },
    { "id": 14, "name": "Hyperion Gaming", "status": "active" }
  ]
}
```

### C. Halaman `Admin/Product/Edit`
Props yang dikirim oleh `ProductController@edit`:
```json
{
  "product": {
    "id": 1,
    "brand_id": 13,
    "name": "Vortix Wireless Pro RGB Headset",
    "slug": "vortix-wireless-pro-rgb-headset",
    "type": "simple",
    "status": "published",
    "short_description": "...",
    "description": "...",
    "brand": { "id": 13, "name": "Vortix" },
    "categories": [{ "id": 1, "name": "Gaming Headsets" }],
    "images": [
      {
        "id": 1,
        "path": "products/abc123.jpg",
        "url": "http://localhost:8000/storage/products/abc123.jpg",
        "is_primary": true,
        "sort_order": 0
      }
    ],
    "variants": [
      {
        "id": 1,
        "sku": "VGS-HEADSET-01",
        "price": 1299000,
        "compare_at_price": 1599000,
        "status": "active"
      }
    ]
  },
  "categories": [ ... ],
  "brands": [ ... ]
}
```

---

## 4. Cara Kerja Penyimpanan Gambar Produk

1. **Upload & Format Path**:
   - File dikirim dari form multipart frontend (`images[]`).
   - Action mengunggah file menggunakan `$file->store('products', 'public')`.
   - String yang disimpan di database kolom `product_images.path` adalah path relatif, contoh: `products/3f9a12b8.jpg`.
2. **Symlink Storage**:
   - Perintah `php artisan storage:link` telah dijalankan, menghubungkan `public/storage` ke `storage/app/public`.
3. **Penyusunan URL di Frontend**:
   - Model `ProductImage` menyediakan accessor `url` (`$image->url`), yang otomatis menghasilkan URL lengkap `http://localhost:8000/storage/products/3f9a12b8.jpg`.
   - Frontend React dapat menggunakan `image.url` atau `asset('storage/' + image.path)` pada tag `<img src="...">`.

---

## 5. Koneksi Halaman Customer `/products` Ke Data Real Database

- Halaman customer `/products` dan API endpoint `/api/catalog/products` telah terhubung langsung ke query Eloquent `Product::where('status', 'published')`.
- Pilihan filter (kategori, pencarian kata kunci `q`, rentang harga `minPrice`/`maxPrice`, dan produk aktif) berjalan secara real-time pada data produk database.
- Hasil format presenter `ProductPresenter::product($product)` yang diterima React:
  ```json
  {
    "id": 1,
    "name": "Vortix Wireless Pro RGB Headset",
    "slug": "vortix-wireless-pro-rgb-headset",
    "price": 1299000,
    "compareAtPrice": 1599000,
    "images": [
      "http://localhost:8000/storage/products/test_main.jpg"
    ],
    "stock": 100,
    "isNew": true,
    "badge": "Diskon",
    "brand": "Vortix",
    "variants": [ ... ]
  }
  ```

---

## 6. Alur Kerja End-to-End Produk

1. **Admin Buka Form**: Admin mengakses `/admin/products/create`. Controller mengambil daftar kategori & brand dari DB dan merender form Create.
2. **Pengisian & Submit Form**: Admin mengisi data produk (nama, deskripsi, harga, SKU varian, upload file gambar) lalu submit ke `POST /admin/products`.
3. **Validasi & Eksekusi Action**: `StoreProductRequest` menguji validasi. `CreateProductAction` menyimpan produk, file gambar ke disk `'public'`, data varian, dan sinkronisasi kategori dalam transaksi database (`DB::transaction`).
4. **Tersimpan & Redirect**: Produk tersimpan di database. Controller melakukan redirect ke `admin.products.index` dengan pesan sukses ("Produk berhasil dibuat.").
5. **Tampil di Tabel Admin**: Halaman `/admin/products` menampilkan row produk baru lengkap dengan thumbnail gambar utama, SKU, harga, dan status.
6. **Tampil di Customer Storefront**: Halaman `/products` milik customer langsung menampilkan produk tersebut dalam katalog, dapat difilter, dicari, dan dimasukkan ke keranjang belanja.
