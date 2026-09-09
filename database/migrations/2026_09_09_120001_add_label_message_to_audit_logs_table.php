<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Menambah kolom label & pesan yang sudah jadi (human readable) pada
     * audit_logs, supaya dashboard "Aktivitas Terbaru" dan notifikasi bisa
     * menampilkan pesan tanpa perlu menerka-nerka isi sebelum/sesudah.
     */
    public function up(): void
    {
        Schema::table('audit_logs', function (Blueprint $table) {
            if (! Schema::hasColumn('audit_logs', 'subject_label')) {
                $table->string('subject_label', 255)->nullable()->after('subject_id');
            }
            if (! Schema::hasColumn('audit_logs', 'message')) {
                $table->string('message', 1000)->nullable()->after('subject_label');
            }
            if (! Schema::hasColumn('audit_logs', 'link')) {
                $table->string('link', 255)->nullable()->after('message');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('audit_logs', function (Blueprint $table) {
            $table->dropColumn(['subject_label', 'message']);
        });
    }
};
