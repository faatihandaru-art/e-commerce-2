<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Inventory\Actions\AdjustStockAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdjustInventoryRequest;
use App\Models\Inventory;
use App\Models\Warehouse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class InventoryController extends Controller
{
    /**
     * Menampilkan tabel stok per varian per gudang, lengkap dengan filter
     * pencarian, filter gudang, toggle stok menipis, dan ringkasan statistik.
     */
    public function index(Request $request): Response
    {
        $query = Inventory::query()
            ->with([
                'warehouse',
                'variant' => fn ($q) => $q->with('product:id,name'),
            ]);

        // Filter gudang
        if ($request->filled('warehouse')) {
            $query->where('warehouse_id', $request->integer('warehouse'));
        }

        // Pencarian nama produk / SKU
        $search = trim((string) $request->query('search', ''));
        if ($search !== '') {
            $query->whereHas('variant', function ($q) use ($search) {
                $q->where('sku', 'like', "%{$search}%")
                    ->orWhereHas('product', function ($p) use ($search) {
                        $p->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Hanya stok menipis / habis
        if ($request->boolean('lowStock')) {
            $query->whereColumn('quantity_on_hand', '<=', 'reorder_level');
        }

        $paginator = $query
            ->orderBy('variant_id')
            ->paginate(10)
            ->withQueryString();

        $paginator->setCollection(
            $paginator->getCollection()
                ->map(function (Inventory $inv) {
                    $variant = $inv->variant;
                    $product = $variant?->product;
                    $available = $inv->availableQuantity();

                    return [
                        'id' => $inv->id,
                        'product_name' => $product?->name ?? 'Produk terhapus',
                        'sku' => $variant?->sku ?? '-',
                        'warehouse_name' => $inv->warehouse?->name ?? '-',
                        'quantity_on_hand' => $inv->quantity_on_hand,
                        'quantity_reserved' => $inv->quantity_reserved,
                        'available_quantity' => $available,
                        'reorder_level' => $inv->reorder_level,
                        'status' => $inv->status(),
                        'is_low' => $available > 0 && $available <= $inv->reorder_level,
                        'is_out_of_stock' => $available <= 0,
                        'updated_at' => $inv->updated_at?->format('d M Y'),
                    ];
                })
                ->values()
        );

        $all = Inventory::query();
        if ($request->filled('warehouse')) {
            $all->where('warehouse_id', $request->integer('warehouse'));
        }

        $stats = [
            'total_variants' => (clone $all)->count(),
            'low_stock' => (clone $all)->whereColumn('quantity_on_hand', '<=', 'reorder_level')->where('quantity_on_hand', '>', 0)->count(),
            'out_of_stock' => (clone $all)->where('quantity_on_hand', '<=', 0)->count(),
        ];

        return Inertia::render('Admin/Inventory/Index', [
            'inventories' => $paginator,
            'warehouses' => Warehouse::query()
                ->where('status', 'active')
                ->orderBy('name')
                ->get(['id', 'name']),
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'warehouse' => $request->integer('warehouse') ?: null,
                'lowStock' => $request->boolean('lowStock'),
            ],
        ]);
    }

    public function adjust(
        AdjustInventoryRequest $request,
        Inventory $inventory,
        AdjustStockAction $action
    ): RedirectResponse {
        try {
            $action->execute(
                $inventory,
                (int) $request->validated('quantity'),
                $request->validated('reason'),
                Auth::id()
            );
        } catch (\LogicException $e) {
            return back()->withErrors([
                'quantity' => $e->getMessage(),
            ])->with('error', $e->getMessage());
        }

        return redirect()->route('admin.inventory.index')
            ->with('success', 'Stok berhasil disesuaikan.');
    }
}
