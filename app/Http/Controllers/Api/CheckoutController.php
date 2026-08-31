<?php

namespace App\Http\Controllers\Api;

use App\Domain\Order\Actions\CreateOrderAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreCheckoutRequest;
use App\Models\Cart;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class CheckoutController extends Controller
{
    public function store(StoreCheckoutRequest $request, CreateOrderAction $action): JsonResponse
    {
        $user = Auth::user();

        $cart = Cart::query()
            ->where('user_id', $user->id)
            ->where('status', 'active')
            ->latest()
            ->first();

        $payload = $request->validated();
        $payload['cart_id'] = $cart?->id;

        try {
            $order = $action->execute($user, $payload);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => $e->getMessage(), 'errors' => $e->errors()], 422);
        }

        if ($cart) {
            $cart->items()->delete();
        }

        return response()->json([
            'message' => 'Pesanan berhasil dibuat.',
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'grand_total' => $order->grand_total,
                'subtotal' => $order->subtotal,
                'discount_total' => $order->discount_total,
                'shipping_total' => $order->shipping_total,
                'fee_total' => $order->fee_total,
                'order_status' => $order->order_status,
                'payment_status' => $order->payment_status,
                'placed_at' => $order->placed_at?->toIso8601String(),
            ],
        ], 201);
    }
}