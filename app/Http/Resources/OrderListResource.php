<?php

namespace App\Http\Resources;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Order
 */
class OrderListResource extends JsonResource
{
    /**
     * Transform the resource into an array for table/list views.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $shipping = $this->shippingAddress;

        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'customer' => [
                'id' => $this->user_id,
                'name' => $this->user ? $this->user->name : ($shipping->recipient ?? 'Guest'),
                'email' => $this->contact_email,
                'phone' => $this->contact_phone,
            ],
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
            'items_count' => $this->relationLoaded('items') ? $this->items->sum('quantity') : 0,
            'placed_at' => $this->placed_at ? $this->placed_at->toIso8601String() : null,
            'created_at' => $this->created_at ? $this->created_at->toIso8601String() : null,
        ];
    }
}
