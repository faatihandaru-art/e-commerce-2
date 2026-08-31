<?php

namespace App\Domain\Order\Actions;

use App\Models\Cart;
use App\Models\Coupon;
use App\Models\CouponUsage;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Models\OrderItem;
use App\Models\OrderStatusHistory;
use App\Models\Payment;
use App\Models\ProductVariant;
use App\Models\ShippingMethod;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CreateOrderAction
{
    /**
     * @param  array<string, mixed>  $payload
     */
    public function execute(User $user, array $payload): Order
    {
        return DB::transaction(function () use ($user, $payload) {
            $lines = $this->resolveLines($payload['items']);
            $subtotal = collect($lines)->sum(fn (array $line) => $line['unit_price'] * $line['quantity']);

            $shipping = $this->resolveShipping($payload, $subtotal);
            $coupon = $this->resolveCoupon($user, $payload['coupon_code'] ?? null, $subtotal);
            $discount = $coupon ? $this->computeDiscount($coupon, $subtotal, $shipping['total']) : 0;
            $couponDiscount = $coupon && $coupon->type !== 'free_shipping' ? $discount : 0;
            $shippingTotal = $coupon && $coupon->type === 'free_shipping' ? 0 : $shipping['total'];
            $fee = (int) ($payload['fee'] ?? 0);
            $grandTotal = max(0, $subtotal - $couponDiscount + $shippingTotal + $fee);

            $order = Order::create([
                'order_number' => $this->generateOrderNumber(),
                'user_id' => $user->id,
                'contact_email' => $user->email,
                'contact_phone' => $payload['shipping']['phone'],
                'currency' => 'IDR',
                'subtotal' => $subtotal,
                'discount_total' => $couponDiscount,
                'shipping_total' => $shippingTotal,
                'fee_total' => $fee,
                'grand_total' => $grandTotal,
                'order_status' => 'pending_payment',
                'payment_status' => 'unpaid',
                'fulfillment_status' => 'unfulfilled',
                'placed_at' => now(),
            ]);

            foreach ($lines as $line) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $line['product_id'],
                    'variant_id' => $line['variant_id'],
                    'sku' => $line['sku'],
                    'product_name' => $line['product_name'],
                    'variant_name' => $line['variant_name'],
                    'unit_price' => $line['unit_price'],
                    'quantity' => $line['quantity'],
                    'cost_price' => $line['cost_price'],
                    'total' => $line['unit_price'] * $line['quantity'],
                    'metadata' => ['image' => $line['image']],
                ]);
            }

            $shippingPayload = $payload['shipping'];
            OrderAddress::create([
                'order_id' => $order->id,
                'type' => 'shipping',
                'recipient' => $shippingPayload['recipient'],
                'phone' => $shippingPayload['phone'],
                'address_line1' => $shippingPayload['address_line1'],
                'address_line2' => $shippingPayload['address_line2'] ?? null,
                'city' => $shippingPayload['city'],
                'province' => $shippingPayload['province'],
                'postal_code' => $shippingPayload['postal_code'],
                'country' => $shippingPayload['country'] ?? 'Indonesia',
            ]);

            $payment = $payload['payment'];
            Payment::create([
                'order_id' => $order->id,
                'method' => $payment['method'],
                'provider' => $payment['group'],
                'amount' => $grandTotal,
                'currency' => 'IDR',
                'status' => 'pending',
                'metadata' => ['notes' => $payload['notes'] ?? null],
            ]);

            OrderStatusHistory::create([
                'order_id' => $order->id,
                'from_status' => null,
                'to_status' => 'pending_payment',
                'notes' => $payload['notes'] ?? null,
                'changed_by' => $user->id,
                'created_at' => now(),
            ]);

            foreach ($lines as $line) {
                $variant = $line['variant'];
                $variant->decrement('stock', $line['quantity']);
            }

            if ($coupon) {
                CouponUsage::create([
                    'coupon_id' => $coupon->id,
                    'user_id' => $user->id,
                    'order_id' => $order->id,
                    'amount' => $couponDiscount,
                    'used_at' => now(),
                ]);
            }

            if (isset($payload['cart_id']) && $payload['cart_id']) {
                Cart::query()->whereKey($payload['cart_id'])->update(['status' => 'converted']);
            }

            $order->load('items', 'shippingAddress', 'payments');

            return $order;
        });
    }

    /**
     * @param  array<int, array{variant_id: int, quantity: int}>  $items
     * @return array<int, array<string, mixed>>
     */
    private function resolveLines(array $items): array
    {
        $lines = [];

        foreach ($items as $item) {
            $variant = ProductVariant::query()
                ->whereKey($item['variant_id'])
                ->with('product.brand', 'product.categories', 'product.images', 'optionValues.option')
                ->lockForUpdate()
                ->first();

            if (! $variant || $variant->status !== 'active') {
                throw ValidationException::withMessages(['items' => 'Varian produk tidak ditemukan atau tidak aktif.']);
            }

            $product = $variant->product;

            if ((int) $variant->stock < (int) $item['quantity']) {
                throw ValidationException::withMessages([
                    'items' => sprintf('Stok "%s" tidak mencukupi (sisa %d).', $product->name, $variant->stock),
                ]);
            }

            $lines[] = [
                'variant' => $variant,
                'variant_id' => $variant->id,
                'product_id' => $product->id,
                'sku' => $variant->sku,
                'product_name' => $product->name,
                'variant_name' => $variant->optionValues
                    ->pluck('value')
                    ->unique()
                    ->implode(' / ') ?: null,
                'unit_price' => (int) $variant->price,
                'quantity' => (int) $item['quantity'],
                'cost_price' => $variant->cost_price,
                'image' => $product->images->sortByDesc('is_primary')->sortBy('sort_order')->first()?->path,
            ];
        }

        return $lines;
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return array{name: string, total: int}
     */
    private function resolveShipping(array $payload, int $subtotal): array
    {
        if (! empty($payload['shipping_method_id'])) {
            $method = ShippingMethod::query()->whereKey($payload['shipping_method_id'])->first();
            if ($method) {
                return ['name' => $method->name, 'total' => (int) $method->base_price];
            }
        }

        return [
            'name' => $payload['shipping_name'] ?? 'Kurir',
            'total' => (int) ($payload['shipping_cost'] ?? 0),
        ];
    }

    private function resolveCoupon(User $user, ?string $code, int $subtotal): ?Coupon
    {
        if (! $code) {
            return null;
        }

        $coupon = Coupon::query()->where('code', $code)->first();

        if (! $coupon || ! $coupon->isActive()) {
            throw ValidationException::withMessages(['coupon_code' => 'Kode kupon tidak valid atau sudah tidak berlaku.']);
        }

        if ($coupon->min_order && $subtotal < $coupon->min_order) {
            throw ValidationException::withMessages(['coupon_code' => 'Minimal belanja untuk kupon ini belum tercapai.']);
        }

        if ($coupon->usage_limit && $coupon->usages()->count() >= $coupon->usage_limit) {
            throw ValidationException::withMessages(['coupon_code' => 'Kupon sudah mencapai batas pemakaian.']);
        }

        if ($coupon->usage_limit_per_user && $coupon->usages()->where('user_id', $user->id)->count() >= $coupon->usage_limit_per_user) {
            throw ValidationException::withMessages(['coupon_code' => 'Kupon ini sudah pernah digunakan.']);
        }

        return $coupon;
    }

    private function computeDiscount(Coupon $coupon, int $subtotal, int $shippingTotal): int
    {
        return match ($coupon->type) {
            'percentage' => min(
                (int) round($subtotal * ($coupon->value / 100)),
                (int) ($coupon->max_discount ?? PHP_INT_MAX)
            ),
            'fixed_amount' => min((int) $coupon->value, $subtotal),
            'free_shipping' => $shippingTotal,
            default => 0,
        };
    }

    private function generateOrderNumber(): string
    {
        return 'VGS-'.strtoupper(now()->format('Ymd')).'-'.strtoupper(Str::random(6));
    }
}