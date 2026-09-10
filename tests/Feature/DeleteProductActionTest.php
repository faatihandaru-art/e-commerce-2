<?php

namespace Tests\Feature;

use App\Domain\Catalog\Actions\DeleteProductAction;
use App\Models\Category;
use App\Models\Inventory;
use App\Models\InventoryMovement;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Role;
use App\Models\StockReservation;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class DeleteProductActionTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        Role::create(['name' => 'Super Admin', 'slug' => 'super_admin']);
        Role::create(['name' => 'Customer', 'slug' => 'customer']);

        $this->admin = User::factory()->create();
        $this->admin->roles()->attach(Role::where('slug', 'super_admin')->first()->id);
    }

    protected function productTree(): array
    {
        $warehouse = Warehouse::create(['name' => 'Gudang Utama', 'code' => 'WH-MAIN']);

        Category::create(['name' => 'Aksesoris', 'slug' => 'aksesoris', 'status' => 'active']);

        $product = Product::create([
            'name' => 'VGS Mouse Pro X',
            'slug' => 'vgs-mouse-pro-x',
            'type' => 'simple',
            'status' => 'published',
        ]);

        $variant = ProductVariant::create([
            'product_id' => $product->id,
            'sku' => 'VGS-MPX-001',
            'price' => 250000,
        ]);

        Inventory::create([
            'warehouse_id' => $warehouse->id,
            'variant_id' => $variant->id,
            'quantity_on_hand' => 10,
            'quantity_reserved' => 2,
            'reorder_level' => 5,
        ]);

        return [$warehouse, $product, $variant];
    }

    protected function createOrder(User $user, array $overrides = []): Order
    {
        return Order::create(array_merge([
            'order_number' => 'ORD-'.strtoupper(bin2hex(random_bytes(4))),
            'user_id' => $user->id,
            'contact_email' => $user->email,
            'contact_phone' => '08123456789',
            'currency' => 'IDR',
            'subtotal' => 250000,
            'discount_total' => 0,
            'shipping_total' => 0,
            'tax_total' => 0,
            'fee_total' => 0,
            'grand_total' => 250000,
            'order_status' => 'pending_payment',
            'payment_status' => 'pending',
            'fulfillment_status' => 'unfulfilled',
            'placed_at' => now(),
        ], $overrides));
    }

    public function test_delete_product_purges_restrictive_children_and_soft_deletes_product(): void
    {
        $this->actingAs($this->admin);

        [$warehouse, $product, $variant] = $this->productTree();

        $customer = User::factory()->create();
        $customer->roles()->attach(Role::where('slug', 'customer')->first()->id);

        InventoryMovement::create([
            'warehouse_id' => $warehouse->id,
            'variant_id' => $variant->id,
            'type' => 'in',
            'quantity' => 10,
            'quantity_before' => 0,
            'quantity_after' => 10,
        ]);

        $order = $this->createOrder($customer);

        StockReservation::create([
            'order_id' => $order->id,
            'warehouse_id' => $warehouse->id,
            'variant_id' => $variant->id,
            'quantity' => 2,
            'status' => 'active',
            'created_at' => now(),
        ]);

        $transferId = DB::table('inventory_transfers')->insertGetId([
            'source_warehouse_id' => $warehouse->id,
            'destination_warehouse_id' => $warehouse->id,
            'status' => 'draft',
            'created_at' => now(),
        ]);

        DB::table('inventory_transfer_items')->insert([
            'transfer_id' => $transferId,
            'variant_id' => $variant->id,
            'quantity' => 3,
        ]);

        $cartId = DB::table('carts')->insertGetId([
            'user_id' => $customer->id,
            'currency' => 'IDR',
            'status' => 'active',
            'created_at' => now(),
        ]);

        DB::table('cart_items')->insert([
            'cart_id' => $cartId,
            'variant_id' => $variant->id,
            'quantity' => 1,
        ]);

        app(DeleteProductAction::class)->execute($product->refresh());

        $this->assertNotNull($product->fresh(), 'produk tetap ada (soft delete)');
        $this->assertSoftDeleted('products', ['id' => $product->id]);
        $this->assertDatabaseMissing('product_variants', ['id' => $variant->id]);
        $this->assertDatabaseMissing('inventories', ['variant_id' => $variant->id]);
        $this->assertDatabaseMissing('inventory_movements', ['variant_id' => $variant->id]);
        $this->assertDatabaseMissing('stock_reservations', ['variant_id' => $variant->id]);
        $this->assertDatabaseMissing('inventory_transfer_items', ['variant_id' => $variant->id]);
        $this->assertDatabaseMissing('cart_items', ['variant_id' => $variant->id]);

        $this->assertDatabaseHas('audit_logs', [
            'action' => 'deleted',
            'subject_type' => Product::class,
            'subject_id' => $product->id,
        ]);
    }

    public function test_delete_product_works_when_only_inventory_exists(): void
    {
        $this->actingAs($this->admin);

        [, $product, $variant] = $this->productTree();

        app(DeleteProductAction::class)->execute($product->refresh());

        $this->assertSoftDeleted('products', ['id' => $product->id]);
        $this->assertDatabaseMissing('product_variants', ['id' => $variant->id]);
        $this->assertDatabaseMissing('inventories', ['variant_id' => $variant->id]);

        $this->assertDatabaseHas('audit_logs', [
            'action' => 'deleted',
            'subject_type' => Product::class,
            'subject_id' => $product->id,
        ]);
    }
}
