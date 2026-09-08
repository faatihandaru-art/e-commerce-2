<?php

namespace App\Domain\Order\Actions;

use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\StockReservation;
use Illuminate\Support\Facades\DB;

class CancelOrderAction
{
    public function execute(Order $order, string $reason = 'Order dibatalkan', ?int $actorId = null): Order
    {
        return DB::transaction(function () use ($order, $reason, $actorId) {
            if (in_array($order->order_status, ['completed', 'refunded', 'cancelled'], true)) {
                return $order->fresh();
            }

            $from = $order->order_status;
            $order->update([
                'order_status' => 'cancelled',
                'payment_status' => $order->payment_status === 'paid' ? 'refunded' : 'failed',
                'fulfillment_status' => 'returned',
            ]);

            OrderStatusHistory::create([
                'order_id' => $order->id,
                'from_status' => $from,
                'to_status' => 'cancelled',
                'notes' => $reason,
                'changed_by' => $actorId,
                'created_at' => now(),
            ]);

            // Release active stock reservations
            StockReservation::where('order_id', $order->id)
                ->where('status', 'active')
                ->update(['status' => 'released']);

            // Restore variant stock if items were reserved/subtracted
            foreach ($order->items as $item) {
                if ($item->variant_id) {
                    $item->variant?->increment('stock', $item->quantity);
                }
            }

            return $order->fresh();
        });
    }
}
