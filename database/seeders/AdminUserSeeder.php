<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $email = 'admin@vgs.test';
        $randomPassword = Str::random(12);

        $superAdminRole = Role::where('slug', 'super_admin')->first();

        if (!$superAdminRole) {
            $this->command->error('Role super_admin not found. Please run RoleSeeder first.');
            return;
        }

        $adminUser = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => 'Super Admin',
                'phone' => '08123456789',
                'password' => $randomPassword,
                'status' => 'active',
            ]
        );

        if (!$adminUser->hasRole('super_admin')) {
            $adminUser->roles()->syncWithoutDetaching([$superAdminRole->id]);
        }

        $this->command->info("========================================");
        $this->command->info("ADMIN USER CREATED SUCCESSFULLY");
        $this->command->info("Email    : {$email}");
        $this->command->info("Password : {$randomPassword}");
        $this->command->info("Role     : super_admin");
        $this->command->info("========================================");
    }
}
