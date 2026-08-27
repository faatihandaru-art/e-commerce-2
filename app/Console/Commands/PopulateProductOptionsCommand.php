<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Database\Seeders\ProductOptionSeeder;

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

        if (!$this->option('force')) {
            $this->warn('Command ini akan:');
            $this->line('  1. Membuat data brand jika belum ada');
            $this->line('  2. Membuat 5 produk sample dengan opsi');
            $this->line('  3. Menambahkan opsi dan nilai ke setiap produk');
            $this->newLine();

            if (!$this->confirm('Lanjutkan?')) {
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
            $this->line('  - 4 brand telah dibuat (Nike, Adidas, Puma, Reebok)');
            $this->line('  - 5 produk dengan opsi telah dibuat');
            $this->line('  - Setiap produk memiliki opsi Size dan Color');
            $this->newLine();
            $this->info('Untuk melihat data, jalankan:');
            $this->line('  php artisan tinker');
            $this->line('  >>> App\\Models\\Product::with("options.values")->get();');

            return self::SUCCESS;
        } catch (\Exception $e) {
            $this->error('Error: ' . $e->getMessage());
            return self::FAILURE;
        }
    }
}
