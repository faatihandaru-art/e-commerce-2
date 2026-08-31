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
        Schema::create('coupon_usages', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('coupon_id')->index('fk_coupon_usages_coupon');
            $table->unsignedBigInteger('user_id')->nullable()->index('fk_coupon_usages_user');
            $table->unsignedBigInteger('order_id')->index('fk_coupon_usages_order');
            $table->unsignedBigInteger('amount');
            $table->timestamp('used_at')->nullable()->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupon_usages');
    }
};
