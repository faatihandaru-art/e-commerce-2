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
        Schema::table('coupon_categories', function (Blueprint $table) {
            $table->foreign(['category_id'], 'fk_coupon_categories_category')->references(['id'])->on('categories')->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['coupon_id'], 'fk_coupon_categories_coupon')->references(['id'])->on('coupons')->onUpdate('no action')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('coupon_categories', function (Blueprint $table) {
            $table->dropForeign('fk_coupon_categories_category');
            $table->dropForeign('fk_coupon_categories_coupon');
        });
    }
};
