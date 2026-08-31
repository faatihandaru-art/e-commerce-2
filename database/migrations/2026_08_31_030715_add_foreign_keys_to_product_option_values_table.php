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
        Schema::table('product_option_values', function (Blueprint $table) {
            $table->foreign(['option_id'], 'fk_product_option_values_option')->references(['id'])->on('product_options')->onUpdate('no action')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_option_values', function (Blueprint $table) {
            $table->dropForeign('fk_product_option_values_option');
        });
    }
};
