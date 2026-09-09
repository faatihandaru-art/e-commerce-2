<?php

namespace App\Observers;

use App\Models\Warehouse;
use App\Support\Activity;

class WarehouseObserver
{
    public function created(Warehouse $warehouse): void
    {
        Activity::record('created', $warehouse, [
            'after' => ['name' => $warehouse->name, 'code' => $warehouse->code, 'status' => $warehouse->status],
            'link' => route('admin.warehouses.index'),
        ]);
    }

    public function updated(Warehouse $warehouse): void
    {
        if (! $warehouse->isDirty(['name', 'code', 'address', 'status'])) {
            return;
        }

        Activity::record('updated', $warehouse, [
            'before' => [
                'name' => $warehouse->getOriginal('name'),
                'code' => $warehouse->getOriginal('code'),
                'status' => $warehouse->getOriginal('status'),
            ],
            'after' => [
                'name' => $warehouse->name,
                'code' => $warehouse->code,
                'status' => $warehouse->status,
            ],
            'link' => route('admin.warehouses.index'),
        ]);
    }

    public function deleted(Warehouse $warehouse): void
    {
        Activity::record('deleted', $warehouse, [
            'before' => ['name' => $warehouse->name, 'code' => $warehouse->code, 'status' => $warehouse->status],
        ]);
    }
}
