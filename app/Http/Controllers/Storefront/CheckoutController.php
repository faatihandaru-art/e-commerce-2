<?php

namespace App\Http\Controllers\Storefront;

use App\Domain\Customer\Actions\SaveCustomerAddressAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\StoreAddressRequest;
use App\Support\CheckoutPresenter;
use Illuminate\Http\JsonResponse;
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

    /**
     * Menyimpan alamat baru langsung dari halaman checkout. Dipanggil via
     * fetch dari sisi klien supaya keranjang & pilihan checkout tidak hilang.
     */
    public function storeAddress(
        StoreAddressRequest $request,
        SaveCustomerAddressAction $action
    ): JsonResponse {
        $address = $action->execute($request->user(), $request->validated());

        return response()->json([
            'message' => 'Alamat berhasil disimpan.',
            'address' => CheckoutPresenter::formatAddress($address),
        ], 201);
    }
}