<?php

namespace App\Domain\Customer\Actions;

use App\Models\User;
use App\Models\Role;

final class RegisterCustomerAction
{
    public function execute(array $data): User
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            // rely on the model cast 'password' => 'hashed' to hash automatically
            'password' => $data['password'],
            'status' => $data['status'] ?? 'active',
        ]);

        // Automatically assign customer role to newly registered users
        $customerRole = Role::where('slug', 'customer')->first();
        if ($customerRole) {
            $user->roles()->attach($customerRole->id);
        }

        return $user;
    }
}