====================================================================
PROMPT UNTUK AI BACKEND -- HALAMAN CUSTOMERS (ADMIN)
BAGIAN KAMU: Model customer_notes, Controller, Route, agregasi data
Vortix Gaming Store (VGS) -- Modul Customers di Admin
Kompatibel dipakai di: Antigravity, OpenCode, Copilot, atau AI
coding assistant lain apapun -- ikuti instruksi ini apa adanya.
====================================================================

CARA PAKAI FILE INI
--------------------------------------------------------------------
Tempel SELURUH isi file ini ke AI coding tool pilihanmu sebagai
prompt awal. Simpan juga file ini di project sebagai
BRIEF_BACKEND_CUSTOMER.md.

Ada 2 rekan yang mengerjakan FRONTEND: Rekan 2 mengerjakan LISTING
semua customer (BRIEF_FRONTEND_CUSTOMER_LIST.md), Rekan 3
mengerjakan DETAIL satu customer -- profil, alamat, riwayat order,
catatan support (BRIEF_FRONTEND_CUSTOMER_DETAIL.md). KEDUANYA
bergantung pada Controller dan route yang kamu buat -- SELESAIKAN
dan commit git bagian itu LEBIH DULU sebelum bagian lain, supaya
mereka bisa mulai lebih awal. Simpan SEMUA temuan dan keputusan di
CATATAN_CUSTOMER.md (lihat bagian dokumentasi di bawah) karena
KEDUA rekan frontend akan membaca file itu sebagai sumber kebenaran
struktur data -- JANGAN biarkan mereka menebak nama field sendiri.

====================================================================
KONTEKS PROJECT
====================================================================

Toko online Vortix Gaming Store (VGS), Laravel 13 + Inertia 3 +
React 19 + TypeScript + Tailwind CSS. Struktur folder modular
monolith: app/Domain/<Domain>/Actions/ untuk logic bisnis,
app/Http/Controllers/ untuk request. SUDAH BERJALAN: sistem role
staf, CRUD Product, Inventory, customer_addresses (fitur tambah
alamat dengan opsi manual/lokasi GPS), dan Checkout & Orders
(dengan order_status/payment_status/fulfillment_status terpisah,
lihat CATATAN_CHECKOUT_ORDER.md untuk detail struktur order yang
sudah ada).

Modul Customers ini MENGGABUNGKAN data dari BEBERAPA tabel yang
SUDAH ADA (users, customer_addresses, orders) PLUS SATU tabel yang
BELUM ADA (customer_notes) -- ini bukan fitur yang membuat tabel
besar baru, tapi lebih ke AGREGASI dan TAMPILAN dari data yang
sudah tersebar.

====================================================================
STRUKTUR DATABASE YANG DIPAKAI
====================================================================

SUDAH ADA (verifikasi dulu strukturnya persis, JANGAN berasumsi):
- users: id, name, email, phone, status, last_login_at, dst
- customer_addresses: recipient, phone, street, village, district,
  city, province, postal_code, country, is_default (lihat
  CATATAN dokumentasi fitur alamat sebelumnya untuk struktur
  PERSIS)
- orders: order_number, contact_email, contact_phone, grand_total,
  order_status, payment_status, fulfillment_status, created_at
  (lihat CATATAN_CHECKOUT_ORDER.md untuk struktur PERSIS)

BELUM ADA -- WAJIB DIBUAT sesuai dokumen arsitektur bagian 6.1:
TABEL customer_notes
id              bigint unsigned, primary key
user_id         bigint unsigned, foreign key ke users, cascade on
                delete (ini customer yang dicatat)
note            text, isi catatan
created_by      bigint unsigned, foreign key ke users, nullable
                (staf yang menulis catatan ini)
created_at, updated_at

Catatan ini dipakai untuk keperluan support internal -- misalnya
"Customer pernah komplain paket telat, sudah dikompensasi voucher"
atau "Customer sering retur, perlu diperhatikan" -- sesuai dokumen
arsitektur bagian 6.1: "Internal support and risk notes". INI
CATATAN INTERNAL STAF, TIDAK PERNAH ditampilkan ke customer.

====================================================================
LANGKAH KERJA
====================================================================

LANGKAH 1 -- VERIFIKASI STRUKTUR YANG SUDAH ADA
Jalankan di tinker untuk konfirmasi struktur PERSIS sebelum menulis
kode apapun:
   php artisan tinker
   >>> Schema::getColumnListing('users')
   >>> Schema::getColumnListing('customer_addresses')
   >>> Schema::getColumnListing('orders')
   >>> Schema::hasTable('customer_notes')
CATAT hasilnya. Jika ada perbedaan dari yang didokumentasikan di
CATATAN sebelumnya (customer_addresses, checkout/order), LAPORKAN
dulu sebelum melanjutkan.

LANGKAH 2 -- MIGRATION customer_notes
Buat migration sesuai struktur di atas. Jalankan php artisan migrate.

LANGKAH 3 -- MODEL
Buat app/Models/CustomerNote.php: $fillable user_id, note,
created_by. Relasi belongsTo(User::class, 'user_id') untuk customer
yang dicatat, belongsTo(User::class, 'created_by') untuk staf
penulis -- BERI NAMA method relasi yang jelas berbeda, misal
customer() untuk yang pertama dan author() untuk yang kedua, supaya
tidak ambigu (dua relasi ke tabel yang sama).

Update app/Models/User.php: tambahkan relasi
hasMany(CustomerAddress::class), hasMany(Order::class),
hasMany(CustomerNote::class, 'user_id') (catatan TENTANG user ini).
Tambahkan juga accessor/method:
- totalOrders(): int -- hitung jumlah order milik user ini
- totalSpent(): int -- jumlah grand_total dari SEMUA order milik
  user ini yang payment_status = 'paid' (JANGAN hitung order yang
  belum dibayar sebagai "sudah belanja")
- lastOrderAt(): tanggal order terakhir, nullable jika belum pernah
  order

LANGKAH 4 -- SCOPE UNTUK MEMBEDAKAN CUSTOMER DARI STAF
PENTING: tabel users berisi CAMPURAN customer DAN staf (karena
sistem role sudah dibangun sebelumnya). Halaman Customers admin
HANYA BOLEH menampilkan user dengan role 'customer', BUKAN staf.
Tambahkan scope di Model User:
   public function scopeCustomersOnly($query)
   {
       return $query->whereHas('roles', fn ($q) => $q->where('slug', 'customer'));
   }
PASTIKAN Controller di Langkah 5 SELALU memakai scope ini, JANGAN
sampai staf ikut muncul di daftar customer.

LANGKAH 5 -- CONTROLLER (app/Http/Controllers/Admin/CustomerController.php)
- index(): daftar SEMUA user dengan scope customersOnly(), dengan
  filter berdasarkan status (aktif/nonaktif jika kolom status
  dipakai untuk itu), search berdasarkan nama/email/phone, dan SORT
  berdasarkan totalSpent atau lastOrderAt (untuk keperluan seperti
  "urutkan customer paling royal"). Kirim data teragregasi (total
  order, total belanja) SUDAH DIHITUNG dari backend, JANGAN kirim
  semua data order mentah ke listing ini -- itu tidak efisien,
  cukup ringkasannya.
- show(User $user): PASTIKAN user ini memang punya role customer
  (abort 404 jika ternyata staf yang diakses lewat URL ini secara
  tidak sengaja/sengaja). Kirim data LENGKAP: profil user, SEMUA
  alamat tersimpan (dari customer_addresses), RINGKASAN riwayat
  order (order_number, tanggal, grand_total, ketiga status -- TIDAK
  PERLU detail item per order di sini, itu bisa diklik ke halaman
  Admin/Orders/Show yang SUDAH ADA dari fitur sebelumnya), dan
  SEMUA customer_notes untuk user ini (dengan nama staf penulis).
- storeNote(Request $request, User $user): terima teks catatan
  baru, simpan sebagai CustomerNote dengan created_by = staf yang
  sedang login. Validasi: note wajib diisi, tidak boleh kosong.
- destroyNote(CustomerNote $note): hapus satu catatan (opsional,
  sertakan jika sempat, boleh dilewati jika waktu terbatas dan
  dicatat sebagai keterbatasan)
- updateStatus(Request $request, User $user): untuk mengaktifkan/
  menonaktifkan akun customer (ubah kolom status di users). Ini
  BERGUNA untuk staf yang perlu menangguhkan akun bermasalah tanpa
  menghapus datanya. Validasi: TIDAK BOLEH menonaktifkan akun staf
  lewat endpoint ini (double check role customer lagi di sini).

LANGKAH 6 -- ROUTE (di dalam grup middleware(['auth','staff'])
->prefix('admin') yang sudah ada)
   Route::get('customers', [CustomerController::class, 'index'])
       ->name('admin.customers.index');
   Route::get('customers/{user}', [CustomerController::class, 'show'])
       ->name('admin.customers.show');
   Route::post('customers/{user}/notes', [CustomerController::class, 'storeNote'])
       ->name('admin.customers.notes.store');
   Route::delete('customers/notes/{note}', [CustomerController::class, 'destroyNote'])
       ->name('admin.customers.notes.destroy');
   Route::post('customers/{user}/status', [CustomerController::class, 'updateStatus'])
       ->name('admin.customers.update-status');

====================================================================
YANG TIDAK BOLEH DILAKUKAN
====================================================================

- JANGAN menampilkan atau menghitung staf sebagai customer di
  halaman manapun -- SELALU pakai scope customersOnly().
- JANGAN menghitung totalSpent() dari order yang belum payment_status
  'paid' -- itu akan salah menggambarkan seberapa "royal" seorang
  customer.
- JANGAN membuat customer_notes bisa dilihat customer sendiri lewat
  akun mereka -- ini murni catatan internal staf, TIDAK ADA route
  storefront/customer-facing untuk fitur ini.
- JANGAN mengizinkan updateStatus menonaktifkan akun STAF lewat
  endpoint customer ini -- validasi ulang role di dalam method itu
  sendiri, jangan cuma mengandalkan bahwa halaman ini "seharusnya"
  cuma diakses untuk customer.
- JANGAN membangun ulang halaman Admin/Orders/Show -- itu SUDAH ADA
  dari fitur sebelumnya, cukup link ke sana dari halaman customer.

====================================================================
WAJIB: DOKUMENTASI SETELAH SELESAI
====================================================================

Buat file CATATAN_CUSTOMER.md di root project, berisi:

1. Hasil verifikasi struktur (Langkah 1) dan penyesuaian yang
   dilakukan.
2. Daftar route admin.customers.* beserta method HTTP-nya.
3. Bentuk PERSIS props yang dikirim ke halaman Admin/Customers/Index
   (termasuk field agregasi totalOrders, totalSpent, lastOrderAt)
   dan Admin/Customers/Show (profil, alamat, ringkasan order,
   catatan) -- contoh JSON konkret untuk KEDUA rekan frontend.
4. Konfirmasi bahwa scope customersOnly() sudah diterapkan di
   SEMUA endpoint terkait, sebagai jaminan staf tidak pernah muncul
   di halaman ini.
5. Penjelasan singkat cara kerja customer_notes (siapa yang bisa
   melihat, siapa yang bisa menulis) untuk ditegaskan lagi ke
   Rekan 3.

Tulis dalam Bahasa Indonesia, jelas dan tidak terlalu teknis.

====================================================================
ATURAN TAMBAHAN
====================================================================

- Kerjakan bertahap: (a) verifikasi struktur, (b) migration
  customer_notes, (c) model dan relasi termasuk scope
  customersOnly(), (d) Controller lengkap, (e) route -- SEGERA
  laporkan setelah ini selesai supaya kedua rekan bisa mulai, (f)
  dokumentasi.
- Tampilkan ringkasan tiap langkah, supaya bisa dicek dan commit
  git bertahap.
- Jika di titik manapun menemukan struktur data yang tidak terduga
  (misal kolom status di users ternyata dipakai untuk hal lain,
  bukan aktif/nonaktif), STOP dan laporkan sebelum melanjutkan
  dengan asumsi sendiri.
