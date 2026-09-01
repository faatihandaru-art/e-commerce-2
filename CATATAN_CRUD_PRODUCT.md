<<<<<<< HEAD
# CATATAN CRUD PRODUCT — Vortix Gaming Store (VGS)

Dokumen ini mencatat implementasi fitur CRUD Product dari sisi **Backend** dan
**Frontend (Form)** yang dikerjakan bersama agar menjadi satu alur yang nyambung.

> Catatan: Dokumen ini disusun setelah bagian backend DAN frontend form dikerjakan
> sekaligus di repositori ini (per keputusan paket kerja). Field-field di bawah sudah
> dikonfirmasi terhadap struktur database fisik (query tinker), bukan sekadar dari
> dokumen arsitektur.

---

## 1. Konfirmasi Struktur Kolom (Hasil Query Tinker)

Berikut nama kolom **sebenarnya** yang ada di database (via `Schema::getColumnListing`),
dipakai pendekatan "semua field yang digunakan form sudah cocok dengan kolom ini".

### `products`
`id, brand_id, name, slug, type, status, short_description, description, meta_title, meta_description, published_at, deleted_at, created_at, updated_at, featured`

Keterangan yang dipakai form:
- `name` (string) — nama produk.
- `slug` (string, unique) — otomatis dibuat dari nama bila kosong (`Str::slug`).
- `brand_id` (nullable FK ke `brands`).
- `type` (enum `simple|variable|digital|service`, default `simple`).
- `status` (enum `draft|published|archived`, default `draft`).
- `short_description` (nullable, max 500).
- `description` (nullable, text).
- `published_at` (timestamp) — diisi `now()` saat status `published`, dikosongkan saat `draft`.

### `product_images`
`id, product_id, variant_id, path, alt_text, sort_order, is_primary, created_at`

Keterangan yang dipakai form:
- `path` — **path relatif** (mis. `products/xxxx.jpg`), disimpan lewat Storage disk `public`.
- `sort_order` (integer) — urutan tampil.
- `is_primary` (boolean) — penanda gambar utama/cover.

### `product_variants`
`id, product_id, sku, barcode, price, compare_at_price, cost_price, weight_grams, length_mm, width_mm, height_mm, status, deleted_at, created_at, updated_at, stock`

Keterangan yang dipakai form:
- `sku` (string, **unique**).
- `price` (unsignedBigInteger) — harga dalam Rupiah (tanpa desimal).
- `compare_at_price` (nullable) — harga coret/discount.
- `status` (enum `active|inactive`, default `active`).

### `categories`
`id, parent_id, name, slug, status, sort_order, meta_title, meta_description, created_at, updated_at, description, icon, image`

### `brands`
`id, name, slug, logo, status, created_at, updated_at`

### Pivot `category_product`
`category_id, product_id` (many-to-many antara produk dan kategori).

---

## 2. Route Admin Products

Berikut route yang terdaftar (dalam grup `middleware(['auth','staff'])->prefix('admin')->name('admin.')`):

| Method | URI | Nama Route | Controller Method |
|--------|-----|-----------|-------------------|
| GET | `/admin/products` | `admin.products.index` | `index()` |
| GET | `/admin/products/create` | `admin.products.create` | `create()` |
| POST | `/admin/products` | `admin.products.store` | `store()` |
| GET | `/admin/products/{product}/edit` | `admin.products.edit` | `edit()` |
| PUT/PATCH | `/admin/products/{product}` | `admin.products.update` | `update()` |
| DELETE | `/admin/products/{product}` | `admin.products.destroy` | `destroy()` |

**Controller**: `App\Http\Controllers\Admin\ProductController`.

---

## 3. Props Yang Dikirim ke Halaman Inertia

### `Admin/Product/Create`
```json
{
  "categories": [ { "id": 1, "name": "Keyboard", "parent_id": null } ],
  "brands":     [ { "id": 1, "name": "Logitech" } ]
}
```

### `Admin/Product/Edit`
=======
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
>>>>>>> 98c2ebd8d06ed9a1a4efbe10f036d25a05958aba
```json
{
  "product": {
    "id": 1,
<<<<<<< HEAD
    "name": "VGS Mouse Pro X",
    "slug": "vgs-mouse-pro-x",
    "brand_id": 2,
    "category_ids": [3, 4],
    "description": "Deskripsi...",
    "short_description": null,
    "status": "published",
    "images": [
      { "id": 11, "url": "http://host/storage/products/abc.png", "sort_order": 0, "is_primary": true }
    ],
    "variants": [
      { "id": 21, "sku": "VGS-MOUSE-PRO-X", "price": 250000, "compare_at_price": 300000 }
    ]
  },
  "categories": [ { "id": 1, "name": "Keyboard", "parent_id": null } ],
  "brands":     [ { "id": 1, "name": "Logitech" } ]
}
```

Catatan field:
- `product.images[].url` sudah **URL lengkap** (`asset('storage/'.$path)`), siap dipakai langsung di `<img src>`.
- `product.variants[].price` dalam Rupiah integer.

### `Admin/Product/Index`
Props `products` berupa paginator Laravel dengan tiap item:
```json
{
  "id": 1,
  "name": "...",
  "slug": "...",
  "status": "published",
  "brand": "Logitech",
  "category_names": ["Keyboard"],
  "image": "products/abc.png",
  "variants": [ { "sku": "...", "price": 250000 } ],
  "created_at": "01 Sep 2026"
}
```
Properti `image` berupa path relatif (buka dengan `/storage/`), `variants[].price` adalah harga varian (untuk dihitung harga mulai di tabel).

---

## 4. Penyimpanan Gambar (Path Relatif vs URL Lengkap)

- Backend menyimpan file lewat `$file->store('products', 'public')` (Storage facade, disk `public`).
- Kolom `product_images.path` berisi **path relatif** seperti `products/xxx.jpg`.
- Frontend menyusun URL tampilan: untuk form edit menggunakan `asset('storage/'.$path)` (sudah disiapkan presenter), untuk tabel index membuka `/storage/{path}`.
- Pastikan `php artisan storage:link` sudah dijalankan (symlink `public/storage` — sudah ada di project ini).

---

## 5. Alur Kerja End-to-End

1. Admin membuka menu **Catalog** (sidebar → `/admin/products`). Daftar produk tampil.
2. Klik "Tambah Produk" → halaman `Create`.
3. Isi informasi dasar, pilih kategori (minimal 1), unggah minimal 1 gambar, tandai gambar utama, tambah minimal 1 varian (SKU + harga).
4. Klik "Simpan Produk" → data dikirim multipart ke `admin.products.store`.
5. Backend `CreateProductAction` menyimpan produk, kategori (pivot), varian, dan gambar dalam satu transaksi DB.
6. Redirect ke `admin.products.index` dengan pesan sukses → produk muncul di tabel admin.
7. Untuk edit, admin membuka form edit, mengubah data, lalu `UpdateProductAction` memperbarui semuanya (termasuk hapus gambar/varian yang tidak lagi dipakai).

---

## Frontend: Form Produk

Bagian ini ditambahkan sesuai BRIEF_FRONTEND_PRODUCT_FORM dan dikerjakan bersama bagian backend.

### 1. Daftar File Yang Dibuat

| File | Keterangan |
|------|-----------|
| `resources/js/components/admin/ProductForm.tsx` | Komponen form bersama untuk Create & Edit (mode create / edit). |
| `resources/js/pages/Admin/Product/Create.tsx` | Halaman tambah produk. |
| `resources/js/pages/Admin/Product/Edit.tsx` | Halaman edit produk. |
| `resources/js/pages/Admin/Product/Index.tsx` | Halaman daftar produk (tabel) — dibuat sebagai pendamping karena store/edit redirect ke sini. |

### 2. Pendekatan Upload Gambar (forceFormData + method spoofing)

Karena form mengirim **file gambar** (multipart) dan update memakai **PUT**, kami memakai
kombinasi:

- **Create**: `form.post('/admin/products', { forceFormData: true })`. Inertia otomatis
  mengirim `FormData` saat ada objek `File` di data form.
- **Update (Edit)**: `form.post('/admin/products/{id}', { forceFormData: true })` dengan field
  `_method: 'PUT'` di dalam data form (method spoofing). Ini menghindari keterbatasan Inertia
  dengan `put()` + file, dan Laravel tetap menerimanya sebagai PUT/update.

Kontrak data gambar yang dikirim:

| Mode | Field | Isi |
|------|-------|-----|
| Create | `images` | array `File` (urutan tampil), wajib min 1 |
| Create | `primary_index` | indeks gambar utama (0-based) |
| Edit | `kept_images` | `[{ id, sort_order }]` — gambar lama yang dipertahankan, urutan tampil |
| Edit | `new_images` | array `File` — gambar baru yang ditambahkan |
| Edit | `delete_image_ids` | `[id]` — id gambar lama yang dihapus |
| Edit | `primary_ref` | `"existing:{id}"` atau `"new:{index}"` penanda gambar utama |

Alasan: memisahkan gambar lama (referensi id) dan gambar baru (File) ke array berbeda supaya
serialisasi FormData oleh Inertia berjalan benar (tidak mencampur File dengan skalar di satu array).

### 3. Keterbatasan Varian (catatan pengembangan lanjutan)

Varian produk **disederhanakan** menjadi satu baris berisi **SKU + harga (+ harga coret opsional)**.
Kami **tidak** membangun sistem `product_options` / `product_option_values` (kombinasi warna ×
ukuran yang rumit) pada tahap ini, sesuai izin di brief. Artinya satu varian = satu SKU dengan
harganya sendiri.

Untuk pengembangan lanjutan, perlu ditambahkan:
- Sistem opsi/atribut (`product_options`, `product_option_values`, pivot `product_variant_option_values`).
- Penamaan varian lebih informatif (mis. "Hitam - Wireless") yang saat ini otomatis diambil dari
  SKU/relasi di sisi storefront (`ProductPresenter::variant()`).

### 4. Konfirmasi Pengetesan

- **Backend**: `CreateProductAction`, `UpdateProductAction`, dan `DeleteProductAction` sudah diuji
  langsung (via skrip tinker sementara) terhadap database asli:
  - Create: produk tersimpan, slug otomatis, gambar tersimpan + `is_primary` sesuai pilihan, varian tersimpan.
  - Create dengan `primary_index` tidak nol: gambar terpilih ditandai utama, `published_at` terisi saat status published.
  - Update: gambar lama dipertahankan/diurutkan, gambar yang dihapus ikut terhapus, gambar baru ditambah,
    penggantian gambar utama berfungsi, kategori tersinkron, harga varian ter-update.
  - Hasil uji berhasil; data uji lalu dibersihkan (produk uji dihapus + file fisik dihapus).
- **Frontend**: `npm run build` **berhasil tanpa error** (semua halaman `Admin/Product/*` dan
  komponen `ProductForm` ter-compile).
- Route `admin.products.*` terdaftar dengan benar (`php artisan route:list`).

> Catatan terkoordinasi: karena backend/dokumentasi `CATATAN_CRUD_PRODUCT.md` ditemukan belum ada
> saat form dikerjakan, dan atas persetujuan pemilik proyek, bagian backend (Model sudah ada,
> Action, Request, Controller, Route, Presenter) ikut dibangun supaya form bisa diuji end-to-end.
> Rekan lain (tabel daftar & koneksi customer) tetap dapat memakai route `admin.products.*` dan
> props yang sudah didokumentasikan di atas.
=======
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
>>>>>>> 98c2ebd8d06ed9a1a4efbe10f036d25a05958aba
