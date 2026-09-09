<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Tabel customer_addresses sudah ada lebih dulu di database development
     * (dibuat manual / migration lama yang tidak lagi ter-versioning).
     * Migration ini disertakan agar database baru (fresh install / test)
     * memiliki tabel yang sama. Guard hasTable membuatnya idempotent.
     */
    public function up(): void
    {
        if (Schema::hasTable('customer_addresses')) {
            return;
        }

        Schema::create('customer_addresses', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id');
            $table->string('recipient', 255);
            $table->string('phone', 255);
            $table->string('street', 255);
            $table->string('village', 255)->nullable();
            $table->string('district', 255)->nullable();
            $table->string('city', 255);
            $table->string('province', 255);
            $table->string('postal_code', 255);
            $table->string('country', 255)->default('Indonesia');
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();

            $table->index('user_id', 'idx_customer_addresses_user');
            $table->foreign('user_id', 'fk_customer_addresses_user')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('customer_addresses')) {
            return;
        }

        Schema::dropIfExists('customer_addresses');
    }
};
