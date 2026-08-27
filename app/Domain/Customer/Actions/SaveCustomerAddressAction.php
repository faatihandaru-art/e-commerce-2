<?php

namespace App\Domain\Customer\Actions;

use App\Models\CustomerAddress;
use App\Models\User;

final class SaveCustomerAddressAction
{
    public function execute(User $user, array $data): CustomerAddress
    {
        if (!empty($data['is_default'])) {
            $user->addresses()->where('is_default', true)->update(['is_default' => false]);
        }

        return $user->addresses()->create($data);
    }
}
