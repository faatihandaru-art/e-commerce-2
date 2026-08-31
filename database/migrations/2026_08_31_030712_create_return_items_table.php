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
        Schema::create('return_items', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('return_id')->index('fk_return_items_return');
            $table->unsignedBigInteger('order_item_id')->index('fk_return_items_order_item');
            $table->integer('quantity');
            $table->string('condition_note')->nullable();
            $table->enum('resolution', ['refund', 'replacement', 'store_credit', 'rejected'])->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('return_items');
    }
};
