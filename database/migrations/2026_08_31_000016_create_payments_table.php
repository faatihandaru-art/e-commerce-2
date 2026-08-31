<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained();
            $table->string('method', 50);
            $table->string('provider', 50);
            $table->string('provider_reference', 150)->nullable();
            $table->unsignedBigInteger('amount');
            $table->char('currency', 3)->default('IDR');
            $table->enum('status', ['pending', 'paid', 'failed', 'expired', 'partially_refunded', 'refunded'])->default('pending');
            $table->string('payment_url', 500)->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->index(['provider_reference', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
