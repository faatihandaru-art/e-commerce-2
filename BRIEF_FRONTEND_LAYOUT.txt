====================================================================
PROMPT UNTUK OPENCODE -- FRONTEND: LAYOUT & NAVIGASI ADMIN
BAGIAN KAMU: AdminLayout.tsx, Sidebar, Header Admin
Vortix Gaming Store (VGS) -- Sistem Role & Akses Staf vs Customer
====================================================================

CARA PAKAI FILE INI
--------------------------------------------------------------------
Tempel SELURUH isi file ini ke OpenCode sebagai prompt awal. Simpan
juga file ini di project sebagai BRIEF_FRONTEND_LAYOUT.md.

Ada rekan yang mengerjakan BACKEND (BRIEF_BACKEND_ROLE.md, dikerjakan
di Antigravity) dan rekan lain yang mengerjakan HALAMAN DASHBOARD
(BRIEF_FRONTEND_DASHBOARD.md, dikerjakan di Copilot). Tugas kamu
adalah membangun "WADAH" -- layout, sidebar, dan header yang akan
DIPAKAI oleh halaman Dashboard rekan ketiga, jadi kerjakan lebih
dulu karena dia bergantung pada hasil kamu.

TUNGGU rekan backend menyelesaikan minimal bagian route admin dan
share data auth (lihat CATATAN_SISTEM_ROLE.md yang akan dia buat)
sebelum kamu mulai, supaya kamu tahu struktur props.auth.user.roles
yang bisa dipakai untuk menampilkan info user di sidebar/header.
Kalau backend belum selesai saat kamu mulai, boleh mulai dengan
struktur sementara dan sesuaikan nanti begitu dokumentasi backend
tersedia.

====================================================================
KONTEKS PROJECT
====================================================================

Toko online Vortix Gaming Store (VGS), dibangun dengan Laravel 13 +
Inertia 3 + React 19 + TypeScript + Tailwind CSS. Frontend storefront
customer SUDAH ADA (Home, About, Product, Cart, Login) dengan style
brand: warna dominan hitam dengan aksen biru elektrik, tipografi
tegas bergaya gaming/esports, TIDAK norak/generic-AI-look. Semua
warna dan font SUDAH terdaftar di tailwind.config (cari nama-nama
seperti vgs-black-void, vgs-black-surface, vgs-black-elevated,
vgs-blue-electric, vgs-blue-deep, vgs-silver-bright, vgs-silver-mid,
vgs-silver-muted, vgs-gray-border -- CEK FILE tailwind.config DULU
untuk daftar lengkap dan nama pasti sebelum menulis kode).

Sekarang sedang dibangun AREA ADMIN terpisah dari storefront, untuk
staf mengelola toko (kelola produk, stok, pesanan, dst -- fitur-
fitur itu akan dibangun BERTAHAP di prompt-prompt terpisah setelah
ini, JANGAN membangunnya sekarang). Tugas kamu HANYA membangun
KERANGKA layout admin: AdminLayout, Sidebar navigasi, dan Header --
BUKAN isi konten halaman-halaman admin itu sendiri.

====================================================================
STRUKTUR DATA YANG AKAN KAMU TERIMA DARI BACKEND
====================================================================

Backend mengirim data user yang sedang login lewat Inertia shared
props, bisa diakses di komponen React manapun lewat:

import { usePage } from '@inertiajs/react';

const { auth } = usePage().props;
// auth.user berbentuk kira-kira:
// {
//   id: number,
//   name: string,
//   email: string,
//   roles: [{ id: number, name: string, slug: string }]
// }

CEK file CATATAN_SISTEM_ROLE.md di root project (dibuat oleh rekan
backend) untuk bentuk PERSIS struktur data ini sebelum menulis kode
-- dokumen itu adalah sumber kebenaran, bukan contoh di atas yang
sifatnya perkiraan.

====================================================================
TUGAS KAMU
====================================================================

1. LAYOUT: resources/js/layouts/AdminLayout.tsx
   - Struktur: <Sidebar /> di kiri (lebar tetap, misal 260px di
     desktop), area konten utama di kanan berisi <Header /> di atas
     dan {children} di bawahnya
   - Terima props children (konten halaman spesifik, akan diisi
     rekan yang membangun Dashboard dan halaman admin lain nanti)
   - Background utama pakai vgs-black-void (atau nama setara di
     tailwind.config kamu), area sidebar sedikit lebih terang pakai
     vgs-black-surface atau vgs-black-elevated supaya ada pemisahan
     visual dari konten utama
   - RESPONSIF: di layar mobile/tablet (di bawah breakpoint md/
     768px), Sidebar HARUS bisa disembunyikan/ditoggle (drawer dari
     kiri, atau collapse jadi ikon-ikon saja) -- jangan biarkan
     sidebar selebar 260px memakan sebagian besar layar mobile

2. KOMPONEN: resources/js/components/admin/Sidebar.tsx
   Menu navigasi admin, untuk tahap ini isi menu masih PLACEHOLDER
   (link-nya boleh mengarah ke "#" atau route yang belum ada, karena
   halaman-halamannya belum dibangun) tapi STRUKTUR dan STYLING
   harus jadi, berisi minimal:
   - Logo/wordmark VGS versi kecil di bagian atas sidebar (styling
     serupa dengan yang dipakai di Navbar storefront, cek komponen
     Navbar yang sudah ada untuk referensi konsistensi)
   - Label "Admin Panel" atau serupa untuk membedakan dari sisi
     customer
   - Daftar menu dengan ikon + label, kelompokkan secara logis
     sesuai modul di dokumen arsitektur bagian 4.2 (Dashboard,
     Catalog, Inventory, Orders, Marketing, Customers, Configuration,
     Reports) -- SEMUA sebagai placeholder link dulu, hanya
     "Dashboard" yang perlu mengarah ke route sungguhan
     (route('admin.dashboard') dari backend, karena itu satu-
     satunya halaman admin yang sudah ada rute-nya di tahap ini)
   - Item menu yang sedang aktif (halaman yang dibuka) diberi
     penanda visual jelas (warna vgs-blue-electric atau background
     berbeda), ikuti pola yang sudah dipakai di Navbar storefront
     untuk konsistensi
   - Di bagian bawah sidebar: info user yang sedang login (nama,
     dan role-nya -- ambil dari auth.user seperti dijelaskan di
     bagian struktur data di atas) plus tombol/link Logout

3. KOMPONEN: resources/js/components/admin/Header.tsx
   Header di atas area konten (bukan sidebar), berisi:
   - Tombol hamburger/toggle untuk membuka-tutup sidebar (relevan
     terutama di mobile, tapi boleh juga ada di desktop untuk
     collapse sidebar jika mau)
   - Judul halaman saat ini (terima sebagai props string, misal
     title="Dashboard" -- akan diisi berbeda-beda oleh halaman yang
     memakainya nanti)
   - Sisi kanan: bisa berisi notifikasi (placeholder ikon saja,
     tidak perlu fungsional) dan info singkat user (avatar
     inisial + nama)

4. STYLING KONSISTEN DENGAN STOREFRONT
   PENTING: area admin ini bagian dari brand VGS yang SAMA, bukan
   template admin generic terpisah. Pakai warna, font, dan gaya
   komponen (border-radius, spacing) yang SAMA dengan yang sudah
   dipakai di storefront -- cek komponen di components/ui/ yang
   sudah ada (Button, Badge, dst) dan PAKAI ULANG, jangan bikin
   versi baru dari nol. Bedanya area admin dengan storefront cukup
   di STRUKTUR LAYOUT (ada sidebar, lebih fungsional/dense), bukan
   di palet warna atau tipografi.

RESPONSIVENESS -- WAJIB DICEK
--------------------------------------------------------------------
- Mobile (375-428px): sidebar tersembunyi default, bisa dibuka
  lewat tombol hamburger di Header, menutup lagi saat item menu
  diklik atau area luar sidebar disentuh
- Tablet (768-1024px): sidebar boleh tetap terlihat tapi lebih
  ramping, atau tetap collapsible tergantung ruang yang tersedia
- Desktop (1280px+): sidebar terlihat penuh secara default
- Semua tombol/elemen tap-able minimal 44x44px di mobile

AKSESIBILITAS -- WAJIB DICEK
--------------------------------------------------------------------
- Tombol toggle sidebar punya aria-label yang jelas (misal "Buka
  menu navigasi")
- Fokus keyboard terlihat jelas (ring vgs-blue-electric atau setara)
  di semua link dan tombol
- Item menu bisa dioperasikan penuh dengan keyboard (tab, enter)

====================================================================
YANG TIDAK PERLU/BOLEH KAMU KERJAKAN DI TAHAP INI
====================================================================

- JANGAN membangun isi/konten halaman Dashboard -- itu tugas rekan
  yang pakai Copilot (lihat BRIEF_FRONTEND_DASHBOARD.md), kamu hanya
  menyediakan AdminLayout yang akan DIPAKAI oleh halaman itu
- JANGAN membangun halaman admin lain (kelola produk, stok, pesanan,
  dst) -- itu di luar cakupan prompt ini, akan dikerjakan bertahap
  nanti dengan prompt terpisah
- JANGAN mengubah apapun di sisi storefront customer yang sudah ada
  (Navbar, Footer, Home, dst) -- kamu hanya menambah area admin baru
- JANGAN mengimplementasikan logic keamanan/proteksi akses di
  frontend (misal cek role lalu sembunyikan sidebar) -- itu sudah
  ditangani middleware backend, tugas kamu murni tampilan

====================================================================
WAJIB: DOKUMENTASI SETELAH SELESAI
====================================================================

Setelah selesai, TAMBAHKAN section baru di file
CATATAN_SISTEM_ROLE.md yang sudah dibuat rekan backend (JANGAN
timpa isi yang sudah ada, tambahkan section baru di bagian bawah
dengan heading "## Frontend: Layout Admin"), berisi:

1. Daftar file yang kamu buat (AdminLayout.tsx, Sidebar.tsx,
   Header.tsx) dengan penjelasan singkat fungsi masing-masing.
2. Props yang diterima tiap komponen (misal AdminLayout menerima
   children, Header menerima title, dst) supaya rekan yang bikin
   Dashboard tahu cara memakainya.
3. Contoh singkat cara memakai AdminLayout dari halaman lain,
   dalam bentuk potongan kode kecil, misal:
   <AdminLayout>
     <Header title="Dashboard" />
     ... konten halaman ...
   </AdminLayout>
   (sesuaikan contoh ini dengan struktur SEBENARNYA yang kamu buat,
   ini hanya ilustrasi kasar)

Tulis dalam Bahasa Indonesia, jelas dan tidak terlalu teknis.

====================================================================
ATURAN TAMBAHAN
====================================================================

- Kerjakan bertahap: (a) Sidebar.tsx dulu, (b) Header.tsx, (c)
  AdminLayout.tsx yang menggabungkan keduanya, (d) uji coba manual
  dengan konten placeholder sederhana untuk pastikan layout dan
  responsivitas bekerja, (e) update dokumentasi.
- Tampilkan ringkasan tiap bagian selesai sebelum lanjut, supaya
  saya bisa cek dan commit git bertahap.
- Jika ternyata komponen dasar yang kamu butuhkan dari components/ui/
  (Button, dst) belum cukup lengkap untuk kebutuhan admin (misal
  butuh varian baru), JANGAN membuat komponen duplikat -- beri tahu
  saya bagian apa yang perlu ditambahkan.
====================================================================
