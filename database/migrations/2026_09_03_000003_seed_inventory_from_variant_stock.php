<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Membuat gudang default dan menyalin stok lama dari product_variants.stock
     * ke tabel inventori (quantity_on_hand), supaya data stok lama tidak hilang.
     */
    public function up(): void
    {
        $warehouseId = DB::table('warehouses')->insertGetId([
            'name' => 'Gudang Utama',
            'code' => 'WH-MAIN',
            'address' => 'Gudang utama Vortix Gaming Store',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $variants = DB::table('product_variants')
            ->select('id', 'stock')
            ->whereNull('deleted_at')
            ->get();

        $rows = $variants->map(fn ($v) => [
            'warehouse_id' => $warehouseId,
            'product_variant_id' => $v->id,
            'quantity_on_hand' => (int) $v->stock,
            'quantity_reserved' => 0,
            'reorder_level' => 3,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        foreach ($rows->chunk(500) as $chunk) {
            DB::table('inventories')->insert($chunk->all());
        }
    }

    public function down(): void
    {
        // Tidak membalik pengisian data stok (tetap ada di product_variants.stock).
        // Hapus data inventori yang dibuat migrasi ini.
        DB::table('inventories')->truncate();
        DB::table('warehouses')->where('code', 'WH-MAIN')->delete();
    }
};
