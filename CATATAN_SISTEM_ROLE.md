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
