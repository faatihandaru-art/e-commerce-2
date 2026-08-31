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
        Schema::table('product_variant_option_values', function (Blueprint $table) {
            $table->foreign(['option_value_id'], 'fk_pvov_option_value')->references(['id'])->on('product_option_values')->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['variant_id'], 'fk_pvov_variant')->references(['id'])->on('product_variants')->onUpdate('no action')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_variant_option_values', function (Blueprint $table) {
            $table->dropForeign('fk_pvov_option_value');
            $table->dropForeign('fk_pvov_variant');
        });
    }
};
