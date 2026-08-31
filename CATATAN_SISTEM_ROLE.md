# CATATAN SISTEM ROLE & LAYOUT ADMIN VGS

Dokumen ini adalah sumber kebenaran teknis bersama untuk sistem role dan layout admin **Vortix Gaming Store (VGS)**.

---

## Frontend: Layout Admin

Bagian ini mendokumentasikan kerangka layout admin (wadah navigasi dan header) yang siap dipakai oleh halaman Dashboard (`Admin/Dashboard.tsx`) maupun modul admin lainnya di masa mendatang.

---

### 1. Daftar File yang Dibuat

| Path File | Fungsi & Peran |
|---|---|
| [`resources/js/layouts/AdminLayout.tsx`](file:///C:/Users/asus/Herd/e-commerce-2/resources/js/layouts/AdminLayout.tsx) | **Wadah Layout Utama Admin.** Menggabungkan `<Sidebar />` di sisi kiri dan area konten di kanan dengan `<Header />` di bagian atas serta `{children}` di bawahnya. Mengatur perilaku responsif (drawer mobile + backdrop overlay). |
| [`resources/js/components/admin/Sidebar.tsx`](file:///C:/Users/asus/Herd/e-commerce-2/resources/js/components/admin/Sidebar.tsx) | **Sidebar Navigasi Admin.** Berisi logo VGS Admin, badge identitas admin panel, daftar menu navigasi yang dikelompokkan sesuai modul (Utama, Katalog & Inventaris, Transaksi, Pemasaran, Sistem), penanda halaman aktif, info ringkas staf yang sedang login, shortcut ke storefront, dan tombol Logout. |
| [`resources/js/components/admin/Header.tsx`](file:///C:/Users/asus/Herd/e-commerce-2/resources/js/components/admin/Header.tsx) | **Header Atas Admin.** Menampilkan tombol hamburger mobile/tablet, judul halaman (`title`), subtitle opsional, tombol langsung ke storefront (`Lihat Toko`), ikon notifikasi, dan avatar profil staf. |
| [`resources/js/types/admin.ts`](file:///C:/Users/asus/Herd/e-commerce-2/resources/js/types/admin.ts) | **Definisi Type TypeScript.** Menyediakan interface `Role`, `AdminUser`, `AdminPageProps`, `AdminNavItem`, dan `AdminNavGroup`. |

---

### 2. Spesifikasi Props Komponen

#### A. `AdminLayout` (`resources/js/layouts/AdminLayout.tsx`)
Komponen wrapper untuk seluruh halaman admin.

| Prop | Tipe | Default | Penjelasan |
|---|---|---|---|
| `children` | `React.ReactNode` | *(Wajib)* | Konten spesifik halaman admin (misal: isi dashboard, tabel produk, dsb). |
| `title` | `string` | `'Dashboard'` | Judul halaman yang akan diteruskan otomatis ke `<Header />` dan ditampilkan di bagian atas. |
| `subtitle` | `string` | `undefined` | Subtitle atau deskripsi kecil di bawah judul halaman pada header. |

---

#### B. `Header` (`resources/js/components/admin/Header.tsx`)
Komponen header atas di area konten. *(Sudah terintegrasi otomatis di dalam `AdminLayout`, namun dapat dipakai terpisah jika dibutuhkan)*.

| Prop | Tipe | Default | Penjelasan |
|---|---|---|---|
| `title` | `string` | `'Dashboard'` | Judul halaman yang aktif. |
| `subtitle` | `string` | `undefined` | Teks keterangan atau breadcrumb kecil di bawah judul. |
| `onToggleSidebar` | `() => void` | `undefined` | Callback untuk membuka/menutup drawer sidebar pada layar mobile & tablet. |
| `isSidebarOpen` | `boolean` | `false` | Status apakah drawer sidebar sedang terbuka di mobile. |

---

#### C. `Sidebar` (`resources/js/components/admin/Sidebar.tsx`)
Komponen navigasi vertikal. *(Sudah terintegrasi otomatis di dalam `AdminLayout`)*.

| Prop | Tipe | Default | Penjelasan |
|---|---|---|---|
| `isOpen` | `boolean` | `false` | Status visibilitas sidebar pada layar mobile. |
| `onClose` | `() => void` | `undefined` | Callback untuk menutup drawer sidebar (dipanggil saat klik tombol close, backdrop, atau link menu). |

---

### 3. Contoh Cara Memakai `AdminLayout` dari Halaman Admin

Rekan yang membuat halaman `resources/js/pages/Admin/Dashboard.tsx` atau halaman admin lainnya cukup membungkus kontennya dengan `<AdminLayout title="...">` seperti contoh berikut:

```tsx
import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import type { AdminPageProps } from '@/types/admin';
import Badge from '@/components/ui/Badge';

export default function Dashboard() {
    const { props } = usePage<AdminPageProps>();
    const user = props.auth?.user;

    // Ambil nama role pertama (atau fallback)
    const roleName = user?.roles?.[0]?.name || 'Staf Admin';

    return (
        <AdminLayout title="Dashboard" subtitle="Ringkasan aktivitas dan metrik performa toko">
            <Head title="Admin Dashboard - Vortix Gaming Store" />

            {/* Sambutan Pengguna */}
            <div className="mb-8 p-6 rounded-2xl bg-vgs-black-surface border border-vgs-gray-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-display font-bold text-vgs-silver-bright">
                            Selamat Datang, {user?.name || 'Administrator'}!
                        </h2>
                        <p className="text-sm text-vgs-silver-mid mt-1">
                            Anda masuk sebagai <Badge variant="primary" size="sm">{roleName}</Badge>
                        </p>
                    </div>
                </div>
            </div>

            {/* Grid Kartu Metrik / Konten Halaman */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* ... kartu ringkasan dashboard ... */}
            </div>
        </AdminLayout>
    );
}
```

---

### 4. Konsistensi Desain & Responsivitas

- **Palet Warna Brand VGS:**
  - Background Utama: `vgs-black-void` (`#0A0A0C`)
  - Permukaan Sidebar: `vgs-black-surface` (`#14161B`)
  - Aksen Aktif & Glow: `vgs-blue-electric` (`#2B6FF6`)
  - Border & Pembatas: `vgs-gray-border` (`#2A2D35`)
  - Teks Heading: `vgs-silver-bright` (`#E8E9ED`)
  - Teks Body: `vgs-silver-mid` (`#A7ABB8`)
  - Teks Keterangan: `vgs-silver-muted` (`#6B6F7B`)
- **Responsivitas Layar:**
  - **Mobile (< 768px):** Sidebar tersembunyi secara default. Dapat dibuka melalui tombol hamburger di Header. Saat terbuka, muncul backdrop overlay gelap dan scroll body dinonaktifkan. Menekan tombol close (X), link menu, tombol `ESC`, atau area luar sidebar akan menutup drawer.
  - **Desktop (>= 768px / md+):** Sidebar tampil penuh dan sticky di sisi kiri selebar `260px`, dengan area konten di kanan yang dapat di-scroll secara independen.
- **Aksesibilitas:**
  - Semua tombol interaktif memiliki `aria-label` yang jelas.
  - Semua link dan tombol memiliki outline fokus keyboard yang konsisten (`focus-visible:ring-2 focus-visible:ring-vgs-blue-electric`).
  - Target sentuh (tap target) di mobile minimal `44x44px`.

---

## Frontend: Halaman Dashboard

Bagian ini mendokumentasikan halaman pertama area admin, `resources/js/pages/Admin/Dashboard.tsx`, yang memakai `AdminLayout`, `Sidebar`, dan `Header` dari bagian "Frontend: Layout Admin" di atas.

### 1. Status Integrasi Data `auth.user`

- Halaman membaca user yang login lewat `usePage<AdminPageProps>().props.auth.user` lalu menampilkan nama sambutan dan role dari `roles[0]`.
- **Hasil verifikasi**: saat smoke-test dengan route sementara, payload Inertia `/admin/dashboard` mengirim `component: "Admin/Dashboard"` dan `auth.user` berisi `id`, `name`, `email`, `phone`, `status`. `npm run typecheck` dan `npm run build` (production) lulus. Route sementara sudah dihapus setelahnya.
- **Ketidakcocokan yang perlu dikoordinasikan dengan rekan backend:**
  1. Backend `app/Http/Middleware/HandleInertiaRequests.php` **belum mengirim field `roles`** pada `auth.user`. Karena kode frontend memperlakukan `roles` sebagai opsional, halaman tidak crash dan menampilkan fallback badge **"Staf"**. Diharapkan backend menambahkan `roles` berbentuk `[{ id, name, slug }]`.
  2. Route `admin.dashboard` **belum terdaftar** di `routes/web.php` (belum ada route `/admin/dashboard`). Setelah route resmi datang, tidak ada perubahan lagi yang dibutuhkan di halaman ini.
- Catatan kecil: dokumentasi layout menyebut `AdminLayout` menerima prop `subtitle`, tetapi implementasi `AdminLayout.tsx` saat ini hanya menerima `title` (Header menampilkan judul saja). Dashboard memakai `title` saja agar aman.

### 2. Kartu Placeholder di Dashboard

Data di kartu berikut masih **DUMMY/statis** (angka contoh) dan sudah ditandai TODO di kode. Menunggu fitur backend masing-masing dibangun di tahap berikutnya:

| Kartu | Nilai (saat ini) | Menunggu fitur backend |
|---|---|---|
| Total Produk | 248 | modul kelola produk / statistik produk |
| Pesanan Hari Ini | 32 | modul manajemen pesanan |
| Pendapatan Bulan Ini | Rp128.650.000 | laporan penjualan / pembayaran |
| Stok Menipis | 18 | modul inventaris / stok |

Selain kartu, ada panel **"Aktivitas Terbaru"** berisi 5 baris contoh (juga dummy + TODO) yang nantinya diganti riwayat pesanan/aktivitas asli.

### 3. Deskripsi Tampilan Akhir

Dengan tema gelap brand VGS (background `vgs-black-void`, kartu `vgs-black-surface`, border `vgs-gray-border`, aksen biru elektrik):

- **Header atas** (dari `AdminLayout`/`Header`): judul "Dashboard", tombol hamburger di layar mobile/tablet, ikon notifikasi, dan avatar + nama/email staf di kanan.
- **Sidebar kiri** selebar 260px di desktop (drawer + backdrop di mobile) berisi navigasi admin.
- **Panel sambutan**: teks "Selamat Datang, [nama]!" dengan badge role (variasi `primary`, dot indikator muncul jika role tersedia) dan email di sisi kanan.
- **Grid 4 kartu metrik**: 1 kolom di mobile → 2 di tablet → 4 di desktop; tiap kartu berisi ikon berwarna, label kecil, angka besar, dan keterangan kecil.
- **Panel "Aktivitas Terbaru"**: daftar baris dengan titik status berwarna (hijau = sukses, oranye = peringatan, biru = info).

---

## Frontend: Halaman Dashboard

Bagian ini mendokumentasikan implementasi halaman `resources/js/pages/Admin/Dashboard.tsx` dan hasil verifikasi integrasi data auth pengguna serta pemakaian `AdminLayout`.

---

### 1. Konfirmasi Integrasi Data `auth.user`
- **Pembacaan Data:** Data pengguna yang sedang login diakses melalui `usePage<AdminPageProps>().props.auth?.user`.
- **Ekstraksi Role:** Role pengguna dibaca dari `user?.roles?.[0]?.name` atau `user?.roles?.[0]?.slug`.
- **Keamanan & Fallback:** Kode dibuat defensif sehingga jika relasi `roles` belum dimuat atau berupa array kosong (`[]`), sistem secara aman menampilkan fallback `"Staf"` tanpa menyebabkan halaman crash.
- **Status Kompatibilitas:** Integrasi dengan `AdminLayout`, `Header`, `Sidebar`, dan shared types (`AdminPageProps`) terverifikasi sukses tanpa error TypeScript maupun bundler Vite.

---

### 2. Daftar Kartu Placeholder Metrik Dashboard
Seluruh kartu metrik pada dashboard saat ini menggunakan **data statis/dummy** untuk visualisasi antarmuka dan telah diberi komentar `TODO` untuk disambungkan ke endpoint query riil backend di tahap berikutnya:

1. **Total Produk:** Menampilkan jumlah total item katalog (`128 Item`) dan status penambahan produk. *(Menunggu modul Catalog)*.
2. **Pesanan Hari Ini:** Menampilkan total order masuk hari ini (`24 Pesanan`) dan tren harian. *(Menunggu modul Orders)*.
3. **Pendapatan Bulan Ini:** Menampilkan omset kotor bulan berjalan (`Rp 48.500.000`) dan pertumbuhan bulanan. *(Menunggu modul Reporting & Finance)*.
4. **Stok Menipis:** Menampilkan peringatan jumlah SKU dengan stok kritis (`6 SKU`). *(Menunggu modul Inventory)*.
5. **Aktivitas Toko & Aksi Cepat:** Menampilkan daftar log audit/peristiwa dummy serta pintasan cepat ke modul arsitektur 4.2 dan tautan kembali ke storefront publik.

---

### 3. Deskripsi Tata Letak Tampilan Akhir (UI / Layout)
Halaman dashboard mengusung bahasa visual bertema gaming/esports khas VGS:
- **Header Atas (Sticky):** Menampilkan tombol toggle mobile, judul `"Dashboard"`, tombol lonceng notifikasi, serta avatar inisial dan nama staf.
- **Sidebar Kiri (Sticky Desktop / Drawer Mobile):** Menampilkan identitas logo VGS Admin Panel, daftar navigasi modul yang terkelompok, status aktif pada menu Dashboard, serta info profil staf dan tombol *Keluar* (Logout).
- **Area Konten Utama:**
  - **Banner Sambutan Personal:** Kotak gelap elevated dengan aksen radial glow biru elektrik, ucapan *"Selamat Datang, [Nama Staf]"*, pill/badge role akses (misal `SUPER_ADMIN` atau `Staf`), status koneksi sistem online, dan email staf.
  - **Grid 4 Kartu Metrik Ringkasan:** Ditata responsif (1 kolom di mobile, 2 kolom di tablet, 4 kolom di desktop) dengan ikon spesifik berkode warna (biru elektrik, hijau sukses, oranye peringatan).
  - **Area Dua Kolom Bawah:**
    - *Kolom Kiri (2/3 lebar di desktop):* Modul & Aksi Cepat untuk akses ke modul Katalog, Pesanan, Pelanggan, dan Laporan, serta shortcut ke Storefront publik.
  - *Kolom Kanan (1/3 lebar di desktop):* Widget linimasa Aktivitas Toko (dummy feed) dengan timestamp dan badge status.

### 4. Status Verifikasi Aktual (31 Agustus 2026)

- Halaman `Admin/Dashboard.tsx` berhasil dikompilasi bersama `AdminLayout`, `Header`, dan `Sidebar`; pemeriksaan TypeScript serta build produksi Vite selesai tanpa error.
- Route `admin.dashboard` tersedia dan merender halaman Dashboard. Karena pemeriksaan ini tidak memakai sesi login staf di browser, bentuk props saat halaman berjalan belum dapat diamati langsung dengan `console.log`.
- Ada ketidakcocokan yang perlu dikoordinasikan dengan backend: `HandleInertiaRequests` saat ini mengirim `id`, `name`, `email`, `phone`, dan `status`, tetapi **belum mengirim `roles`**. Dashboard tetap aman dan sementara menampilkan badge **"Staf"** melalui fallback. Nama pengguna tetap dapat ditampilkan dari `auth.user.name`.
- Kartu yang benar-benar tampil saat ini adalah **Total Produk**, **Pesanan Hari Ini**, **Pendapatan Bulan Ini**, dan **Stok Menipis**, serta panel **Aktivitas Terbaru**. Seluruh nilainya masih dummy dan komentar `TODO` sudah tersedia untuk penggantian dengan data backend pada tahap berikutnya.
