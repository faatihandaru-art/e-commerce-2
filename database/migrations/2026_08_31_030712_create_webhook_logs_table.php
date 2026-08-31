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
        Schema::create('webhook_logs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('provider', 50);
            $table->string('event_id', 150);
            $table->string('type', 100)->nullable();
            $table->json('headers')->nullable();
            $table->json('payload')->nullable();
            $table->enum('status', ['received', 'processed', 'failed', 'ignored'])->default('received');
            $table->text('error')->nullable();
            $table->timestamp('created_at')->nullable()->useCurrent();

            $table->unique(['provider', 'event_id'], 'uq_webhook_logs_provider_event');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('webhook_logs');
    }
};
