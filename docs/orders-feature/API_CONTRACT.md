# API Contract & Specs — Orders Feature

Dokumen ini berisi kontrak API final untuk fitur **Orders** (Admin Panel & Account / "Pesanan Saya").
Frontend (OpenCode & Copilot) dapat membaca spesifikasi ini untuk melakukan integrasi tanpa menebak-nebak.

---

## 1. Status Enums

### Order Status (`order_status`)
- `pending_payment`: Menunggu pembayaran dari customer.
- `confirmed`: Pembayaran dikonfirmasi / order dikonfirmasi admin.
- `processing`: Order sedang diproses / disiapkan di gudang.
- `packed`: Barang selesai dikemas dan siap dikirim.
- `shipped`: Barang telah diserahterimakan ke kurir / sedang dalam pengiriman.
- `completed`: Order selesai diterima customer.
- `cancelled`: Order dibatalkan.
- `refunded`: Order telah direfund.

#### Aturan Transisi Status Valid:
- `pending_payment` -> `confirmed`, `cancelled`
- `confirmed` -> `processing`, `cancelled`, `refunded`
- `processing` -> `packed`, `cancelled`, `refunded`
- `packed` -> `shipped`, `cancelled`, `refunded`
- `shipped` -> `completed`, `refunded`
- `completed` -> `refunded`
- `cancelled` -> (terminal)
- `refunded` -> (terminal)

### Payment Status (`payment_status`)
- `unpaid`, `pending`, `paid`, `failed`, `expired`, `partially_refunded`, `refunded`

### Fulfillment Status (`fulfillment_status`)
- `unfulfilled`, `processing`, `partially_fulfilled`, `fulfilled`, `returned`

---

## 2. Admin API & Routes (`/admin/orders`)

Semua route admin dilindungi middleware `auth` + `staff`.

### 2.1 List Orders & Summary Cards
- **Route**: `GET /admin/orders`
- **Name**: `admin.orders.index`
- **Query Parameters**:
  - `status` / `order_status` (optional, string): Filter berdasarkan status order (misal `pending_payment`, `packed`).
  - `payment_status` (optional, string)
  - `fulfillment_status` (optional, string)
  - `search` (optional, string): Cari no order, nama/email/telepon customer, atau penerima.
  - `date_from` (optional, date string YYYY-MM-DD)
  - `date_to` (optional, date string YYYY-MM-DD)
  - `sort_by` (optional, default `created_at`)
  - `sort_order` (optional, `asc` | `desc`, default `desc`)
  - `per_page` (optional, integer, default `15`)
  - `page` (optional, integer, default `1`)

- **Response Shape (Inertia Props / JSON)**:
```json
{
  "orders": {
    "data": [
      {
        "id": 1,
        "order_number": "ORD-20260908-0001",
        "customer": {
          "id": 5,
          "name": "Budi Santoso",
          "email": "budi@example.com",
          "phone": "08123456789"
        },
        "currency": "IDR",
        "subtotal": 1500000,
        "discount_total": 50000,
        "shipping_total": 20000,
        "tax_total": 0,
        "fee_total": 0,
        "grand_total": 1470000,
        "order_status": "confirmed",
        "payment_status": "paid",
        "fulfillment_status": "processing",
        "items_count": 2,
        "placed_at": "2026-09-08T10:00:00.000000Z",
        "created_at": "2026-09-08T10:00:00.000000Z"
      }
    ],
    "links": { ... },
    "meta": { ... }
  },
  "summary": {
    "total_orders": 120,
    "perlu_diproses": 15,
    "perlu_dikirim": 8
  },
  "filters": {
    "status": "confirmed"
  }
}
```

---

### 2.2 Get Order Detail (Admin)
- **Route**: `GET /admin/orders/{order}`
- **Name**: `admin.orders.show`
- **Response Shape**:
```json
{
  "order": {
    "id": 1,
    "order_number": "ORD-20260908-0001",
    "customer": {
      "id": 5,
      "name": "Budi Santoso",
      "email": "budi@example.com",
      "phone": "08123456789"
    },
    "contact_email": "budi@example.com",
    "contact_phone": "08123456789",
    "currency": "IDR",
    "subtotal": 1500000,
    "discount_total": 50000,
    "shipping_total": 20000,
    "tax_total": 0,
    "fee_total": 0,
    "grand_total": 1470000,
    "order_status": "confirmed",
    "payment_status": "paid",
    "fulfillment_status": "processing",
    "placed_at": "2026-09-08T10:00:00.000000Z",
    "created_at": "2026-09-08T10:00:00.000000Z",
    "updated_at": "2026-09-08T10:05:00.000000Z",
    "items": [
      {
        "id": 10,
        "order_id": 1,
        "product_id": 3,
        "variant_id": 12,
        "sku": "VGS-KB-01",
        "product_name": "Mechanical Keyboard RGB",
        "variant_name": "Blue Switch",
        "unit_price": 750000,
        "quantity": 2,
        "discount_amount": 50000,
        "tax_amount": 0,
        "cost_price": 450000,
        "total": 1450000,
        "image": "https://example.com/images/kb.jpg",
        "metadata": null
      }
    ],
    "shipping_address": {
      "id": 1,
      "recipient": "Budi Santoso",
      "phone": "08123456789",
      "address_line1": "Jl. Gatot Subroto No. 45",
      "address_line2": "Apt 3B",
      "city": "Jakarta Selatan",
      "province": "DKI Jakarta",
      "postal_code": "12930",
      "country": "Indonesia"
    },
    "billing_address": null,
    "status_histories": [
      {
        "id": 1,
        "from_status": "pending_payment",
        "to_status": "confirmed",
        "notes": "Pembayaran Midtrans dikonfirmasi",
        "changed_by": { "id": 1, "name": "System Admin" },
        "created_at": "2026-09-08T10:05:00.000000Z"
      }
    ],
    "payments": [
      {
        "id": 1,
        "method": "qris",
        "provider": "midtrans",
        "amount": 1470000,
        "currency": "IDR",
        "status": "paid",
        "payment_url": null,
        "paid_at": "2026-09-08T10:05:00.000000Z",
        "expires_at": null,
        "provider_reference": "TRX-998877",
        "metadata": {}
      }
    ],
    "shipments": [],
    "notes": [
      {
        "id": 1,
        "visibility": "internal",
        "note": "Customer minta pengemasan ekstra bubble wrap",
        "created_by": { "id": 2, "name": "CS Staff" },
        "created_at": "2026-09-08T10:10:00.000000Z"
      }
    ],
    "adjustments": []
  }
}
```

---

### 2.3 Update Order Status (Admin)
- **Route**: `PATCH /admin/orders/{order}/status`
- **Name**: `admin.orders.update-status`
- **Request Body**:
```json
{
  "status": "processing",
  "notes": "Order mulai diproses oleh tim gudang."
}
```
- **Response Success (200)**:
```json
{
  "message": "Status order berhasil diperbarui.",
  "order": { ... }
}
```
- **Response Error (422)** (Jika transisi tidak valid):
```json
{
  "message": "Transisi status order tidak valid dari 'pending_payment' ke 'shipped'."
}
```

---

### 2.4 Add Order Note (Admin)
- **Route**: `POST /admin/orders/{order}/notes`
- **Name**: `admin.orders.notes.store`
- **Request Body**:
```json
{
  "note": "Customer melakukan konfirmasi penerimaan via WhatsApp",
  "visibility": "internal"
}
```
*(Visibility options: `internal` | `customer`)*

- **Response Success (200)**:
```json
{
  "message": "Catatan order berhasil ditambahkan.",
  "order": { ... }
}
```

---

### 2.5 Cancel Order (Admin)
- **Route**: `POST /admin/orders/{order}/cancel`
- **Name**: `admin.orders.cancel`
- **Request Body**:
```json
{
  "reason": "Stok barang kosong / rusak saat QC"
}
```
- **Response Success (200)**:
```json
{
  "message": "Order berhasil dibatalkan.",
  "order": { ... }
}
```

---

## 3. Account / Customer API & Routes (`/account/orders`)

Semua route account dilindungi middleware `auth` dan hanya menampilkan order milik user yang login.

### 3.1 List Customer Orders ("Pesanan Saya")
- **Route**: `GET /account/orders`
- **Name**: `account.orders`
- **Query Parameters**:
  - `status` (optional, string): Filter status (misal `pending_payment`, `shipped`).
  - `search` (optional, string): Cari no order / nama produk.
  - `page` (optional, integer)
  - `per_page` (optional, integer)

- **Response Shape (Inertia Props / JSON)**:
```json
{
  "orders": {
    "data": [
      {
        "id": 1,
        "order_number": "ORD-20260908-0001",
        "customer": {
          "id": 5,
          "name": "Budi Santoso",
          "email": "budi@example.com",
          "phone": "08123456789"
        },
        "currency": "IDR",
        "subtotal": 1500000,
        "discount_total": 50000,
        "shipping_total": 20000,
        "tax_total": 0,
        "fee_total": 0,
        "grand_total": 1470000,
        "order_status": "confirmed",
        "payment_status": "paid",
        "fulfillment_status": "processing",
        "items_count": 2,
        "placed_at": "2026-09-08T10:00:00.000000Z",
        "created_at": "2026-09-08T10:00:00.000000Z"
      }
    ],
    "links": { ... },
    "meta": { ... }
  },
  "filters": {}
}
```

---

### 3.2 Get Customer Order Detail
- **Route**: `GET /account/orders/{order}`
- **Name**: `account.orders.show`
- **Privasi Data**:
  - **TIDAK menyertakan** `cost_price` pada items.
  - **TIDAK menyertakan** internal notes (`visibility === 'internal'`).
  - **TIDAK menyertakan** data provider payment sensitif (`provider_reference`, raw payment metadata).
  - Mengembalikan `403 Forbidden` jika customer mencoba membuka order milik user lain.

- **Response Shape**:
```json
{
  "order": {
    "id": 1,
    "order_number": "ORD-20260908-0001",
    "contact_email": "budi@example.com",
    "contact_phone": "08123456789",
    "currency": "IDR",
    "subtotal": 1500000,
    "discount_total": 50000,
    "shipping_total": 20000,
    "tax_total": 0,
    "fee_total": 0,
    "grand_total": 1470000,
    "order_status": "confirmed",
    "payment_status": "paid",
    "fulfillment_status": "processing",
    "placed_at": "2026-09-08T10:00:00.000000Z",
    "items": [
      {
        "id": 10,
        "order_id": 1,
        "product_id": 3,
        "variant_id": 12,
        "sku": "VGS-KB-01",
        "product_name": "Mechanical Keyboard RGB",
        "variant_name": "Blue Switch",
        "unit_price": 750000,
        "quantity": 2,
        "discount_amount": 50000,
        "tax_amount": 0,
        "total": 1450000,
        "image": "https://example.com/images/kb.jpg",
        "metadata": null
      }
    ],
    "shipping_address": {
      "recipient": "Budi Santoso",
      "phone": "08123456789",
      "address_line1": "Jl. Gatot Subroto No. 45",
      "city": "Jakarta Selatan",
      "province": "DKI Jakarta",
      "postal_code": "12930"
    },
    "status_histories": [ ... ],
    "payments": [
      {
        "id": 1,
        "method": "qris",
        "provider": "midtrans",
        "amount": 1470000,
        "currency": "IDR",
        "status": "paid"
      }
    ],
    "notes": [
      /* hanya catatan dengan visibility='customer' */
    ]
  }
}
```

---

### 3.3 Cancel Order (Customer)
- **Route**: `POST /account/orders/{order}/cancel`
- **Name**: `account.orders.cancel`
- **Ketentuan**: Customer hanya dapat membatalkan pesanan milik sendiri jika `order_status` masih `pending_payment`.
- **Request Body**:
```json
{
  "reason": "Ingin mengubah alamat / item"
}
```
- **Response Success (200)**:
```json
{
  "message": "Pesanan berhasil dibatalkan.",
  "order": { ... }
}
```
