<?php

namespace App\Observers;

use App\Models\Order;
use App\Support\Activity;
use Illuminate\Support\Arr;

class OrderObserver
{
    public function created(Order $order): void
    {
        Activity::record('order_placed', $order, [
            'actor_id' => $order->user_id,
            'details' => 'Rp '.number_format($order->grand_total, 0, ',', '.'),
            'after' => [
                'order_number' => $order->order_number,
                'grand_total' => $order->grand_total,
                'order_status' => $order->order_status,
            ],
            'link' => route('admin.orders.show', $order),
        ]);
    }

    public function updated(Order $order): void
    {
        $fields = ['order_status', 'payment_status', 'fulfillment_status'];
        $changes = [];

        foreach ($fields as $field) {
            if ($order->isDirty($field)) {
                $changes[] = "{$field}: {$order->getOriginal($field)} → {$order->{$field}}";
            }
        }

        if ($changes === []) {
            return;
        }

        Activity::record('order_status_changed', $order, [
            'details' => implode(', ', $changes),
            'before' => Arr::only($order->getOriginal(), $fields),
            'after' => Arr::only($order->getAttributes(), $fields),
            'link' => route('admin.orders.show', $order),
        ]);
    }
}
