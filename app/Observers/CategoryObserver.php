<?php

namespace App\Observers;

use App\Models\Category;
use App\Support\Activity;

class CategoryObserver
{
    public function created(Category $category): void
    {
        Activity::record('created', $category, [
            'after' => ['name' => $category->name, 'status' => $category->status],
            'link' => route('admin.categories.index'),
        ]);
    }

    public function updated(Category $category): void
    {
        if (! $category->isDirty(['name', 'slug', 'status', 'parent_id'])) {
            return;
        }

        Activity::record('updated', $category, [
            'before' => [
                'name' => $category->getOriginal('name'),
                'status' => $category->getOriginal('status'),
            ],
            'after' => ['name' => $category->name, 'status' => $category->status],
            'link' => route('admin.categories.index'),
        ]);
    }

    public function deleted(Category $category): void
    {
        Activity::record('deleted', $category, [
            'before' => ['name' => $category->name, 'status' => $category->status],
        ]);
    }
}
