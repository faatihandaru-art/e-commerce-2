<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Inventory;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Role;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected User $customer;

    protected function setUp(): void
    {
        parent::setUp();

        Role::create(['name' => 'Super Admin', 'slug' => 'super_admin']);
        Role::create(['name' => 'Customer', 'slug' => 'customer']);

        $this->admin = User::factory()->create();
        $this->admin->roles()->attach(Role::where('slug', 'super_admin')->first()->id);

        $this->customer = User::factory()->create();
        $this->customer->roles()->attach(Role::where('slug', 'customer')->first()->id);
    }

    protected function createOrder(User $user, int $grandTotal, array $overrides = []): Order
    {
        return Order::create(array_merge([
            'order_number' => 'ORD-'.strtoupper(bin2hex(random_bytes(4))),
            'user_id' => $user->id,
            'contact_email' => $user->email,
            'contact_phone' => '08123456789',
            'currency' => 'IDR',
            'subtotal' => $grandTotal,
            'discount_total' => 0,
            'shipping_total' => 0,
            'tax_total' => 0,
            'fee_total' => 0,
            'grand_total' => $grandTotal,
            'order_status' => 'completed',
            'payment_status' => 'paid',
            'fulfillment_status' => 'fulfilled',
            'placed_at' => now(),
        ], $overrides));
    }

    public function test_dashboard_returns_real_order_statistics(): void
    {
        $this->createOrder($this->customer, 250000, ['placed_at' => now()]);
        $this->createOrder($this->customer, 100000, [
            'order_status' => 'pending_payment',
            'payment_status' => 'pending',
            'placed_at' => now(),
        ]);

        $response = $this->actingAs($this->admin)->getJson('/admin');

        $response->assertStatus(200)
            ->assertJsonPath('stats.total_orders', 2)
            ->assertJsonPath('stats.orders_today', 2)
            ->assertJsonPath('stats.pending_payments', 1)
            ->assertJsonPath('stats.perlu_diproses', 1)
            ->assertJsonPath('stats.revenue_this_month', 250000);
    }

    public function test_dashboard_revenue_ignores_unpaid_orders_and_other_months(): void
    {
        $this->createOrder($this->customer, 300000, ['payment_status' => 'unpaid', 'placed_at' => now()]);
        $this->createOrder($this->customer, 500000, ['placed_at' => now()->subMonth()]);

        $response = $this->actingAs($this->admin)->getJson('/admin');

        $response->assertJsonPath('stats.revenue_this_month', 0)
            ->assertJsonPath('stats.revenue_last_month', 500000);
    }

    public function test_dashboard_counts_products_categories_customers_and_low_stock(): void
    {
        Category::create(['name' => 'Aksesoris', 'slug' => 'aksesoris', 'status' => 'active']);
        Product::create([
            'name' => 'VGS Mouse Pro X',
            'slug' => 'vgs-mouse-pro-x',
            'type' => 'simple',
            'status' => 'published',
        ]);

        $warehouse = Warehouse::create(['name' => 'Gudang Utama', 'code' => 'WH-MAIN']);
        $variant = ProductVariant::create([
            'product_id' => Product::first()->id,
            'sku' => 'VGS-MPX-001',
            'price' => 250000,
        ]);

        Inventory::create([
            'warehouse_id' => $warehouse->id,
            'variant_id' => $variant->id,
            'quantity_on_hand' => 2,
            'quantity_reserved' => 0,
            'reorder_level' => 5,
        ]);

        // customer sengaja tidak dihitung ke staff
        $response = $this->actingAs($this->admin)->getJson('/admin');

        $response->assertJsonPath('stats.total_products', 1)
            ->assertJsonPath('stats.total_categories', 1)
            ->assertJsonPath('stats.total_customers', 1)
            ->assertJsonPath('stats.low_stock', 1);
    }

    public function test_dashboard_recent_activity_mixes_orders_and_audit_logs(): void
    {
        $order = $this->createOrder($this->customer, 150000);

        $response = $this->actingAs($this->admin)->getJson('/admin');

        $activity = $response->json('recent_activity');

        $this->assertIsArray($activity);
        $this->assertNotEmpty($activity);

        $isOrderEntry = collect($activity)->firstWhere('kind', 'order');
        $isAuditEntry = collect($activity)->firstWhere('kind', 'audit');

        $this->assertNotNull($isOrderEntry);
        $this->assertStringContainsString($order->order_number, $isOrderEntry['message']);
        $this->assertNotNull($isAuditEntry);
    }
}
