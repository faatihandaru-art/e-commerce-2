<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'order_id',
        'product_id',
        'variant_id',
        'sku',
        'product_name',
        'variant_name',
        'unit_price',
        'quantity',
        'discount_amount',
        'tax_amount',
        'cost_price',
        'total',
        'metadata',
    ];

    protected $casts = [
        'unit_price' => 'integer',
        'quantity' => 'integer',
        'discount_amount' => 'integer',
        'tax_amount' => 'integer',
        'cost_price' => 'integer',
        'total' => 'integer',
        'metadata' => 'array',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'variant_id');
    }
}
