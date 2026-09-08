<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrdersController extends Controller
{
    private const FILTER_STATUSES = [
        'processing' => ['confirmed', 'processing', 'packed'],
        'shipped' => ['shipped'],
        'completed' => ['completed'],
        'cancelled' => ['cancelled', 'refunded'],
    ];

    public function index(Request $request): Response
    {
        $filter = $request->string('status')->toString();
        $query = $request->user()
            ->orders()
            ->with(['items', 'shippingAddress'])
            ->latest('placed_at')
            ->latest('id');

        if (isset(self::FILTER_STATUSES[$filter])) {
            $query->whereIn('order_status', self::FILTER_STATUSES[$filter]);
        }

        $orders = $query->paginate(10)->withQueryString()->through(
            fn (Order $order) => $this->orderSummary($order)
        );

        return Inertia::render('Account/Orders/Index', [
            'orders' => $orders,
            'filters' => [
                'status' => $filter ?: 'all',
            ],
        ]);
    }

    public function show(Request $request, Order $order): Response
    {
        abort_unless($order->user_id === $request->user()->id, 404);

        $order->load([
            'items',
            'shippingAddress',
            'payments',
            'shipments',
            'statusHistories' => fn ($query) => $query->oldest('created_at'),
        ]);

        return Inertia::render('Account/Orders/Show', [
            'order' => [
                ...$this->orderSummary($order),
                'tax_total' => $order->tax_total,
                'fee_total' => $order->fee_total,
                'fulfillment_status' => $order->fulfillment_status,
                'payment' => $order->payments->first() ? [
                    'method' => $order->payments->first()->method,
                    'status' => $order->payments->first()->status,
                ] : null,
                'shipping_address' => $order->shippingAddress ? [
                    'recipient' => $order->shippingAddress->recipient,
                    'phone' => $order->shippingAddress->phone,
                    'line1' => $order->shippingAddress->address_line1,
                    'line2' => $order->shippingAddress->address_line2,
                    'city' => $order->shippingAddress->city,
                    'province' => $order->shippingAddress->province,
                    'postal_code' => $order->shippingAddress->postal_code,
                    'country' => $order->shippingAddress->country,
                ] : null,
                'shipments' => $order->shipments->map(fn ($shipment) => [
                    'courier' => $shipment->courier,
                    'tracking_number' => $shipment->tracking_number,
                    'status' => $shipment->status,
                    'shipped_at' => optional($shipment->shipped_at)->translatedFormat('d F Y, H:i'),
                    'delivered_at' => optional($shipment->delivered_at)->translatedFormat('d F Y, H:i'),
                ])->values(),
                'timeline' => $order->statusHistories->map(fn ($history) => [
                    'status' => $history->to_status,
                    'date' => optional($history->created_at)->translatedFormat('d F Y, H:i'),
                ])->values(),
            ],
        ]);
    }

    private function orderSummary(Order $order): array
    {
        return [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'order_status' => $order->order_status,
            'payment_status' => $order->payment_status,
            'subtotal' => $order->subtotal,
            'discount_total' => $order->discount_total,
            'shipping_total' => $order->shipping_total,
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
                'line' => $order->shippingAddress->address_line1,
                'city' => "{$order->shippingAddress->city}, {$order->shippingAddress->province} {$order->shippingAddress->postal_code}",
            ] : null,
        ];
    }
}
