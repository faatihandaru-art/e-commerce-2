<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            ['name' => 'Manage Products', 'slug' => 'manage_products'],
            ['name' => 'Manage Inventory', 'slug' => 'manage_inventory'],
            ['name' => 'Manage Orders', 'slug' => 'manage_orders'],
            ['name' => 'Manage Payments', 'slug' => 'manage_payments'],
            ['name' => 'Manage Customers', 'slug' => 'manage_customers'],
            ['name' => 'View Reports', 'slug' => 'view_reports'],
            ['name' => 'Manage Settings', 'slug' => 'manage_settings'],
        ];

        foreach ($permissions as $permissionData) {
            Permission::firstOrCreate(['slug' => $permissionData['slug']], $permissionData);
        }
    }
}
