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
        Schema::create('shipments', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('order_id')->index('fk_shipments_order');
            $table->unsignedBigInteger('warehouse_id')->index('fk_shipments_warehouse');
            $table->unsignedBigInteger('method_id')->nullable()->index('fk_shipments_method');
            $table->string('courier', 100)->nullable();
            $table->string('tracking_number', 150)->nullable();
            $table->unsignedBigInteger('cost')->default(0);
            $table->enum('status', ['pending', 'packed', 'shipped', 'in_transit', 'delivered', 'returned'])->default('pending');
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('created_at')->nullable()->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};
