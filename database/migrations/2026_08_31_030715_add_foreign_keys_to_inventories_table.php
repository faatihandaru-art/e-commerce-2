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
        Schema::table('inventories', function (Blueprint $table) {
            $table->foreign(['variant_id'], 'fk_inventories_variant')->references(['id'])->on('product_variants')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign(['warehouse_id'], 'fk_inventories_warehouse')->references(['id'])->on('warehouses')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inventories', function (Blueprint $table) {
            $table->dropForeign('fk_inventories_variant');
            $table->dropForeign('fk_inventories_warehouse');
        });
    }
};
