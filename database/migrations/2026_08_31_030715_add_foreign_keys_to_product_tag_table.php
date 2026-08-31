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
        Schema::table('product_tag', function (Blueprint $table) {
            $table->foreign(['product_id'], 'fk_product_tag_product')->references(['id'])->on('products')->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['tag_id'], 'fk_product_tag_tag')->references(['id'])->on('product_tags')->onUpdate('no action')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_tag', function (Blueprint $table) {
            $table->dropForeign('fk_product_tag_product');
            $table->dropForeign('fk_product_tag_tag');
        });
    }
};
