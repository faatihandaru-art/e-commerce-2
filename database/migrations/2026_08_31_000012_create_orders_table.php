<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number', 50)->unique();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
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
            $table->timestamps();
            $table->index(['user_id', 'order_status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
