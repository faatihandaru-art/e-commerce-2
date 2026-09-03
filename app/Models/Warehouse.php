<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Warehouse extends Model
{
    protected $fillable = [
        'name',
        'code',
        'address',
        'status',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    public function inventories(): HasMany
    {
        return $this->hasMany(Inventory::class);
    }
}
