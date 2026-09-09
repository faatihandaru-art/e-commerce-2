<?php

namespace App\Observers;

use App\Models\Inventory;
use App\Support\Activity;

class InventoryObserver
{
    public function created(Inventory $inventory): void
    {
        Activity::record('stock_adjusted', $inventory, [
            'details' => "stok awal {$inventory->quantity_on_hand}",
            'before' => ['quantity_on_hand' => 0],
            'after' => ['quantity_on_hand' => $inventory->quantity_on_hand],
            'link' => route('admin.inventory.index'),
        ]);
    }

    public function updated(Inventory $inventory): void
    {
        if (! $inventory->isDirty(['quantity_on_hand', 'quantity_reserved', 'reorder_level'])) {
            return;
        }

        $before = $inventory->getOriginal('quantity_on_hand') ?? 0;
        $after = $inventory->quantity_on_hand;
        $delta = $after - $before;
        $sign = $delta >= 0 ? '+' : '';

        Activity::record('stock_adjusted', $inventory, [
            'details' => "{$sign}{$delta} (sekarang {$after})",
            'before' => [
                'quantity_on_hand' => $before,
                'quantity_reserved' => $inventory->getOriginal('quantity_reserved'),
            ],
            'after' => [
                'quantity_on_hand' => $after,
                'quantity_reserved' => $inventory->quantity_reserved,
            ],
            'link' => route('admin.inventory.index'),
        ]);
    }
}
