/**
 * Vortix Gaming Store (VGS) - Product Type Definitions
 * Shared types for Orang 1 (Storefront, Home, UI) & Orang 2 (Product, Cart, Checkout, Auth)
 * 
 * Field structures reflect the database architecture (products, categories, product_variants, carts).
 */

export interface Category {
    id: number | string;
    name: string;
    slug: string;
    icon?: string;
    image?: string;
    description?: string;
    productCount?: number;
}

export interface ProductVariant {
    id: number | string;
    productId?: number | string;
    name: string;      // e.g. "Color", "Switch Type", "Layout"
    value: string;     // e.g. "Matte Obsidian Black", "Cherry MX Red"
    priceModifier?: number; // Added/subtracted price relative to base
    stock?: number;
    sku?: string;
}

export interface Product {
    id: number | string;
    name: string;
    slug: string;
    description: string;
    categoryId: number | string;
    category?: Category;
    /**
     * Minimum 3-4 image URLs per product for multi-image gallery support.
     * High quality Unsplash gaming gear photos or local product asset paths.
     */
    images: string[];
    price: number;
    compareAtPrice?: number | null;
    variants?: ProductVariant[];
    specifications: Record<string, string>;
    rating: number;        // e.g. 4.8
    reviewCount: number;   // e.g. 142
    stock: number;
    isFeatured?: boolean;
    isNew?: boolean;
    badge?: 'Baru' | 'Diskon' | 'Stok Terbatas' | string;
    brand?: string;
    sku?: string;
}

export interface CartItem {
    id?: number | string;
    productId: number | string;
    variantId?: number | string | null;
    quantity: number;
    product?: Product;
    variant?: ProductVariant;
}

export interface ProductFilter {
    categoryId?: number | string | null;
    minPrice?: number | null;
    maxPrice?: number | null;
    sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
    search?: string;
}
