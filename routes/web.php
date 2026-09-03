<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Customer\AddressController;
use App\Http\Controllers\Storefront\CheckoutController;
use App\Http\Controllers\Account\OrdersController;
use App\Http\Controllers\Account\ProfileController;

// Storefront (Orang 1)
Route::get('/', fn () => Inertia::render('Storefront/Home'))->name('home');
Route::get('/about', fn () => Inertia::render('Storefront/About'))->name('about');

// Catalog pages (Orang 2) - data diambil dari API katalog di sisi klien
Route::get('/products', fn () => Inertia::render('Storefront/Product/Index'))->name('products.index');
Route::get('/products/{slug}', fn ($slug) => Inertia::render('Storefront/Product/Show', ['slug' => $slug]))->name('products.show');

// Cart & Checkout
Route::get('/cart', fn () => Inertia::render('Cart'))->name('cart');
Route::get('/checkout', [CheckoutController::class, 'index'])
    ->middleware('auth')
    ->name('checkout');

// Auth
Route::get('/login', fn () => Inertia::render('Auth/Login'))->name('login');
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::get('/register', fn () => Inertia::render('Auth/Register'))->name('register');
Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

// Account Pages (Protected)
Route::middleware('auth')->prefix('account')->group(function () {
    Route::get('/profile', fn () => Inertia::render('Account/Profile'))->name('account.profile');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('account.profile.update');
    Route::post('/profile/password', [ProfileController::class, 'updatePassword'])->name('account.profile.password');

    Route::get('/addresses', function () {
        $addresses = Auth::user()->addresses()->latest()->get();
        return Inertia::render('Account/Addresses', ['addresses' => $addresses]);
    })->name('account.addresses');
    Route::post('/addresses', [AddressController::class, 'store'])->name('account.addresses.store');
    Route::delete('/addresses/{id}', [AddressController::class, 'destroy'])->name('account.addresses.destroy');

    Route::get('/status', fn () => Inertia::render('Account/Status'))->name('account.status');
    Route::get('/orders', [OrdersController::class, 'index'])->name('account.orders');
});
