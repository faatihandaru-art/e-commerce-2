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
        Schema::table('category_product', function (Blueprint $table) {
            $table->foreign(['category_id'], 'fk_category_product_category')->references(['id'])->on('categories')->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['product_id'], 'fk_category_product_product')->references(['id'])->on('products')->onUpdate('no action')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('category_product', function (Blueprint $table) {
            $table->dropForeign('fk_category_product_category');
            $table->dropForeign('fk_category_product_product');
        });
    }
};
