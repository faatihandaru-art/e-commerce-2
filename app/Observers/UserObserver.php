<?php

namespace App\Observers;

use App\Models\User;
use App\Support\Activity;

class UserObserver
{
    public function updated(User $user): void
    {
        if (! $user->isDirty('status')) {
            return;
        }

        if (! $user->roles()->where('slug', 'customer')->exists()) {
            return;
        }

        $before = $user->getOriginal('status');
        $after = $user->status;

        Activity::record('customer_status_changed', $user, [
            'label' => "customer '{$user->name}'",
            'details' => "{$before} → {$after}",
            'before' => ['status' => $before],
            'after' => ['status' => $after],
            'link' => route('admin.customers.show', $user),
        ]);
    }
}
