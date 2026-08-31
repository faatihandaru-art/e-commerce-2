# CATATAN MIGRATION LENGKAP — Vortix Gaming Store (VGS)

Dokumen ini mencatat proses rekonsiliasi migration Laravel dengan struktur
database fisik `db_e_commerce` yang sudah ada, supaya rekan tim bisa
`git clone` + `migrate` dan mendapatkan struktur yang persis sama.

---

## 1. Ringkasan Angka

| Hal | Jumlah |
|---|---|
| Total tabel di database fisik (`db_e_commerce`) | **65 tabel** |
| Migration yang sudah ada di awal | **4 file** (mencakup 9 tabel: users, password_reset_tokens, sessions, cache, cache_locks, jobs, job_batches, failed_jobs, customer_addresses) |
| Tabel sistem `migrations` (dikelola Laravel, bukan tabel bisnis) | 1 |
| Tabel bisnis yang butuh dibuatkan migration | **55 tabel** |
| **File migration baru yang dihasilkan** | **98 file** (55 file `_create_..._table` + 43 file `_add_foreign_keys_to_...`) |
| Total file migration di project setelah proses | **102 file** |

Semua 55 tabel bisnis yang tersisa berhasil dibuatkan migration-nya. Tidak
ada tabel yang terlewat dan tidak ada tabel ekstra.

---

## 2. Daftar 98 File Migration Baru

Semua file baru menggunakan prefix tanggal `2026_08_31_030712` (untuk
pembuatan tabel) dan `2026_08_31_030715` (untuk penambahan foreign key).

### 2a. File pembuatan tabel (55 file `_create_..._table`)

```
2026_08_31_030712_create_audit_logs_table.php
2026_08_31_030712_create_banners_table.php
2026_08_31_030712_create_brands_table.php
2026_08_31_030712_create_cart_items_table.php
2026_08_31_030712_create_carts_table.php
2026_08_31_030712_create_categories_table.php
2026_08_31_030712_create_category_product_table.php        (pivot)
2026_08_31_030712_create_coupon_categories_table.php       (pivot)
2026_08_31_030712_create_coupon_products_table.php         (pivot)
2026_08_31_030712_create_coupon_usages_table.php
2026_08_31_030712_create_coupons_table.php
2026_08_31_030712_create_customer_notes_table.php
2026_08_31_030712_create_exports_table.php
2026_08_31_030712_create_inventories_table.php
2026_08_31_030712_create_inventory_movements_table.php
2026_08_31_030712_create_inventory_transfer_items_table.php
2026_08_31_030712_create_inventory_transfers_table.php
2026_08_31_030712_create_order_addresses_table.php
2026_08_31_030712_create_order_adjustments_table.php
2026_08_31_030712_create_order_items_table.php
2026_08_31_030712_create_order_notes_table.php
2026_08_31_030712_create_order_status_histories_table.php
2026_08_31_030712_create_orders_table.php
2026_08_31_030712_create_pages_table.php
2026_08_31_030712_create_payment_transactions_table.php
2026_08_31_030712_create_payments_table.php
2026_08_31_030712_create_permission_role_table.php         (pivot)
2026_08_31_030712_create_permissions_table.php
2026_08_31_030712_create_product_images_table.php
2026_08_31_030712_create_product_option_values_table.php
2026_08_31_030712_create_product_options_table.php
2026_08_31_030712_create_product_reviews_table.php
2026_08_31_030712_create_product_tag_table.php             (pivot)
2026_08_31_030712_create_product_tags_table.php
2026_08_31_030712_create_product_variant_option_values_table.php
2026_08_31_030712_create_product_variants_table.php
2026_08_31_030712_create_products_table.php
2026_08_31_030712_create_promotion_actions_table.php
2026_08_31_030712_create_promotion_rules_table.php
2026_08_31_030712_create_promotions_table.php
2026_08_31_030712_create_refund_items_table.php
2026_08_31_030712_create_refunds_table.php
2026_08_31_030712_create_return_items_table.php
2026_08_31_030712_create_returns_table.php
2026_08_31_030712_create_role_user_table.php               (pivot)
2026_08_31_030712_create_roles_table.php
2026_08_31_030712_create_settings_table.php
2026_08_31_030712_create_shipment_items_table.php
2026_08_31_030712_create_shipments_table.php
2026_08_31_030712_create_shipping_methods_table.php
2026_08_31_030712_create_stock_reservations_table.php
2026_08_31_030712_create_warehouses_table.php
2026_08_31_030712_create_webhook_logs_table.php
2026_08_31_030712_create_wishlist_items_table.php
2026_08_31_030712_create_wishlists_table.php
```

### 2b. File penambahan foreign key (43 file `_add_foreign_keys_to_...`)

```
2026_08_31_030715_add_foreign_keys_to_audit_logs_table.php
2026_08_31_030715_add_foreign_keys_to_cart_items_table.php
2026_08_31_030715_add_foreign_keys_to_carts_table.php
2026_08_31_030715_add_foreign_keys_to_categories_table.php
2026_08_31_030715_add_foreign_keys_to_category_product_table.php
2026_08_31_030715_add_foreign_keys_to_coupon_categories_table.php
2026_08_31_030715_add_foreign_keys_to_coupon_products_table.php
2026_08_31_030715_add_foreign_keys_to_coupon_usages_table.php
2026_08_31_030715_add_foreign_keys_to_customer_notes_table.php
2026_08_31_030715_add_foreign_keys_to_exports_table.php
2026_08_31_030715_add_foreign_keys_to_inventories_table.php
2026_08_31_030715_add_foreign_keys_to_inventory_movements_table.php
2026_08_31_030715_add_foreign_keys_to_inventory_transfer_items_table.php
2026_08_31_030715_add_foreign_keys_to_inventory_transfers_table.php
2026_08_31_030715_add_foreign_keys_to_order_addresses_table.php
2026_08_31_030715_add_foreign_keys_to_order_adjustments_table.php
2026_08_31_030715_add_foreign_keys_to_order_items_table.php
2026_08_31_030715_add_foreign_keys_to_order_notes_table.php
2026_08_31_030715_add_foreign_keys_to_order_status_histories_table.php
2026_08_31_030715_add_foreign_keys_to_orders_table.php
2026_08_31_030715_add_foreign_keys_to_payment_transactions_table.php
2026_08_31_030715_add_foreign_keys_to_payments_table.php
2026_08_31_030715_add_foreign_keys_to_permission_role_table.php
2026_08_31_030715_add_foreign_keys_to_product_images_table.php
2026_08_31_030715_add_foreign_keys_to_product_option_values_table.php
2026_08_31_030715_add_foreign_keys_to_product_options_table.php
2026_08_31_030715_add_foreign_keys_to_product_reviews_table.php
2026_08_31_030715_add_foreign_keys_to_product_tag_table.php
2026_08_31_030715_add_foreign_keys_to_product_variant_option_values_table.php
2026_08_31_030715_add_foreign_keys_to_product_variants_table.php
2026_08_31_030715_add_foreign_keys_to_products_table.php
2026_08_31_030715_add_foreign_keys_to_promotion_actions_table.php
2026_08_31_030715_add_foreign_keys_to_promotion_rules_table.php
2026_08_31_030715_add_foreign_keys_to_refund_items_table.php
2026_08_31_030715_add_foreign_keys_to_refunds_table.php
2026_08_31_030715_add_foreign_keys_to_return_items_table.php
2026_08_31_030715_add_foreign_keys_to_returns_table.php
2026_08_31_030715_add_foreign_keys_to_role_user_table.php
2026_08_31_030715_add_foreign_keys_to_shipment_items_table.php
2026_08_31_030715_add_foreign_keys_to_shipments_table.php
2026_08_31_030715_add_foreign_keys_to_stock_reservations_table.php
2026_08_31_030715_add_foreign_keys_to_wishlist_items_table.php
2026_08_31_030715_add_foreign_keys_to_wishlists_table.php
```

> Catatan: 12 tabel yang memang **tidak memiliki foreign key** di database
> tidak menghasilkan file `_add_foreign_keys_...`: `banners`, `brands`,
> `coupons`, `pages`, `permissions`, `product_tags`, `promotions`, `roles`,
> `settings`, `shipping_methods`, `warehouses`, `webhook_logs`. Ini sesuai
> struktur fisik aslinya (semuanya 0 FK).

---

## 3. Catatan Urutan Migration yang Perlu Diperhatikan

### Kunci penting: desain file FK terpisah

Alat `migrate:generate` membuat **semua foreign key dalam file terpisah**
(`..._add_foreign_keys_to_...`) yang selalu **berjalan SETELAH semua file
pembuatan tabel**. Urutan nama file:

- `2026_08_31_030712_...` → semua 55 tabel dibuat (urutan abjad nama file).
- `2026_08_31_030715_...` → semua 43 file FK dijalankan setelahnya.

Dengan desain ini, kebanyakan masalah "child table jalan sebelum parent
table" **tidak akan terjadi** — seluruh tabel dibuat dulu, baru constraint
FK dipasang. Inilah kenapa simulasi database kosong berhasil tanpa error.

### Tabel induk (parent) yang dirujuk tabel lain (harus ada lebih dulu)

Tabel-tabel berikut dirujuk oleh tabel lain sebagai foreign key. Karena FK
dipasang belakangan, urutannya praktis tidak masalah, tapi catat sebagai
referensi:

- `users` (induk bagi orders, carts, customer_notes, role_user, wishlists,
  dll) — dibuat oleh migration bawaan `0001_01_01_000000`.
- `customer_addresses` — dibuat oleh migration lama (bukan bagian proses ini).
- Tabel induk mandiri: `brands`, `categories`, `coupons`, `products`,
  `product_variants`, `product_options`, `product_option_values`,
  `product_tags`, `roles`, `permissions`, `warehouses`, `shipping_methods`,
  `promotions`, `orders`, `order_items`, `payments`, `returns`, `refunds`,
  `shipments`, `inventory_transfers`, `carts`, `wishlists`.

### Panduan untuk menambah migration baru di masa depan

Karena semua FK dipisah ke file `_add_foreign_keys_`, saat menambah tabel
baru yang mereferensikan tabel lain:

1. Buat file `..._create_<tabel>_table.php` (boleh nama tabel apa pun).
2. Buat file `..._add_foreign_keys_to_<tabel>_table.php` **setelahnya**
   (timestamps lebih besar), berisi `$table->foreign(...)->references(...)`.
3. Pastikan waktu/angka timestamp di nama file tabel induk **lebih kecil**
   dari file FK-nya, dan tabel yang dirujuk sudah dibuat sebelumnya.

Ini pola yang sama dengan apa yang dihasilkan di proses ini.

---

## 4. Hasil Verifikasi (4 Langkah)

### Langkah 1 — Hitung file

- **98 file migration baru** dihasilkan: 55 pembuatan tabel + 43 foreign key.
- 55 tabel bisnis yang belum punya migration **semua ter-generate**, tidak
  ada yang kurang ataupun lebih (tabel `migrations` sengaja di-exclude,
  dan 9 tabel yang sudah dimigrasi sengaja di-`ignore`).

### Langkah 2 — Baca isi file secara acak

Diperiksa file: `orders`, `products`, `product_variants`, `payments`,
`inventories`, `settings`, `role_user`, dan beberapa file FK (`orders`,
`customer_notes`, `role_user`, `inventories`), serta tabel pivot. Hasilnya:

- Nama kolom, tipe data (enum, unsignedBigInteger, decimal, json, char),
  nullable, dan default **sesuai database**.
- Foreign key dibuat sebagai `unsignedBigInteger` + index bernama (mis.
  `fk_products_brand`), lalu constraint-nya di file FK terpisah dengan
  onDelete/onUpdate yang benar (`cascade`, `set null`, `no action`).
- Index unik/komposit memakai nama asli dari DB (`uq_...`, `idx_...`).
- Timestamps dengan `useCurrent()`/`useCurrentOnUpdate()` dan `softDeletes`
  dipertahankan.
- ENUM (mis. `order_status`, `payment_status`, `type`, `status`) terdeteksi
  dengan daftar pilihan yang persis seperti DB fisik.

### Langkah 3 — `php artisan migrate:status`

Semua **102 migration berstatus `Ran`** (4 lama + 98 baru). Tidak ada yang
Pending. Tabel `migrations` utama direkonsiliasi: 98 file baru dicatat
sebagai batch 3 (murni pencatatan, tidak menyentuh struktur/data tabel).

### Langkah 4 — Simulasi setup dari nol (PALING PENTING)

- Database kosong dibuat: `db_e_commerce_test_migration`.
- `php artisan migrate` dijalankan dari nol → **BERHASIL TANPA ERROR**,
  semua 102 migration dieksekusi berurutan (55 tabel + 43 FK constraint).
- Perbandingan struktur DB test vs DB utama:
  - **63 dari 64 tabel identik sempurna** (kolom, foreign key, index).
  - Satu-satunya beda: tabel `users` (lihat bagian 5).
- Database test lalu **dihapus**, and `.env` utama dikembalikan normal
  (tetap menunjuk `db_e_commerce`). Pendekatan yang dipakai adalah
  `.env.testing` sementara — `.env` utama tidak pernah diubah.

**Kesimpulan:** rangkaian migration ini **terbukti valid** dan bisa dipakai
rekan tim untuk setup project dari nol lewat `git clone` + `php artisan
migrate`.

---

## 5. Catatan Struktur yang Perlu Didiskusikan (TIDAK Diubah Tanpa Izin)

### a. Ketidaksesuaian tabel `users` (sebelum proses ini)

Tabel `users` **fisik** di database memiliki kolom ekstra yang tidak ada di
migration bawaan Laravel `0001_01_01_000000_create_users_table.php`:

- `phone` (varchar 30, nullable)
- `status` (enum `active`, `inactive`, `banned`, default `active`)
- `last_login_at` (timestamp, nullable)
- `created_at` / `updated_at` dengan default `CURRENT_TIMESTAMP` di DB
  fisik, sedangkan migration bawaan tidak menetapkan default.

Ini **bukan** bagian dari 98 file yang dihasilkan proses ini — ini ketidak
sesuaian yang sudah ada antara struktur fisik dan migration bawaan Laravel.
**Perlu keputusan**: apakah migration `users` akan diperbarui agar sesuai
DB fisik (dengan kolom tambahan tsb), atau kolom tersebut dihapus dari DB
fisik. **Belum diubah** karena butuh izin eksplisit.

### b. Pengamatan lain (tidak mengubah apa pun)

- Sebagian besar tabel memakai `unsignedBigInteger` untuk kolom harga/uang
  (nilai Rupiah tanpa desimal). Ini konsisten di seluruh DB.
- Tidak ada anomali parsial lain yang ditemukan pada tabel-tabel selain
  `users`.

---

## 6. Prosedur yang Dipakai (untuk referensi)

1. Install (dev): `composer require --dev kitloong/laravel-migrations-generator`
2. Backup: `mysqldump` dari `db_e_commerce` → file SQL aman (di luar repo).
3. Generate:
   ```
   php artisan migrate:generate \
     --ignore="users,password_reset_tokens,sessions,cache,cache_locks,jobs,job_batches,failed_jobs,customer_addresses" \
     --skip-log
   ```
   > **Penting:** package v7.4.0 ternyata **tidak otomatis melewati** tabel
   > yang sudah punya migration (hanya mengecualikan tabel `migrations`).
   > Karena itu daftar `--ignore` di atas wajib diberikan, supaya tidak
   > muncul file `CREATE TABLE` duplikat untuk tabel yang sudah dimigrasi.
4. Verifikasi 1-2 (hitung & baca file).
5. Simulasi database kosong (pakai `.env.testing` sementara, DB test dihapus
   setelahnya).
6. Rekonsiliasi DB utama: 98 file baru dicatat ke tabel `migrations` sebagai
   batch 3 (tanpa menjalankan `migrate`/`rollback`/`fresh` di DB utama).
7. `php artisan migrate:status` → semua Ran.

---

*Dibuat: 31 Agustus 2026.*
