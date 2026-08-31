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
        Schema::table('coupon_products', function (Blueprint $table) {
            $table->foreign(['coupon_id'], 'fk_coupon_products_coupon')->references(['id'])->on('coupons')->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['product_id'], 'fk_coupon_products_product')->references(['id'])->on('products')->onUpdate('no action')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('coupon_products', function (Blueprint $table) {
            $table->dropForeign('fk_coupon_products_coupon');
            $table->dropForeign('fk_coupon_products_product');
        });
    }
};
