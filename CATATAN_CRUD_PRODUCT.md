# CATATAN CRUD PRODUCT — Vortix Gaming Store (VGS)

Dokumen ini mencatat implementasi fitur CRUD Product dari sisi **Backend**, **Frontend (Form)**,
dan **Frontend (Tabel Admin & Koneksi Storefront)** agar menjadi satu alur yang nyambung.

> Dokumen ini disusun setelah bagian backend, form, dan tabel dikerjakan dan diuji bersama.
> Field-field di bawah sudah dikonfirmasi terhadap struktur database fisik (query tinker),
> bukan sekadar dari dokumen arsitektur.

---

## 1. Konfirmasi Struktur Kolom (Hasil Query Tinker)

Berikut nama kolom **sebenarnya** yang ada di database (via `Schema::getColumnListing`).

### `products`
`id, brand_id, name, slug, type, status, short_description, description, meta_title, meta_description, published_at, deleted_at, created_at, updated_at, featured`

Keterangan yang dipakai:
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

- `path` — **path relatif**. Ada dua bentuk: `images/...` (data seed/demo, relatif thd `public/`)
  dan `products/...` (hasil upload form CRUD, disimpan via Storage disk `public`).
- `sort_order` (integer) — urutan tampil.
- `is_primary` (boolean) — penanda gambar utama/cover.

### `product_variants`
`id, product_id, sku, barcode, price, compare_at_price, cost_price, weight_grams, length_mm, width_mm, height_mm, status, deleted_at, created_at, updated_at, stock`

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

Route terdaftar (grup `middleware(['auth','staff'])->prefix('admin')->name('admin.')`):

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

### `Admin/Product/Index`
Props `products` berupa paginator Laravel. Tiap item:
```json
{
  "id": 1,
  "name": "...",
  "slug": "...",
  "status": "published",
  "brand": "Logitech",
  "category_names": ["Keyboard"],
  "image": "images/products/x.jpg | products/x.jpg",
  "variants": [ { "sku": "...", "price": 250000 } ],
  "created_at": "01 Sep 2026"
}
```
`image` berupa path relatif; frontend menyusun URL lewat helper `imageUrl()` (lihat bagian Frontend Tabel).

Flash success dikirim lewat redirect ke halaman ini (mis. "Produk berhasil disimpan.").

### `Admin/Product/Create`
```json
{
  "categories": [ { "id": 1, "name": "Keyboard", "parent_id": null } ],
  "brands":     [ { "id": 1, "name": "Logitech" } ]
}
```

### `Admin/Product/Edit`
```json
{
  "product": {
    "id": 1,
    "name": "VGS Mouse Pro X",
    "slug": "vgs-mouse-pro-x",
    "brand_id": 2,
    "category_ids": [3, 4],
    "description": "Deskripsi...",
    "short_description": null,
    "status": "published",
    "images": [ { "id": 11, "url": "http://host/images/products/x.png", "sort_order": 0, "is_primary": true } ],
    "variants": [ { "id": 21, "sku": "VGS-MOUSE-PRO-X", "price": 250000, "compare_at_price": 300000 } ]
  },
  "categories": [ ... ],
  "brands":     [ ... ]
}
```
`product.images[].url` sudah **URL lengkap** siap dipakai di `<img src>`.

---

## 4. Penyimpanan Gambar (Path Relatif vs URL Lengkap)

- **Data seed/demo**: `path` seperti `/images/products/x.jpg` — file berada langsung di
  `public/images/...`. URL cukup `asset('images/...')`.
- **Upload form CRUD**: `$file->store('products', 'public')` → file di
  `storage/app/public/products/`, `path` = `products/x.jpg`. URL lewat symlink `/storage`:
  `asset('storage/products/x.jpg')`.
- `php artisan storage:link` sudah dijalankan (`public/storage` → `storage/app/public`).

Penyusunan URL dipusatkan di satu helper backend `App\Support\ProductPresenter::imageUrl()`
(yang menangani path `http`, `storage/...`, `images/...`, dan `products/...`). Frontend tabel
admin memakai helper serupa `imageUrl()` di `Index.tsx`.

---

## 5. Koneksi Halaman Customer `/products` Ke Data Real Database

- Halaman customer `/products` dan endpoint `/api/catalog/products` terhubung langsung ke query
  Eloquent `Product::where('status', 'published')`.
- Filter (kategori, pencarian kata kunci `q`, rentang harga `minPrice`/`maxPrice`, urutan `sort`)
  berjalan real-time pada data produk database.
- Hasil format presenter `ProductPresenter::product($product)` yang diterima React:
  ```json
  {
    "id": 1,
    "name": "...",
    "slug": "...",
    "categoryId": 1,
    "category": { "id": 1, "name": "Gaming Mouse", "slug": "gaming-mouse" },
    "price": 1299000,
    "compareAtPrice": 1599000,
    "images": ["http://host/images/products/x.jpg"],
    "stock": 100,
    "isNew": true,
    "isFeatured": false,
    "badge": "Diskon",
    "brand": "...",
    "variants": [ ... ],
    "specifications": { ... },
    "rating": 4.7,
    "reviewCount": 3,
    "sku": "..."
  }
  ```

---

## Frontend: Form Produk

### 1. Daftar File

| File | Keterangan |
|------|-----------|
| `resources/js/components/admin/ProductForm.tsx` | Komponen form bersama untuk Create & Edit. |
| `resources/js/pages/Admin/Product/Create.tsx` | Halaman tambah produk. |
| `resources/js/pages/Admin/Product/Edit.tsx` | Halaman edit produk. |
| `resources/js/pages/Admin/Product/Index.tsx` | Halaman daftar produk (dibahas bagian Frontend Tabel). |

### 2. Pendekatan Upload Gambar (forceFormData + method spoofing)

- **Create**: `form.post('/admin/products', { forceFormData: true })`.
- **Update (Edit)**: `form.post('/admin/products/{id}', { forceFormData: true })` dengan field
  `_method: 'PUT'` (method spoofing), menghindari keterbatasan Inertia dengan file.

Kontrak data gambar:
| Mode | Field | Isi |
|------|-------|-----|
| Create | `images` | array `File`, wajib min 1 |
| Create | `primary_index` | indeks gambar utama (0-based) |
| Edit | `kept_images` | `[{ id, sort_order }]` gambar lama yang dipertahankan |
| Edit | `new_images` | array `File` gambar baru |
| Edit | `delete_image_ids` | `[id]` gambar lama yang dihapus |
| Edit | `primary_ref` | `"existing:{id}"` atau `"new:{index}"` penanda gambar utama |

### 3. Keterbatasan Varian (catatan pengembangan lanjutan)

Varian disederhanakan menjadi satu baris **SKU + harga (+ harga coret opsional)**. Tidak dibangun
sistem `product_options` / `product_option_values` pada tahap ini sesuai izin di brief. Untuk
pengembangan lanjutan perlu ditambahkan sistem opsi/atribut kombinasi (warna × ukuran).

### 4. Konfirmasi Pengetesan

- **Backend**: `CreateProductAction`, `UpdateProductAction`, dan `DeleteProductAction` sudah diuji
  terhadap database asli (create, slug otomatis, gambar utama, varian; update maintain/hapus
  gambar; delete menghapus file fisik).
- **Frontend**: `npm run build` berhasil tanpa error.
- Route `admin.products.*` dan API `/api/catalog/*` terdaftar dengan benar.

---

## Frontend: Tabel Admin & Koneksi Storefront

Bagian ini ditambahkan sesuai BRIEF_FRONTEND_PRODUCT_TABLE.

### 1. Daftar File yang Dibuat/Diubah

| File | Keterangan |
|------|------------|
| `resources/js/pages/Admin/Product/Index.tsx` | Tabel daftar produk admin (dibuat ulang sesuai brief). |
| `app/Support/ProductPresenter.php` | Ditambah helper `imageUrl()` agar URL gambar seed & upload benar. |
| `app/Support/Admin/CatalogPresenter.php` | Penyusunan URL gambar edit memakai `ProductPresenter::imageUrl()`. |
| File backend lain (Action, Controller, Request, Route) | Konflik merge hasil `git pull` didamaikan agar app bisa boot (lihat catatan di bawah). |

### 2. Yang Dikerjakan

- **Index.tsx**: header + tombol "Tambah Produk Baru" (link ke `admin.products.create`), tabel
  dengan kolom thumbnail, nama, brand, kategori (pertama + indikator "+N"), harga (rentang bila
  beberapa varian beda harga), jumlah varian, badge status (draft vs published), aksi Edit + Hapus.
  Hapus memakai **modal konfirmasi** (komponen `Modal`, bukan `window.confirm`) sebelum request
  DELETE. Ada paginasi (Sebelumnya/Berikutnya) dan empty state dengan tombol tambah produk.
  Flash sukses ditampilkan dari redirect backend.
- **Koneksi storefront `/products`**: halaman `Storefront/Product/Index.tsx` sudah membaca data
  sungguhan dari API katalog (`getCatalog`/`getCategories`), bukan data dummy. `ProductCard`
  menerima data sesuai `ProductPresenter::product()`. Filter kategori, harga, pencarian, dan
  urutan sudah mengirim parameter ke backend dan hasilnya ter-update real-time (diverifikasi).
- **Perbaikan URL gambar**: ditemukan bahwa data seed menyimpan `path` seperti
  `/images/products/x.jpg` (file di `public/images/`) tetapi presenter lama selalu memakai
  `asset('storage/...')` sehingga gambar **tidak tampil (404)**. Ditambahkan helper
  `ProductPresenter::imageUrl()` dan `imageUrl()` di Index.tsx yang menangani path seed, upload,
  dan URL lengkap dengan benar.

### 3. Konfirmasi Hasil Uji Coba End-to-End

- **Database** berisi 15 produk dengan status `published` (15), 38 varian, 15 gambar.
- **API katalog** (`GET /api/catalog/products`) mengembalikan 200 dengan data dan URL gambar yang
  benar (diverifikasi lewat `php artisan serve` + HTTP request).
- **Filter** bekerja real-time:
  - `category=gaming-mouse` → 3 produk
  - `minPrice=500000&maxPrice=1500000` → 4 produk
  - `q=headset` → 2 produk
  - `sort=price-asc` → semua produk terurut
- **Halaman customer `/products`** menampilkan produk sungguhan (gambar, nama, harga) via API.
- **Backend tests**: `composer test` → 2/2 PASSED.
- **Frontend**: `npm run build` → sukses tanpa error.

### 4. Catatan Resolusi Konflik Merge

Setelah `git pull`, ditemukan marker konflik merge (`<<<<<<< HEAD`) yang **tertekankan ke dalam
file backend** (routes/web.php, ProductController, Create/Update/DeleteProductAction,
Store/UpdateProductRequest) sehingga app tidak bisa boot (parse error). Kedua sisi sebenarnya
implementasi alternatif dari fitur yang sama. Konflik didamaikan dengan memilih satu sisi yang
koheren dengan kontrak form yang sudah dibangun (`kept_images`/`new_images`/`delete_image_ids`/
`primary_ref` pada UpdateProductAction, serta `CatalogPresenter`). File `routes/admin.php` yang
menjadi orpan (tidak lagi di-`require` web.php) dihapus.

> Catatan scale-of-work: file `resources/js/components/admin/ProductForm.tsx` masih memunculkan
> beberapa error `tsc` (typecheck) yang bersumber dari pekerjaan rekan form, bukan dari bagian
> tabel ini. Error tersebut tidak memblokir `npm run build` (vite/esbuild). Sesuai brief, bagian
> form tidak disentuh di paket kerja ini.
