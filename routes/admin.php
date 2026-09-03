<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\InventoryController;

// Admin Routes (Protected by auth + staff middleware)
Route::middleware(['auth', 'staff'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', fn () => Inertia::render('Admin/Dashboard'))->name('dashboard');

    Route::resource('products', ProductController::class)
        ->except(['show'])
        ->names('products');

    Route::get('inventory', [InventoryController::class, 'index'])
        ->name('inventory.index');
});
