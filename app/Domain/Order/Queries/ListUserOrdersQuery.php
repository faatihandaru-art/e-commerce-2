<?php

namespace App\Domain\Order\Queries;

use App\Models\Order;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ListUserOrdersQuery
{
    /**
     * List orders for a specific user with optional filters and pagination.
     *
     * @param  array<string, mixed>  $filters
     */
    public function execute(User|int $user, array $filters = []): LengthAwarePaginator
    {
        $userId = $user instanceof User ? $user->id : $user;

        $query = Order::query()
            ->where('user_id', $userId)
            ->with(['items', 'shippingAddress', 'payments']);

        if (! empty($filters['status'])) {
            $query->where('order_status', $filters['status']);
        }

        if (! empty($filters['search'])) {
            $search = '%'.trim($filters['search']).'%';
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', $search)
                    ->orWhereHas('items', function ($iq) use ($search) {
                        $iq->where('product_name', 'like', $search)
                            ->orWhere('sku', 'like', $search);
                    });
            });
        }

        $perPage = min((int) ($filters['per_page'] ?? 10), 50);

        return $query->latest('created_at')->paginate($perPage)->withQueryString();
    }
}
