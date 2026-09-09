<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Product;
use App\Models\Role;
use App\Models\User;
use App\Notifications\AdminActivityNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected User $staff;

    protected User $customer;

    protected function setUp(): void
    {
        parent::setUp();

        Role::create(['name' => 'Super Admin', 'slug' => 'super_admin']);
        Role::create(['name' => 'Customer Service', 'slug' => 'customer_service']);
        Role::create(['name' => 'Customer', 'slug' => 'customer']);

        $this->admin = User::factory()->create();
        $this->admin->roles()->attach(Role::where('slug', 'super_admin')->first()->id);

        $this->staff = User::factory()->create();
        $this->staff->roles()->attach(Role::where('slug', 'customer_service')->first()->id);

        $this->customer = User::factory()->create();
        $this->customer->roles()->attach(Role::where('slug', 'customer')->first()->id);
    }

    protected function createOrder(User $user): Order
    {
        return Order::create([
            'order_number' => 'ORD-'.strtoupper(bin2hex(random_bytes(4))),
            'user_id' => $user->id,
            'contact_email' => $user->email,
            'contact_phone' => '08123456789',
            'currency' => 'IDR',
            'subtotal' => 150000,
            'discount_total' => 0,
            'shipping_total' => 0,
            'tax_total' => 0,
            'fee_total' => 0,
            'grand_total' => 150000,
            'order_status' => 'pending_payment',
            'payment_status' => 'pending',
            'fulfillment_status' => 'unfulfilled',
            'placed_at' => now(),
        ]);
    }

    public function test_order_creation_notifies_staff_only(): void
    {
        $this->createOrder($this->customer);

        $this->assertSame(1, $this->admin->unreadNotifications()->count());
        $this->assertSame(1, $this->staff->unreadNotifications()->count());
        $this->assertSame(0, $this->customer->unreadNotifications()->count());

        $adminNotification = $this->admin->unreadNotifications()->first();
        $this->assertSame('Pesanan baru', $adminNotification->data['title']);
        $this->assertStringContainsString('ORD-', $adminNotification->data['message']);
    }

    public function test_notifications_index_returns_paginated_notifications(): void
    {
        $this->createOrder($this->customer);

        $response = $this->actingAs($this->admin)->getJson('/admin/notifications');

        $response->assertStatus(200)
            ->assertJsonPath('notifications.total', 1);

        $item = $response->json('notifications.data.0');
        $this->assertSame('Pesanan baru', $item['title']);
        $this->assertFalse($item['read']);
        $this->assertNotNull($item['time']);
    }

    public function test_mark_notification_as_read(): void
    {
        $this->createOrder($this->customer);

        $notification = $this->admin->unreadNotifications()->first();

        $this->actingAs($this->admin)
            ->postJson("/admin/notifications/{$notification->id}/read")
            ->assertStatus(302);

        $this->assertSame(0, $this->admin->unreadNotifications()->count());
    }

    public function test_read_all_notifications(): void
    {
        $this->createOrder($this->customer);
        $this->createOrder($this->customer);

        $this->assertSame(2, $this->admin->unreadNotifications()->count());

        $this->actingAs($this->admin)
            ->postJson('/admin/notifications/read-all')
            ->assertStatus(302);

        $this->assertSame(0, $this->admin->unreadNotifications()->count());
    }

    public function test_activity_product_update_records_audit_and_notification(): void
    {
        $product = Product::create([
            'name' => 'VGS Keyboard RGB',
            'slug' => 'vgs-keyboard-rgb',
            'type' => 'simple',
            'status' => 'draft',
        ]);

        $this->actingAs($this->admin);

        $product->update(['name' => 'VGS Keyboard RGB Pro', 'status' => 'published']);

        $this->assertDatabaseHas('audit_logs', [
            'subject_type' => Product::class,
            'subject_id' => $product->id,
            'action' => 'updated',
        ]);

        $this->assertSame(
            1,
            $this->admin->unreadNotifications()
                ->where('type', AdminActivityNotification::class)
                ->where('data', 'like', '%Produk diperbarui%')
                ->count()
        );
    }
}
