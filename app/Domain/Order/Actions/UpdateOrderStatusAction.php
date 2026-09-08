<?php

namespace App\Domain\Order\Actions;

use App\Domain\Order\Enums\OrderStatus;
use App\Domain\Order\Exceptions\InvalidOrderStatusTransitionException;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\StockReservation;
use Illuminate\Support\Facades\DB;

class UpdateOrderStatusAction
{
    /**
     * Update order status with transition validation and history tracking.
     *
     * @throws InvalidOrderStatusTransitionException
     */
    public function execute(Order $order, string $toStatus, ?string $notes = null, ?int $actorId = null): Order
    {
        $currentStatusEnum = OrderStatus::tryFrom($order->order_status);
        $targetStatusEnum = OrderStatus::tryFrom($toStatus);

        if (! $targetStatusEnum) {
            throw new \InvalidArgumentException("Status '{$toStatus}' tidak valid.");
        }

        if ($currentStatusEnum && ! $currentStatusEnum->canTransitionTo($targetStatusEnum)) {
            throw new InvalidOrderStatusTransitionException($order->order_status, $toStatus);
        }

        return DB::transaction(function () use ($order, $toStatus, $notes, $actorId) {
            $fromStatus = $order->order_status;

            if ($fromStatus === $toStatus) {
                return $order;
            }

            $updateData = [
                'order_status' => $toStatus,
            ];

            // Auto-update secondary statuses according to lifecycle
            match ($toStatus) {
                OrderStatus::CONFIRMED->value => [
                    $updateData['payment_status'] = $order->payment_status === 'unpaid' ? 'pending' : $order->payment_status,
                ],
                OrderStatus::PROCESSING->value => [
                    $updateData['fulfillment_status'] = 'processing',
                ],
                OrderStatus::PACKED->value => [
                    $updateData['fulfillment_status'] = 'processing',
                ],
                OrderStatus::SHIPPED->value => [
                    $updateData['fulfillment_status'] = 'fulfilled',
                ],
                OrderStatus::COMPLETED->value => [
                    $updateData['payment_status'] = 'paid',
                    $updateData['fulfillment_status'] = 'fulfilled',
                ],
                OrderStatus::CANCELLED->value => [
                    $updateData['payment_status'] = $order->payment_status === 'paid' ? 'refunded' : 'failed',
                    $updateData['fulfillment_status'] = 'returned',
                ],
                OrderStatus::REFUNDED->value => [
                    $updateData['payment_status'] = 'refunded',
                ],
                default => null,
            };

            $order->update($updateData);

            OrderStatusHistory::create([
                'order_id' => $order->id,
                'from_status' => $fromStatus,
                'to_status' => $toStatus,
                'notes' => $notes,
                'changed_by' => $actorId,
                'created_at' => now(),
            ]);

            if ($toStatus === OrderStatus::CANCELLED->value) {
                // Release active stock reservations
                StockReservation::where('order_id', $order->id)
                    ->where('status', 'active')
                    ->update(['status' => 'released']);
            }

            return $order->fresh();
        });
    }
}
