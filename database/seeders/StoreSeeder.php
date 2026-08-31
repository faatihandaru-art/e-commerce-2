<?php

namespace Database\Seeders;

use App\Models\Coupon;
use App\Models\ShippingMethod;
use Illuminate\Database\Seeder;

class StoreSeeder extends Seeder
{
    public function run(): void
    {
        $coupons = [
            [
                'code' => 'VGSWIN',
                'type' => 'percentage',
                'value' => 10,
                'status' => 'active',
            ],
            [
                'code' => 'ESPORTS10',
                'type' => 'percentage',
                'value' => 10,
                'status' => 'active',
            ],
        ];

        foreach ($coupons as $data) {
            Coupon::firstOrCreate(['code' => $data['code']], $data);
        }

        $shippingMethods = [
            ['name' => 'JNE Reguler', 'code' => 'jne-reguler', 'provider' => 'JNE', 'service' => 'Reguler', 'base_price' => 24000],
            ['name' => 'JNE Express', 'code' => 'jne-express', 'provider' => 'JNE', 'service' => 'Express', 'base_price' => 42000],
            ['name' => 'J&T Express', 'code' => 'jnt-express', 'provider' => 'J&T', 'service' => 'Express', 'base_price' => 24000],
            ['name' => 'SiCepat Reguler', 'code' => 'sicepat-reguler', 'provider' => 'SiCepat', 'service' => 'Reguler', 'base_price' => 25000],
            ['name' => 'SiCepat BEST', 'code' => 'sicepat-best', 'provider' => 'SiCepat', 'service' => 'BEST', 'base_price' => 55000],
        ];

        foreach ($shippingMethods as $data) {
            ShippingMethod::firstOrCreate(['code' => $data['code']], $data);
        }

        $this->command->info(sprintf(
            'Seeded %d coupons and %d shipping methods.',
            Coupon::count(),
            ShippingMethod::count()
        ));
    }
}
