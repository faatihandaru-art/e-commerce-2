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
        Schema::table('inventory_transfers', function (Blueprint $table) {
            $table->foreign(['destination_warehouse_id'], 'fk_transfers_dest')->references(['id'])->on('warehouses')->onUpdate('no action')->onDelete('no action');
            $table->foreign(['source_warehouse_id'], 'fk_transfers_source')->references(['id'])->on('warehouses')->onUpdate('no action')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inventory_transfers', function (Blueprint $table) {
            $table->dropForeign('fk_transfers_dest');
            $table->dropForeign('fk_transfers_source');
        });
    }
};
