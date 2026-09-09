====================================================================
PROMPT UNTUK AI FRONTEND -- DETAIL CUSTOMER (ADMIN)
BAGIAN KAMU: Halaman Admin/Customers/Show -- profil, alamat,
riwayat order, catatan support
Vortix Gaming Store (VGS) -- Modul Customers di Admin
Kompatibel dipakai di: Antigravity, OpenCode, Copilot, atau AI
coding assistant lain apapun -- ikuti instruksi ini apa adanya.
====================================================================

CARA PAKAI FILE INI
--------------------------------------------------------------------
Tempel SELURUH isi file ini ke AI coding tool pilihanmu sebagai
prompt awal. Simpan juga file ini di project sebagai
BRIEF_FRONTEND_CUSTOMER_DETAIL.md.

Ada rekan yang mengerjakan BACKEND (BRIEF_BACKEND_CUSTOMER.md) dan
rekan lain yang mengerjakan LISTING semua customer
(BRIEF_FRONTEND_CUSTOMER_LIST.md). Tugas kamu BERGANTUNG PADA
Controller dan route dari backend -- TUNGGU dia menyelesaikan
Controller+Route (cek CATATAN_CUSTOMER.md yang akan dia buat)
sebelum mulai. Tugas kamu TIDAK bergantung pada hasil Rekan 2 --
kamu bisa mulai membangun halaman detail begitu backend siap,
walau halaman listing belum selesai (kamu bisa akses halaman detail
langsung lewat URL untuk testing, tidak harus lewat klik dari
listing).

====================================================================
KONTEKS PROJECT
====================================================================

Toko online Vortix Gaming Store (VGS), Laravel 13 + Inertia 3 +
React 19 + TypeScript + Tailwind CSS. Area admin SUDAH ADA dengan
AdminLayout, Sidebar, Header, Dashboard, CRUD Product, Inventory,
dan Orders yang sudah berjalan lengkap -- termasuk halaman
Admin/Orders/Show yang SUDAH ADA dan bisa kamu LINK dari halaman ini
(JANGAN membangun ulang detail order, cukup arahkan ke sana). Style
memakai warna dari tailwind.config yang sudah ada dan komponen dari
components/ui/ yang sudah ada.

====================================================================
STRUKTUR DATA YANG AKAN KAMU PAKAI
====================================================================

CEK file CATATAN_CUSTOMER.md di root project (dibuat rekan backend)
untuk bentuk PERSIS:
- Route admin.customers.show, admin.customers.notes.store,
  admin.customers.notes.destroy, admin.customers.update-status
- Struktur props yang dikirim ke halaman Show: profil user, SEMUA
  alamat dari customer_addresses, ringkasan riwayat order (BUKAN
  detail item, hanya ringkasan: order_number, tanggal, grand_total,
  tiga status), dan daftar customer_notes dengan nama staf penulis
- Penjelasan siapa yang boleh melihat customer_notes (murni internal
  staf, jangan bocor ke customer manapun)

CEK JUGA CATATAN_CHECKOUT_ORDER.md (dari fitur Orders sebelumnya)
untuk tahu route admin.orders.show yang akan kamu pakai sebagai
link dari ringkasan order di halaman ini.

====================================================================
TUGAS KAMU
====================================================================

1. HALAMAN: resources/js/pages/Admin/Customers/Show.tsx
   Dibungkus AdminLayout yang sudah ada. Berisi:

   a. INFO PROFIL
      - Nama, email, nomor HP customer
      - Tanggal bergabung (created_at dari users)
      - Status akun (aktif/nonaktif) dengan Badge, DAN tombol untuk
        mengubah status ini (klik memunculkan konfirmasi dulu,
        kirim ke route admin.customers.update-status) -- JELASKAN
        DENGAN JELAS di UI apa efek menonaktifkan akun (misal
        "Customer tidak akan bisa login" sebagai teks penjelas kecil
        di dekat tombol, supaya admin paham konsekuensinya sebelum
        klik)
      - Ringkasan singkat: total order, total belanja (format
        rupiah), order terakhir -- data ini SUDAH DIHITUNG backend,
        tampilkan apa adanya

   b. DAFTAR ALAMAT TERSIMPAN
      Tampilkan SEMUA alamat dari customer_addresses milik customer
      ini (recipient, phone, street, village, district, city,
      province, postal_code, tandai mana yang is_default) -- format
      tampilan MIRIP dengan yang sudah dipakai di halaman "Alamat
      Saya" milik customer sendiri (untuk konsistensi visual), tapi
      di sini READ-ONLY (admin hanya melihat, TIDAK BISA mengedit
      alamat customer dari sini -- itu privasi milik customer
      sendiri untuk diubah lewat akunnya)

   c. RINGKASAN RIWAYAT ORDER
      Tabel sederhana: nomor order, tanggal, grand_total, TIGA
      badge status (order/payment/fulfillment -- ikuti pola warna
      yang SUDAH DIPAKAI di halaman Admin/Orders/Index yang sudah
      ada, untuk konsistensi). SETIAP baris punya link "Lihat
      Detail" yang mengarah ke route('admin.orders.show', order.id)
      -- halaman itu SUDAH ADA dari fitur Orders sebelumnya, JANGAN
      membangun ulang tampilan detail order di sini.
      Jika customer belum pernah order, tampilkan pesan jelas
      "Customer ini belum pernah melakukan pemesanan."

   d. CATATAN SUPPORT INTERNAL (BAGIAN PALING PENTING -- FITUR BARU)
      - Tampilkan daftar customer_notes yang sudah ada, urut
        terbaru dulu: isi catatan, nama staf yang menulis, tanggal
      - Form untuk menambah catatan baru: textarea + tombol
        "Simpan Catatan", kirim ke route
        admin.customers.notes.store. Setelah berhasil, catatan baru
        LANGSUNG muncul di daftar tanpa perlu reload manual (pakai
        router.reload() dari Inertia atau update state lokal)
      - Setiap catatan punya tombol hapus kecil (opsional, sesuai
        apakah backend menyediakan endpoint destroyNote -- cek
        dokumentasi, jika tidak tersedia, lewati bagian hapus dan
        catat di ringkasan)
      - BERI PENANDA VISUAL JELAS bahwa section ini BERSIFAT
        INTERNAL (misal label kecil "Hanya terlihat oleh staf" atau
        ikon kunci/gembok di judul section) -- supaya tidak ada
        kebingungan bahwa ini bukan bagian yang terlihat customer

RESPONSIVENESS DAN AKSESIBILITAS
--------------------------------------------------------------------
Sama seperti pola yang sudah dipakai di halaman admin lain untuk
konsistensi -- grid/layout menyesuaikan layar, tap target 44px di
mobile, fokus keyboard jelas, form catatan bisa dioperasikan penuh
dengan keyboard.

====================================================================
YANG TIDAK PERLU/BOLEH KAMU KERJAKAN DI TAHAP INI
====================================================================

- JANGAN membangun halaman Admin/Customers/Index (listing) -- itu
  tugas Rekan 2
- JANGAN membangun ulang tampilan detail order -- LINK saja ke
  halaman Admin/Orders/Show yang sudah ada
- JANGAN mengizinkan admin MENGEDIT alamat customer dari halaman
  ini -- read-only, alamat hanya bisa diubah customer sendiri lewat
  akunnya
- JANGAN membuat customer_notes bisa diakses/terlihat lewat
  halaman/akun customer manapun -- ini murni untuk staf

====================================================================
WAJIB: DOKUMENTASI SETELAH SELESAI
====================================================================

Tambahkan section baru di file CATATAN_CUSTOMER.md yang sudah ada
(JANGAN timpa isi yang sudah ada, tambahkan di bagian bawah dengan
heading "## Frontend: Detail Customer"), berisi:

1. Daftar file yang dibuat/diubah.
2. Konfirmasi hasil uji coba: tambah catatan baru berhasil dan
   langsung muncul, ubah status akun berhasil, link ke detail order
   berfungsi dengan benar.
3. Catatan jika fitur hapus catatan tidak sempat dibangun (karena
   endpoint backend belum tersedia saat itu), sebagai keterbatasan
   yang bisa ditambahkan nanti.
4. Catatan jika ada penyesuaian dari yang didokumentasikan backend.

Tulis dalam Bahasa Indonesia, jelas dan tidak terlalu teknis.

====================================================================
ATURAN TAMBAHAN
====================================================================

- Kerjakan bertahap: (a) info profil dan ringkasan, (b) daftar
  alamat read-only, (c) ringkasan riwayat order dengan link ke
  detail, (d) fitur catatan support (tampilkan + tambah), (e) fitur
  ubah status akun, (f) uji coba semua, (g) dokumentasi.
- Tampilkan ringkasan tiap bagian selesai sebelum lanjut, supaya
  bisa dicek dan commit git bertahap.
- Jika data dari backend TIDAK SESUAI dokumentasi, JANGAN menebak
  -- laporkan dengan jelas di ringkasan.
====================================================================
