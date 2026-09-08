<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    /**
     * Determine whether the user can view any orders (Admin list).
     */
    public function viewAny(User $user): bool
    {
        return $user->isStaff();
    }

    /**
     * Determine whether the user can view the specific order.
     */
    public function view(User $user, Order $order): bool
    {
        if ($user->isStaff()) {
            return true;
        }

        return $order->user_id === $user->id;
    }

    /**
     * Determine whether the user can update the order status.
     */
    public function updateStatus(User $user, Order $order): bool
    {
        return $user->isStaff();
    }

    /**
     * Determine whether the user can add notes to the order.
     */
    public function addNote(User $user, Order $order): bool
    {
        return $user->isStaff();
    }

    /**
     * Determine whether the user can cancel the order.
     */
    public function cancel(User $user, Order $order): bool
    {
        if ($user->isStaff()) {
            return true;
        }

        // Customer can only cancel their own order if it's still pending payment
        return $order->user_id === $user->id && $order->order_status === 'pending_payment';
    }
}
