<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('stock_reservations', function (Blueprint $table) {
            $table->foreign(['variant_id'], 'fk_stock_res_variant')->references(['id'])->on('product_variants')->onUpdate('no action')->onDelete('no action');
            $table->foreign(['warehouse_id'], 'fk_stock_res_warehouse')->references(['id'])->on('warehouses')->onUpdate('no action')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stock_reservations', function (Blueprint $table) {
            $table->dropForeign('fk_stock_res_variant');
            $table->dropForeign('fk_stock_res_warehouse');
        });
    }
};
