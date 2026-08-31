<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['name' => 'Super Admin', 'slug' => 'super_admin'],
            ['name' => 'Admin', 'slug' => 'admin'],
            ['name' => 'Catalog Manager', 'slug' => 'catalog_manager'],
            ['name' => 'Inventory Manager', 'slug' => 'inventory_manager'],
            ['name' => 'Order Manager', 'slug' => 'order_manager'],
            ['name' => 'Finance Operator', 'slug' => 'finance_operator'],
            ['name' => 'Customer Service', 'slug' => 'customer_service'],
            ['name' => 'Customer', 'slug' => 'customer'],
        ];

        foreach ($roles as $roleData) {
            Role::firstOrCreate(['slug' => $roleData['slug']], $roleData);
        }
    }
}
