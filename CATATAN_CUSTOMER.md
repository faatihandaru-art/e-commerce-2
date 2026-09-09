# CATATAN TEKNIS MODUL CUSTOMERS (ADMIN) — VORTIX GAMING STORE (VGS)

Dokumen ini adalah sumber kebenaran teknis (single source of truth) backend untuk **Modul Customers di Admin Panel**. Dokumen ini ditujukan sebagai panduan integrasi bagi **Rekan 2 (Frontend Customer Listing)** dan **Rekan 3 (Frontend Customer Detail)**.

---

## 1. HASIL VERIFIKASI STRUKTUR DATABASE (LANGKAH 1)

Struktur tabel pendukung yang dipakai pada modul Customers telah diverifikasi dan dikonfirmasi persis di database:

### A. Tabel Yang Sudah Ada (Existing Tables)
1. **`users`**
   - Kolom: `id`, `name`, `email`, `phone`, `password`, `status`, `last_login_at`, `email_verified_at`, `remember_token`, `created_at`, `updated_at`.
   - Peran: Menyimpan data pengguna (baik customer maupun staf).

2. **`customer_addresses`**
   - Kolom: `id`, `user_id`, `recipient`, `phone`, `street`, `village`, `district`, `city`, `province`, `postal_code`, `country`, `latitude`, `longitude`, `is_default`, `created_at`, `updated_at`.
   - Peran: Menyimpan daftar alamat pengiriman milik customer.

3. **`orders`**
   - Kolom: `id`, `order_number`, `user_id`, `contact_email`, `contact_phone`, `currency`, `subtotal`, `discount_total`, `shipping_total`, `tax_total`, `fee_total`, `grand_total`, `order_status`, `payment_status`, `fulfillment_status`, `placed_at`, `created_at`, `updated_at`.
   - Peran: Sumber data riwayat pesanan & perhitungan agregat belanja customer.

### B. Tabel & Model Catatan Support Internal (`customer_notes`)
Tabel `customer_notes` telah dibuat melalui migration (`2026_08_31_030712_create_customer_notes_table.php` & `2026_08_31_030715_add_foreign_keys_to_customer_notes_table.php`) dengan struktur:
- `id` (bigint unsigned, Primary Key, Auto Increment)
- `user_id` (bigint unsigned, Foreign Key ke `users.id`, Cascade on Delete) — customer yang diberi catatan.
- `note` (text) — isi catatan internal staf.
- `created_by` (bigint unsigned, Foreign Key ke `users.id`) — staf penuliskatatan.
- `created_at`, `updated_at` (timestamp)

**Model Eloquent `App\Models\CustomerNote.php`** telah dibuat:
- Relasi `$note->customer()` -> `belongsTo(User::class, 'user_id')`
- Relasi `$note->author()` -> `belongsTo(User::class, 'created_by')`

**Pembaruan Model Eloquent `App\Models\User.php`**:
- Relasi `$user->customerAddresses()` -> `hasMany(CustomerAddress::class)`
- Relasi `$user->customerNotes()` -> `hasMany(CustomerNote::class, 'user_id')`
- Scope `$user->customersOnly()` -> memfilter hanya user yang memiliki role `customer`.
- Method `$user->totalOrders()` -> menghitung total jumlah order milik customer.
- Method `$user->totalSpent()` -> menghitung total nilai belanja (rupiah) dari order dengan `payment_status = 'paid'`.
- Method `$user->lastOrderAt()` -> mendapatkan timestamp tanggal order terakhir milik customer (nullable).

---

## 2. DAFTAR ROUTE ADMIN CUSTOMERS

Seluruh route berada di bawah middleware `['auth', 'staff']` dan prefix `/admin`:

| Method | Route Path | Nama Route (`route()`) | Controller Method | Deskripsi |
|---|---|---|---|---|
| `GET` | `/admin/customers` | `admin.customers.index` | `CustomerController@index` | Menampilkan listing customer teragregasi (paginated, filter, search, sort). |
| `GET` | `/admin/customers/{user}` | `admin.customers.show` | `CustomerController@show` | Menampilkan detail profil, alamat, ringkasan order, dan catatan customer. |
| `POST` | `/admin/customers/{user}/notes` | `admin.customers.notes.store` | `CustomerController@storeNote` | Menambah catatan internal staf baru untuk customer. |
| `DELETE` | `/admin/customers/notes/{note}` | `admin.customers.notes.destroy` | `CustomerController@destroyNote` | Menghapus satu catatan internal staf. |
| `POST` | `/admin/customers/{user}/status` | `admin.customers.update-status` | `CustomerController@updateStatus` | Memperbarui status akun customer (`active`, `inactive`, `banned`). |

---

## 3. STRUKTUR PROPS UNTUK FRONTEND

### A. Props Halaman Listing: `Admin/Customers/Index` (Panduan Rekan 2)

Dipanggil via `GET /admin/customers`. Mendukung query parameters:
- `search`: Kata kunci nama / email / nomor HP customer.
- `status`: Filter status (`active`, `inactive`, `banned`).
- `sort_by`: Field pengurutan (`total_spent`, `last_order_at`, `total_orders`, `name`, `email`, `created_at`). Default: `created_at`.
- `sort_order`: Arah pengurutan (`asc` atau `desc`). Default: `desc`.
- `page`: Nomor halaman pagination.
- `per_page`: Jumlah item per halaman (default 10).

**Contoh Struktur Props JSON:**

```json
{
  "customers": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "name": "Aris Maulana",
        "email": "arismaulana06445@gmail.com",
        "phone": "085792584079",
        "status": "active",
        "total_orders": 5,
        "total_spent": 12500000,
        "last_order_at": "2026-09-01T14:30:00+00:00",
        "created_at": "2026-08-26T04:08:47+00:00"
      },
      {
        "id": 2,
        "name": "saipul",
        "email": "arismaulana06477@gmail.com",
        "phone": "085792584999",
        "status": "active",
        "total_orders": 0,
        "total_spent": 0,
        "last_order_at": null,
        "created_at": "2026-08-28T06:48:13+00:00"
      }
    ],
    "first_page_url": "http://localhost:8000/admin/customers?page=1",
    "from": 1,
    "last_page": 1,
    "last_page_url": "http://localhost:8000/admin/customers?page=1",
    "links": [
      {
        "url": null,
        "label": "&laquo; Previous",
        "active": false
      },
      {
        "url": "http://localhost:8000/admin/customers?page=1",
        "label": "1",
        "active": true
      },
      {
        "url": null,
        "label": "Next &raquo;",
        "active": false
      }
    ],
    "next_page_url": null,
    "path": "http://localhost:8000/admin/customers",
    "per_page": 10,
    "prev_page_url": null,
    "to": 2,
    "total": 2
  },
  "filters": {
    "search": "",
    "status": "",
    "sort_by": "created_at",
    "sort_order": "desc"
  }
}
```

---

### B. Props Halaman Detail: `Admin/Customers/Show` (Panduan Rekan 3)

Dipanggil via `GET /admin/customers/{id}`.

**Contoh Struktur Props JSON:**

```json
{
  "customer": {
    "profile": {
      "id": 1,
      "name": "Aris Maulana",
      "email": "arismaulana06445@gmail.com",
      "phone": "085792584079",
      "status": "active",
      "last_login_at": "2026-09-08T10:15:00+00:00",
      "created_at": "2026-08-26T04:08:47+00:00",
      "updated_at": "2026-08-26T04:08:47+00:00",
      "total_orders": 2,
      "total_spent": 4500000,
      "last_order_at": "2026-09-01T14:30:00+00:00"
    },
    "addresses": [
      {
        "id": 10,
        "recipient": "Aris Maulana",
        "phone": "085792584079",
        "street": "Jl. Gajah Mada No. 123",
        "village": "Kuta",
        "district": "Kuta",
        "city": "Badung",
        "province": "Bali",
        "postal_code": "80361",
        "country": "Indonesia",
        "latitude": "-8.7222",
        "longitude": "115.1768",
        "is_default": true
      }
    ],
    "orders": [
      {
        "id": 101,
        "order_number": "VGS-ORD-20260901-001",
        "grand_total": 2500000,
        "order_status": "completed",
        "payment_status": "paid",
        "fulfillment_status": "fulfilled",
        "placed_at": "2026-09-01T14:30:00+00:00",
        "created_at": "2026-09-01T14:30:00+00:00"
      }
    ],
    "notes": [
      {
        "id": 1,
        "note": "Customer pernah komplain pengiriman lambat, sudah diberikan kompensasi voucher 10k.",
        "created_by": 4,
        "author_name": "Super Admin",
        "created_at": "2026-09-09T03:05:09+00:00"
      }
    ]
  }
}
```

---

## 4. JAMINAN ISOLASI CUSTOMER VS STAF (`customersOnly()`)

1. **Query Filter**: Seluruh query data customer di `CustomerController@index` menggunakan scope `User::customersOnly()`, yang secara ketat memfilter pengguna ber-role `customer` dari tabel pivot `role_user`. Staf (seperti `super_admin`, `catalog_manager`, dll) tidak akan pernah muncul di daftar customer.
2. **Endpoint Guard**: Endpoint `show()`, `storeNote()`, dan `updateStatus()` secara eksplisit melakukan periksa ulang role `customer`. Apabila ID staf tidak sengaja dipanggil (misal `/admin/customers/4`), sistem akan secara otomatis merespon **HTTP 404 / HTTP 403 Forbidden**.
3. **Proteksi Pengubahan Status**: Method `updateStatus()` mengisolasi perubahan status agar **TIDAK BISA** digunakan untuk menonaktifkan akun staf.

---

## 5. CARA KERJA CATATAN SUPPORT INTERNAL (`customer_notes`)

1. **Tujuan Fitur**: `customer_notes` dirancang khusus untuk keperluan support internal staf toko (misalnya mencatat komplain, riwayat klaim garansi, catatan risiko retur, dll).
2. **Hak Akses & Visibilitas**:
   - **Murni Internal Staf**: Catatan ini **TIDAK PERNAH** dikirim atau ditampilkan ke storefront publik (akun customer). Customer tidak dapat melihat catatan ini dari dashboard/profil mereka.
   - **Hanya Staf Terautentikasi**: Staf yang sedang login di panel admin dapat membaca seluruh catatan customer via halaman detail (`GET /admin/customers/{user}`) dan menambah catatan baru via `POST /admin/customers/{user}/notes`.
   - **Pencatatan Penulis**: Field `created_by` secara otomatis mencatat ID staf yang sedang login (`auth()->id()`), dan nama staf dikembalikan sebagai `author_name` di JSON props.
   - **Hapus Catatan**: Hapus catatan dapat dilakukan via `DELETE /admin/customers/notes/{note}` (opsional untuk staf).

---

## 6. CATATAN TAMBAHAN — HASIL VERIFIKASI & PENYESUAIAN

Bagian ini berisi temuan selama verifikasi (Langkah 1) dan penyesuaian yang
dilakukan, supaya tidak ada asumsi yang tersembunyi.

### 6.1 Hasil Verifikasi Struktur vs. Brief

1. **Tabel `customer_notes` TELAH ADA lebih dulu** — dibuat oleh migration
   batch `2026_08_31_030712_create_customer_notes_table.php` dan
   `2026_08_31_030715_add_foreign_keys_to_customer_notes_table.php`. Struktur
   kolom (`id`, `user_id`, `note`, `created_by`, `created_at`, `updated_at`)
   sudah persis seperti yang diminta brief, jadi tidak perlu migration baru.
2. **Perbedaan kecil: kolom `created_by` TIDAK nullable** di database
   (brief menyebut nullable). Tidak masalah secara fungsional karena catatan
   selalu ditulis oleh staf yang sedang login (`created_by` selalu terisi).
3. **Kolom `status` di `users`** adalah `enum('active','inactive','banned')`
   default `active` — dipakai untuk filter aktif/nonaktif sesuai brief, dengan
   tambahan nilai `banned` yang juga didukung oleh endpoint update-status.
4. **Tanggal order memakai `orders.placed_at`** (bukan `created_at`) sebagai
   "tanggal order" — konsisten dipakai di `CustomerController@index` (aggregasi
   `last_order_at`) dan method `User::lastOrderAt()`.
5. Referensi struktur order yang dipakai: `docs/orders-feature/API_CONTRACT.md`
   (file `CATATAN_CHECKOUT_ORDER.md` yang disebut di brief tidak ada, isinya
   sudah dipindah ke dokumen API contract orders).

### 6.2 Temuan: Migration `customer_addresses` Tidak Ada di Repo

Tabel `customer_addresses` sudah ada di database development, tetapi
**tidak ada migration-nya di repository** (hanya disebut dokumentasi
`CATATAN_FITUR_ALAMAT.md`). Ini membuat database baru (fresh install / setelan
test `:memory:`) gagal karena tabel tidak pernah dibuat.

**Penyesuaian**: ditambahkan migration idempotent
`database/migrations/2026_09_09_000000_create_customer_addresses_table.php`
yang membuat tabel dengan struktur persis mengikuti database development
(termasuk kolom `latitude`/`longitude` untuk fitur GPS dan foreign key
`user_id` → `users` cascade). Guard `Schema::hasTable()` membuat migration ini
aman dijalankan pada database yang tabelnya sudah ada.

### 6.3 Validasi & Hak Akses yang Diperkuat

- **`storeNote`** menolak catatan kosong / hanya spasi (validasi `required` +
  pengecekan isi setelah `trim`), maksimal 2000 karakter.
- **`show` / `storeNote`** mengembalikan 404 jika URL dipanggil untuk akun
  staf; **`updateStatus`** mengembalikan 403 jika ada upaya menonaktifkan akun
  staf lewat endpoint ini (guard: harus ber-role `customer` dan tidak
  `isStaff()`).
- **`destroyNote`** (hapus catatan) **sudah diimplementasikan**, tidak di-skip.

### 6.4 Pengujian

Ditambahkan `tests/Feature/CustomerManagementTest.php` (8 test) yang
mencakup:
- Listing hanya menampilkan role customer (staf & admin TIDAK muncul).
- `total_spent` hanya menghitung order `payment_status = 'paid'`,
  `total_orders` menghitung semua order.
- Sort by `total_spent` (customer paling royal di urutan teratas).
- Detail customer: profil, alamat, ringkasan order, dan catatan (dengan
  `author_name`).
- Endpoint staf → 404 / 403, catatan kosong → 422, hapus catatan → sukses,
  ubah status akun customer → sukses.

Status pengujian: seluruh suite (`php artisan test`) **passing (16 test)**, dan
formatting kode dicek dengan Laravel Pint (`vendor/bin/pint`).

---

## Frontend: Listing Customer

Dokumentasi hasil kerja **Rekan 2 (Frontend Halaman Listing Customer)** setalah
backend modul Customers selesai.

### 1. File yang Dibuat / Diubah

- **Dibuat** `resources/js/pages/Admin/Customers/Index.tsx` — halaman Admin
  Customers/Index (dibungkus `AdminLayout`). Berisi:
  - Header "Kelola Customer" + kartu ringkasan **Total Customer**.
  - **Filter & pencarian** (`components/admin/customers/CustomerFilterBar.tsx`):
    pencarian nama / email / nomor HP, filter status (aktif / nonaktif /
    dibanned), urutkan (terbaru daftar, nama, total order, total belanja,
    order terakhir), dan arah urutan (menurun / menaik).
  - **Tabel customer**: nama + email, nomor HP, total order, total belanja
    (format rupiah), order terakhir (menampilkan "Belum pernah order" jika
    `last_order_at` kosong), badge status, dan tombol **Lihat Detail**.
  - **Paginasi** mengikuti pola halaman admin lain (Orders / Inventory).
  - **State kosong** jika belum ada customer / hasil filter kosong.
- **Dibuat** `resources/js/components/admin/customers/CustomerFilterBar.tsx` —
  komponen filter terpisah, mengikuti pola `OrderFilterBar` yang sudah ada.
- **Diubah** `resources/js/components/admin/Sidebar.tsx` — link menu **Customers**
  diaktifkan dari `href="#"` menjadi `/admin/customers` (route
  `admin.customers.index`).

### 2. Hasil Uji Coba

- **TypeScript & build**: `npm run typecheck` dan `npm run build` **berhasil**
  tanpa error.
- **Keamanan (staf TIDAK muncul di daftar customer)**: diverifikasi melalui
  test backend `tests/Feature/CustomerManagementTest.php` (8 test, semua
  **passing**) yang antara lain memastikan listing hanya menampilkan akun
  ber-role `customer` — staf dan admin tidak ikut muncul. Halaman frontend ini
  **tidak menambahkan filter apa pun untuk menyaring staf**, sesuai aturan:
  isolasi kewenangan sepenuhnya milik backend via scope `customersOnly()`.
  Tidak ada temuan staf yang bocor di daftar.
- **Search, filter status, dan sort**: parameternya (`search`, `status`,
  `sort_by`, `sort_order`) dikirim ke endpoint persis sesuai kontrak di
  dokumentasi ini dan dipertahankan saat pindah halaman (paginasi). Manual
  interaksi dapat dicoba dengan membuka `/admin/customers` pada panel admin.
- **Link "Lihat Detail"**: mengarah ke `/admin/customers/{id}` (route
  `admin.customers.show` — halaman detail milik Rekan 3).

### 3. Catatan Penyesuaian

- Data **"Customer Baru Bulan Ini"** tidak dikirim oleh backend saat ini,
  sehingga kartu ringkasan hanya menampilkan **Total Customer** (nilai diambil
  dari `customers.total` dari paginator). Kartu tambahan bisa ditambahkan nanti
  bila backend menyediakan prop `created_this_month` / sejenisnya.
- Filter status mendukung nilai `active`, `inactive`, dan `banned` sesuai
  kolom `users.status` di backend (dokumentasi brief hanya menyebut aktif /
  nonaktif, tapi `banned` sudah didukung endpoint, jadi ikut dimasukkan).
- Semua tipe data (jenis kolom tabel, nama route, struktur props `customers` +
  `filters`) mengikuti persis `CATATAN_CUSTOMER.md` — tidak ada penyimpangan
  dari kontrak backend.

---

## 7. FRONTEND: DETAIL CUSTOMER (`Admin/Customers/Show`)

Implementasi antarmuka frontend halaman detail customer admin telah selesai dibangun menggunakan React 19, Inertia.js v2/v3, TypeScript, dan Tailwind CSS. Halaman ini terintegrasi langsung dengan controller dan route backend yang telah disediakan.

### 7.1 Daftar File Yang Dibuat & Diubah

1. **`BRIEF_FRONTEND_CUSTOMER_DETAIL.md`** *(File Baru)* — Salinan brief spesifikasi teknis untuk pengembangan antarmuka detail customer.
2. **`resources/js/pages/Admin/Customers/Show.tsx`** *(File Baru)* — Komponen halaman detail customer lengkap yang mencakup:
   - Header profil pengguna, status badge, tombol aksi ubah status, dan ringkasan metrik belanja (total belanja paid, total order, order terakhir, login terakhir).
   - Tabel ringkasan riwayat order dengan 3 badge status (`OrderStatusBadge`), nilai grand total rupiah, dan tautan langsung ke detail order (`/admin/orders/{id}`).
   - Daftar kartu alamat tersimpan milik customer dengan mode read-only (konsisten dengan tampilan kartu alamat storefront/akun customer).
   - Panel Catatan Support Internal berpenanda visual gembok & label internal staf, form penambahan catatan reaktif, serta tombol hapus catatan.
   - Modal dialog konfirmasi perubahan status akun (Aktif / Nonaktif / Banned) beserta deskripsi konsekuensi login.
   - Modal dialog konfirmasi penghapusan catatan support.
3. **`tests/Feature/CustomerManagementTest.php`** *(Pembaruan)* — Ditambahkan pengujian render halaman Inertia `Admin/Customers/Show`.
4. **`CATATAN_CUSTOMER.md`** *(Pembaruan)* — Penambahan dokumentasi teknis implementasi frontend detail customer.

---

### 7.2 Fitur yang Diimplementasikan & Hasil Verifikasi

1. **Info Profil & Metrik Ringkasan:**
   - Menampilkan inisial avatar, nama lengkap, status akun, email, nomor HP, dan tanggal bergabung (`created_at`).
   - 4 kartu statistik belanja teragregasi: Total Belanja (`total_spent` berstatus lunas dalam format Rupiah), Total Order (`total_orders`), Tanggal Order Terakhir (`last_order_at`), dan Waktu Login Terakhir (`last_login_at`).
2. **Ubah Status Akun Customer:**
   - Tombol "Ubah Status Akun" membuka modal konfirmasi interaktif.
   - Tiga pilihan status didukung (`active`, `inactive`, `banned`) dengan penjelasan konsekuensi jelas di UI (misal: "Customer tidak akan bisa login ke akun mereka").
   - Terhubung ke endpoint `POST /admin/customers/{user}/status`.
3. **Daftar Alamat Pengiriman (Read-Only):**
   - Menampilkan seluruh alamat dari relasi `customerAddresses`.
   - Mempertahankan konsistensi visual layout kartu dari halaman *Alamat Saya* (`Account/Addresses.tsx`).
   - Bersifat murni *read-only* dilengkapi penanda visual gembok privasi customer (admin tidak dapat menyunting atau menghapus alamat dari halaman admin).
4. **Ringkasan Riwayat Order & Tautan Detail:**
   - Tabel daftar pesanan menampilkan nomor order, tanggal transaksi (`placed_at`), nominal `grand_total` (Rupiah), serta 3 badge status: Order, Pembayaran, dan Pengiriman.
   - Tombol "Lihat Detail" mengarah langsung ke `/admin/orders/{order}` (`admin.orders.show`).
   - Menangani empty state jika customer belum pernah berbelanja.
5. **Catatan Support Internal (Fitur Baru):**
   - Diberi penanda visual jelas berupa ikon gembok, badge peringatan "Internal Staf", dan teks penjelasan bahwa catatan tidak akan pernah dapat diakses oleh customer.
   - Form pembuatan catatan baru dilengkapi counter 2000 karakter, validasi karakter spasi kosong, dan status loading submit (`POST /admin/customers/{user}/notes`).
   - Catatan baru langsung muncul di daftar secara instan tanpa perlu reload manual halaman.
   - Fitur hapus catatan telah aktif dan terhubung ke endpoint backend `DELETE /admin/customers/notes/{note}` dengan konfirmasi modal.

---

### 7.3 Hasil Pengujian & Kompilasi

- **PHPUnit Feature Tests:** 17 tests passed (100% passing) termasuk pengujian isolasi role staf vs customer, perhitungan total spent, pencatatan note, update status, dan render komponen Inertia `Admin/Customers/Show`.
- **PHP Code Style:** Lolos pengecekan Laravel Pint (`vendor/bin/pint --test`).
- **TypeScript Typecheck:** `npm run typecheck` (`tsc --noEmit`) berhasil tanpa error tipe data.
- **Frontend Production Build:** `npm run build` berhasil menghasilkan bundle `public/build/assets/Show-*.js` dan asset terkait secara optimal.
