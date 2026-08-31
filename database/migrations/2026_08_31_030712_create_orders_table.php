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
        Schema::create('orders', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('order_number', 50)->unique('uq_orders_order_number');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('contact_email');
            $table->string('contact_phone', 30);
            $table->char('currency', 3)->default('IDR');
            $table->unsignedBigInteger('subtotal')->default(0);
            $table->unsignedBigInteger('discount_total')->default(0);
            $table->unsignedBigInteger('shipping_total')->default(0);
            $table->unsignedBigInteger('tax_total')->default(0);
            $table->unsignedBigInteger('fee_total')->default(0);
            $table->unsignedBigInteger('grand_total')->default(0);
            $table->enum('order_status', ['pending_payment', 'confirmed', 'processing', 'packed', 'shipped', 'completed', 'cancelled', 'refunded'])->default('pending_payment');
            $table->enum('payment_status', ['unpaid', 'pending', 'paid', 'failed', 'expired', 'partially_refunded', 'refunded'])->default('unpaid');
            $table->enum('fulfillment_status', ['unfulfilled', 'processing', 'partially_fulfilled', 'fulfilled', 'returned'])->default('unfulfilled');
            $table->timestamp('placed_at')->nullable();
            $table->timestamp('created_at')->nullable()->useCurrent();
            $table->timestamp('updated_at')->useCurrentOnUpdate()->nullable()->useCurrent();

            $table->index(['user_id', 'order_status', 'created_at'], 'idx_orders_user_status_created');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
