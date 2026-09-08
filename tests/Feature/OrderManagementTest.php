<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\OrderAddress;
use App\Models\OrderItem;
use App\Models\OrderNote;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected User $customer;

    protected User $otherCustomer;

    protected function setUp(): void
    {
        parent::setUp();

        $adminRole = Role::create([
            'name' => 'Order Manager',
            'slug' => 'order_manager',
        ]);

        $customerRole = Role::create([
            'name' => 'Customer',
            'slug' => 'customer',
        ]);

        $this->admin = User::factory()->create();
        $this->admin->roles()->attach($adminRole->id);

        $this->customer = User::factory()->create();
        $this->customer->roles()->attach($customerRole->id);

        $this->otherCustomer = User::factory()->create();
        $this->otherCustomer->roles()->attach($customerRole->id);
    }

    protected function createSampleOrder(User $user, string $orderStatus = 'pending_payment'): Order
    {
        $order = Order::create([
            'order_number' => 'ORD-'.strtoupper(bin2hex(random_bytes(4))),
            'user_id' => $user->id,
            'contact_email' => $user->email,
            'contact_phone' => '08123456789',
            'currency' => 'IDR',
            'subtotal' => 100000,
            'discount_total' => 0,
            'shipping_total' => 10000,
            'tax_total' => 0,
            'fee_total' => 0,
            'grand_total' => 110000,
            'order_status' => $orderStatus,
            'payment_status' => 'unpaid',
            'fulfillment_status' => 'unfulfilled',
            'placed_at' => now(),
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'sku' => 'SKU-001',
            'product_name' => 'Gaming Mouse',
            'unit_price' => 100000,
            'quantity' => 1,
            'cost_price' => 60000,
            'total' => 100000,
        ]);

        OrderAddress::create([
            'order_id' => $order->id,
            'type' => 'shipping',
            'recipient' => $user->name,
            'phone' => '08123456789',
            'address_line1' => 'Jl. Merdeka No. 10',
            'city' => 'Jakarta',
            'province' => 'DKI Jakarta',
            'postal_code' => '10110',
            'country' => 'Indonesia',
        ]);

        OrderNote::create([
            'order_id' => $order->id,
            'visibility' => 'internal',
            'note' => 'Internal staff secret note',
        ]);

        OrderNote::create([
            'order_id' => $order->id,
            'visibility' => 'customer',
            'note' => 'Public note for customer',
        ]);

        return $order;
    }

    public function test_admin_can_list_and_filter_orders(): void
    {
        $order1 = $this->createSampleOrder($this->customer, 'pending_payment');
        $order2 = $this->createSampleOrder($this->customer, 'shipped');

        $response = $this->actingAs($this->admin)
            ->getJson('/admin/orders?status=pending_payment');

        $response->assertStatus(200)
            ->assertJsonPath('summary.total_orders', 2)
            ->assertJsonPath('summary.perlu_diproses', 1);
    }

    public function test_admin_can_update_order_status_with_valid_transition_and_records_history(): void
    {
        $order = $this->createSampleOrder($this->customer, 'pending_payment');

        $response = $this->actingAs($this->admin)
            ->patchJson("/admin/orders/{$order->id}/status", [
                'status' => 'confirmed',
                'notes' => 'Pembayaran dikonfirmasi manual.',
            ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'order_status' => 'confirmed',
        ]);

        $this->assertDatabaseHas('order_status_histories', [
            'order_id' => $order->id,
            'from_status' => 'pending_payment',
            'to_status' => 'confirmed',
            'notes' => 'Pembayaran dikonfirmasi manual.',
        ]);
    }

    public function test_admin_invalid_status_transition_is_rejected(): void
    {
        $order = $this->createSampleOrder($this->customer, 'pending_payment');

        // Cannot jump directly from pending_payment to shipped
        $response = $this->actingAs($this->admin)
            ->patchJson("/admin/orders/{$order->id}/status", [
                'status' => 'shipped',
                'notes' => 'Invalid jump',
            ]);

        $response->assertStatus(422);

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'order_status' => 'pending_payment',
        ]);
    }

    public function test_customer_can_only_view_their_own_order(): void
    {
        $ownOrder = $this->createSampleOrder($this->customer);
        $otherOrder = $this->createSampleOrder($this->otherCustomer);

        // Can view own order
        $responseOwn = $this->actingAs($this->customer)
            ->getJson("/account/orders/{$ownOrder->id}");

        $responseOwn->assertStatus(200);

        // Cannot view other's order
        $responseOther = $this->actingAs($this->customer)
            ->getJson("/account/orders/{$otherOrder->id}");

        $responseOther->assertStatus(403);
    }

    public function test_account_orders_endpoint_does_not_leak_cost_price_or_internal_notes(): void
    {
        $order = $this->createSampleOrder($this->customer);

        $response = $this->actingAs($this->customer)
            ->getJson("/account/orders/{$order->id}");

        $response->assertStatus(200);

        $json = $response->json();

        // Check items do not contain cost_price
        $item = $json['order']['items'][0];
        $this->assertArrayNotHasKey('cost_price', $item);

        // Check notes only contain customer visible notes
        $notes = $json['order']['notes'];
        $this->assertCount(1, $notes);
        $this->assertEquals('customer', $notes[0]['visibility']);
        $this->assertEquals('Public note for customer', $notes[0]['note']);
    }

    public function test_customer_can_cancel_their_own_pending_payment_order(): void
    {
        $order = $this->createSampleOrder($this->customer, 'pending_payment');

        $response = $this->actingAs($this->customer)
            ->postJson("/account/orders/{$order->id}/cancel", [
                'reason' => 'Ingin ganti varian',
            ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'order_status' => 'cancelled',
        ]);

        $this->assertDatabaseHas('order_status_histories', [
            'order_id' => $order->id,
            'from_status' => 'pending_payment',
            'to_status' => 'cancelled',
        ]);
    }
}
