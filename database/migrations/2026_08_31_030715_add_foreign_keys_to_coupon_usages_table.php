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
        Schema::table('coupon_usages', function (Blueprint $table) {
            $table->foreign(['coupon_id'], 'fk_coupon_usages_coupon')->references(['id'])->on('coupons')->onUpdate('no action')->onDelete('no action');
            $table->foreign(['order_id'], 'fk_coupon_usages_order')->references(['id'])->on('orders')->onUpdate('no action')->onDelete('no action');
            $table->foreign(['user_id'], 'fk_coupon_usages_user')->references(['id'])->on('users')->onUpdate('no action')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('coupon_usages', function (Blueprint $table) {
            $table->dropForeign('fk_coupon_usages_coupon');
            $table->dropForeign('fk_coupon_usages_order');
            $table->dropForeign('fk_coupon_usages_user');
        });
    }
};
