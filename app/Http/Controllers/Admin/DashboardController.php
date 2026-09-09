<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Category;
use App\Models\Inventory;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response|JsonResponse
    {
        $data = [
            'stats' => $this->stats(),
            'recent_activity' => $this->recentActivity(),
        ];

        if ($request->wantsJson() && ! $request->header('X-Inertia')) {
            return response()->json($data);
        }

        return Inertia::render('Admin/Dashboard', $data);
    }

    /**
     * @return array<string, int|null>
     */
    protected function stats(): array
    {
        $now = now();
        $revenueThisMonth = $this->revenueBetween($now->copy()->startOfMonth(), $now->copy()->endOfMonth());
        $revenueLastMonth = $this->revenueBetween(
            $now->copy()->startOfMonth()->subMonthNoOverflow(),
            $now->copy()->endOfMonth()->subMonthNoOverflow()
        );

        $revenueChangePct = $revenueLastMonth > 0
            ? (int) round(($revenueThisMonth - $revenueLastMonth) / $revenueLastMonth * 100)
            : null;

        return [
            'total_products' => Product::count(),
            'total_categories' => Category::count(),
            'total_customers' => User::query()->customersOnly()->count(),
            'total_orders' => Order::count(),
            'orders_today' => Order::whereDate('placed_at', today())->count(),
            'pending_payments' => Order::where('order_status', 'pending_payment')->count(),
            'perlu_diproses' => Order::whereIn('order_status', ['pending_payment', 'confirmed', 'processing'])->count(),
            'revenue_this_month' => $revenueThisMonth,
            'revenue_last_month' => $revenueLastMonth,
            'revenue_change_pct' => $revenueChangePct,
            'low_stock' => Inventory::query()
                ->whereRaw('(quantity_on_hand - quantity_reserved) <= reorder_level')
                ->count(),
        ];
    }

    protected function revenueBetween(Carbon $from, Carbon $to): int
    {
        return (int) Order::query()
            ->where('payment_status', 'paid')
            ->whereBetween('placed_at', [$from, $to])
            ->sum('grand_total');
    }

    /**
     * Gabungan order terbaru + riwayat audit yang baru, diurutkan dari terbaru.
     *
     * @return array<int, array<string, mixed>>
     */
    protected function recentActivity(): array
    {
        $orderFeed = Order::query()
            ->with('user:id,name')
            ->whereNotNull('placed_at')
            ->latest('placed_at')
            ->limit(8)
            ->get()
            ->map(fn (Order $order) => [
                'id' => 'order-'.$order->id,
                'kind' => 'order',
                'title' => 'Pesanan Baru',
                'message' => "Pesanan baru {$order->order_number} dari ".($order->user?->name ?? 'Guest'),
                'time' => $order->placed_at->toIso8601String(),
                'link' => route('admin.orders.show', $order),
                'tone' => 'success',
            ]);

        $auditFeed = AuditLog::query()
            ->with('actor:id,name')
            ->latest('created_at')
            ->limit(8)
            ->get()
            ->map(fn (AuditLog $log) => [
                'id' => 'audit-'.$log->id,
                'kind' => 'audit',
                'title' => $this->auditTitle($log->action),
                'message' => $log->message,
                'time' => $log->created_at->toIso8601String(),
                'link' => $log->link,
                'tone' => $this->auditTone($log->action),
            ]);

        return (new Collection($orderFeed))
            ->merge($auditFeed)
            ->sortByDesc('time')
            ->take(10)
            ->values()
            ->all();
    }

    protected function auditTitle(string $action): string
    {
        return match ($action) {
            'created' => 'Data Ditambahkan',
            'updated' => 'Data Diperbarui',
            'deleted' => 'Data Dihapus',
            'status_changed', 'customer_status_changed' => 'Status Diubah',
            'order_placed' => 'Pesanan Masuk',
            'order_status_changed' => 'Pesanan Diperbarui',
            'stock_adjusted' => 'Stok Disesuaikan',
            'note_added' => 'Catatan Ditambahkan',
            'note_deleted' => 'Catatan Dihapus',
            'customer_registered' => 'Customer Baru',
            default => ucfirst(str_replace('_', ' ', $action)),
        };
    }

    protected function auditTone(string $action): string
    {
        if (in_array($action, ['deleted', 'note_deleted'], true)) {
            return 'danger';
        }

        if (in_array($action, ['created', 'order_placed', 'customer_registered', 'note_added'], true)) {
            return 'success';
        }

        return 'info';
    }
}
