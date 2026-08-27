-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.4.3 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table db_e_commerce.audit_logs
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `actor_id` bigint unsigned DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `subject_type` varchar(100) DEFAULT NULL,
  `subject_id` bigint unsigned DEFAULT NULL,
  `before_state` json DEFAULT NULL,
  `after_state` json DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_audit_logs_actor` (`actor_id`),
  KEY `idx_audit_logs_subject` (`subject_type`,`subject_id`),
  CONSTRAINT `fk_audit_logs_actor` FOREIGN KEY (`actor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.audit_logs: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.banners
CREATE TABLE IF NOT EXISTS `banners` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `media` varchar(500) NOT NULL,
  `link` varchar(500) DEFAULT NULL,
  `position` varchar(50) DEFAULT NULL,
  `starts_at` timestamp NULL DEFAULT NULL,
  `ends_at` timestamp NULL DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.banners: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.brands
CREATE TABLE IF NOT EXISTS `brands` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `slug` varchar(170) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_brands_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.brands: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.cache
CREATE TABLE IF NOT EXISTS `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_e_commerce.cache: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.cache_locks
CREATE TABLE IF NOT EXISTS `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_e_commerce.cache_locks: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.carts
CREATE TABLE IF NOT EXISTS `carts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `session_id` varchar(100) DEFAULT NULL,
  `currency` char(3) NOT NULL DEFAULT 'IDR',
  `status` enum('active','converted','abandoned') NOT NULL DEFAULT 'active',
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_carts_user` (`user_id`),
  KEY `idx_carts_session` (`session_id`),
  CONSTRAINT `fk_carts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.carts: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.cart_items
CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `cart_id` bigint unsigned NOT NULL,
  `variant_id` bigint unsigned NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `fk_cart_items_cart` (`cart_id`),
  KEY `fk_cart_items_variant` (`variant_id`),
  CONSTRAINT `fk_cart_items_cart` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cart_items_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`),
  CONSTRAINT `chk_cart_items_qty` CHECK ((`quantity` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.cart_items: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` bigint unsigned DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `slug` varchar(170) NOT NULL,
  `status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
  `sort_order` int NOT NULL DEFAULT '0',
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_categories_slug` (`slug`),
  KEY `idx_categories_parent` (`parent_id`),
  CONSTRAINT `fk_categories_parent` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.categories: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.category_product
CREATE TABLE IF NOT EXISTS `category_product` (
  `category_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`category_id`,`product_id`),
  KEY `fk_category_product_product` (`product_id`),
  CONSTRAINT `fk_category_product_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_category_product_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.category_product: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.coupons
CREATE TABLE IF NOT EXISTS `coupons` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `type` enum('percentage','fixed_amount','free_shipping') NOT NULL,
  `value` bigint unsigned NOT NULL DEFAULT '0',
  `min_order` bigint unsigned DEFAULT NULL,
  `max_discount` bigint unsigned DEFAULT NULL,
  `usage_limit` int unsigned DEFAULT NULL,
  `usage_limit_per_user` int unsigned DEFAULT NULL,
  `starts_at` timestamp NULL DEFAULT NULL,
  `ends_at` timestamp NULL DEFAULT NULL,
  `status` enum('active','inactive','expired') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_coupons_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.coupons: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.coupon_categories
CREATE TABLE IF NOT EXISTS `coupon_categories` (
  `coupon_id` bigint unsigned NOT NULL,
  `category_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`coupon_id`,`category_id`),
  KEY `fk_coupon_categories_category` (`category_id`),
  CONSTRAINT `fk_coupon_categories_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_coupon_categories_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.coupon_categories: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.coupon_products
CREATE TABLE IF NOT EXISTS `coupon_products` (
  `coupon_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`coupon_id`,`product_id`),
  KEY `fk_coupon_products_product` (`product_id`),
  CONSTRAINT `fk_coupon_products_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_coupon_products_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.coupon_products: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.coupon_usages
CREATE TABLE IF NOT EXISTS `coupon_usages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `coupon_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `order_id` bigint unsigned NOT NULL,
  `amount` bigint unsigned NOT NULL,
  `used_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_coupon_usages_coupon` (`coupon_id`),
  KEY `fk_coupon_usages_user` (`user_id`),
  KEY `fk_coupon_usages_order` (`order_id`),
  CONSTRAINT `fk_coupon_usages_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`),
  CONSTRAINT `fk_coupon_usages_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `fk_coupon_usages_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.coupon_usages: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.customer_addresses
CREATE TABLE IF NOT EXISTS `customer_addresses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `recipient` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `street` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `village` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `district` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `province` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `postal_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Indonesia',
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `customer_addresses_user_id_foreign` (`user_id`),
  CONSTRAINT `customer_addresses_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_e_commerce.customer_addresses: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.customer_notes
CREATE TABLE IF NOT EXISTS `customer_notes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `note` text NOT NULL,
  `created_by` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_customer_notes_creator` (`created_by`),
  KEY `idx_customer_notes_user` (`user_id`),
  CONSTRAINT `fk_customer_notes_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_customer_notes_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.customer_notes: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.exports
CREATE TABLE IF NOT EXISTS `exports` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(100) NOT NULL,
  `filters` json DEFAULT NULL,
  `status` enum('queued','processing','completed','failed') NOT NULL DEFAULT 'queued',
  `path` varchar(500) DEFAULT NULL,
  `requested_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_exports_user` (`requested_by`),
  CONSTRAINT `fk_exports_user` FOREIGN KEY (`requested_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.exports: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.failed_jobs
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_e_commerce.failed_jobs: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.inventories
CREATE TABLE IF NOT EXISTS `inventories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `warehouse_id` bigint unsigned NOT NULL,
  `product_variant_id` bigint unsigned NOT NULL,
  `quantity_on_hand` int NOT NULL DEFAULT '0',
  `quantity_reserved` int NOT NULL DEFAULT '0',
  `reorder_level` int NOT NULL DEFAULT '0',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_inventories_warehouse_variant` (`warehouse_id`,`product_variant_id`),
  KEY `fk_inventories_variant` (`product_variant_id`),
  CONSTRAINT `fk_inventories_variant` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`),
  CONSTRAINT `fk_inventories_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`),
  CONSTRAINT `chk_inventories_qty` CHECK (((`quantity_on_hand` >= 0) and (`quantity_reserved` >= 0)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.inventories: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.inventory_movements
CREATE TABLE IF NOT EXISTS `inventory_movements` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `warehouse_id` bigint unsigned NOT NULL,
  `variant_id` bigint unsigned NOT NULL,
  `type` enum('in','out','adjustment','reservation','release') NOT NULL,
  `quantity` int NOT NULL,
  `quantity_before` int NOT NULL,
  `quantity_after` int NOT NULL,
  `reference_type` varchar(100) DEFAULT NULL,
  `reference_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_inv_movements_warehouse` (`warehouse_id`),
  KEY `idx_inv_movements_variant_created` (`variant_id`,`created_at`),
  CONSTRAINT `fk_inv_movements_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`),
  CONSTRAINT `fk_inv_movements_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.inventory_movements: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.inventory_transfers
CREATE TABLE IF NOT EXISTS `inventory_transfers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `source_warehouse_id` bigint unsigned NOT NULL,
  `destination_warehouse_id` bigint unsigned NOT NULL,
  `status` enum('draft','in_transit','completed','cancelled') NOT NULL DEFAULT 'draft',
  `dispatched_at` timestamp NULL DEFAULT NULL,
  `received_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_transfers_source` (`source_warehouse_id`),
  KEY `fk_transfers_dest` (`destination_warehouse_id`),
  CONSTRAINT `fk_transfers_dest` FOREIGN KEY (`destination_warehouse_id`) REFERENCES `warehouses` (`id`),
  CONSTRAINT `fk_transfers_source` FOREIGN KEY (`source_warehouse_id`) REFERENCES `warehouses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.inventory_transfers: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.inventory_transfer_items
CREATE TABLE IF NOT EXISTS `inventory_transfer_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `transfer_id` bigint unsigned NOT NULL,
  `variant_id` bigint unsigned NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_transfer_items_transfer` (`transfer_id`),
  KEY `fk_transfer_items_variant` (`variant_id`),
  CONSTRAINT `fk_transfer_items_transfer` FOREIGN KEY (`transfer_id`) REFERENCES `inventory_transfers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_transfer_items_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.inventory_transfer_items: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.jobs
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` smallint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_e_commerce.jobs: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.job_batches
CREATE TABLE IF NOT EXISTS `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_e_commerce.job_batches: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.migrations
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_e_commerce.migrations: ~2 rows (approximately)
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
	(1, '0001_01_01_000000_create_users_table', 1),
	(2, '0001_01_01_000001_create_cache_table', 1),
	(3, '0001_01_01_000002_create_jobs_table', 1),
	(4, '2026_08_27_022956_create_customer_addresses_table', 2);

-- Dumping structure for table db_e_commerce.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_number` varchar(50) NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `contact_email` varchar(255) NOT NULL,
  `contact_phone` varchar(30) NOT NULL,
  `currency` char(3) NOT NULL DEFAULT 'IDR',
  `subtotal` bigint unsigned NOT NULL DEFAULT '0',
  `discount_total` bigint unsigned NOT NULL DEFAULT '0',
  `shipping_total` bigint unsigned NOT NULL DEFAULT '0',
  `tax_total` bigint unsigned NOT NULL DEFAULT '0',
  `fee_total` bigint unsigned NOT NULL DEFAULT '0',
  `grand_total` bigint unsigned NOT NULL DEFAULT '0',
  `order_status` enum('pending_payment','confirmed','processing','packed','shipped','completed','cancelled','refunded') NOT NULL DEFAULT 'pending_payment',
  `payment_status` enum('unpaid','pending','paid','failed','expired','partially_refunded','refunded') NOT NULL DEFAULT 'unpaid',
  `fulfillment_status` enum('unfulfilled','processing','partially_fulfilled','fulfilled','returned') NOT NULL DEFAULT 'unfulfilled',
  `placed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_orders_order_number` (`order_number`),
  KEY `idx_orders_user_status_created` (`user_id`,`order_status`,`created_at`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.orders: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.order_addresses
CREATE TABLE IF NOT EXISTS `order_addresses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `type` enum('billing','shipping') NOT NULL,
  `recipient` varchar(255) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `address_line1` varchar(255) NOT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `city` varchar(100) NOT NULL,
  `province` varchar(100) NOT NULL,
  `postal_code` varchar(20) NOT NULL,
  `country` varchar(100) NOT NULL DEFAULT 'Indonesia',
  PRIMARY KEY (`id`),
  KEY `idx_order_addresses_order` (`order_id`),
  CONSTRAINT `fk_order_addresses_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.order_addresses: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.order_adjustments
CREATE TABLE IF NOT EXISTS `order_adjustments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `order_item_id` bigint unsigned DEFAULT NULL,
  `type` enum('discount','tax','fee','manual') NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `amount` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_order_adjustments_order` (`order_id`),
  KEY `fk_order_adjustments_item` (`order_item_id`),
  CONSTRAINT `fk_order_adjustments_item` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_adjustments_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.order_adjustments: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.order_items
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned DEFAULT NULL,
  `variant_id` bigint unsigned DEFAULT NULL,
  `sku` varchar(100) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `variant_name` varchar(255) DEFAULT NULL,
  `unit_price` bigint unsigned NOT NULL,
  `quantity` int NOT NULL,
  `discount_amount` bigint unsigned NOT NULL DEFAULT '0',
  `tax_amount` bigint unsigned NOT NULL DEFAULT '0',
  `cost_price` bigint unsigned DEFAULT NULL,
  `total` bigint unsigned NOT NULL,
  `metadata` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_order_items_order` (`order_id`),
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_order_items_qty` CHECK ((`quantity` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.order_items: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.order_notes
CREATE TABLE IF NOT EXISTS `order_notes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `visibility` enum('internal','customer') NOT NULL DEFAULT 'internal',
  `note` text NOT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_order_notes_order` (`order_id`),
  KEY `fk_order_notes_user` (`created_by`),
  CONSTRAINT `fk_order_notes_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_notes_user` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.order_notes: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.order_status_histories
CREATE TABLE IF NOT EXISTS `order_status_histories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `from_status` varchar(50) DEFAULT NULL,
  `to_status` varchar(50) NOT NULL,
  `notes` varchar(500) DEFAULT NULL,
  `changed_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_order_status_hist_order` (`order_id`),
  KEY `fk_order_status_hist_user` (`changed_by`),
  CONSTRAINT `fk_order_status_hist_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_status_hist_user` FOREIGN KEY (`changed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.order_status_histories: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.pages
CREATE TABLE IF NOT EXISTS `pages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(280) NOT NULL,
  `content` longtext,
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_pages_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.pages: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.password_reset_tokens
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_e_commerce.password_reset_tokens: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.payments
CREATE TABLE IF NOT EXISTS `payments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `method` varchar(50) NOT NULL,
  `provider` varchar(50) NOT NULL,
  `provider_reference` varchar(150) DEFAULT NULL,
  `amount` bigint unsigned NOT NULL,
  `currency` char(3) NOT NULL DEFAULT 'IDR',
  `status` enum('pending','paid','failed','expired','partially_refunded','refunded') NOT NULL DEFAULT 'pending',
  `payment_url` varchar(500) DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_payments_order` (`order_id`),
  KEY `idx_payments_provider_ref_status` (`provider_reference`,`status`),
  CONSTRAINT `fk_payments_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.payments: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.payment_transactions
CREATE TABLE IF NOT EXISTS `payment_transactions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `payment_id` bigint unsigned NOT NULL,
  `type` enum('charge','capture','refund','void','notification') NOT NULL,
  `provider_tx_id` varchar(150) DEFAULT NULL,
  `amount` bigint unsigned NOT NULL,
  `status` varchar(50) NOT NULL,
  `request_payload` json DEFAULT NULL,
  `response_payload` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_payment_tx_payment` (`payment_id`),
  CONSTRAINT `fk_payment_tx_payment` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.payment_transactions: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.permissions
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_permissions_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.permissions: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.permission_role
CREATE TABLE IF NOT EXISTS `permission_role` (
  `permission_id` bigint unsigned NOT NULL,
  `role_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`role_id`),
  KEY `fk_permission_role_role` (`role_id`),
  CONSTRAINT `fk_permission_role_permission` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_permission_role_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.permission_role: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.products
CREATE TABLE IF NOT EXISTS `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `brand_id` bigint unsigned DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(280) NOT NULL,
  `type` enum('simple','variable','digital','service') NOT NULL DEFAULT 'simple',
  `status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
  `short_description` varchar(500) DEFAULT NULL,
  `description` text,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` varchar(500) DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_products_slug` (`slug`),
  KEY `fk_products_brand` (`brand_id`),
  KEY `idx_products_status_published` (`status`,`published_at`),
  CONSTRAINT `fk_products_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.products: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.product_images
CREATE TABLE IF NOT EXISTS `product_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `variant_id` bigint unsigned DEFAULT NULL,
  `path` varchar(500) NOT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_primary` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_product_images_variant` (`variant_id`),
  KEY `idx_product_images_product` (`product_id`),
  CONSTRAINT `fk_product_images_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_product_images_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.product_images: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.product_options
CREATE TABLE IF NOT EXISTS `product_options` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `name` varchar(100) NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_product_options_product` (`product_id`),
  CONSTRAINT `fk_product_options_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.product_options: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.product_option_values
CREATE TABLE IF NOT EXISTS `product_option_values` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `option_id` bigint unsigned NOT NULL,
  `value` varchar(100) NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_product_option_values_option` (`option_id`),
  CONSTRAINT `fk_product_option_values_option` FOREIGN KEY (`option_id`) REFERENCES `product_options` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.product_option_values: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.product_reviews
CREATE TABLE IF NOT EXISTS `product_reviews` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `order_item_id` bigint unsigned DEFAULT NULL,
  `rating` tinyint unsigned NOT NULL,
  `review` text,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_reviews_user` (`user_id`),
  KEY `fk_reviews_product` (`product_id`),
  KEY `fk_reviews_order_item` (`order_item_id`),
  CONSTRAINT `fk_reviews_order_item` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_reviews_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_reviews_rating` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.product_reviews: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.product_tag
CREATE TABLE IF NOT EXISTS `product_tag` (
  `product_id` bigint unsigned NOT NULL,
  `tag_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`product_id`,`tag_id`),
  KEY `fk_product_tag_tag` (`tag_id`),
  CONSTRAINT `fk_product_tag_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_product_tag_tag` FOREIGN KEY (`tag_id`) REFERENCES `product_tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.product_tag: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.product_tags
CREATE TABLE IF NOT EXISTS `product_tags` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_product_tags_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.product_tags: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.product_variants
CREATE TABLE IF NOT EXISTS `product_variants` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `sku` varchar(100) NOT NULL,
  `barcode` varchar(100) DEFAULT NULL,
  `price` bigint unsigned NOT NULL,
  `compare_at_price` bigint unsigned DEFAULT NULL,
  `cost_price` bigint unsigned DEFAULT NULL,
  `weight_grams` int unsigned DEFAULT NULL,
  `length_mm` int unsigned DEFAULT NULL,
  `width_mm` int unsigned DEFAULT NULL,
  `height_mm` int unsigned DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_product_variants_sku` (`sku`),
  KEY `idx_product_variants_product` (`product_id`),
  CONSTRAINT `fk_product_variants_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_product_variants_price` CHECK ((`price` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.product_variants: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.product_variant_option_values
CREATE TABLE IF NOT EXISTS `product_variant_option_values` (
  `variant_id` bigint unsigned NOT NULL,
  `option_value_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`variant_id`,`option_value_id`),
  KEY `fk_pvov_option_value` (`option_value_id`),
  CONSTRAINT `fk_pvov_option_value` FOREIGN KEY (`option_value_id`) REFERENCES `product_option_values` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pvov_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.product_variant_option_values: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.promotions
CREATE TABLE IF NOT EXISTS `promotions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `starts_at` timestamp NULL DEFAULT NULL,
  `ends_at` timestamp NULL DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `priority` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.promotions: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.promotion_actions
CREATE TABLE IF NOT EXISTS `promotion_actions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `promotion_id` bigint unsigned NOT NULL,
  `type` varchar(50) NOT NULL,
  `configuration` json NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_promotion_actions_promotion` (`promotion_id`),
  CONSTRAINT `fk_promotion_actions_promotion` FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.promotion_actions: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.promotion_rules
CREATE TABLE IF NOT EXISTS `promotion_rules` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `promotion_id` bigint unsigned NOT NULL,
  `type` varchar(50) NOT NULL,
  `configuration` json NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_promotion_rules_promotion` (`promotion_id`),
  CONSTRAINT `fk_promotion_rules_promotion` FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.promotion_rules: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.refunds
CREATE TABLE IF NOT EXISTS `refunds` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `payment_id` bigint unsigned NOT NULL,
  `amount` bigint unsigned NOT NULL,
  `status` enum('pending','processed','failed') NOT NULL DEFAULT 'pending',
  `reason` varchar(255) DEFAULT NULL,
  `processed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_refunds_order` (`order_id`),
  KEY `fk_refunds_payment` (`payment_id`),
  CONSTRAINT `fk_refunds_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `fk_refunds_payment` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.refunds: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.refund_items
CREATE TABLE IF NOT EXISTS `refund_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `refund_id` bigint unsigned NOT NULL,
  `order_item_id` bigint unsigned NOT NULL,
  `quantity` int NOT NULL,
  `restock` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_refund_items_refund` (`refund_id`),
  KEY `fk_refund_items_order_item` (`order_item_id`),
  CONSTRAINT `fk_refund_items_order_item` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`),
  CONSTRAINT `fk_refund_items_refund` FOREIGN KEY (`refund_id`) REFERENCES `refunds` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.refund_items: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.returns
CREATE TABLE IF NOT EXISTS `returns` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `status` enum('requested','approved','rejected','received','resolved') NOT NULL DEFAULT 'requested',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_returns_order` (`order_id`),
  CONSTRAINT `fk_returns_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.returns: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.return_items
CREATE TABLE IF NOT EXISTS `return_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `return_id` bigint unsigned NOT NULL,
  `order_item_id` bigint unsigned NOT NULL,
  `quantity` int NOT NULL,
  `condition_note` varchar(255) DEFAULT NULL,
  `resolution` enum('refund','replacement','store_credit','rejected') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_return_items_return` (`return_id`),
  KEY `fk_return_items_order_item` (`order_item_id`),
  CONSTRAINT `fk_return_items_order_item` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`),
  CONSTRAINT `fk_return_items_return` FOREIGN KEY (`return_id`) REFERENCES `returns` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.return_items: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_roles_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.roles: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.role_user
CREATE TABLE IF NOT EXISTS `role_user` (
  `role_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`user_id`),
  KEY `fk_role_user_user` (`user_id`),
  CONSTRAINT `fk_role_user_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_role_user_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.role_user: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.sessions
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_e_commerce.sessions: ~1 rows (approximately)
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
	('D37eiRmiTt4E1IFqowOksvXOZSFoF4IWdTE3D7r1', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJBTEZmbmFNUzZCQjFLejNHbjFLdnF2NE53OXpJVU1hZExCOE42RUpqIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOiJob21lIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfSwibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiOjF9', 1787729823),
	('wuWAGkDQr7jLDnH4Wdd6lIJom0hwqlryhyRCNK6o', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.133.0 Chrome/148.0.7778.280 Electron/42.8.0 Safari/537.36', 'eyJfdG9rZW4iOiJDUE0wdXNjSEx5Skk0ZGxtMTZkc3BPWU5YRThqTTdHMHNpSW9FYjVnIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9yZWdpc3RlciIsInJvdXRlIjoicmVnaXN0ZXIifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1787729466),
	('YsqnFnlqW8ws7WbtkYUFDfqIyRrEU7cY9MZ24WUs', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.133.0 Chrome/148.0.7778.280 Electron/42.8.0 Safari/537.36', 'eyJfdG9rZW4iOiJQck05dVh4cDNucjBHOEdjVXRscnJNYTUyNWYxZFMxYk9XQWdPSGxpIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOiJob21lIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1787729472);

-- Dumping structure for table db_e_commerce.settings
CREATE TABLE IF NOT EXISTS `settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `group` varchar(50) NOT NULL,
  `key` varchar(100) NOT NULL,
  `value` text,
  `type` enum('string','integer','boolean','json') NOT NULL DEFAULT 'string',
  `is_public` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_settings_group_key` (`group`,`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.settings: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.shipments
CREATE TABLE IF NOT EXISTS `shipments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `warehouse_id` bigint unsigned NOT NULL,
  `method_id` bigint unsigned DEFAULT NULL,
  `courier` varchar(100) DEFAULT NULL,
  `tracking_number` varchar(150) DEFAULT NULL,
  `cost` bigint unsigned NOT NULL DEFAULT '0',
  `status` enum('pending','packed','shipped','in_transit','delivered','returned') NOT NULL DEFAULT 'pending',
  `shipped_at` timestamp NULL DEFAULT NULL,
  `delivered_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_shipments_order` (`order_id`),
  KEY `fk_shipments_warehouse` (`warehouse_id`),
  KEY `fk_shipments_method` (`method_id`),
  CONSTRAINT `fk_shipments_method` FOREIGN KEY (`method_id`) REFERENCES `shipping_methods` (`id`),
  CONSTRAINT `fk_shipments_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `fk_shipments_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.shipments: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.shipment_items
CREATE TABLE IF NOT EXISTS `shipment_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `shipment_id` bigint unsigned NOT NULL,
  `order_item_id` bigint unsigned NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_shipment_items_shipment` (`shipment_id`),
  KEY `fk_shipment_items_order_item` (`order_item_id`),
  CONSTRAINT `fk_shipment_items_order_item` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`),
  CONSTRAINT `fk_shipment_items_shipment` FOREIGN KEY (`shipment_id`) REFERENCES `shipments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.shipment_items: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.shipping_methods
CREATE TABLE IF NOT EXISTS `shipping_methods` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `code` varchar(50) NOT NULL,
  `provider` varchar(50) DEFAULT NULL,
  `service` varchar(100) DEFAULT NULL,
  `base_price` bigint unsigned NOT NULL DEFAULT '0',
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_shipping_methods_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.shipping_methods: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.stock_reservations
CREATE TABLE IF NOT EXISTS `stock_reservations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `warehouse_id` bigint unsigned NOT NULL,
  `variant_id` bigint unsigned NOT NULL,
  `quantity` int NOT NULL,
  `status` enum('active','committed','released','expired') NOT NULL DEFAULT 'active',
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_stock_res_warehouse` (`warehouse_id`),
  KEY `fk_stock_res_variant` (`variant_id`),
  KEY `idx_stock_res_status_expires` (`status`,`expires_at`),
  CONSTRAINT `fk_stock_res_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`),
  CONSTRAINT `fk_stock_res_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.stock_reservations: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `status` enum('active','inactive','banned') NOT NULL DEFAULT 'active',
  `last_login_at` timestamp NULL DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.users: ~0 rows (approximately)
INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `status`, `last_login_at`, `email_verified_at`, `remember_token`, `created_at`, `updated_at`) VALUES
	(1, 'Aris Maulana', 'arismaulana06445@gmail.com', '085792584079', '$2y$12$hqEUgaQnCJYj2Xys.mC1b.N4Y1NYFBcS779POk6hi6Y4UW3sGhd46', 'active', NULL, NULL, NULL, '2026-08-25 20:08:47', '2026-08-25 20:08:47');

-- Dumping structure for table db_e_commerce.warehouses
CREATE TABLE IF NOT EXISTS `warehouses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `code` varchar(30) NOT NULL,
  `address` varchar(500) DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_warehouses_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.warehouses: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.webhook_logs
CREATE TABLE IF NOT EXISTS `webhook_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `provider` varchar(50) NOT NULL,
  `event_id` varchar(150) NOT NULL,
  `type` varchar(100) DEFAULT NULL,
  `headers` json DEFAULT NULL,
  `payload` json DEFAULT NULL,
  `status` enum('received','processed','failed','ignored') NOT NULL DEFAULT 'received',
  `error` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_webhook_logs_provider_event` (`provider`,`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.webhook_logs: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.wishlists
CREATE TABLE IF NOT EXISTS `wishlists` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `name` varchar(100) NOT NULL DEFAULT 'My Wishlist',
  PRIMARY KEY (`id`),
  KEY `fk_wishlists_user` (`user_id`),
  CONSTRAINT `fk_wishlists_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.wishlists: ~0 rows (approximately)

-- Dumping structure for table db_e_commerce.wishlist_items
CREATE TABLE IF NOT EXISTS `wishlist_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `wishlist_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_wishlist_items_wishlist` (`wishlist_id`),
  KEY `fk_wishlist_items_product` (`product_id`),
  CONSTRAINT `fk_wishlist_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_wishlist_items_wishlist` FOREIGN KEY (`wishlist_id`) REFERENCES `wishlists` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_e_commerce.wishlist_items: ~0 rows (approximately)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
