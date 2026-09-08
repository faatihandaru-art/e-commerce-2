<?php

namespace App\Domain\Order\Actions;

use App\Models\Order;
use App\Models\OrderNote;

class AddOrderNoteAction
{
    /**
     * Add a note to an order.
     */
    public function execute(Order $order, string $note, string $visibility = 'internal', ?int $createdBy = null): OrderNote
    {
        if (! in_array($visibility, ['internal', 'customer'], true)) {
            $visibility = 'internal';
        }

        return OrderNote::create([
            'order_id' => $order->id,
            'visibility' => $visibility,
            'note' => $note,
            'created_by' => $createdBy,
            'created_at' => now(),
        ]);
    }
}
