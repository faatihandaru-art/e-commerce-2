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
        Schema::table('wishlist_items', function (Blueprint $table) {
            $table->foreign(['product_id'], 'fk_wishlist_items_product')->references(['id'])->on('products')->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['wishlist_id'], 'fk_wishlist_items_wishlist')->references(['id'])->on('wishlists')->onUpdate('no action')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('wishlist_items', function (Blueprint $table) {
            $table->dropForeign('fk_wishlist_items_product');
            $table->dropForeign('fk_wishlist_items_wishlist');
        });
    }
};
