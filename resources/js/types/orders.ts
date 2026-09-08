/**
 * Vortix Gaming Store (VGS) — Order Type Definitions
 * Shapes mengikuti API_CONTRACT.md (docs/orders-feature/API_CONTRACT.md).
 * Dipakai bersama oleh halaman Admin (Admin/Orders/*) dan Account.
 */

export type OrderStatus =
    | 'pending_payment'
    | 'confirmed'
    | 'processing'
    | 'packed'
    | 'shipped'
    | 'completed'
    | 'cancelled'
    | 'refunded';

export type PaymentStatus =
    | 'unpaid'
    | 'pending'
    | 'paid'
    | 'failed'
    | 'expired'
    | 'partially_refunded'
    | 'refunded';

export type FulfillmentStatus =
    | 'unfulfilled'
    | 'processing'
    | 'partially_fulfilled'
    | 'fulfilled'
    | 'returned';

export type OrderStatusType = 'order' | 'payment' | 'fulfillment';

export interface OrderCustomer {
    id: number | null;
    name: string;
    email: string;
    phone: string | null;
}

export interface PaginationLinks {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
}

export interface PaginationMeta {
    current_page: number;
    from: number | null;
    last_page: number;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

export interface OrderListItem {
    id: number;
    order_number: string;
    customer: OrderCustomer;
    currency: string;
    subtotal: number;
    discount_total: number;
    shipping_total: number;
    tax_total: number;
    fee_total: number;
    grand_total: number;
    order_status: OrderStatus;
    payment_status: PaymentStatus;
    fulfillment_status: FulfillmentStatus;
    items_count: number;
    placed_at: string | null;
    created_at: string | null;
}

export interface OrderPaginator {
    data: OrderListItem[];
    links: PaginationLinks;
    meta: PaginationMeta;
}

export interface OrdersSummary {
    total_orders: number;
    perlu_diproses: number;
    perlu_dikirim: number;
}

export interface OrderFilters {
    status?: string;
    order_status?: string;
    payment_status?: string;
    fulfillment_status?: string;
    search?: string;
    date_from?: string;
    date_to?: string;
    sort_by?: string;
    sort_order?: string;
    per_page?: number | string;
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number | null;
    variant_id: number | null;
    sku: string | null;
    product_name: string;
    variant_name: string | null;
    unit_price: number;
    quantity: number;
    discount_amount: number;
    tax_amount: number;
    total: number;
    image: string | null;
    metadata: Record<string, unknown> | null;
    cost_price?: number | null;
}

export interface OrderAddress {
    id: number;
    recipient: string;
    phone: string | null;
    address_line1: string;
    address_line2: string | null;
    city: string;
    province: string | null;
    postal_code: string | null;
    country: string | null;
}

export interface OrderStatusHistory {
    id: number;
    from_status: string | null;
    to_status: string;
    notes: string | null;
    changed_by: { id: number; name: string } | null;
    created_at: string | null;
}

export interface OrderPayment {
    id: number;
    method: string;
    provider: string | null;
    amount: number;
    currency: string;
    status: string;
    payment_url: string | null;
    paid_at: string | null;
    expires_at: string | null;
    provider_reference?: string | null;
    metadata?: Record<string, unknown> | null;
}

export interface OrderShipment {
    id: number;
    courier: string | null;
    tracking_number: string | null;
    cost: number;
    status: string | null;
    warehouse: { id: number; name: string; code: string } | null;
    shipped_at: string | null;
    delivered_at: string | null;
}

export interface OrderNote {
    id: number;
    visibility: 'internal' | 'customer';
    note: string;
    created_by: { id: number; name: string } | null;
    created_at: string | null;
}

export interface OrderAdjustment {
    id: number;
    type: string;
    description: string | null;
    amount: number;
}

export interface OrderDetail {
    id: number;
    order_number: string;
    customer: OrderCustomer;
    contact_email: string | null;
    contact_phone: string | null;
    currency: string;
    subtotal: number;
    discount_total: number;
    shipping_total: number;
    tax_total: number;
    fee_total: number;
    grand_total: number;
    order_status: OrderStatus;
    payment_status: PaymentStatus;
    fulfillment_status: FulfillmentStatus;
    placed_at: string | null;
    created_at: string | null;
    updated_at: string | null;
    items: OrderItem[];
    shipping_address: OrderAddress | null;
    billing_address: OrderAddress | null;
    status_histories: OrderStatusHistory[];
    payments: OrderPayment[];
    shipments: OrderShipment[];
    notes: OrderNote[];
    adjustments: OrderAdjustment[];
}