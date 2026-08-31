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
        Schema::table('order_adjustments', function (Blueprint $table) {
            $table->foreign(['order_item_id'], 'fk_order_adjustments_item')->references(['id'])->on('order_items')->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['order_id'], 'fk_order_adjustments_order')->references(['id'])->on('orders')->onUpdate('no action')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_adjustments', function (Blueprint $table) {
            $table->dropForeign('fk_order_adjustments_item');
            $table->dropForeign('fk_order_adjustments_order');
        });
    }
};
