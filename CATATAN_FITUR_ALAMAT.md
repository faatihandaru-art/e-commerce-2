# CATATAN FITUR ALAMAT — Vortix Gaming Store (VGS)

## 1. Daftar File yang Dibuat/Diubah

### Migration
- `database/migrations/2026_08_27_022956_create_customer_addresses_table.php` — Sudah ada sebelumnya, mendefinisikan struktur tabel `customer_addresses`.

### Model
- `app/Models/CustomerAddress.php` — Model untuk tabel `customer_addresses`, berisi relasi `belongsTo` ke User dan definisi atribut yang boleh diisi (`fillable`).
- `app/Models/User.php` — Ditambahkan relasi `hasMany(CustomerAddress::class)` agar user bisa memiliki banyak alamat.

### Domain Action
- `app/Domain/Customer/Actions/SaveCustomerAddressAction.php` — Logic bisnis penyimpanan alamat: jika alamat baru ditandai sebagai default, alamat default lain milik user yang sama akan di-unset otomatis, lalu alamat baru disimpan.

### Form Request
- `app/Http/Requests/Customer/StoreAddressRequest.php` — Validasi input untuk form tambah alamat. Memastikan semua field wajib terisi, tipe data benar, dan batasan panjang karakter terpenuhi.

### Controller
- `app/Http/Controllers/Customer/AddressController.php` — Controller dengan dua method:
  - `store()` — Menerima request, memanggil Action untuk menyimpan alamat, lalu redirect kembali ke halaman daftar alamat.
  - `destroy()` — Menghapus alamat milik user yang sedang login (dibatasi berdasarkan `user_id`).

### Route
- `routes/web.php` — Ditambahkan tiga route di dalam grup `middleware('auth')->prefix('account')`:
  - `GET /account/addresses` — Menampilkan halaman daftar alamat beserta data alamat user.
  - `POST /account/addresses` — Menyimpan alamat baru.
  - `DELETE /account/addresses/{id}` — Menghapus alamat berdasarkan ID.

### Frontend
- `resources/js/components/account/AddAddressForm.tsx` — Komponen form tambah alamat dalam modal, mendukung dua mode: isi manual dan gunakan lokasi saat ini (GPS + reverse geocoding).
- `resources/js/pages/Account/Addresses.tsx` — Halaman daftar alamat yang menampilkan semua alamat user, dengan tombol buka modal tambah alamat dan tombol hapus per alamat.

---

## 2. API yang Digunakan

### Geolocation API (Bawaan Browser)
- **Untuk apa:** Mendapatkan koordinat GPS (latitude dan longitude) dari perangkat user.
- **Cara kerja:** Dipanggil lewat `navigator.geolocation.getCurrentPosition()`. Browser akan meminta izin kepada user. Jika diizinkan, koordinat dikembalikan lewat callback.
- **Tanpa biaya:** Ini adalah fitur bawaan browser, tidak memerlukan koneksi internet atau API pihak ketiga.
- **Batasan:** Hanya berfungsi di halaman HTTPS, kecuali saat development di localhost/127.0.0.1.

### Nominatim — OpenStreetMap (Reverse Geocoding)
- **Untuk apa:** Mengubah koordinat GPS menjadi alamat teks (nama jalan, kelurahan, kecamatan, kota, provinsi, kode pos).
- **Endpoint:** `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat={latitude}&lon={longitude}`
- **Gratis tanpa API key:** Tidak perlu mendaftar akun atau kartu kredit. Cukup panggil endpoint langsung dari browser.
- **Aturan fair use (OpenStreetMap Foundation):**
  - Maksimal 1 request per detik dari aplikasi ini. Untuk fitur ini (user klik tombol sekali), aturan ini otomatis terpenuhi.
  - Tidak boleh melakukan reverse geocoding otomatis berulang kali tanpa aksi eksplisit dari user.
- **Mengapa Nominatim, bukan Google Maps?** Google Maps Geocoding API memerlukan API key, akun billing, dan memiliki kuota gratis yang terbatas. Untuk kebutuhan project PKL/skripsi, Nominatim cukup memadai dan benar-benar gratis tanpa batasan kuota yang signifikan untuk penggunaan normal.

---

## 3. Alur Kerja Fitur

1. User login ke akun VGS.
2. Navigasi ke halaman **Alamat Saya** (`/account/addresses`).
3. Klik tombol **"+ Tambah Alamat"**. Modal form akan terbuka.
4. **Pilihan mode:**
   - **Isi Manual:** User mengisi semua field alamat secara manual.
   - **Gunakan Lokasi Saat Ini:** User klik tab ini, browser meminta izin lokasi. Jika diizinkan, koordinat GPS dikirim ke Nominatim untuk reverse geocoding. Field alamat akan terisi otomatis berdasarkan hasil tersebut. User tetap bisa mengedit semua field sebelum menyimpan.
5. User memastikan data sudah benar, lalu klik **"Simpan Alamat"**.
6. Data dikirim ke backend lewat POST request, divalidasi oleh `StoreAddressRequest`, lalu disimpan oleh `SaveCustomerAddressAction` ke database.
7. User diarahkan kembali ke halaman daftar alamat dengan pesan sukses.

---

## 4. Catatan Keterbatasan

- **Harus HTTPS:** Fitur Geolocation (GPS) tidak akan berfungsi jika website diakses lewat HTTP biasa di domain production. Browser modern hanya mengizinkan Geolocation di halaman HTTPS atau localhost. Pastikan server production sudah menggunakan SSL/TLS.

- **Akurasi data lokasi tergantung OpenStreetMap:** Hasil reverse geocoding dari Nominatim bergantung pada kelengkapan data OpenStreetMap di wilayah tersebut. Di daerah yang datanya belum lengkap (terutama pedesaan), beberapa field mungkin kosong. Kode sudah dirancang untuk menangani kondisi ini dengan fallback antar field (misalnya, jika field `village` kosong, akan dicoba dari `suburb`).

- **User harus mengecek ulang:** Sistem tidak menjamin 100% akurasi hasil isi otomatis dari GPS. User disarankan untuk memeriksa dan mengedit hasilnya sebelum menyimpan. Jika hasil GPS salah, user bisa langsung mengedit field-nya karena semua field tetap bisa diedit kapan saja.

- **Hanya satu alamat default:** Setiap user hanya boleh memiliki satu alamat utama (`is_default = true`). Jika user menandai alamat baru sebagai default, alamat default sebelumnya akan otomatis di-unset.

- **Penghapusan tanpa konfirmasi backend:** Saat ini fitur hapus alamat hanya menggunakan `confirm()` browser. Belum ada fitur soft delete atau arsip alamat — penghapusan bersifat permanen.
