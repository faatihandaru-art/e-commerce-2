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
        Schema::create('refunds', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('order_id')->index('fk_refunds_order');
            $table->unsignedBigInteger('payment_id')->index('fk_refunds_payment');
            $table->unsignedBigInteger('amount');
            $table->enum('status', ['pending', 'processed', 'failed'])->default('pending');
            $table->string('reason')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamp('created_at')->nullable()->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('refunds');
    }
};
