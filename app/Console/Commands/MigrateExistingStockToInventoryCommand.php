<?php

namespace App\Console\Commands;

use App\Models\Inventory;
use App\Models\ProductVariant;
use App\Models\Warehouse;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class MigrateExistingStockToInventoryCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'inventory:migrate-existing-stock {--warehouse-code=MAIN : Kode gudang tujuan}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Pindahkan data stok dari product_variants.stock ke tabel inventories';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $warehouse = Warehouse::where('code', $this->option('warehouse-code'))->first();

        if (! $warehouse) {
            $this->error('Gudang dengan kode "'.$this->option('warehouse-code').'" tidak ditemukan.');

            return self::FAILURE;
        }

        $variants = ProductVariant::whereNotNull('stock')
            ->where('stock', '>', 0)
            ->get(['id', 'sku', 'stock']);

        if ($variants->isEmpty()) {
            $this->warn('Tidak ada varian dengan stok > 0 untuk dipindahkan.');

            return self::SUCCESS;
        }

        $migrated = 0;
        $skipped = 0;

        try {
            DB::transaction(function () use ($variants, $warehouse, &$migrated, &$skipped): void {
                foreach ($variants as $variant) {
                    $exists = Inventory::where('warehouse_id', $warehouse->id)
                        ->where('variant_id', $variant->id)
                        ->exists();

                    if ($exists) {
                        $skipped++;

                        continue;
                    }

                    Inventory::create([
                        'warehouse_id' => $warehouse->id,
                        'variant_id' => $variant->id,
                        'quantity_on_hand' => (int) $variant->stock,
                        'quantity_reserved' => 0,
                        'reorder_level' => 5,
                    ]);

                    $migrated++;
                }
            });
        } catch (\Throwable $e) {
            $this->error('Gagal melakukan migrasi data: '.$e->getMessage());

            return self::FAILURE;
        }

        $this->info(sprintf(
            'Selesai. %d baris inventory dibuat, %d dilewati (sudah ada).',
            $migrated,
            $skipped
        ));

        return self::SUCCESS;
    }
}
