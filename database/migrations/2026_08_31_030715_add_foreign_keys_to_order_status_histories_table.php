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
        Schema::table('order_status_histories', function (Blueprint $table) {
            $table->foreign(['order_id'], 'fk_order_status_hist_order')->references(['id'])->on('orders')->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['changed_by'], 'fk_order_status_hist_user')->references(['id'])->on('users')->onUpdate('no action')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_status_histories', function (Blueprint $table) {
            $table->dropForeign('fk_order_status_hist_order');
            $table->dropForeign('fk_order_status_hist_user');
        });
    }
};
