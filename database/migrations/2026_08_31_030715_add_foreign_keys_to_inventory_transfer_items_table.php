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
        Schema::table('inventory_transfer_items', function (Blueprint $table) {
            $table->foreign(['transfer_id'], 'fk_transfer_items_transfer')->references(['id'])->on('inventory_transfers')->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['variant_id'], 'fk_transfer_items_variant')->references(['id'])->on('product_variants')->onUpdate('no action')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inventory_transfer_items', function (Blueprint $table) {
            $table->dropForeign('fk_transfer_items_transfer');
            $table->dropForeign('fk_transfer_items_variant');
        });
    }
};
