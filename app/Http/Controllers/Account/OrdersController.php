<?php

namespace App\Http\Controllers\Account;

use App\Domain\Order\Actions\CancelOrderAction;
use App\Domain\Order\Queries\GetOrderDetailQuery;
use App\Domain\Order\Queries\ListUserOrdersQuery;
use App\Http\Controllers\Controller;
use App\Http\Resources\OrderListResource;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrdersController extends Controller
{
    /**
     * Display a listing of orders belonging to the authenticated customer.
     */
    public function index(Request $request, ListUserOrdersQuery $query): Response|JsonResponse
    {
        $filters = $request->only(['status', 'search', 'page', 'per_page']);
        $paginatedOrders = $query->execute($request->user(), $filters);

        $ordersResource = OrderListResource::collection($paginatedOrders)->response()->getData(true);

        if ($request->wantsJson() && ! $request->header('X-Inertia')) {
            return response()->json([
                'orders' => $ordersResource,
                'filters' => $filters,
            ]);
        }

        return Inertia::render('Account/Orders', [
            'orders' => $ordersResource,
            'filters' => $filters,
        ]);
    }

    /**
     * Display full detail of a specific order belonging to the authenticated customer.
     */
    public function show(Order $order, GetOrderDetailQuery $query, Request $request): Response|JsonResponse
    {
        if ($order->user_id !== $request->user()->id) {
            abort(403, 'Anda tidak memiliki akses ke pesanan ini.');
        }

        $detailedOrder = $query->execute($order);
        $resource = new OrderResource($detailedOrder);

        if ($request->wantsJson() && ! $request->header('X-Inertia')) {
            return response()->json([
                'order' => $resource->resolve($request),
            ]);
        }

        return Inertia::render('Account/OrderShow', [
            'order' => $resource->resolve($request),
        ]);
    }

    /**
     * Cancel an order if it belongs to the customer and is still pending payment.
     */
    public function cancel(Order $order, Request $request, CancelOrderAction $action): RedirectResponse|JsonResponse
    {
        if ($order->user_id !== $request->user()->id) {
            abort(403, 'Anda tidak memiliki akses ke pesanan ini.');
        }

        if ($order->order_status !== 'pending_payment') {
            if ($request->wantsJson() && ! $request->header('X-Inertia')) {
                return response()->json(['message' => 'Hanya pesanan pending_payment yang dapat dibatalkan.'], 422);
            }

            return redirect()->back()->withErrors(['message' => 'Hanya pesanan pending_payment yang dapat dibatalkan.']);
        }

        $reason = $request->input('reason', 'Dibatalkan oleh pembeli');
        $cancelledOrder = $action->execute($order, $reason, $request->user()->id);

        $resource = new OrderResource($cancelledOrder);

        if ($request->wantsJson() && ! $request->header('X-Inertia')) {
            return response()->json([
                'message' => 'Pesanan berhasil dibatalkan.',
                'order' => $resource->resolve($request),
            ]);
        }

        return redirect()->back()->with('success', 'Pesanan berhasil dibatalkan.');
    }
}
