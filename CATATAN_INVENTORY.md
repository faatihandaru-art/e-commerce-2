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

---

# Dokumentasi Backend Inventory

Dokumentasi hasil pengerjaan modul Inventory oleh AI Backend, mengikuti
`BRIEF_BACKEND_INVENTORY.txt`. Berlaku untuk tim (Rekan 2 & 3 frontend dan siapa
pun yang menyentuh stok).

## 1. Verifikasi Migrasi Data Stok

Data stok lama tersimpan di kolom `product_variants.stock`. Sebelum dipindah,
total stok dihitung dari kolom tersebut:

- Jumlah varian dengan stok > 0: **4 varian**
- Total stok sebelum (jumlah `product_variants.stock`): **156**

Semua baris dipindah ke tabel `inventories` dengan gudang default **MAIN**
(Gudang Utama) menggunakan Artisan command sekali-jalan
`inventory:migrate-existing-stock`:

| variant_id | SKU            | stock lama | quantity_on_hand baru |
|------------|----------------|------------|------------------------|
| 1          | VGS-APEX-BLK-V2 | 42       | 42                    |
| 5          | VGS-MON-OLED27  | 20       | 20                    |
| 10         | TNK-STOCK-0002  | 77       | 77                    |
| 11         | UJI-FINAL-0001  | 17       | 17                    |

**Verifikasi:** Total `inventories.quantity_on_hand` setelah migrasi = **156**.
Sama persis dengan total sebelum migrasi (156). **COCOK ✓** — tidak ada data
stok yang hilang.

> Catatan: Kolom `product_variants.stock` TIDAK dihapus (jaring pengaman),
> tetapi aplikasi sudah berhenti menulis ke kolom tersebut. Input stock pada
> form Produk sudah dihapus (lihat poin 5).

## 2. Tabel Baru yang Dibuat (melengkapi dokumen arsitektur)

Berdasarkan pengecekan `Schema::hasTable()`, semua tabel berikut **sebelumnya
belum ada** di database dan sekarang sudah dibuat. Ada DUA seri migration di
project; kami memakai seri `2026_08_31_030712_*` yang sudah tersedia (sesuai
keputusan) dengan penyesuaian kecil.

### Kategori Inventory (dipakai fitur ini)
| Tabel | Status | Keterangan |
|-------|--------|------------|
| `warehouses` | Lengkap + Model + Controller | Struktur disesuaikan: `address` text, `code` varchar(50), ada timestamps |
| `inventories` | Lengkap + Model + Controller | Kolom FK memakai **`variant_id`** (bukan `product_variant_id`) agar konsisten dengan `cart_items`, `inventory_movements`, `stock_reservations`. FK ke `product_variants` dan `warehouses` pakai `ON DELETE CASCADE`. Unique composite `(warehouse_id, variant_id)` |
| `inventory_movements` | Lengkap + Model | Audit trail. Ditambah kolom `reason` dan `created_by` (FK `users`, nullOnDelete) |
| `stock_reservations` | Struktur saja (belum ada logic) | Disiapkan untuk fitur reservasi stok di Fase 4. Belum dibangun logic otomatisnya |

### Kategori lain (struktur dasar saja, tanpa Model/Controller)
Tabel berikut dibuat hanya strukturnya (untuk setup database lengkap dari nol
dan pekerjaan fase berikutnya sesuai roadmap). Belum ada Model/Controller.

- **Pembayaran:** `payment_transactions`
- **Webhook:** `webhook_logs` (unique composite provider+event_id)
- **Pengiriman:** `shipments`, `shipment_items`
- **Refund:** `refunds`, `refund_items`
- **Retur:** `returns`, `return_items`
- **Promosi lanjutan:** `promotions`, `promotion_rules`, `promotion_actions`
  (mengingat `coupons` sudah ada dan dianggap cukup untuk tahap ini — tabel
  promosi lanjutan ini disiapkan strukturnya, logicnya belum diimplementasikan)
- **Wishlist:** `wishlists`, `wishlist_items`
- **Pengaturan:** `settings` (key-value konfigurasi toko)
- **CMS:** `pages`
- **Export:** `exports` (riwayat export laporan)
- **Catatan pelanggan:** `customer_notes`

> Yang SUDAH ADA sebelumnya (tidak dibuat ulang): `audit_logs`, `coupons`,
> `banners`, `roles`, `permissions`, dll.

## 3. Route Baru

Semua route berada di `routes/admin.php` (dalam grup
`middleware(['auth','staff'])` -> `prefix('admin')`):

| Method | URI                            | Nama                | Action |
|--------|--------------------------------|---------------------|--------|
| GET    | `/admin/inventory`             | `admin.inventory.index`  | Tampilkan daftar stok per varian per gudang |
| POST   | `/admin/inventory/{inventory}/adjust` | `admin.inventory.adjust` | Penyesuaian stok dengan alasan |
| GET    | `/admin/warehouses`            | `admin.warehouses.index` | Daftar gudang |
| POST   | `/admin/warehouses`            | `admin.warehouses.store` | Tambah gudang |
| PUT    | `/admin/warehouses/{warehouse}`| `admin.warehouses.update`| Perbarui gudang |
| DELETE | `/admin/warehouses/{warehouse}`| `admin.warehouses.destroy`| Hapus gudang |

WarehouseController bersifat CRUD sederhana (buka modal/form di halaman yang
sama, tidak ada halaman create/edit terpisah).

## 4. Bentuk Props Halaman `Admin/Inventory/Index`

Kontroller `InventoryController@index` mengirim prop `inventories` (array).
Contoh JSON konkret:

```json
{
  "inventories": [
    {
      "id": 1,
      "warehouse_id": 1,
      "warehouse_name": "Gudang Utama",
      "variant_id": 1,
      "sku": "VGS-APEX-BLK-V2",
      "product_name": "Vortix Apex Pro Wireless Headset (Updated V2)",
      "quantity_on_hand": 42,
      "quantity_reserved": 0,
      "available_quantity": 42,
      "reorder_level": 5,
      "is_low": false,
      "is_out_of_stock": false
    }
  ]
}
```

Penjelasan field:
- `quantity_on_hand` — stok fisik total di gudang itu.
- `quantity_reserved` — stok yang ditahan pesanan (belum diisi logic; 0).
- `available_quantity` — `quantity_on_hand - quantity_reserved`.
- `is_low` — `true` saat stok menipis (`quantity_on_hand <= reorder_level` dan
  `> 0`). Untuk indikator "stok menipis" di dashboard.
- `is_out_of_stock` — `true` saat `quantity_on_hand <= 0`.
- `product_name` bisa `null` (varian tidak terhubung produk yang valid).

Form penyesuaian stok mengirim ke `admin.inventory.adjust` dengan method POST
dan body: `{ "quantity": <int, bukan 0>, "reason": "<string>" }`.
`quantity` positif = tambah stok, negatif = kurangi stok. **Hasil akhir tidak
boleh negatif** (akan ditolak dengan pesan error).

Halaman `Admin/Inventory/Warehouses` menerima prop `warehouses`:
```json
{
  "warehouses": [
    { "id": 1, "name": "Gudang Utama", "code": "MAIN", "address": "...", "status": "active" }
  ]
}
```

## 5. Field Stock DIHAPUS dari Form Produk

Pada **backend** form Produk (Langkah 10 brief):
- Validasi `variants.*.stock` dihapus dari `StoreProductRequest` dan
  `UpdateProductRequest`.
- Logika tulis `stock` dihapus dari `CreateProductAction` dan
  `UpdateProductAction` (varian produk TIDAK lagi menulis ke `product_variants.stock`).
- `stock` dihapus dari `$fillable` dan `$casts` model `ProductVariant`.

**Peringatan untuk Rekan 2 & 3 (frontend):** Hapus juga input/kolom *stock*
pada form **Tambah/Edit Produk** (`Admin/Product/Create` & `Edit`) dan
jangan lagi mengirim field `stock` per varian. Stok sekarang di kelola
sepenuhnya di halaman **Inventory** (modul terpisah). Kolom `product_variants.stock`
masih ada di database sebagai jaring pengaman, tapi tidak lagi dipakai/tulis.

Catatan tambahan: alur *cart/checkout* yang lama masih membaca
`product_variants.stock` — ini bagian dari jaring pengaman dan penggantian ke
sistem reservasi berbasis `inventories` adalah pekerjaan Fase 4 terpisah,
bukan bagian brief ini.

## 6. Alur Kerja End-to-End

1. Admin membuka menu **Inventory** (`admin.inventory.index`).
2. Halaman menampilkan stok per varian per gudang (dengan nama produk, SKU,
   jumlah, dan status "stok menipis" / "habis").
3. Admin mengklik "Sesuaikan stok" pada satu baris, mengisi **jumlah**
   (positif/negatif) dan **alasan**.
4. Submit ke `admin.inventory.adjust` -> `AdjustStockAction` menambah/mengurangi
   `quantity_on_hand` di `inventories` (dengan `lockForUpdate()` di dalam
   transaksi) dan mencatat satu baris **`inventory_movements`** (tipe, sebelum,
   sesudah, alasan, user).
5. Total stok gabungan otomatis bisa ditampilkan di halaman produk melalui
   `ProductVariant::totalStock()` (jumlah `quantity_on_hand` dari semua gudang).

## File Penting yang Dibuat/Diubah

**Dibuat:**
- Migration: `2026_09_03_040355_add_reason_and_created_by_to_inventory_movements_table.php`
- `app/Models/Warehouse.php`, `app/Models/Inventory.php`, `app/Models/InventoryMovement.php`
- `app/Domain/Inventory/Actions/AdjustStockAction.php`
- `app/Http/Controllers/Admin/InventoryController.php`, `app/Http/Controllers/Admin/WarehouseController.php`
- `app/Http/Requests/Admin/AdjustInventoryRequest.php`, `StoreWarehouseRequest.php`, `UpdateWarehouseRequest.php`
- `app/Console/Commands/MigrateExistingStockToInventoryCommand.php`
- `database/seeders/WarehouseSeeder.php`

**Diubah:**
- `routes/admin.php` (tambah inventory + warehouses)
- `app/Models/ProductVariant.php` (relasi `inventories`, helper `totalStock()`, hapus `stock` dari fillable/casts)
- `app/Domain/Catalog/Actions/CreateProductAction.php`, `UpdateProductAction.php` (hapus tulis `stock`)
- `app/Http/Requests/Admin/StoreProductRequest.php`, `UpdateProductRequest.php` (hapus validasi `stock`)
- `database/seeders/DatabaseSeeder.php` (daftarkan `WarehouseSeeder`)
- Migration seri `030712` untuk `warehouses` & `inventories` (penyesuaian struktur sesuai brief)
