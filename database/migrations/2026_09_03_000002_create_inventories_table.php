<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Stok per varian per gudang. Menggantikan kolom `stock` di product_variants.
     */
    public function up(): void
    {
        Schema::create('inventories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('warehouse_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_variant_id')->constrained()->cascadeOnDelete();
            $table->integer('quantity_on_hand')->default(0);
            $table->integer('quantity_reserved')->default(0);
            $table->integer('reorder_level')->default(0);
            $table->timestamps();

            $table->unique(['warehouse_id', 'product_variant_id'], 'uq_inventories_warehouse_variant');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventories');
    }
};
