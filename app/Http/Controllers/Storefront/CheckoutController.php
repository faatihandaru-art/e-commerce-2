<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Support\CheckoutPresenter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Checkout', [
            'addresses' => CheckoutPresenter::addresses($request->user()),
            'shippingMethods' => CheckoutPresenter::shippingMethods(),
            'paymentMethods' => CheckoutPresenter::paymentMethods(),
        ]);
    }
}