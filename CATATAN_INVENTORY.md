# CATATAN INVENTORY

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
