<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ProductVariant;
use App\Models\User;
use App\Support\ProductPresenter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json($this->payload($request->user()));
    }

    public function add(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'variant_id' => ['required', 'integer', 'exists:product_variants,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $variant = ProductVariant::with('product')->findOrFail($validated['variant_id']);

        if ((int) $variant->stock < 1) {
            return response()->json(['message' => 'Varian produk sedang kehabisan stok.'], 422);
        }

        $cart = $this->resolveCart($request->user());
        $quantity = min((int) $validated['quantity'], (int) $variant->stock);

        $item = $cart->items()->firstOrNew(['variant_id' => $variant->id]);
        $item->quantity = min($item->quantity + $quantity, (int) $variant->stock);
        $item->save();

        return response()->json($this->payload($request->user()), 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:0'],
        ]);

        $item = $this->resolveItem($request->user(), $id);

        if ((int) $validated['quantity'] < 1) {
            $item->delete();
        } else {
            $max = (int) ($item->variant?->stock ?? 0);
            $item->quantity = $max > 0 ? min((int) $validated['quantity'], $max) : 0;
            $item->save();
        }

        return response()->json($this->payload($request->user()));
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->resolveItem($request->user(), $id)->delete();

        return response()->json($this->payload($request->user()));
    }

    public function clear(Request $request): JsonResponse
    {
        $cart = $this->resolveCart($request->user(), create: false);
        $cart?->items()->delete();

        return response()->json($this->payload($request->user()));
    }

    private function resolveItem(User $user, int $id): CartItem
    {
        $item = CartItem::query()
            ->where('id', $id)
            ->whereHas('cart', fn ($q) => $q->where('user_id', $user->id))
            ->first();

        abort_unless($item instanceof CartItem, 404);

        return $item;
    }

    public function resolveCart(User $user, bool $create = true): ?Cart
    {
        $cart = Cart::query()
            ->where('user_id', $user->id)
            ->where('status', 'active')
            ->latest('updated_at')
            ->first();

        if (! $cart && $create) {
            $cart = Cart::create([
                'user_id' => $user->id,
                'currency' => 'IDR',
                'status' => 'active',
            ]);
        }

        return $cart;
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(User $user): array
    {
        $cart = $this->resolveCart($user);
        $items = $cart?->items()
            ->with(['variant.product.brand', 'variant.product.categories', 'variant.product.images', 'variant.optionValues.option'])
            ->get() ?? collect();

        $mapped = $items->map(function (CartItem $item) {
            $product = $item->variant?->product;

            return [
                'id' => $item->id,
                'productId' => $product?->id,
                'variantId' => $item->variant_id,
                'quantity' => $item->quantity,
                'product' => $product ? ProductPresenter::summary($product) : null,
                'variant' => $item->variant ? ProductPresenter::variant($item->variant) : null,
            ];
        })->values();

        $cartCount = $mapped->sum('quantity');
        $cartSubtotal = $mapped->sum(fn (array $item) => ($item['product']['price'] ?? 0) * $item['quantity']);

        return [
            'items' => $mapped,
            'cartCount' => $cartCount,
            'cartSubtotal' => $cartSubtotal,
        ];
    }
}