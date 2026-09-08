<?php

namespace App\Http\Resources;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Order
 */
class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array for full detail views.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $request->user();
        $isStaff = $user && $user->isStaff();

        $notes = $this->relationLoaded('notes') ? $this->notes : collect();
        if (! $isStaff) {
            $notes = $notes->filter(fn ($note) => $note->visibility === 'customer');
        }

        $payments = $this->relationLoaded('payments') ? $this->payments->map(function ($payment) use ($isStaff) {
            $pData = [
                'id' => $payment->id,
                'method' => $payment->method,
                'provider' => $payment->provider,
                'amount' => (int) $payment->amount,
                'currency' => $payment->currency,
                'status' => $payment->status,
                'payment_url' => $payment->payment_url,
                'paid_at' => $payment->paid_at ? $payment->paid_at->toIso8601String() : null,
                'expires_at' => $payment->expires_at ? $payment->expires_at->toIso8601String() : null,
            ];

            if ($isStaff) {
                $pData['provider_reference'] = $payment->provider_reference;
                $pData['metadata'] = $payment->metadata;
            }

            return $pData;
        }) : [];

        $shipments = $this->relationLoaded('shipments') ? $this->shipments->map(fn ($shipment) => [
            'id' => $shipment->id,
            'courier' => $shipment->courier,
            'tracking_number' => $shipment->tracking_number,
            'cost' => (int) $shipment->cost,
            'status' => $shipment->status,
            'warehouse' => $shipment->warehouse ? [
                'id' => $shipment->warehouse->id,
                'name' => $shipment->warehouse->name,
                'code' => $shipment->warehouse->code,
            ] : null,
            'shipped_at' => $shipment->shipped_at ? $shipment->shipped_at->toIso8601String() : null,
            'delivered_at' => $shipment->delivered_at ? $shipment->delivered_at->toIso8601String() : null,
        ]) : [];

        $statusHistories = $this->relationLoaded('statusHistories') ? $this->statusHistories->map(fn ($history) => [
            'id' => $history->id,
            'from_status' => $history->from_status,
            'to_status' => $history->to_status,
            'notes' => $history->notes,
            'changed_by' => $history->changedBy ? [
                'id' => $history->changedBy->id,
                'name' => $history->changedBy->name,
            ] : null,
            'created_at' => $history->created_at ? $history->created_at->toIso8601String() : null,
        ]) : [];

        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'customer' => [
                'id' => $this->user_id,
                'name' => $this->user ? $this->user->name : ($this->shippingAddress->recipient ?? 'Guest'),
                'email' => $this->contact_email,
                'phone' => $this->contact_phone,
            ],
            'contact_email' => $this->contact_email,
            'contact_phone' => $this->contact_phone,
            'currency' => $this->currency,
            'subtotal' => (int) $this->subtotal,
            'discount_total' => (int) $this->discount_total,
            'shipping_total' => (int) $this->shipping_total,
            'tax_total' => (int) $this->tax_total,
            'fee_total' => (int) $this->fee_total,
            'grand_total' => (int) $this->grand_total,
            'order_status' => $this->order_status,
            'payment_status' => $this->payment_status,
            'fulfillment_status' => $this->fulfillment_status,
            'placed_at' => $this->placed_at ? $this->placed_at->toIso8601String() : null,
            'created_at' => $this->created_at ? $this->created_at->toIso8601String() : null,
            'updated_at' => $this->updated_at ? $this->updated_at->toIso8601String() : null,
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'shipping_address' => $this->relationLoaded('shippingAddress') && $this->shippingAddress ? [
                'id' => $this->shippingAddress->id,
                'recipient' => $this->shippingAddress->recipient,
                'phone' => $this->shippingAddress->phone,
                'address_line1' => $this->shippingAddress->address_line1,
                'address_line2' => $this->shippingAddress->address_line2,
                'city' => $this->shippingAddress->city,
                'province' => $this->shippingAddress->province,
                'postal_code' => $this->shippingAddress->postal_code,
                'country' => $this->shippingAddress->country,
            ] : null,
            'billing_address' => $this->relationLoaded('billingAddress') && $this->billingAddress ? [
                'id' => $this->billingAddress->id,
                'recipient' => $this->billingAddress->recipient,
                'phone' => $this->billingAddress->phone,
                'address_line1' => $this->billingAddress->address_line1,
                'address_line2' => $this->billingAddress->address_line2,
                'city' => $this->billingAddress->city,
                'province' => $this->billingAddress->province,
                'postal_code' => $this->billingAddress->postal_code,
                'country' => $this->billingAddress->country,
            ] : null,
            'status_histories' => $statusHistories,
            'payments' => $payments,
            'shipments' => $shipments,
            'notes' => $notes->map(fn ($note) => [
                'id' => $note->id,
                'visibility' => $note->visibility,
                'note' => $note->note,
                'created_by' => $note->createdBy ? [
                    'id' => $note->createdBy->id,
                    'name' => $note->createdBy->name,
                ] : null,
                'created_at' => $note->created_at ? $note->created_at->toIso8601String() : null,
            ])->values(),
            'adjustments' => $this->whenLoaded('adjustments', fn () => $this->adjustments->map(fn ($adj) => [
                'id' => $adj->id,
                'type' => $adj->type,
                'description' => $adj->description,
                'amount' => (int) $adj->amount,
            ])),
        ];
    }
}
