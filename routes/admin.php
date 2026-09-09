<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\InventoryController;
use App\Http\Controllers\Admin\NotificationController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\WarehouseController;
use Illuminate\Support\Facades\Route;

// Admin Routes (Protected by auth + staff middleware)
Route::middleware(['auth', 'staff'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Notifications
    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('notifications/read-all', [NotificationController::class, 'readAll'])->name('notifications.read-all');
    Route::post('notifications/{notification}/read', [NotificationController::class, 'markRead'])->name('notifications.read');

    Route::resource('products', ProductController::class)
        ->except(['show'])
        ->names('products');

    Route::resource('categories', CategoryController::class)
        ->except(['create', 'show', 'edit'])
        ->names('categories');

    // Customers Management
    Route::get('customers', [CustomerController::class, 'index'])->name('customers.index');
    Route::get('customers/{user}', [CustomerController::class, 'show'])->name('customers.show');
    Route::post('customers/{user}/notes', [CustomerController::class, 'storeNote'])->name('customers.notes.store');
    Route::delete('customers/notes/{note}', [CustomerController::class, 'destroyNote'])->name('customers.notes.destroy');
    Route::post('customers/{user}/status', [CustomerController::class, 'updateStatus'])->name('customers.update-status');

    // Orders Management
    Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::patch('orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.update-status');
    Route::post('orders/{order}/notes', [OrderController::class, 'addNote'])->name('orders.notes.store');
    Route::post('orders/{order}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');

    // Inventory
    Route::get('inventory', [InventoryController::class, 'index'])
        ->name('inventory.index');
    Route::post('inventory/{inventory}/adjust', [InventoryController::class, 'adjust'])
        ->name('inventory.adjust');

    // Warehouses
    Route::resource('warehouses', WarehouseController::class)
        ->except(['create', 'show', 'edit'])
        ->names('warehouses');
});
