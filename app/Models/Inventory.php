<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Inventory extends Model
{
    protected $fillable = [
        'warehouse_id',
        'variant_id',
        'quantity_on_hand',
        'quantity_reserved',
        'reorder_level',
    ];

    protected $casts = [
        'quantity_on_hand' => 'integer',
        'quantity_reserved' => 'integer',
        'reorder_level' => 'integer',
    ];

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'variant_id');
    }

    public function availableQuantity(): int
    {
        return $this->quantity_on_hand - $this->quantity_reserved;
    }
}
