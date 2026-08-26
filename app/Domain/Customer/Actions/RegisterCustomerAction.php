<?php

namespace App\Domain\Customer\Actions;

use App\Models\User;

final class RegisterCustomerAction
{
    public function execute(array $data): User
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            // rely on the model cast 'password' => 'hashed' to hash automatically
            'password' => $data['password'],
            'status' => $data['status'] ?? 'active',
        ]);
    }
}