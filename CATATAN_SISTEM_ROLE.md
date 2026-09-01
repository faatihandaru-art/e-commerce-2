# CATATAN SISTEM ROLE & AKSES (BACKEND & FRONTEND) VGS

Dokumen ini adalah sumber kebenaran teknis bersama untuk sistem **Role & Akses Staf vs Customer** serta **Integrasi Frontend Admin** toko online **Vortix Gaming Store (VGS)**.

---

## 🚀 BACKEND IMPLEMENTATION: SISTEM ROLE & OTORISASI

### 1. Daftar File yang Dibuat & Diubah

| File Path | Status | Penjelasan Fungsi & Tanggung Jawab |
|---|---|---|
| [`database/migrations/2026_08_31_030712_create_roles_table.php`](file:///C:/Users/user/Herd/e-commerce-2/database/migrations/2026_08_31_030712_create_roles_table.php) | Ditambahkan | Migration tabel `roles` (`id`, `name`, `slug` unique, `timestamps`). |
| [`database/migrations/2026_08_31_030712_create_permissions_table.php`](file:///C:/Users/user/Herd/e-commerce-2/database/migrations/2026_08_31_030712_create_permissions_table.php) | Ditambahkan | Migration tabel `permissions` (`id`, `name`, `slug` unique, `timestamps`). |
| [`database/migrations/2026_08_31_030712_create_role_user_table.php`](file:///C:/Users/user/Herd/e-commerce-2/database/migrations/2026_08_31_030712_create_role_user_table.php) | Ditambahkan | Migration tabel pivot `role_user` (relasi Many-to-Many User & Role). |
| [`database/migrations/2026_08_31_030712_create_permission_role_table.php`](file:///C:/Users/user/Herd/e-commerce-2/database/migrations/2026_08_31_030712_create_permission_role_table.php) | Ditambahkan | Migration tabel pivot `permission_role` (relasi Many-to-Many Permission & Role). |
| [`database/migrations/2026_08_31_030715_add_foreign_keys_to_role_user_table.php`](file:///C:/Users/user/Herd/e-commerce-2/database/migrations/2026_08_31_030715_add_foreign_keys_to_role_user_table.php) | Ditambahkan | Definisi foreign key & cascade delete untuk `role_user`. |
| [`database/migrations/2026_08_31_030715_add_foreign_keys_to_permission_role_table.php`](file:///C:/Users/user/Herd/e-commerce-2/database/migrations/2026_08_31_030715_add_foreign_keys_to_permission_role_table.php) | Ditambahkan | Definisi foreign key & cascade delete untuk `permission_role`. |
| [`app/Models/Role.php`](file:///C:/Users/user/Herd/e-commerce-2/app/Models/Role.php) | Diperbarui | Model Eloquent Role dengan relasi `users()` dan `permissions()`. |
| [`app/Models/Permission.php`](file:///C:/Users/user/Herd/e-commerce-2/app/Models/Permission.php) | Dibuat | Model Eloquent Permission dengan relasi `roles()`. |
| [`app/Models/User.php`](file:///C:/Users/user/Herd/e-commerce-2/app/Models/User.php) | Diperbarui | Model Eloquent User dengan relasi `roles()` serta helper `hasRole()`, `isStaff()`, dan `isCustomer()`. |
| [`database/seeders/RoleSeeder.php`](file:///C:/Users/user/Herd/e-commerce-2/database/seeders/RoleSeeder.php) | Dibuat | Seeder untuk menginisialisasi 8 role standar toko VGS. |
| [`database/seeders/PermissionSeeder.php`](file:///C:/Users/user/Herd/e-commerce-2/database/seeders/PermissionSeeder.php) | Dibuat | Seeder untuk menginisialisasi 7 permission hak akses sistem. |
| [`database/seeders/AdminUserSeeder.php`](file:///C:/Users/user/Herd/e-commerce-2/database/seeders/AdminUserSeeder.php) | Dibuat | Seeder pembuatan akun `super_admin` pertama dengan password acak aman yang ditampilkan di terminal CLI. |
| [`database/seeders/DatabaseSeeder.php`](file:///C:/Users/user/Herd/e-commerce-2/database/seeders/DatabaseSeeder.php) | Diperbarui | Menjadwalkan `RoleSeeder`, `PermissionSeeder`, dan `AdminUserSeeder`. |
| [`app/Domain/Customer/Actions/RegisterCustomerAction.php`](file:///C:/Users/user/Herd/e-commerce-2/app/Domain/Customer/Actions/RegisterCustomerAction.php) | Diperbarui | Hardcode penguncian assign role `customer` saat pendaftaran akun publik di sisi server. |
| [`app/Http/Middleware/EnsureUserIsStaff.php`](file:///C:/Users/user/Herd/e-commerce-2/app/Http/Middleware/EnsureUserIsStaff.php) | Dibuat | Middleware server-level untuk memeriksa `isStaff()` dan melempar status `HTTP 403 Forbidden` bagi non-staf. |
| [`bootstrap/app.php`](file:///C:/Users/user/Herd/e-commerce-2/bootstrap/app.php) | Diperbarui | Registrasi alias middleware `'staff' => EnsureUserIsStaff::class`. |
| [`routes/admin.php`](file:///C:/Users/user/Herd/e-commerce-2/routes/admin.php) | Dibuat | Kelompok route `/admin` terproteksi middleware `['auth', 'staff']`. |
| [`routes/web.php`](file:///C:/Users/user/Herd/e-commerce-2/routes/web.php) | Diperbarui | Memuat (require) file `routes/admin.php`. |
| [`app/Http/Controllers/Auth/AuthenticatedSessionController.php`](file:///C:/Users/user/Herd/e-commerce-2/app/Http/Controllers/Auth/AuthenticatedSessionController.php) | Diperbarui | Logika redirect setelah login: Staf ke `/admin`, Customer ke `/`. |
| [`app/Http/Middleware/HandleInertiaRequests.php`](file:///C:/Users/user/Herd/e-commerce-2/app/Http/Middleware/HandleInertiaRequests.php) | Diperbarui | Berbagi data pengguna beserta relasi `roles` ke seluruh halaman React Inertia via `props.auth.user`. |

---

### 2. Daftar Role dan Permission yang Di-seed

#### A. Role (`roles` table)
1. `super_admin` - Super Admin (Akses Penuh Sistem)
2. `admin` - Admin Utama
3. `catalog_manager` - Manajer Katalog Produk
4. `inventory_manager` - Manajer Stok & Inventaris
5. `order_manager` - Manajer Pesanan Pelanggan
6. `finance_operator` - Operator Keuangan & Pembayaran
7. `customer_service` - Layanan Pelanggan / CS
8. `customer` - Pelanggan Publik (Default Register)

#### B. Permission (`permissions` table)
1. `manage_products` - Kelola Katalog & Produk
2. `manage_inventory` - Kelola Stok & Inventaris
3. `manage_orders` - Kelola Pesanan
4. `manage_payments` - Kelola Transaksi & Pembayaran
5. `manage_customers` - Kelola Data Pelanggan
6. `view_reports` - Akses Laporan & Analitik
7. `manage_settings` - Kelola Pengaturan Toko & Sistem

---

### 3. Panduan Pembuatan Akun Staf Baru (Tinker)

Sebelum panel UI Manajemen Staf dibangun di fase berikutnya, pembuatan akun staf baru dapat dilakukan dengan mudah melalui Artisan Tinker:

```bash
php artisan tinker
```

Kemudian jalankan perintah PHP berikut di Tinker:

```php
// 1. Buat User Staf
$user = App\Models\User::create([
    'name' => 'Budi Staf Inventaris',
    'email' => 'budi.inventory@vgs.test',
    'phone' => '081299887766',
    'password' => 'PasswordStafAman123!', // Otomatis di-hash oleh model cast
    'status' => 'active',
]);

// 2. Ambil Role Staf (misal: inventory_manager)
$role = App\Models\Role::where('slug', 'inventory_manager')->first();

// 3. Hubungkan Role ke User
$user->roles()->attach($role->id);
```

---

### 4. BENTUK STRUKTUR DATA `props.auth.user` (INFORMASI UNTUK FRONTEND)

> [!IMPORTANT]
> Kedua rekan tim frontend (OpenCode & Copilot) dapat membaca status login dan array `roles` pengguna secara langsung via `usePage().props.auth.user`.

Berikut adalah struktur JSON konkret dari `props.auth.user` yang dikirim dari backend:

```json
{
  "id": 1,
  "name": "Super Admin",
  "email": "admin@vgs.test",
  "phone": "08123456789",
  "status": "active",
  "created_at": "2026-08-31T05:27:23.000000Z",
  "updated_at": "2026-08-31T05:27:23.000000Z",
  "roles": [
    {
      "id": 1,
      "name": "Super Admin",
      "slug": "super_admin",
      "created_at": "2026-08-31T05:27:21.000000Z",
      "updated_at": "2026-08-31T05:27:21.000000Z",
      "pivot": {
        "user_id": 1,
        "role_id": 1
      }
    }
  ]
}
```

*Jika pengguna belum login (guest), `props.auth.user` bernilai `null`.*

---

### 5. Alur Kerja Sistem (End-to-End Flow)

1. **Pendaftaran Akun Publik (Customer Register):**
   - Pengunjung mengisi form registrasi di `/register`.
   - `RegisteredUserController` memanggil `RegisterCustomerAction`.
   - `RegisterCustomerAction` membuat akun dan **secara otomatis meng-assign role `customer`** dari database. Form publik tidak menerima parameter role apapun.
2. **Autentikasi & Redirect Login:**
   - User memasukkan kredensial di `/login`.
   - `AuthenticatedSessionController::store()` memverifikasi password dan melakukan `session()->regenerate()`.
   - Controller mengecek status role via `$user->isStaff()`:
     - Jika pengguna adalah **Staf** (punya role selain `customer`), sistem me-redirect ke dashboard admin (`/admin`).
     - Jika pengguna adalah **Customer**, sistem me-redirect ke storefront publik (`/`).
3. **Proteksi Server-Level Halaman Admin:**
   - Setiap URL di bawah `/admin/*` diproteksi oleh middleware `['auth', 'staff']`.
   - Apabila seorang Customer mencoba mengetik `/admin` secara manual di browser, middleware `EnsureUserIsStaff` mendeteksi bahwa `isStaff()` bernilai `false` dan langsung melempar respon **HTTP 403 Forbidden**.
4. **Akses Bebas Staf ke Storefront:**
   - Pembatasan berlaku **satu arah**: Customer tidak bisa masuk ke Admin, namun Staf yang sedang login tetap bebas membuka halaman storefront publik (`/`).

---

### 6. Catatan Keamanan untuk Laporan PKL

- **Server-Side Authorization (Defense in Depth):** Keamanan sistem tidak mengandalkan penyembunyian elemen UI di frontend. Penentuan role registrasi dan penguncian akses admin dilakukan 100% di server.
- **Zero Trust Public Registration:** Tidak ada endpoint publik yang dapat menerima atau memanipulasi parameter role. Role `customer` di-hardcode pada logika backend action.
- **Dynamic Server-Level Control Flow:** Middleware server mengecek relasi role pengguna dari database pada setiap request HTTP menuju area sensitif `/admin/*`.

---

## 🎨 FRONTEND IMPLEMENTATION: LAYOUT ADMIN & DASHBOARD

### 1. Daftar File Layout & Dashboard

| Path File | Fungsi & Peran |
|---|---|
| [`resources/js/layouts/AdminLayout.tsx`](file:///C:/Users/user/Herd/e-commerce-2/resources/js/layouts/AdminLayout.tsx) | Wadah Layout Utama Admin (Sidebar + Header + Content). |
| [`resources/js/components/admin/Sidebar.tsx`](file:///C:/Users/user/Herd/e-commerce-2/resources/js/components/admin/Sidebar.tsx) | Sidebar Navigasi Admin bertema dark gaming VGS. |
| [`resources/js/components/admin/Header.tsx`](file:///C:/Users/user/Herd/e-commerce-2/resources/js/components/admin/Header.tsx) | Header Atas Admin dengan pencarian, notifikasi, dan profil staf. |
| [`resources/js/types/admin.ts`](file:///C:/Users/user/Herd/e-commerce-2/resources/js/types/admin.ts) | Interface TypeScript untuk `Role`, `AdminUser`, `AdminPageProps`. |
| [`resources/js/pages/Admin/Dashboard.tsx`](file:///C:/Users/user/Herd/e-commerce-2/resources/js/pages/Admin/Dashboard.tsx) | Halaman utama Admin Dashboard. |

---

### 2. Spesifikasi Integrasi Frontend

Halaman `Admin/Dashboard.tsx` membaca data pengguna yang login secara dinamis dari `props.auth.user`:
- Nama staf ditampilkan pada banner sambutan.
- Role pertama (`user.roles[0].name`) ditampilkan dalam bentuk Badge.
- Sistem menggunakan fallback defensif jika data role belum termuat.

---

## Diagnosa dan Perbaikan Redirect Login

> Tanggal: 01 September 2026

### 1. Hasil Lima Titik Diagnosa

Berikut hasil pemeriksaan lima titik yang berpotensi menjadi penyebab admin tidak redirect ke `/admin`. **Semua titik backend ternyata SUDAH BENAR** — kode yang dibangun sebelumnya masih utuh dan berfungsi.

| Titik | Status | Temuan |
|---|---|---|
| **1. Seeder sudah jalan?** | ✅ OK | Tabel `roles` berisi **8 role** lengkap. User `admin@vgs.test` **ADA** (id=4, nama "Super Admin", status `active`) dan role `super_admin` **ter-attach** ke akun itu (relasi roles = 1 item). |
| **2. `isStaff()` berfungsi?** | ✅ OK | Method ada di `app/Models/User.php` dan logicnya benar (mengembalikan `true` jika ada role selain `customer`). Untuk `admin@vgs.test` hasilnya **`bool(true)`**. |
| **3. Logic redirect di controller?** | ✅ OK | `AuthenticatedSessionController.php` method `store()` punya logic persis: staf → route `admin.dashboard`, selain itu → route `home`. |
| **4. Route `admin.dashboard` ada & terproteksi?** | ✅ OK | Route muncul di `route:list` dan diproteksi middleware **`web`, `auth`, `staff`**. |
| **5. Data roles terkirim ke frontend?** | ✅ OK | `HandleInertiaRequests.php` memakai `$request->user()?->load('roles')` — array `roles` terkirim ke React via `props.auth.user.roles`. |

### 2. Akar Masalah Sebenarnya (Bukan Kode)

Masalah yang dilaporkan **tidak berasal dari kode**, melainkan dari **data akun / kredensial** yang dipakai untuk tes, yaitu:

- Ada 3 akun lain di database yang **tidak punya role sama sekali**:
  - `arismaulana06445@gmail.com`
  - `arismaulana06477@gmail.com`
  - `test@example.com`
- Ketiga akun itu `isStaff()` bernilai **`false`**, sehingga ketika dipakai login, sistem benar-benar **mengarahkan ke storefront (`/`)** — persis gejala yang dilaporkan. Akun tanpa role juga membuat bagian profil **tidak tampil** sebagai staf.
- Akun `admin@vgs.test` memang sudah benar (staff + role super_admin), tetapi `AdminUserSeeder` memakai **password acak** yang hanya dicetak sekali di terminal saat seeding pertama. Password asli kemungkinan sudah terlewat/tidak diketahui, sehingga penguji justru login memakai akun non-admin tadi.

### 3. Perbaikan yang Dilakukan

1. **Password `admin@vgs.test` di-reset ke nilai tetap yang terdokumentasi** agar tes bisa dilakukan dengan kredensial yang pasti benar (diverifikasi dengan `Hash::check` = `true`).

### 4. Kredensial Admin yang VALID Sekarang

| Field | Nilai |
|---|---|
| **Email** | `admin@vgs.test` |
| **Password** | `AdminVGS2026#` |
| **Role** | `super_admin` |

### 5. Komponen Profil Staf di Area Admin

Profil staf yang sedang login sudah tersedia di **dua komponen** area admin (tidak ada file baru yang perlu dibuat):

| File | Lokasi Profil Staf |
|---|---|
| [`resources/js/components/admin/Sidebar.tsx`](file:///C:/Users/user/Herd/e-commerce-2/resources/js/components/admin/Sidebar.tsx) | Bagian bawah sidebar (pojok kiri): avatar inisial, nama staf, role staf, tombol **Keluar** (logout). |
| [`resources/js/components/admin/Header.tsx`](file:///C:/Users/user/Herd/e-commerce-2/resources/js/components/admin/Header.tsx) | Bagian kanan header: avatar inisial, nama staf, email staf. |

Keduanya membaca `props.auth.user` (nama, email, dan `roles[0].name` dengan fallback aman `"Staf"` jika array role kosong) dan menampilkan avatar inisial — konsisten dengan gaya `vgs-blue-electric` / `vgs-black-surface`. Profil **customer** di storefront (`resources/js/components/storefront/Navbar.tsx` & `ProfileDropdown.tsx`) sengaja **tidak diubah**.

### 6. Langkah Pengetesan Manual

1. Buka halaman login (`/login`).
2. Masuk dengan kredensial admin di atas: email `admin@vgs.test`, password `AdminVGS2026#`.
3. Setelah berhasil login, sistem **harus me-redirect ke `/admin`** (Admin Dashboard).
4. Di area admin, periksa pojok kiri bawah sidebar (atau kanan atas header) — harus terlihat **avatar inisial "SA"**, nama **"Super Admin"**, role **"Super Admin"**, dan tombol **"Keluar"** untuk logout.
5. Coba klik tombol **Keluar** — sistem harus kembali ke storefront (`/`) sebagai tamu.

> Catatan: Jika login memakai `test@example.com` / `arismaulana06445@gmail.com` / `arismaulana06477@gmail.com`, sistem akan tetap diarahkan ke storefront karena akun-akun itu memang **bukan** staf (tanpa role). Gunakan akun `admin@vgs.test` di atas untuk menguji akses admin.
