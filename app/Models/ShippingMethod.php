<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShippingMethod extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'name',
        'code',
        'provider',
        'service',
        'base_price',
        'status',
    ];

    protected $casts = [
        'base_price' => 'integer',
    ];
}
