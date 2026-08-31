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
        Schema::table('product_reviews', function (Blueprint $table) {
            $table->foreign(['order_item_id'], 'fk_reviews_order_item')->references(['id'])->on('order_items')->onUpdate('no action')->onDelete('set null');
            $table->foreign(['product_id'], 'fk_reviews_product')->references(['id'])->on('products')->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['user_id'], 'fk_reviews_user')->references(['id'])->on('users')->onUpdate('no action')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_reviews', function (Blueprint $table) {
            $table->dropForeign('fk_reviews_order_item');
            $table->dropForeign('fk_reviews_product');
            $table->dropForeign('fk_reviews_user');
        });
    }
};
