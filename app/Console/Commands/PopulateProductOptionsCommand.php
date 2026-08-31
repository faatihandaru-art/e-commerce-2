<?php

namespace App\Console\Commands;

use Database\Seeders\ProductOptionSeeder;
use Illuminate\Console\Command;

class PopulateProductOptionsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'product-options:populate {--force : Skip confirmation}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Populate product options untuk produk yang sudah ada di database';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Memulai populate product options...');
        $this->newLine();

        if (! $this->option('force')) {
            $this->warn('Command ini akan:');
            $this->line('  1. Membuat data brand gaming jika belum ada (HyperX, Razer, Logitech, dll)');
            $this->line('  2. Membuat produk sample gaming gear dengan opsi');
            $this->line('  3. Menambahkan opsi, nilai, varian, dan gambar ke setiap produk');
            $this->newLine();

            if (! $this->confirm('Lanjutkan?')) {
                $this->info('Dibatalkan.');

                return self::FAILURE;
            }
        }

        try {
            $this->call('db:seed', ['--class' => ProductOptionSeeder::class]);

            $this->newLine();
            $this->info('✓ Product options berhasil di-populate!');
            $this->newLine();
            $this->info('Informasi:');
            $this->line('  - Brand gaming telah dibuat (HyperX, Logitech, Razer, AULA, dsb)');
            $this->line('  - Produk gaming gear (mouse, keyboard, headset, monitor, dsb)');
            $this->line('  - Setiap produk memiliki opsi, varian, dan gambar utama');
            $this->newLine();
            $this->info('Untuk melihat data, jalankan:');
            $this->line('  php artisan tinker');
            $this->line('  >>> App\\Models\\Product::with("options.values", "variants", "brand", "images")->get();');

            return self::SUCCESS;
        } catch (\Exception $e) {
            $this->error('Error: '.$e->getMessage());

            return self::FAILURE;
        }
    }
}
