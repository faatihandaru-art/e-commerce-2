<?php

namespace App\Domain\Order\Queries;

use App\Models\Order;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class ListAdminOrdersQuery
{
    /**
     * Get paginated orders list with filtering and search for admin.
     *
     * @param  array<string, mixed>  $filters
     */
    public function execute(array $filters = []): LengthAwarePaginator
    {
        $query = Order::query()
            ->with(['user', 'items', 'shippingAddress', 'payments']);

        $this->applyFilters($query, $filters);

        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = strtolower($filters['sort_order'] ?? 'desc') === 'asc' ? 'asc' : 'desc';

        $perPage = min((int) ($filters['per_page'] ?? 15), 100);

        return $query->orderBy($sortBy, $sortOrder)->paginate($perPage)->withQueryString();
    }

    /**
     * Get summary metrics for admin dashboard/order list cards.
     *
     * @return array{total_orders: int, perlu_diproses: int, perlu_dikirim: int}
     */
    public function getSummary(): array
    {
        $totalOrders = Order::count();
        $perluDiproses = Order::whereIn('order_status', ['pending_payment', 'confirmed', 'processing'])->count();
        $perluDikirim = Order::where('order_status', 'packed')->count();

        return [
            'total_orders' => $totalOrders,
            'perlu_diproses' => $perluDiproses,
            'perlu_dikirim' => $perluDikirim,
        ];
    }

    /**
     * @param  Builder<Order>  $query
     * @param  array<string, mixed>  $filters
     */
    protected function applyFilters(Builder $query, array $filters): void
    {
        if (! empty($filters['status'])) {
            $status = $filters['status'];
            if (is_array($status)) {
                $query->whereIn('order_status', $status);
            } else {
                $query->where('order_status', $status);
            }
        }

        if (! empty($filters['order_status'])) {
            $query->where('order_status', $filters['order_status']);
        }

        if (! empty($filters['payment_status'])) {
            $query->where('payment_status', $filters['payment_status']);
        }

        if (! empty($filters['fulfillment_status'])) {
            $query->where('fulfillment_status', $filters['fulfillment_status']);
        }

        if (! empty($filters['search'])) {
            $search = '%'.trim($filters['search']).'%';
            $query->where(function (Builder $q) use ($search) {
                $q->where('order_number', 'like', $search)
                    ->orWhere('contact_email', 'like', $search)
                    ->orWhere('contact_phone', 'like', $search)
                    ->orWhereHas('user', function (Builder $userQuery) use ($search) {
                        $userQuery->where('name', 'like', $search)
                            ->orWhere('email', 'like', $search);
                    })
                    ->orWhereHas('addresses', function (Builder $addressQuery) use ($search) {
                        $addressQuery->where('recipient', 'like', $search)
                            ->orWhere('phone', 'like', $search);
                    });
            });
        }

        if (! empty($filters['date_from'])) {
            $query->where('created_at', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to'])) {
            $query->where('created_at', '<=', $filters['date_to'].' 23:59:59');
        }
    }
}
