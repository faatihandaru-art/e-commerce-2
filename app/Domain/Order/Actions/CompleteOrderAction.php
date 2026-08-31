<?php

namespace App\Domain\Order\Actions;

use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class CompleteOrderAction
{
    public function execute(Order $order, ?int $actorId = null): Order
    {
        return DB::transaction(function () use ($order, $actorId) {
            $payment = $order->payments()->first();

            if ($payment) {
                $payment->update([
                    'status' => 'paid',
                    'paid_at' => now(),
                ]);
            }

            if ($order->order_status === 'pending_payment') {
                $from = $order->order_status;
                $order->update([
                    'order_status' => 'confirmed',
                    'payment_status' => 'paid',
                ]);

                OrderStatusHistory::create([
                    'order_id' => $order->id,
                    'from_status' => $from,
                    'to_status' => 'confirmed',
                    'notes' => 'Pembayaran dikonfirmasi.',
                    'changed_by' => $actorId,
                    'created_at' => now(),
                ]);
            }

            return $order->fresh();
        });
    }
}