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
        Schema::table('shipments', function (Blueprint $table) {
            $table->foreign(['method_id'], 'fk_shipments_method')->references(['id'])->on('shipping_methods')->onUpdate('no action')->onDelete('no action');
            $table->foreign(['order_id'], 'fk_shipments_order')->references(['id'])->on('orders')->onUpdate('no action')->onDelete('no action');
            $table->foreign(['warehouse_id'], 'fk_shipments_warehouse')->references(['id'])->on('warehouses')->onUpdate('no action')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shipments', function (Blueprint $table) {
            $table->dropForeign('fk_shipments_method');
            $table->dropForeign('fk_shipments_order');
            $table->dropForeign('fk_shipments_warehouse');
        });
    }
};
