<?php

namespace Tests\Feature;

use App\Models\CustomerNote;
use App\Models\Order;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected User $customer;

    protected User $staff;

    protected function setUp(): void
    {
        parent::setUp();

        $staffRole = Role::create([
            'name' => 'Customer Service',
            'slug' => 'customer_service',
        ]);

        $adminRole = Role::create([
            'name' => 'Super Admin',
            'slug' => 'super_admin',
        ]);

        $customerRole = Role::create([
            'name' => 'Customer',
            'slug' => 'customer',
        ]);

        $this->admin = User::factory()->create();
        $this->admin->roles()->attach($adminRole->id);

        $this->staff = User::factory()->create();
        $this->staff->roles()->attach($staffRole->id);

        $this->customer = User::factory()->create();
        $this->customer->roles()->attach($customerRole->id);
    }

    protected function createSampleOrder(User $user, int $grandTotal = 110000, string $paymentStatus = 'unpaid', ?string $placedAt = null): Order
    {
        return Order::create([
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
            'payment_status' => $paymentStatus,
            'fulfillment_status' => 'fulfilled',
            'placed_at' => $placedAt ?? now(),
        ]);
    }

    public function test_admin_can_list_customers_only_excluding_staff(): void
    {
        $this->createSampleOrder($this->customer, 150000, 'paid');

        $response = $this->actingAs($this->admin)
            ->getJson('/admin/customers');

        $response->assertStatus(200);

        $customerIds = collect($response->json('customers.data'))->pluck('id')->all();

        $this->assertContains($this->customer->id, $customerIds);
        $this->assertNotContains($this->admin->id, $customerIds);
        $this->assertNotContains($this->staff->id, $customerIds);
    }

    public function test_listing_aggregates_total_spent_from_paid_orders_only(): void
    {
        $this->createSampleOrder($this->customer, 250000, 'paid', now()->subDays(2));
        $this->createSampleOrder($this->customer, 50000, 'paid', now()->subDay());
        $this->createSampleOrder($this->customer, 75000, 'unpaid', now());

        $response = $this->actingAs($this->admin)
            ->getJson('/admin/customers');

        $row = collect($response->json('customers.data'))->firstWhere('id', $this->customer->id);

        $this->assertEquals(3, $row['total_orders']);
        $this->assertEquals(300000, $row['total_spent']);
        $this->assertNotNull($row['last_order_at']);

        // Sort by total_spent paling royal terlebih dahulu
        $responsePaid = $this->actingAs($this->admin)
            ->getJson('/admin/customers?sort_by=total_spent&sort_order=desc');

        $this->assertSame($this->customer->id, $responsePaid->json('customers.data.0.id'));
    }

    public function test_show_customer_returns_profile_addresses_orders_and_notes(): void
    {
        $order = $this->createSampleOrder($this->customer, 250000, 'paid');

        $note = CustomerNote::create([
            'user_id' => $this->customer->id,
            'note' => 'Customer pernah komplain pengiriman lambat.',
            'created_by' => $this->admin->id,
        ]);

        $response = $this->actingAs($this->admin)
            ->getJson("/admin/customers/{$this->customer->id}");

        $response->assertStatus(200)
            ->assertJsonPath('customer.profile.id', $this->customer->id)
            ->assertJsonPath('customer.orders.0.order_number', $order->order_number)
            ->assertJsonPath('customer.notes.0.note', $note->note)
            ->assertJsonPath('customer.notes.0.author_name', $this->admin->name)
            ->assertJsonPath('customer.profile.total_orders', 1)
            ->assertJsonPath('customer.profile.total_spent', 250000);

        // addresses tetap array walau belum ada data alamat (tabel customer_addresses)
        $this->assertIsArray($response->json('customer.addresses'));
    }

    public function test_show_staff_account_returns_404(): void
    {
        $this->actingAs($this->admin)
            ->getJson("/admin/customers/{$this->staff->id}")
            ->assertStatus(404);
    }

    public function test_admin_can_store_note_for_customer(): void
    {
        $response = $this->actingAs($this->admin)
            ->postJson("/admin/customers/{$this->customer->id}/notes", [
                'note' => 'Customer sering retur, perlu diperhatikan.',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('message', 'Catatan customer berhasil ditambahkan.');

        $this->assertDatabaseHas('customer_notes', [
            'user_id' => $this->customer->id,
            'note' => 'Customer sering retur, perlu diperhatikan.',
            'created_by' => $this->admin->id,
        ]);
    }

    public function test_blank_note_is_rejected(): void
    {
        $response = $this->actingAs($this->admin)
            ->postJson("/admin/customers/{$this->customer->id}/notes", [
                'note' => '   ',
            ]);

        $response->assertStatus(422);

        $this->assertDatabaseCount('customer_notes', 0);
    }

    public function test_admin_can_delete_customer_note(): void
    {
        $note = CustomerNote::create([
            'user_id' => $this->customer->id,
            'note' => 'Catatan sementara untuk dihapus.',
            'created_by' => $this->admin->id,
        ]);

        $this->actingAs($this->admin)
            ->deleteJson("/admin/customers/notes/{$note->id}")
            ->assertStatus(200);

        $this->assertDatabaseMissing('customer_notes', ['id' => $note->id]);
    }

    public function test_admin_can_update_customer_status_but_not_staff_status(): void
    {
        $this->actingAs($this->admin)
            ->postJson("/admin/customers/{$this->customer->id}/status", [
                'status' => 'inactive',
            ])
            ->assertStatus(200);

        $this->assertDatabaseHas('users', [
            'id' => $this->customer->id,
            'status' => 'inactive',
        ]);

        $this->actingAs($this->admin)
            ->postJson("/admin/customers/{$this->staff->id}/status", [
                'status' => 'inactive',
            ])
            ->assertStatus(403);

        $this->assertDatabaseHas('users', [
            'id' => $this->staff->id,
            'status' => 'active',
        ]);
    }
}
