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
        Schema::table('refund_items', function (Blueprint $table) {
            $table->foreign(['order_item_id'], 'fk_refund_items_order_item')->references(['id'])->on('order_items')->onUpdate('no action')->onDelete('no action');
            $table->foreign(['refund_id'], 'fk_refund_items_refund')->references(['id'])->on('refunds')->onUpdate('no action')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('refund_items', function (Blueprint $table) {
            $table->dropForeign('fk_refund_items_order_item');
            $table->dropForeign('fk_refund_items_refund');
        });
    }
};
