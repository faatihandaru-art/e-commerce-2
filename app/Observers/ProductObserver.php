<?php

namespace App\Observers;

use App\Models\Product;
use App\Support\Activity;

class ProductObserver
{
    public function created(Product $product): void
    {
        Activity::record('created', $product, [
            'after' => ['name' => $product->name, 'status' => $product->status],
            'link' => route('admin.products.edit', $product),
        ]);
    }

    public function updated(Product $product): void
    {
        if (! $product->isDirty(['name', 'slug', 'status', 'description', 'category_id'])) {
            return;
        }

        Activity::record('updated', $product, [
            'before' => [
                'name' => $product->getOriginal('name'),
                'status' => $product->getOriginal('status'),
            ],
            'after' => ['name' => $product->name, 'status' => $product->status],
            'link' => route('admin.products.edit', $product),
        ]);
    }

    public function deleted(Product $product): void
    {
        Activity::record('deleted', $product, [
            'before' => ['name' => $product->name, 'status' => $product->status],
        ]);
    }
}
