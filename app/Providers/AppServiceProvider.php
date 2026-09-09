<?php

namespace App\Providers;

use App\Models\Category;
use App\Models\CustomerNote;
use App\Models\Inventory;
use App\Models\Order;
use App\Models\OrderNote;
use App\Models\Product;
use App\Models\User;
use App\Models\Warehouse;
use App\Observers\CategoryObserver;
use App\Observers\CustomerNoteObserver;
use App\Observers\InventoryObserver;
use App\Observers\OrderNoteObserver;
use App\Observers\OrderObserver;
use App\Observers\ProductObserver;
use App\Observers\UserObserver;
use App\Observers\WarehouseObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Product::observe(ProductObserver::class);
        Category::observe(CategoryObserver::class);
        Warehouse::observe(WarehouseObserver::class);
        Inventory::observe(InventoryObserver::class);
        Order::observe(OrderObserver::class);
        OrderNote::observe(OrderNoteObserver::class);
        CustomerNote::observe(CustomerNoteObserver::class);
        User::observe(UserObserver::class);
    }
}
