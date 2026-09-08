<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Shipment extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'order_id',
        'warehouse_id',
        'method_id',
        'courier',
        'tracking_number',
        'cost',
        'status',
        'shipped_at',
        'delivered_at',
        'created_at',
    ];

    protected $casts = [
        'cost' => 'integer',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
        'created_at' => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function method(): BelongsTo
    {
        return $this->belongsTo(ShippingMethod::class, 'method_id');
    }
}
