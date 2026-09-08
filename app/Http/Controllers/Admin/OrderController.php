<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Order\Actions\AddOrderNoteAction;
use App\Domain\Order\Actions\CancelOrderAction;
use App\Domain\Order\Actions\UpdateOrderStatusAction;
use App\Domain\Order\Exceptions\InvalidOrderStatusTransitionException;
use App\Domain\Order\Queries\GetOrderDetailQuery;
use App\Domain\Order\Queries\ListAdminOrdersQuery;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AddOrderNoteRequest;
use App\Http\Requests\Admin\UpdateOrderStatusRequest;
use App\Http\Resources\OrderListResource;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * Display a paginated listing of orders for admin.
     */
    public function index(Request $request, ListAdminOrdersQuery $query): Response|JsonResponse
    {
        $filters = $request->only([
            'status',
            'order_status',
            'payment_status',
            'fulfillment_status',
            'search',
            'date_from',
            'date_to',
            'sort_by',
            'sort_order',
            'per_page',
            'page',
        ]);

        $paginatedOrders = $query->execute($filters);
        $summary = $query->getSummary();

        $ordersResource = OrderListResource::collection($paginatedOrders)->response()->getData(true);

        if ($request->wantsJson() && ! $request->header('X-Inertia')) {
            return response()->json([
                'orders' => $ordersResource,
                'summary' => $summary,
                'filters' => $filters,
            ]);
        }

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $ordersResource,
            'summary' => $summary,
            'filters' => $filters,
        ]);
    }

    /**
     * Display full details of a specific order.
     */
    public function show(Order $order, GetOrderDetailQuery $query, Request $request): Response|JsonResponse
    {
        $detailedOrder = $query->execute($order);
        $resource = new OrderResource($detailedOrder);

        if ($request->wantsJson() && ! $request->header('X-Inertia')) {
            return response()->json([
                'order' => $resource->resolve($request),
            ]);
        }

        return Inertia::render('Admin/Orders/Show', [
            'order' => $resource->resolve($request),
        ]);
    }

    /**
     * Update the status of an order.
     */
    public function updateStatus(
        Order $order,
        UpdateOrderStatusRequest $request,
        UpdateOrderStatusAction $action,
        GetOrderDetailQuery $query
    ): RedirectResponse|JsonResponse {
        try {
            $updatedOrder = $action->execute(
                order: $order,
                toStatus: $request->validated('status'),
                notes: $request->validated('notes'),
                actorId: $request->user()?->id
            );

            $detailedOrder = $query->execute($updatedOrder);
            $resource = new OrderResource($detailedOrder);

            if ($request->wantsJson() && ! $request->header('X-Inertia')) {
                return response()->json([
                    'message' => 'Status order berhasil diperbarui.',
                    'order' => $resource->resolve($request),
                ]);
            }

            return redirect()->back()->with('success', 'Status order berhasil diperbarui.');
        } catch (InvalidOrderStatusTransitionException $e) {
            if ($request->wantsJson() && ! $request->header('X-Inertia')) {
                return response()->json([
                    'message' => $e->getMessage(),
                ], 422);
            }

            return redirect()->back()->withErrors(['status' => $e->getMessage()]);
        }
    }

    /**
     * Add a note to the order.
     */
    public function addNote(
        Order $order,
        AddOrderNoteRequest $request,
        AddOrderNoteAction $action,
        GetOrderDetailQuery $query
    ): RedirectResponse|JsonResponse {
        $action->execute(
            order: $order,
            note: $request->validated('note'),
            visibility: $request->validated('visibility', 'internal'),
            createdBy: $request->user()?->id
        );

        $detailedOrder = $query->execute($order);
        $resource = new OrderResource($detailedOrder);

        if ($request->wantsJson() && ! $request->header('X-Inertia')) {
            return response()->json([
                'message' => 'Catatan order berhasil ditambahkan.',
                'order' => $resource->resolve($request),
            ]);
        }

        return redirect()->back()->with('success', 'Catatan order berhasil ditambahkan.');
    }

    /**
     * Cancel an order.
     */
    public function cancel(
        Order $order,
        Request $request,
        CancelOrderAction $action,
        GetOrderDetailQuery $query
    ): RedirectResponse|JsonResponse {
        $reason = $request->input('reason', 'Dibatalkan oleh Admin');

        $cancelledOrder = $action->execute(
            order: $order,
            reason: $reason,
            actorId: $request->user()?->id
        );

        $detailedOrder = $query->execute($cancelledOrder);
        $resource = new OrderResource($detailedOrder);

        if ($request->wantsJson() && ! $request->header('X-Inertia')) {
            return response()->json([
                'message' => 'Order berhasil dibatalkan.',
                'order' => $resource->resolve($request),
            ]);
        }

        return redirect()->back()->with('success', 'Order berhasil dibatalkan.');
    }
}
