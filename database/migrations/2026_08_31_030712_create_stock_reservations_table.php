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
        Schema::create('stock_reservations', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('order_id');
            $table->unsignedBigInteger('warehouse_id')->index('fk_stock_res_warehouse');
            $table->unsignedBigInteger('variant_id')->index('fk_stock_res_variant');
            $table->integer('quantity');
            $table->enum('status', ['active', 'committed', 'released', 'expired'])->default('active');
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('created_at')->nullable()->useCurrent();

            $table->index(['status', 'expires_at'], 'idx_stock_res_status_expires');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_reservations');
    }
};
