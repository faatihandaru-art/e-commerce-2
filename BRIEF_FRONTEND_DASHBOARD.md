====================================================================
PROMPT UNTUK COPILOT -- FRONTEND: HALAMAN DASHBOARD & INTEGRASI DATA
BAGIAN KAMU: Admin/Dashboard.tsx, baca data auth.user.roles
Vortix Gaming Store (VGS) -- Sistem Role & Akses Staf vs Customer
====================================================================

CARA PAKAI FILE INI
--------------------------------------------------------------------
Tempel SELURUH isi file ini ke Copilot sebagai prompt awal. Simpan
juga file ini di project sebagai BRIEF_FRONTEND_DASHBOARD.md.

Ada rekan yang mengerjakan BACKEND (BRIEF_BACKEND_ROLE.md, dikerjakan
di Antigravity) dan rekan lain yang mengerjakan LAYOUT+SIDEBAR admin
(BRIEF_FRONTEND_LAYOUT.md, dikerjakan di OpenCode). Tugas kamu
BERGANTUNG PADA HASIL REKAN LAYOUT -- kamu memakai AdminLayout,
Sidebar, dan Header yang dia buat, BUKAN membuat versi sendiri.

TUNGGU rekan yang mengerjakan BRIEF_FRONTEND_LAYOUT.md menyelesaikan
resources/js/layouts/AdminLayout.tsx dan komponen pendukungnya
sebelum kamu mulai. Cek juga CATATAN_SISTEM_ROLE.md di root project
(diperbarui oleh KEDUA rekan lain) untuk tahu struktur data yang
tersedia dan cara memakai AdminLayout yang sudah mereka buat.

====================================================================
KONTEKS PROJECT
====================================================================

Toko online Vortix Gaming Store (VGS), dibangun dengan Laravel 13 +
Inertia 3 + React 19 + TypeScript + Tailwind CSS. Frontend storefront
customer SUDAH ADA dengan style brand: warna dominan hitam dengan
aksen biru elektrik, tipografi tegas bergaya gaming/esports. Semua
warna dan font SUDAH terdaftar di tailwind.config (cari nama-nama
seperti vgs-black-void, vgs-blue-electric, vgs-silver-bright, dst --
CEK FILE tailwind.config untuk daftar lengkap sebelum menulis kode).

Sekarang sedang dibangun AREA ADMIN untuk staf mengelola toko.
Backend SUDAH/SEDANG menyediakan route admin.dashboard yang
merender Inertia::render('Admin/Dashboard') -- INI HALAMAN YANG
JADI TUGAS UTAMA KAMU.

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
backend, bagian "BENTUK STRUKTUR DATA props.auth.user") untuk
bentuk PERSIS struktur data ini sebelum menulis kode -- dokumen itu
sumber kebenaran, bukan contoh di atas yang sifatnya perkiraan.

====================================================================
TUGAS KAMU
====================================================================

1. HALAMAN: resources/js/pages/Admin/Dashboard.tsx
   Ini halaman yang dirender route admin.dashboard dari backend.
   Untuk tahap ini, isi CUKUP SEDERHANA -- fokus utamanya adalah
   MEMASTIKAN INTEGRASI DATA berjalan benar, BUKAN membangun fitur
   dashboard yang lengkap (grafik penjualan, dst -- itu di luar
   cakupan prompt ini, akan dikerjakan bertahap nanti):

   - Bungkus konten dengan AdminLayout yang SUDAH DIBUAT rekan tim
     (import dari resources/js/layouts/AdminLayout.tsx), dan Header
     yang juga sudah dia buat (dengan title="Dashboard" atau serupa)
     -- CEK CATATAN_SISTEM_ROLE.md untuk tahu CARA PERSIS memakai
     komponen-komponen itu, ikuti contoh yang sudah didokumentasikan
     rekan tim, JANGAN menebak strukturnya sendiri
   - Tampilkan pesan sambutan personal, contoh: "Selamat datang,
     [nama user]" -- ambil nama dari auth.user.name lewat usePage()
     seperti dijelaskan di atas
   - Tampilkan role user yang sedang login (misal sebagai badge/pill
     kecil di bawah nama, contoh tampilan "Super Admin" -- ambil
     dari auth.user.roles, ingat satu user untuk sekarang dianggap
     hanya punya satu role aktif, jadi ambil roles[0] cukup aman,
     tapi kode HARUS tetap tidak error jika roles ternyata array
     kosong -- tampilkan fallback seperti "Staf" jika begitu, jangan
     biarkan halaman crash)
   - Tambahkan BEBERAPA kartu ringkasan PLACEHOLDER (boleh dengan
     angka dummy/statis untuk sekarang, karena data sungguhan seperti
     total pesanan/produk belum tersambung) untuk memberi kesan
     dashboard yang berfungsi, misal: "Total Produk", "Pesanan Hari
     Ini", "Pendapatan Bulan Ini", "Stok Menipis" -- pakai style
     card yang konsisten dengan komponen ui/ yang sudah ada di
     project (cek components/ui/ untuk komponen yang bisa dipakai
     ulang, jangan bikin versi baru dari nol)
   - Beri komentar TODO yang jelas di kode menandai bagian mana yang
     nanti perlu diganti dengan data sungguhan dari backend (setelah
     fitur kelola produk/pesanan/dst dibangun di tahap-tahap
     berikutnya), supaya jelas ini memang sengaja masih dummy bukan
     lupa dikerjakan

2. VERIFIKASI INTEGRASI (BAGIAN PALING PENTING DARI TUGAS KAMU)
   Setelah halaman dibuat, lakukan pengecekan berikut dan laporkan
   hasilnya ke saya:
   - Apakah data auth.user benar-benar terkirim dan bisa dibaca di
     halaman ini (coba console.log sementara untuk verifikasi
     bentuk datanya cocok dengan yang didokumentasikan backend, lalu
     hapus console.log itu setelah yakin berfungsi)
   - Apakah AdminLayout, Sidebar, dan Header dari rekan tim berhasil
     ter-render tanpa error saat dipakai dari halaman ini
   - Jika ada KETIDAKCOCOKAN antara apa yang didokumentasikan rekan
     tim (backend maupun layout) dengan kenyataan kode yang ada
     (misal nama props berbeda dari yang didokumentasikan, atau
     struktur data auth.user tidak sesuai dokumentasi), JANGAN
     memaksakan kode menyesuaikan diam-diam -- laporkan
     ketidakcocokan itu dengan jelas di ringkasan akhir supaya bisa
     dikoordinasikan ulang dengan rekan yang bersangkutan

====================================================================
YANG TIDAK PERLU/BOLEH KAMU KERJAKAN DI TAHAP INI
====================================================================

- JANGAN membuat versi AdminLayout/Sidebar/Header sendiri walau
  punya ide yang menurutmu lebih bagus -- itu tugas rekan yang
  mengerjakan BRIEF_FRONTEND_LAYOUT.md, PAKAI hasil kerjanya apa
  adanya. Jika hasil kerjanya menurutmu kurang, laporkan di ringkasan
  akhir, jangan menimpa/membuat versi paralel
- JANGAN membangun halaman admin lain (kelola produk, stok, pesanan,
  dst) -- di luar cakupan prompt ini
- JANGAN mengubah apapun di sisi storefront customer yang sudah ada
- JANGAN mengimplementasikan proteksi akses/pengecekan role untuk
  MENOLAK akses di frontend (misal redirect manual jika bukan staf)
  -- itu SUDAH ditangani middleware backend sebelum halaman ini
  sempat dirender, tugas kamu murni MENAMPILKAN info role yang
  sudah pasti valid, bukan memvalidasi ulang

====================================================================
WAJIB: DOKUMENTASI SETELAH SELESAI
====================================================================

Setelah selesai, TAMBAHKAN section baru di file
CATATAN_SISTEM_ROLE.md yang sudah ada (JANGAN timpa isi yang sudah
ada, tambahkan section baru di bagian paling bawah dengan heading
"## Frontend: Halaman Dashboard"), berisi:

1. Konfirmasi bahwa integrasi data auth.user berhasil diverifikasi
   (atau laporkan masalah jika ada ketidakcocokan seperti dijelaskan
   di atas).
2. Daftar kartu placeholder yang dibuat di dashboard, dengan catatan
   jelas bahwa datanya masih dummy dan menunggu fitur backend terkait
   dibangun di tahap berikutnya.
3. Screenshot atau deskripsi singkat tampilan akhir (dalam teks,
   karena AI tidak bisa menyertakan gambar sungguhan, cukup
   deskripsikan tata letaknya).

Tulis dalam Bahasa Indonesia, jelas dan tidak terlalu teknis.

====================================================================
ATURAN TAMBAHAN
====================================================================

- SEBELUM mulai coding, cek dulu apakah AdminLayout.tsx dari rekan
  tim sudah ada di project. Jika BELUM ada, beri tahu saya bahwa
  kamu perlu menunggu rekan tim menyelesaikan bagian layout dulu --
  jangan membuat AdminLayout versi sementara sendiri untuk "supaya
  bisa lanjut", karena itu berpotensi menghasilkan dua versi layout
  yang berbeda dan membingungkan saat digabung nanti.
- Tampilkan ringkasan setelah selesai, termasuk hasil verifikasi
  integrasi data seperti diminta di atas, supaya saya bisa cek dan
  commit git.
====================================================================
