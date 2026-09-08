# Orders Feature Status

## Customer storefront (UI)

- [x] Customer order list with status filters and pagination
- [x] Customer order detail with snapshot items, address, totals, shipment, and timeline
- [x] User ownership check on order detail route
- [x] Indonesian customer-friendly status labels and empty states
- [x] React components: `Account/Orders/Index` & `Account/Orders/Show`

---

## Backend Foundation

Dokumen ini mencatat status implementasi backend fondasi untuk fitur **Orders**.

## Progress Checklist

- [x] **Database & Migration Verification**
  - [x] Verifikasi tabel `orders`, `order_items`, `order_addresses`, `order_status_histories`, `order_adjustments`, `order_notes`, `payments`, `shipments`, `stock_reservations`, `refunds`.
  - [x] Model Eloquent disiapkan di `app/Models/` dengan relasi terhubung lengkap (`Order`, `OrderItem`, `OrderAddress`, `OrderStatusHistory`, `OrderNote`, `OrderAdjustment`, `Payment`, `Shipment`, `StockReservation`, `Refund`).

- [x] **Domain Layer (`app/Domain/Order/`)**
  - [x] `OrderStatus` Enum dengan state machine transition guard (`canTransitionTo`).
  - [x] `ListAdminOrdersQuery`: pencarian multi-field, filter status/tanggal, pagination, dan pembuatan object `summary` (`total_orders`, `perlu_diproses`, `perlu_dikirim`).
  - [x] `GetOrderDetailQuery`: memuat seluruh relasi detail order (items, addresses, status history, payment, shipment, notes, adjustments).
  - [x] `ListUserOrdersQuery`: scoped ke user login dengan pencarian dan filter status.
  - [x] `UpdateOrderStatusAction`: validasi transisi status ketat, pencatatan otomatis `order_status_histories`, penyesuaian otomatis status sekunder (payment/fulfillment), pelepasan `stock_reservations` saat dibatalkan.
  - [x] `CancelOrderAction`: pembatalan order, pelepasan `stock_reservations`, pemulihan stok variant, dan pencatatan history.
  - [x] `AddOrderNoteAction`: penambahan catatan internal / customer.
  - [x] `InvalidOrderStatusTransitionException`: custom domain exception untuk transisi ilegal.

- [x] **Policy Layer (`app/Policies/OrderPolicy.php`)**
  - [x] Otorisasi staff/admin vs customer.
  - [x] Pembatasan akses view & cancel customer strictly ke `user_id === auth()->id()`.

- [x] **HTTP Layer (`app/Http/Controllers/`, `Requests/`, `Resources/`)**
  - [x] `OrderListResource`: format ringkas untuk tabel daftar order.
  - [x] `OrderItemResource`: penyembunyian `cost_price` untuk customer.
  - [x] `OrderResource`: format detail lengkap dengan perlindungan data privasi/sensitif untuk customer (hanya customer notes, no raw payment secrets, no cost price).
  - [x] `UpdateOrderStatusRequest` & `AddOrderNoteRequest`: validasi input admin.
  - [x] `Admin\OrderController`: endpoint `index`, `show`, `updateStatus`, `addNote`, `cancel`.
  - [x] `Account\OrdersController`: endpoint `index`, `show`, `cancel`.

- [x] **Routing (`routes/admin.php` & `routes/web.php`)**
  - [x] Admin routes terdaftar di `routes/admin.php` di bawah middleware `auth` + `staff`.
  - [x] Account routes terdaftar di `routes/web.php` di bawah middleware `auth`.

- [x] **Automated Tests (`tests/Feature/OrderManagementTest.php`)**
  - [x] Admin list & filter order + summary metrics test.
  - [x] Admin update status valid transition & history recording test.
  - [x] Transisi status tidak valid ditolak (422) test.
  - [x] Customer 403 authorization guard untuk order orang lain test.
  - [x] Endpoint `/account/orders` tidak membocorkan `cost_price` atau `internal` notes test.
  - [x] Customer cancel `pending_payment` order test.

- [x] **Dokumentasi & Verifikasi Kode**
  - [x] `docs/orders-feature/API_CONTRACT.md` dibuat.
  - [x] `docs/orders-feature/STATUS.md` dibuat.
  - [x] Formatter Pint & Static Analyzer Larastan telah dijalankan.

---

*Status Akhir: SELESAI (Ready for PR).*

---

# Status Frontend Admin — Halaman Orders (Branch: `feat/orders-admin-ui`)

Dikerjakan oleh **OpenCode (Person 2 — Frontend Admin)** dengan referensi desain halaman
Admin > Inventory (VGS / Vortix Gaming Store, dark theme).

## Progress Checklist

- [x] **Sidebar & Routing**
  - [x] Menu "Orders" di sidebar admin diarahkan dari `#` (placeholder) ke `/admin/orders`.
  - [x] Halaman `resources/js/pages/Admin/Orders/Index.tsx` terhubung ke route `admin.orders.index`.
  - [x] Halaman `resources/js/pages/Admin/Orders/Show.tsx` terhubung ke route `admin.orders.show`.

- [x] **Tipe & Mapping Bersama (`resources/js/types/orders.ts`)**
  - [x] Tipe `OrderListItem`, `OrderPaginator`, `OrdersSummary`, `OrderFilters`, `OrderDetail`, `OrderItem`, dll —
    bentuk mengikuti `API_CONTRACT.md`.
  - [x] Mapping label + warna badge di `components/admin/orders/orderStatus.ts`
    (`ORDER_STATUS_META`, `PAYMENT_STATUS_META`, `FULFILLMENT_STATUS_META`, `NEXT_ORDER_STATUSES`).

- [x] **Komponen Reusable (`resources/js/components/admin/orders/`)**
  - [x] `OrderStatusBadge.tsx` — menerima `type` (`order` | `payment` | `fulfillment`) + nilai status,
        render warna berbeda; opsi `showType` untuk menampilkan label tipe status.
  - [x] `OrderFilterBar.tsx` — input "Cari No. Order / Customer", dropdown status order, dapat diaktifkan
        dropdown payment/fulfillment, dan date range opsional; controlled + tombol "Terapkan Filter".
  - [x] `OrderItemsTable.tsx` — tabel item pesanan read-only (produk, varian, qty, harga satuan, diskon,
        pajak, subtotal) — semua dari snapshot, TIDAK dihitung ulang di frontend.
  - [x] `OrderStatusTimeline.tsx` — timeline histori status (siapa yang mengubah & kapan).
  - [x] `useInertiaLoading.ts` — hook indicator loading untuk kunjungan Inertia
        (dipakai halaman Index saat filter/pagination berubah).

  > **Catatan koordinasi dengan Copilot (halaman User "Pesanan Saya"):**
  > Komponen di atas **sudah dipakai ulang** oleh halaman Account
  > (`pages/Account/Orders/Index.tsx` & `Show.tsx`) — tidak ada duplikasi lagi.
  > `OrderStatusBadge` dirancang agar bisa dipakai di halaman Account juga.
  > Label/single source of truth ada di `components/admin/orders/orderStatus.ts`.

- [x] **Halaman `Admin/Orders/Index.tsx` (Daftar Order)**
  - [x] Header + subjudul ringkasan ("X pesanan perlu diproses") pola sama dengan Inventory.
  - [x] 3 kartu statistik: **TOTAL ORDERS** / **PERLU DIPROSES** (warning) / **PERLU DIKIRIM** (blue).
  - [x] Filter bar: cari no. order/customer, status order, payment status, fulfillment status, date range.
  - [x] Tabel: No. Order, Customer, Tanggal, Grand Total, Order Status, Payment Status, Fulfillment Status,
        aksi "Lihat Detail" (outline biru, sama gaya tombol "Sesuaikan Stok").
  - [x] Pagination server-side (ikut props Inertia `orders.meta`).
  - [x] Empty state + loading state saat filter berubah (`router.get` + `preserveState`).

- [x] **Halaman `Admin/Orders/Show.tsx` (Detail Order)**
  - [x] Header: No. Order, tanggal, 3 badge status TERPISAH (order/payment/fulfillment) — status independen.
  - [x] Info customer + alamat pengiriman & penagihan (snapshot `shipping_address`/`billing_address`).
  - [x] Tabel item pesanan read-only + ringkasan total (subtotal, diskon, ongkir, pajak, biaya lain, grand total).
  - [x] Timeline histori status (`status_histories`).
  - [x] Panel aksi admin:
    - [x] Dropdown ubah `order_status` → `PATCH /admin/orders/{id}/status`, alasan (`notes`) wajib diisi,
          pilihan status tujuan mengikuti state machine di `API_CONTRACT.md`.
    - [x] Form catatan internal → `POST /admin/orders/{id}/notes` (dropdown visibilitas internal/customer).
    - [x] Tombol "Batalkan Order" dengan dialog konfirmasi → `POST /admin/orders/{id}/cancel` (alasan opsional).
  - [x] Toast/flash sukses & gagal; tombol di-disable saat submitting.
  - [x] State terminal (`cancelled`/`refunded`) menyembunyikan aksi yang tidak valid.
  - [x] Guard: aksi admin hanya tampil untuk status yang valid; policy backend tetap penjaga utama
        (refund endpoint tidak tersedia di kontrak backend → tidak dibuat).

- [ ] **Refund UI** — tidak dibuat; tidak ada route `POST /admin/orders/{id}/refund` di
      `API_CONTRACT.md` maupun `routes/admin.php`. Akan ditambahkan bila backend menyediakan endpoint.

- [x] **Verifikasi**
  - [x] `npm run typecheck` (tsc --noEmit) lulus.
  - [x] `npm run build` (vite build) lulus.

- [x] **Deduplikasi komponen (hasil sync dengan branch utama Copilot)**
  - [x] Halaman Account `pages/Account/Orders/Index.tsx` & `Show.tsx` kini memakai
        `components/admin/orders/OrderStatusBadge` + `orderStatus.ts` (label diturunkan dari *_META).
  - [x] Folder duplikat `resources/js/components/orders/` dihapus.
  - [x] `components/admin/orders/orderStatus.ts` mendapat compatibility exports
        (`PAYMENT_STATUS_LABELS`, `FULFILLMENT_STATUS_LABELS`, `paymentStatusLabel`, dll).

*Status Akhir: SELESAI (Ready for PR) — `feat/admin: orders list & detail pages`.*
