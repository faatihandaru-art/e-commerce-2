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
        Schema::table('shipment_items', function (Blueprint $table) {
            $table->foreign(['order_item_id'], 'fk_shipment_items_order_item')->references(['id'])->on('order_items')->onUpdate('no action')->onDelete('no action');
            $table->foreign(['shipment_id'], 'fk_shipment_items_shipment')->references(['id'])->on('shipments')->onUpdate('no action')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shipment_items', function (Blueprint $table) {
            $table->dropForeign('fk_shipment_items_order_item');
            $table->dropForeign('fk_shipment_items_shipment');
        });
    }
};
