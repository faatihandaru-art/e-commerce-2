<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Refund extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'order_id',
        'payment_id',
        'amount',
        'status',
        'reason',
        'processed_at',
        'created_at',
    ];

    protected $casts = [
        'amount' => 'integer',
        'processed_at' => 'datetime',
        'created_at' => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }
}
