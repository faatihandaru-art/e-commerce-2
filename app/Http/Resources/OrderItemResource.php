<?php

namespace App\Http\Resources;

use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin OrderItem
 */
class OrderItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $request->user();
        $isStaff = $user && $user->isStaff();

        $data = [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'product_id' => $this->product_id,
            'variant_id' => $this->variant_id,
            'sku' => $this->sku,
            'product_name' => $this->product_name,
            'variant_name' => $this->variant_name,
            'unit_price' => (int) $this->unit_price,
            'quantity' => (int) $this->quantity,
            'discount_amount' => (int) $this->discount_amount,
            'tax_amount' => (int) $this->tax_amount,
            'total' => (int) $this->total,
            'image' => data_get($this->metadata, 'image'),
            'metadata' => $this->metadata,
        ];

        // Include cost_price ONLY for staff members
        if ($isStaff) {
            $data['cost_price'] = $this->cost_price !== null ? (int) $this->cost_price : null;
        }

        return $data;
    }
}
