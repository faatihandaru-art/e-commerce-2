<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CatalogController;
use App\Http\Controllers\Api\CheckoutController;

Route::get('/catalog/products', [CatalogController::class, 'index']);
Route::get('/catalog/products/{idOrSlug}', [CatalogController::class, 'show']);
Route::get('/catalog/categories', [CatalogController::class, 'categories']);

Route::middleware(['web', 'auth'])->group(function () {
    Route::get('/user', fn () => request()->user());

    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/items', [CartController::class, 'add']);
    Route::patch('/cart/items/{id}', [CartController::class, 'update']);
    Route::delete('/cart/items/{id}', [CartController::class, 'destroy']);
    Route::delete('/cart', [CartController::class, 'clear']);

    Route::post('/checkout', [CheckoutController::class, 'store']);
});