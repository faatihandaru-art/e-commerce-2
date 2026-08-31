<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrdersController extends Controller
{
    public function index(Request $request): Response
    {
        $orders = $request->user()
            ->orders()
            ->with(['items', 'shippingAddress', 'payments'])
            ->latest()
            ->get()
            ->map(fn ($order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'order_status' => $order->order_status,
                'payment_status' => $order->payment_status,
                'subtotal' => $order->subtotal,
                'discount_total' => $order->discount_total,
                'shipping_total' => $order->shipping_total,
                'fee_total' => $order->fee_total,
                'grand_total' => $order->grand_total,
                'placed_at' => optional($order->placed_at)->translatedFormat('d F Y, H:i'),
                'item_count' => $order->items->sum('quantity'),
                'items' => $order->items->map(fn ($item) => [
                    'sku' => $item->sku,
                    'product_name' => $item->product_name,
                    'variant_name' => $item->variant_name,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'total' => $item->total,
                    'image' => data_get($item->metadata, 'image'),
                ])->values(),
                'shipping' => $order->shippingAddress ? [
                    'recipient' => $order->shippingAddress->recipient,
                    'phone' => $order->shippingAddress->phone,
                    'line' => $order->shippingAddress->address_line1,
                    'city' => "{$order->shippingAddress->city}, {$order->shippingAddress->province} {$order->shippingAddress->postal_code}",
                ] : null,
                'payment' => $order->payments->first() ? [
                    'method' => $order->payments->first()->method,
                    'status' => $order->payments->first()->status,
                ] : null,
            ]);

        return Inertia::render('Account/Orders', ['orders' => $orders]);
    }
}