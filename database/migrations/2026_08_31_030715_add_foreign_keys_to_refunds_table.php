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
        Schema::table('refunds', function (Blueprint $table) {
            $table->foreign(['order_id'], 'fk_refunds_order')->references(['id'])->on('orders')->onUpdate('no action')->onDelete('no action');
            $table->foreign(['payment_id'], 'fk_refunds_payment')->references(['id'])->on('payments')->onUpdate('no action')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('refunds', function (Blueprint $table) {
            $table->dropForeign('fk_refunds_order');
            $table->dropForeign('fk_refunds_payment');
        });
    }
};
