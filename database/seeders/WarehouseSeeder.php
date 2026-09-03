<?php

namespace Database\Seeders;

use App\Models\Warehouse;
use Illuminate\Database\Seeder;

class WarehouseSeeder extends Seeder
{
    public function run(): void
    {
        $warehouses = [
            [
                'name' => 'Gudang Utama',
                'code' => 'MAIN',
                'address' => 'Jl. Raya Mangga Dua No. 8, Jakarta Utara',
                'status' => 'active',
            ],
        ];

        foreach ($warehouses as $data) {
            Warehouse::firstOrCreate(['code' => $data['code']], $data);
        }

        $this->command->info(sprintf('Seeded %d warehouses.', Warehouse::count()));
    }
}
