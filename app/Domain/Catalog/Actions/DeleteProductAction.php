<?php

namespace App\Domain\Catalog\Actions;

use App\Models\CartItem;
use App\Models\InventoryMovement;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\StockReservation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

final class DeleteProductAction
{
    public function execute(Product $product): void
    {
        DB::transaction(function () use ($product) {
            $paths = $product->images()->pluck('path')->filter()->values();

            // Hapus varian secara permanen (bukan soft delete) beserta stok
            // inventory-nya, supaya produk yang sudah dihapus tidak lagi
            // meninggalkan baris inventory "yatim" di halaman Inventory.
            // inventories.variant_id, product_images.variant_id, dan
            // product_variant_option_values.variant_id punya ON DELETE
            // CASCADE, sehingga baris terkait otomatis terhapus saat varian
            // dihapus permanen.
            $variantIds = $product->variants()->withTrashed()->pluck('id');

            // Tabel berikut memakai FK ke product_variants dengan ON DELETE
            // NO ACTION di skema database. Karena varian akan dihapus
            // permanen, baris-baris "yatim" itu harus dibersihkan lebih dulu:
            InventoryMovement::whereIn('variant_id', $variantIds)->delete();
            StockReservation::whereIn('variant_id', $variantIds)->delete();
            DB::table('inventory_transfer_items')->whereIn('variant_id', $variantIds)->delete();
            CartItem::whereIn('variant_id', $variantIds)->delete();

            ProductVariant::withTrashed()->whereIn('id', $variantIds)->forceDelete();

            $product->images()->delete();

            // Produk soft-delete agar alur arsip tetap tersedia (konsisten
            // dengan perilaku SoftDeletes yang sudah dipakai sebelumnya).
            $product->delete();

            foreach ($paths as $path) {
                Storage::disk('public')->delete($path);
            }
        });
    }
}
