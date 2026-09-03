# CATATAN INVENTORY

Catatan teknis fitur **Inventory / stok** di Vortix Gaming Store (VGS).
Dokumen ini menjelaskan struktur data, bagaimana stok dipisah dari `product_variants`
ke tabel `inventories`, halaman admin, dan cara data dikirim ke frontend.

---

## Latar Belakang

Sebelumnya stok varian disimpan langsung di kolom `product_variants.stock`.
Fitur inventori memisahkan stok ke tabel sendiri per **varian × gudang**
(`inventories`), sehingga mendukung banyak gudang dan status stok (normal/menipis/habis).

Stok yang ditampilkan di storefront, halaman admin produk, dan halaman inventori
kini **bersumber dari tabel `inventories`**, bukan lagi kolom `stock` di variant.

---

## Struktur Tabel Baru

### `warehouses`
Gudang fisik tempat stok disimpan.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint (PK) | |
| name | string(150) | Nama gudang |
| code | string(30) | Kode unik (mis. `WH-MAIN`) |
| address | string(500) | Alamat (opsional) |
| status | enum | `active` / `inactive` |
| timestamps | | |

### `inventories`
Catatan stok per varian per gudang.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint (PK) | |
| warehouse_id | FK → warehouses | |
| product_variant_id | FK → product_variants | |
| quantity_on_hand | integer | Stok fisik saat ini |
| quantity_reserved | integer | Stok yang direservasi |
| reorder_level | integer | Ambang "stok menipis" |
| timestamps | | |

Unik gabungan `(warehouse_id, product_variant_id)` — satu varian satu baris per gudang.

### Status stok (dihitung, bukan kolom)
- **normal** : `quantity_on_hand - quantity_reserved > reorder_level`
- **low** (menipis) : `0 < (on_hand - reserved) <= reorder_level`
- **out** (habis) : `quantity_on_hand - quantity_reserved <= 0`

---

## Model & Method

### `App\Models\Warehouse`
- `inventories()` : HasMany → `Inventory`

### `App\Models\Inventory`
- `warehouse()` : BelongsTo `Warehouse`
- `variant()` : BelongsTo `ProductVariant` (via `product_variant_id`)
- `available()` : `quantity_on_hand - quantity_reserved`
- `status()` : `'out'` | `'low'` | `'normal'`

### `App\Models\ProductVariant`
- `inventories()` : HasMany → `Inventory`
- `totalStock()` : jumlah `quantity_on_hand` dari seluruh gudang varian ini.
  **Ini dipakai storefront** (`ProductPresenter::variant`).

### `App\Models\Product`
- `inventories()` : HasManyThrough (product → variant → inventory)
- `totalStock()` : jumlah `quantity_on_hand` seluruh varian & seluruh gudang.
  **Ini dipakai storefront** (`ProductPresenter::product`) untuk badge / label stok.

---

## Route & Controller

### Route (`routes/admin.php`)
```
GET  admin/inventory  → Admin\InventoryController@index  (name: admin.inventory.index)
```
dilindungi middleware `auth` + `staff`, prefix `/admin`, nama `admin.inventory.index`.

### `Admin\InventoryController@index`
Mendukung filter query:
- `search` : cari nama produk / SKU
- `warehouse` : filter id gudang
- `lowStock` : tampilkan hanya stok menipis/habis (`on_hand <= reorder_level`)

**Props yang dikirim ke halaman `Admin/Inventory/Index`:**

```js
inventories: {
  data: [{
    id, product_name, sku, warehouse_name,
    quantity_on_hand, quantity_reserved, reorder_level,
    status,             // 'normal' | 'low' | 'out'
    updated_at,
  }],
  current_page, last_page, total, per_page, ...
},
warehouses: [{ id, name }],          // gudang aktif untuk filter dropdown
stats: {
  total_variants,                    // jumlah baris inventory terfilter
  low_stock,                         // on_hand > 0 dan <= reorder_level
  out_of_stock,                      // on_hand <= 0
},
filters: { search, warehouse, lowStock }
```

---

## Migrasi Data dari Stok Lama → Inventori

Migrasi `2026_09_03_000003_seed_inventory_from_variant_stock`:
1. Membuat gudang default (kode `WH-MAIN`, nama "Gudang Utama").
2. Menyalin `product_variants.stock` → `inventories.quantity_on_hand` per varian.
   (tidak menyentuh kolom `stock` lama, biar data lama aman).
3. `reorder_level` default = 3.

Kolom `product_variants.stock` **sengaja dipertahankan** (tidak di-drop) untuk
sekarang, agar memudahkan rollback dan tidak merusak logic order/cart lama yang
masih membacanya. Pembersihan lengkap bisa dilakukan tahap berikutnya.

---

## Sinkronisasi Stok dari Form Produk

Saat produk dibuat/diubah lewat form admin (Create/Edit Product), nilai `stock`
yang diisi di form disalin ke `inventories` gudang default via
`CreateProductAction` dan `UpdateProductAction` (method `syncVariantInventory`).
Dengan begitu stok yang diinput di form CRUD produk tetap tampil konsisten di
halaman inventory & storefront.

> Catatan: cara ini bersifat *sementara* agar konsisten sampai Rekan lain
> membangun modal "Sesuaikan Stok" yang menjadi sumber kelola stok utama.

---

## Frontend: Tabel Inventory & Koneksi Produk

### 1. Halaman baru `resources/js/pages/Admin/Inventory/Index.tsx`
Dibungkus `AdminLayout`. Isi:
- **Header** "Kelola Inventory" + jumlah varian.
- **3 kartu ringkasan** (Total Varian, Stok Menipis, Stok Habis) dari prop `stats`.
- **Filter**: search nama produk/SKU, dropdown gudang, toggle "Hanya stok menipis".
- **Tabel**: nama produk + SKU, nama gudang, stok saat ini, stok direservasi,
  status (Badge: hijau/kuning/merah), aksi "Sesuaikan Stok".
- **Paginasi** mengikuti pola `Admin/Product/Index`.
- **State kosong** jika belum ada data.

### 2. Tampilan stok di halaman admin produk (`Admin/Product/Index.tsx`)
Sudah menampilkan total stok dari relasi inventory:
- Backend `ProductController@index` mengirim `total_stock` (produk) dan
  `stock` per varian yang dihitung dari `quantity_on_hand` (inventories).
- Frontend menampilkan `product.total_stock` (fallback ke jumlah `variant.stock`).
- Visual tabel tidak diubah — hanya sumber datanya.

### 3. Stok di storefront customer
`app/Support/ProductPresenter.php` sudah memakai `$product->totalStock()` dan
`$variant->totalStock()`, sehingga stok di katalog & detail produk otomatis
berasal dari inventori. Tampilan visual (badge "Stok Terbatas", label "Sisa n")
tidak diubah; hanya sumbernya yang kini dari inventory.

### 4. Link Sidebar
Menu **Inventory** di `components/admin/Sidebar.tsx` diaktifkan:
`href: '/admin/inventory'` (sebelumnya placeholder `#`).
Menu lain yang masih placeholder (Orders, Customers, Marketing, dst) **tidak**
diubah.

### 5. Tombol "Sesuaikan Stok" (STUB)
Komponen `AdjustStockModal.tsx` (tugas Rekan lain) **belum ada**. Tombol
"Sesuaikan Stok" di tabel dibuat sebagai **stub** non-fungsional (disabled)
dengan komentar `TODO (Rekan 2)`, sesuai kesepakatan — jangan membangun isi
modal sendiri.

---

## Ringkasan File yang Dibuat / Diubah

**Backend**
- `database/migrations/2026_09_03_000001_create_warehouses_table.php` (baru)
- `database/migrations/2026_09_03_000002_create_inventories_table.php` (baru)
- `database/migrations/2026_09_03_000003_seed_inventory_from_variant_stock.php` (baru)
- `app/Models/Warehouse.php` (baru)
- `app/Models/Inventory.php` (baru)
- `app/Models/ProductVariant.php` (+ `inventories()`, `totalStock()`)
- `app/Models/Product.php` (+ `inventories()`, `totalStock()`)
- `app/Http/Controllers/Admin/InventoryController.php` (baru)
- `app/Http/Controllers/Admin/ProductController.php` (stok dari inventory)
- `app/Domain/Catalog/Actions/CreateProductAction.php` (+ sinkron inventory)
- `app/Domain/Catalog/Actions/UpdateProductAction.php` (+ sinkron inventory)
- `routes/admin.php` (+ route `admin.inventory.index`)

**Frontend**
- `resources/js/pages/Admin/Inventory/Index.tsx` (baru)
- `resources/js/components/admin/Sidebar.tsx` (aktifkan link Inventory)

---

## Hasil Uji Coba End-to-End

Diuji dengan menjalankan controller langsung (simulasi request):
- `admin.inventory.index` → component `Admin/Inventory/Index`, total **11** baris.
- Filter/props (`inventories`, `warehouses`, `stats`, `filters`) terisi benar.
- Stats: 11 total varian, 0 menipis, 7 habis (sesuai data seed).
- **Konsistensi stok** divalidasi otomatis:
  - Storefront (`ProductPresenter`) vs jumlah `quantity_on_hand` inventory → **OK** untuk semua produk.
  - Admin `ProductController@index` (`total_stock` per varian) vs inventory → **OK**.
- `npm run typecheck` → lulus, tidak ada error TypeScript.
- `npm run build` → berhasil, halaman Inventory ter-bundle.

### Belum diuji (menunggu Rekan lain)
- Penyesuaian stok via modal `AdjustStockModal.tsx` (belum dibuat).
- Perubahan stok real-time lewat UI saat modal submit (belum ada modal).
