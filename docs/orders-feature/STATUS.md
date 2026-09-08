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

## Admin storefront (UI)

- [x] Reusable admin order components di `resources/js/components/admin/orders/`:
  - [x] `OrderStatusBadge` (order/payment/fulfillment, warna konsisten dengan theme VGS)
  - [x] `OrderFilterBar` (cari no order/customer, status, date range)
  - [x] `OrderItemsTable` (snapshot read-only, opsional tampil cost_price untuk staff)
  - [x] `OrderStatusTimeline` (riwayat histori status + siapa & kapan)
- [x] Halaman `Admin/Orders/Index`: 3 kartu statistik, filter bar, tabel dengan badge status, pagination server-side, empty state, loading state.
- [x] Halaman `Admin/Orders/Show`: header dengan 3 badge status terpisah, info customer & alamat, tabel item, ringkasan biaya, timeline status, panel aksi (ubah status, tambah catatan, batalkan) dengan modal konfirmasi & toast/error.
- [x] Sidebar admin: item "Orders" tersambung ke `/admin/orders`.

---

*Status Akhir: SELESAI (Ready for PR).*
