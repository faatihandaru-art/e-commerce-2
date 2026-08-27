# 📐 Product Options - Data Structure & Relationships

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         BRANDS                                   │
├─────────────────────────────────────────────────────────────────┤
│ id (PK)                                                          │
│ name                                                             │
│ slug                                                             │
│ logo                                                             │
│ status                                                           │
│ created_at, updated_at                                           │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ 1:N (One Brand : Many Products)
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                        PRODUCTS                                  │
├─────────────────────────────────────────────────────────────────┤
│ id (PK)                                                          │
│ brand_id (FK) ─────────────────────────────────┐                │
│ name                                           │                │
│ slug (UNIQUE)                                  │                │
│ type (simple|variable|digital|service)        │                │
│ status (draft|published|archived)              │                │
│ short_description                              │                │
│ description                                    │                │
│ meta_title, meta_description                   │                │
│ published_at                                   │                │
│ deleted_at (SoftDelete)                        │                │
│ created_at, updated_at                         │                │
└────────────┬────────────────────┬──────────────┤────────────────┘
             │                    │              │
             │ 1:N                │ 1:N          │
             │                    │              │
    ┌────────▼─────────┐  ┌───────▼─────────┐  │
    │ PRODUCT_OPTIONS  │  │ PRODUCT_VARIANTS│  │
    ├──────────────────┤  ├──────────────────┤ │
    │ id (PK)          │  │ id (PK)          │ │
    │ product_id (FK)  │  │ product_id (FK)  │ │
    │ name             │  │ sku (UNIQUE)     │ │
    │ sort_order       │  │ barcode          │ │
    └────────┬─────────┘  │ price            │ │
             │            │ compare_at_price │ │
             │            │ cost             │ │
             │ 1:N         │ weight           │ │
             │            │ status           │ │
    ┌────────▼──────────────────┐ └──────────────┘
    │ PRODUCT_OPTION_VALUES     │
    ├────────────────────────────┤
    │ id (PK)                    │
    │ option_id (FK)             │
    │ value                      │
    │ sort_order                 │
    └────────────────────────────┘

    ┌──────────────────┐
    │ PRODUCT_IMAGES   │
    ├──────────────────┤
    │ id (PK)          │
    │ product_id (FK)  │
    │ variant_id (FK)  │
    │ path             │
    │ alt_text         │
    │ sort_order       │
    │ is_primary       │
    │ created_at       │
    └──────────────────┘
```

---

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│ INPUT DATA (Seeder / API / Manual)                           │
└────────────┬─────────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────────┐
│ CreateProductOptionsAction                                    │
│ - execute()      : Create options for 1 product              │
│ - executeBulk()  : Create options for multiple products      │
│ - copyFromProduct(): Copy options between products           │
└────────────┬─────────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────────┐
│ DATABASE OPERATIONS                                           │
├──────────────────────────────────────────────────────────────┤
│ ├─ Insert into product_options                               │
│ └─ Insert into product_option_values                         │
└────────────┬─────────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────────┐
│ OUTPUT                                                        │
├──────────────────────────────────────────────────────────────┤
│ ├─ Collection of ProductOption models                        │
│ ├─ JSON responses (if using API)                             │
│ └─ Database records                                          │
└──────────────────────────────────────────────────────────────┘
```

---

## Model Relationships

### Product Model
```
Product
├─ belongsTo(Brand)
├─ hasMany(ProductOption)
├─ hasMany(ProductVariant)
└─ hasMany(ProductImage)
```

### ProductOption Model
```
ProductOption
├─ belongsTo(Product)
└─ hasMany(ProductOptionValue)
```

### ProductOptionValue Model
```
ProductOptionValue
└─ belongsTo(ProductOption)
```

### Brand Model
```
Brand
└─ hasMany(Product)
```

### ProductVariant Model
```
ProductVariant
└─ belongsTo(Product)
```

### ProductImage Model
```
ProductImage
└─ belongsTo(Product)
```

---

## Sample Data Structure

```
Brand: Nike
├── Product: Nike Air Max 90
│   ├── ProductOption: Size
│   │   ├── ProductOptionValue: 6
│   │   ├── ProductOptionValue: 7
│   │   ├── ProductOptionValue: 8
│   │   ├── ProductOptionValue: 9
│   │   ├── ProductOptionValue: 10
│   │   ├── ProductOptionValue: 11
│   │   └── ProductOptionValue: 12
│   │
│   ├── ProductOption: Color
│   │   ├── ProductOptionValue: White
│   │   ├── ProductOptionValue: Black
│   │   ├── ProductOptionValue: Red
│   │   └── ProductOptionValue: Blue
│   │
│   ├── ProductVariant: SKU-001
│   │   └── price: 999000
│   │
│   └── ProductImage: /images/nike-air-max-90-1.jpg
│
├── Product: Nike Zoom Fly
│   ├── ProductOption: Size
│   │   └── ProductOptionValue: [...similar...]
│   │
│   └── ProductOption: Color
│       └── ProductOptionValue: [...similar...]
│
└── [More Products...]
```

---

## Database Schema

### products Table
```sql
CREATE TABLE `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `brand_id` bigint unsigned DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(280) NOT NULL UNIQUE,
  `type` enum('simple','variable','digital','service') DEFAULT 'simple',
  `status` enum('draft','published','archived') DEFAULT 'draft',
  `short_description` varchar(500),
  `description` text,
  `meta_title` varchar(255),
  `meta_description` varchar(500),
  `published_at` timestamp NULL,
  `deleted_at` timestamp NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON DELETE SET NULL
);
```

### product_options Table
```sql
CREATE TABLE `product_options` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `name` varchar(100) NOT NULL,
  `sort_order` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
);
```

### product_option_values Table
```sql
CREATE TABLE `product_option_values` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `option_id` bigint unsigned NOT NULL,
  `value` varchar(100) NOT NULL,
  `sort_order` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`option_id`) REFERENCES `product_options`(`id`) ON DELETE CASCADE
);
```

### product_variants Table
```sql
CREATE TABLE `product_variants` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `sku` varchar(100) NOT NULL UNIQUE,
  `barcode` varchar(100),
  `price` bigint unsigned NOT NULL,
  `compare_at_price` bigint unsigned,
  `cost` bigint unsigned,
  `weight` decimal(5,2),
  `status` varchar(50),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
);
```

---

## Querying Examples

### Get Product with All Options and Values
```php
$product = Product::with('options.values')->find(1);
// SELECT * FROM products WHERE id = 1
// SELECT * FROM product_options WHERE product_id = 1
// SELECT * FROM product_option_values WHERE option_id IN (...)
```

### Get Products by Type
```php
$variableProducts = Product::where('type', 'variable')->get();
// SELECT * FROM products WHERE type = 'variable'
```

### Get Product with Specific Option
```php
$product = Product::with([
    'options' => function($query) {
        $query->where('name', 'Size');
    },
    'options.values'
])->find(1);
```

### Count Options and Values
```php
$product = Product::find(1);
$optionsCount = $product->options()->count();
$valuesCount = $product->options()
    ->with('values')
    ->get()
    ->sum(fn($option) => $option->values->count());
```

---

## Sample Data after Seeding

### Brands (4)
- Nike
- Adidas
- Puma
- Reebok

### Products (5)
1. Nike Air Max 90 - type: variable, status: published
2. Adidas Ultraboost - type: variable, status: published
3. Puma RS-X - type: variable, status: published
4. Reebok Classic Leather - type: variable, status: published
5. Cotton T-Shirt - type: variable, status: published

### Options per Product (2)
- Size (with 6-7 values each)
- Color (with 3-5 values each)

### Total Records after Seeding
- Products: 5
- Options: 10 (5 products × 2 options)
- Option Values: ~40 (varies by product)

---

## Performance Considerations

### Indexing
```sql
-- Already created by migration:
KEY `idx_product_options_product` (`product_id`);
KEY `idx_product_option_values_option` (`option_id`);
```

### Query Optimization
```php
// ✅ GOOD - Uses eager loading
$products = Product::with('options.values')->get();

// ❌ BAD - N+1 query problem
$products = Product::all();
foreach ($products as $product) {
    $options = $product->options; // Extra query per product!
}
```

### Caching Strategy
```php
// Cache product options for 24 hours
$options = Cache::remember(
    "product_{$productId}_options",
    86400,
    fn() => Product::find($productId)->options()->with('values')->get()
);
```

---

## API Request/Response Examples

### Request
```http
POST /api/products/1/options HTTP/1.1
Host: localhost
Content-Type: application/json

{
  "options": [
    {
      "name": "Size",
      "values": ["S", "M", "L", "XL"]
    },
    {
      "name": "Color",
      "values": ["Red", "Blue"]
    }
  ]
}
```

### Response (201 Created)
```json
{
  "success": true,
  "message": "Options created successfully",
  "data": [
    {
      "id": 1,
      "product_id": 1,
      "name": "Size",
      "sort_order": 0,
      "values": [
        {"id": 1, "option_id": 1, "value": "S", "sort_order": 0},
        {"id": 2, "option_id": 1, "value": "M", "sort_order": 1},
        {"id": 3, "option_id": 1, "value": "L", "sort_order": 2},
        {"id": 4, "option_id": 1, "value": "XL", "sort_order": 3}
      ]
    },
    {
      "id": 2,
      "product_id": 1,
      "name": "Color",
      "sort_order": 1,
      "values": [
        {"id": 5, "option_id": 2, "value": "Red", "sort_order": 0},
        {"id": 6, "option_id": 2, "value": "Blue", "sort_order": 1}
      ]
    }
  ],
  "count": 2
}
```

---

## Summary

| Aspek | Detail |
|-------|--------|
| **Models** | 6 (Product, ProductOption, ProductOptionValue, Brand, ProductVariant, ProductImage) |
| **Tables** | 6 |
| **Relationships** | 7 (1 Brand:N Products, 1 Product:N Options, 1 Option:N Values, etc) |
| **Sample Products** | 5 |
| **Sample Options** | 10 |
| **Sample Values** | ~40 |
| **API Endpoints** | 7 |
| **Action Methods** | 3 (execute, executeBulk, copyFromProduct) |

---

**Created:** 2026-08-27
**Version:** 1.0
**Status:** ✅ Documentation Complete
