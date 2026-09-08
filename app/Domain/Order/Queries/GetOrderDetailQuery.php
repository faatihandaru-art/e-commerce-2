<?php

namespace App\Domain\Order\Queries;

use App\Models\Order;

class GetOrderDetailQuery
{
    /**
     * Get order detail with all necessary relationships loaded.
     */
    public function execute(Order|int|string $order): Order
    {
        if (! $order instanceof Order) {
            $order = Order::query()
                ->where('id', $order)
                ->orWhere('order_number', $order)
                ->firstOrFail();
        }

        return $order->load([
            'user',
            'items',
            'addresses',
            'shippingAddress',
            'billingAddress',
            'statusHistories.changedBy',
            'payments',
            'shipments.warehouse',
            'shipments.method',
            'notes.createdBy',
            'adjustments',
            'refunds.payment',
        ]);
    }
}
