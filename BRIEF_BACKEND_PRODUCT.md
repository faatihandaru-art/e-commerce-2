====================================================================
PROMPT UNTUK ANTIGRAVITY -- BACKEND CRUD PRODUCT
BAGIAN KAMU: Model, Action, Controller, Route, Storage Gambar
Vortix Gaming Store (VGS) -- CRUD Produk Admin ke Storefront
====================================================================

CARA PAKAI FILE INI
--------------------------------------------------------------------
Tempel SELURUH isi file ini ke Antigravity sebagai prompt awal.
Simpan juga file ini di project sebagai BRIEF_BACKEND_PRODUCT.md.

Ada 2 rekan yang mengerjakan FRONTEND: Rekan 2 mengerjakan FORM
tambah/edit produk (BRIEF_FRONTEND_PRODUCT_FORM.md, di OpenCode),
Rekan 3 mengerjakan TABEL daftar produk di admin DAN koneksi ke
halaman /products yang dilihat customer
(BRIEF_FRONTEND_PRODUCT_TABLE.md, di Copilot). KEDUANYA bergantung
pada endpoint API/route yang kamu buat -- SELESAIKAN dan commit git
bagian route dan Controller LEBIH DULU sebelum bagian lain, supaya
mereka bisa mulai testing lebih awal.

====================================================================
KONTEKS PROJECT
====================================================================

Toko online Vortix Gaming Store (VGS), Laravel 13 + Inertia 3 +
React 19 + TypeScript + Tailwind CSS. Struktur folder modular
monolith: app/Domain/<Domain>/Actions/ untuk logic bisnis,
app/Http/Controllers/ untuk request, app/Http/Requests/ untuk
validasi.

Sistem role staf SUDAH BERJALAN -- akun admin bisa login dan masuk
ke /admin dengan layout, sidebar, dan dashboard placeholder yang
sudah tampil (lihat CATATAN_SISTEM_ROLE.md untuk detail). Middleware
'staff' sudah melindungi semua route di bawah /admin/*.

MASALAH YANG HARUS DISELESAIKAN
--------------------------------------------------------------------
Menu "Catalog" di sidebar admin sudah ADA secara visual tapi belum
mengarah ke halaman fungsional apapun. Halaman /products yang
dilihat CUSTOMER saat ini KOSONG (menampilkan "Tidak Ada Produk yang
Cocok") karena tabel products di database masih benar-benar kosong
(0 rows). Dibutuhkan sistem CRUD (Create, Read, Update, Delete)
produk yang LENGKAP, dari admin mengisi form sampai produk itu
benar-benar muncul di halaman /products milik customer.

====================================================================
STRUKTUR DATABASE YANG DIPAKAI (SUDAH ADA, JANGAN BUAT MIGRATION BARU)
====================================================================

CATATAN PENTING: tabel-tabel ini SUDAH ADA secara fisik di database
(sudah pernah dibuat sebelumnya dan sudah didaftarkan lewat migration
di proses migrate:generate yang sudah dilakukan -- cek
CATATAN_MIGRATION_LENGKAP.md jika ada, untuk konfirmasi). TUGAS KAMU
BUKAN membuat migration baru, tapi membuat Model, Action, dan
Controller yang membaca/menulis ke struktur yang SUDAH ADA. SEBELUM
menulis kode apapun, jalankan di terminal:

   php artisan tinker
   >>> Schema::getColumnListing('products')
   >>> Schema::getColumnListing('product_images')
   >>> Schema::getColumnListing('product_variants')
   >>> Schema::getColumnListing('categories')
   >>> Schema::getColumnListing('brands')

CATAT hasil PERSIS dari perintah di atas dan SESUAIKAN semua kode
Model/Action/Controller ke nama kolom yang BENAR-BENAR ADA -- JANGAN
menebak nama kolom dari dokumen arsitektur semata, karena struktur
sebenarnya di database bisa saja sedikit berbeda dari dokumen asli.
Dokumen arsitektur bagian 6.2 adalah PANDUAN UMUM, hasil query di
atas adalah KEBENARAN AKTUAL yang wajib diikuti.

====================================================================
TUGAS KAMU (BACKEND)
====================================================================

1. MODEL (app/Models/)
   - Product.php
   - ProductImage.php
   - ProductVariant.php
   - Category.php
   - Brand.php

2. ACTION (app/Domain/Catalog/Actions/)
   - CreateProductAction.php
   - UpdateProductAction.php
   - DeleteProductAction.php

3. PENYIMPANAN GAMBAR
   - Laravel Storage facade dengan disk 'public'
   - Symlink php artisan storage:link

4. FORM REQUEST (app/Http/Requests/Admin/)
   - StoreProductRequest.php
   - UpdateProductRequest.php

5. CONTROLLER (app/Http/Controllers/Admin/ProductController.php)
   - index(), create(), store(), edit(), update(), destroy()

6. ROUTE (routes/admin.php & routes/web.php)
   - Route::resource('products', ProductController::class)->names('admin.products');

7. SAMBUNGKAN KE HALAMAN CUSTOMER /products
   - Query data terpublikasi dari database untuk storefront.
