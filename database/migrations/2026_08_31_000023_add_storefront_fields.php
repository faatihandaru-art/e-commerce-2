<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('products', 'featured')) {
            Schema::table('products', function (Blueprint $table) {
                $table->boolean('featured')->default(false)->after('status');
            });
        }

        if (! Schema::hasColumn('product_variants', 'stock')) {
            Schema::table('product_variants', function (Blueprint $table) {
                $table->unsignedInteger('stock')->default(0)->after('cost_price');
            });
        }

        if (! Schema::hasColumn('categories', 'description')) {
            Schema::table('categories', function (Blueprint $table) {
                $table->text('description')->nullable()->after('slug');
                $table->string('icon', 50)->nullable()->after('slug');
                $table->string('image')->nullable()->after('slug');
            });
        }

        if (! Schema::hasColumn('users', 'phone')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('phone', 30)->nullable()->after('email');
            });
        }

        if (! Schema::hasColumn('users', 'status')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('status', 20)->default('active')->after('phone');
            });
        }
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('featured');
        });

        Schema::table('product_variants', function (Blueprint $table) {
            $table->dropColumn('stock');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn(['description', 'icon', 'image']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'status']);
        });
    }
};