<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Storefront (Orang 1)
Route::get('/', fn () => Inertia::render('Storefront/Home'))->name('home');
Route::get('/about', fn () => Inertia::render('Storefront/About'))->name('about');

// Stub halaman Orang 2 -- JANGAN dibangun penuh di tahap ini
Route::get('/products', fn () => Inertia::render('Storefront/Product/Index'))->name('products.index');
Route::get('/products/{slug}', fn ($slug) => Inertia::render('Storefront/Product/Show', ['slug' => $slug]))->name('products.show');
Route::get('/cart', fn () => Inertia::render('Cart'))->name('cart');
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

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
    Route::get('/addresses', fn () => Inertia::render('Account/Addresses'))->name('account.addresses');
    Route::get('/status', fn () => Inertia::render('Account/Status'))->name('account.status');
    Route::get('/orders', fn () => Inertia::render('Account/Orders'))->name('account.orders');
});
