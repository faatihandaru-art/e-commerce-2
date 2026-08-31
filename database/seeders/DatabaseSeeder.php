<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductReview;
use App\Models\CustomerAddress;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::updateOrCreate([
            'email' => 'test@example.com',
        ], [
            'name' => 'Test User',
            'phone' => '0812-3456-7890',
            'password' => bcrypt('password'),
        ]);

        // Seed product options
        $this->call(ProductOptionSeeder::class);

        // Seed store reference data (coupons, shipping methods)
        $this->call(StoreSeeder::class);

        $this->seedCustomerAddress($user);
        $this->seedProductReviews($user);
    }

    private function seedCustomerAddress(User $user): void
    {
        $user->addresses()->firstOrCreate(['recipient' => 'Test User'], [
            'recipient' => 'Test User',
            'phone' => '0812-3456-7890',
            'street' => 'Jl. Merdeka No. 45, RT 05/RW 02, Kel. Cideng, Kec. Gambir',
            'city' => 'Jakarta Pusat',
            'province' => 'DKI Jakarta',
            'postal_code' => '10150',
            'country' => 'Indonesia',
            'is_default' => true,
        ]);
    }

    private function seedProductReviews(User $user): void
    {
        $products = Product::where('featured', true)->limit(6)->get();

        $reviewTemplates = [
            ['rating' => 5, 'review' => 'Sensornya bener-bener gila presisi! Gak ada delay sama sekali waktu flicking, build quality kokoh banget.'],
            ['rating' => 5, 'review' => 'Pengiriman super aman pakai packing tebal. Barang 100% original bergaransi resmi VGS. Recommended!'],
            ['rating' => 4, 'review' => 'Overall sangat puas. Desain minimalis technical aesthetic cocok banget dengan setup clean saya di meja.'],
        ];

        foreach ($products as $product) {
            foreach ($reviewTemplates as $template) {
                ProductReview::create([
                    'user_id' => $user->id,
                    'product_id' => $product->id,
                    'rating' => $template['rating'],
                    'review' => $template['review'],
                    'status' => 'approved',
                    'created_at' => now()->subDays(random_int(1, 9)),
                ]);
            }
        }

        $this->command->info(sprintf('Seeded %d product reviews.', ProductReview::count()));
    }
}
