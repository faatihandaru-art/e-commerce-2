import type { Category, Product, ProductFilter, ProductVariant } from '@/types/product';

export interface PaginatedProducts {
    data: Product[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export interface ProductWithReviews {
    data: Product;
    reviews: ProductReviewPayload[];
}

export interface ProductReviewPayload {
    id: number | string;
    author: string;
    rating: number;
    comment: string | null;
    date?: string;
}

export interface ServerCartItem {
    id: number | string;
    productId: number | string;
    variantId: number | string;
    quantity: number;
    product?: Product | null;
    variant?: ProductVariant | null;
}

export interface CartPayload {
    items: ServerCartItem[];
    cartCount: number;
    cartSubtotal: number;
}

export interface ShippingOptionPayload {
    id: number | string;
    code: string;
    name: string;
    provider: string;
    eta: string;
    cost: number;
    logoUrl: string;
}

export interface PaymentMethodPayload {
    id: string;
    name: string;
    group: string;
    logo: string;
    fee: number;
    desc?: string;
}

export interface CheckoutConfigPayload {
    addresses: CheckoutAddressPayload[];
    shippingMethods: ShippingOptionPayload[];
    paymentMethods: PaymentMethodPayload[];
}

export interface CheckoutAddressPayload {
    id: number | string;
    label: string;
    recipient: string;
    phone: string;
    line: string;
    city: string;
    note?: string | null;
    province: string;
    postal_code: string;
    country: string;
}

export interface PlaceOrderPayload {
    items: { variant_id: number | string; quantity: number }[];
    shipping: {
        recipient: string;
        phone: string;
        address_line1: string;
        address_line2?: string | null;
        city: string;
        province: string;
        postal_code: string;
        country?: string;
    };
    shipping_method_id?: number | string | null;
    shipping_cost?: number;
    shipping_name?: string;
    payment: { method: string; group: string; fee?: number };
    coupon_code?: string;
    notes?: string;
}

export interface PlaceOrderResult {
    message: string;
    order: {
        id: number;
        order_number: string;
        grand_total: number;
        subtotal: number;
        discount_total: number;
        shipping_total: number;
        fee_total: number;
        order_status: string;
        payment_status: string;
        placed_at?: string;
    };
}

export class ApiError extends Error {
    status: number;
    data: unknown;

    constructor(message: string, status: number, data: unknown) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
    let response: Response;
    try {
        response = await fetch(url, {
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
                ...options?.headers,
            },
            ...options,
        });
    } catch (err) {
        throw new ApiError('Tidak dapat terhubung ke server.', 0, err);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    const data = (await response.json().catch(() => null)) as unknown;
    if (!response.ok) {
        const body = (data ?? {}) as { message?: string; errors?: Record<string, string[]> };
        const firstError = body.errors ? Object.values(body.errors).flat()[0] : undefined;
        throw new ApiError(body.message || firstError || `Request gagal (${response.status}).`, response.status, data);
    }

    return data as T;
}

const apiGet = <T>(url: string): Promise<T> => request<T>(url);

const apiPost = <T>(url: string, body: unknown): Promise<T> =>
    request<T>(url, { method: 'POST', body: JSON.stringify(body ?? {}) });

const apiPatch = <T>(url: string, body: unknown): Promise<T> =>
    request<T>(url, { method: 'PATCH', body: JSON.stringify(body ?? {}) });

const apiDelete = <T>(url: string): Promise<T> => request<T>(url, { method: 'DELETE' });

// ---------------------------------------------------------------------------
// Catalog
// ---------------------------------------------------------------------------

let categoriesCache: Promise<Category[]> | null = null;

export async function fetchCategories(): Promise<Category[]> {
    const payload = await apiGet<{ data: Category[] }>('/api/catalog/categories');
    return payload.data;
}

export function getCategories(): Promise<Category[]> {
    categoriesCache ??= fetchCategories();
    return categoriesCache;
}

export async function getCatalog(filter: ProductFilter = {}, extra: { perPage?: number } = {}): Promise<PaginatedProducts> {
    const params = new URLSearchParams();
    if (filter.categoryId) params.set('category', String(filter.categoryId));
    if (filter.minPrice != null) params.set('minPrice', String(filter.minPrice));
    if (filter.maxPrice != null) params.set('maxPrice', String(filter.maxPrice));
    if (filter.sortBy && filter.sortBy !== 'featured') params.set('sort', filter.sortBy);
    if (filter.search) params.set('q', filter.search);
    if (extra.perPage) params.set('per_page', String(extra.perPage));

    return apiGet<PaginatedProducts>(`/api/catalog/products?${params.toString()}`);
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
    const params = new URLSearchParams({ featured: '1', per_page: String(limit) });
    const payload = await apiGet<PaginatedProducts>(`/api/catalog/products?${params.toString()}`);
    return payload.data;
}

export async function getProduct(idOrSlug: string | number): Promise<ProductWithReviews> {
    return apiGet<ProductWithReviews>(`/api/catalog/products/${encodeURIComponent(String(idOrSlug))}`);
}

// ---------------------------------------------------------------------------
// Cart
// ---------------------------------------------------------------------------

export async function fetchCart(): Promise<CartPayload> {
    return apiGet<CartPayload>('/api/cart');
}

export async function addCartItem(variantId: number | string, quantity: number): Promise<CartPayload> {
    return apiPost<CartPayload>('/api/cart/items', { variant_id: variantId, quantity });
}

export async function updateCartItem(id: number | string, quantity: number): Promise<CartPayload> {
    return apiPatch<CartPayload>(`/api/cart/items/${id}`, { quantity });
}

export async function removeCartItem(id: number | string): Promise<CartPayload> {
    return apiDelete<CartPayload>(`/api/cart/items/${id}`);
}

export async function clearCartApi(): Promise<CartPayload> {
    return apiDelete<CartPayload>('/api/cart');
}

// ---------------------------------------------------------------------------
// Checkout
// ---------------------------------------------------------------------------

export async function placeOrder(payload: PlaceOrderPayload): Promise<PlaceOrderResult> {
    return apiPost<PlaceOrderResult>('/api/checkout', payload);
}