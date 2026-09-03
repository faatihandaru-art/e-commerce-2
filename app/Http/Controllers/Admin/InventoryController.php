<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InventoryController extends Controller
{
    /**
     * Menampilkan tabel stok per varian per gudang.
     */
    public function index(Request $request): Response
    {
        $query = Inventory::query()
            ->with(['variant' => fn ($q) => $q->withTrashed(), 'variant.product' => fn ($q) => $q->withTrashed(), 'warehouse']);

        // Filter gudang
        if ($request->filled('warehouse')) {
            $query->where('warehouse_id', $request->integer('warehouse'));
        }

        // Pencarian nama produk / SKU
        if ($search = trim((string) $request->query('search', ''))) {
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
            ->orderBy('updated_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        $paginator->setCollection(
            $paginator->getCollection()
                ->map(function (Inventory $inv) {
                    $variant = $inv->variant;
                    $product = $variant?->product;

                    return [
                        'id' => $inv->id,
                        'product_name' => $product?->name ?? 'Produk terhapus',
                        'sku' => $variant?->sku ?? '-',
                        'warehouse_name' => $inv->warehouse?->name ?? '-',
                        'quantity_on_hand' => $inv->quantity_on_hand,
                        'quantity_reserved' => $inv->quantity_reserved,
                        'reorder_level' => $inv->reorder_level,
                        'status' => $inv->status(),
                        'updated_at' => $inv->updated_at?->format('d M Y'),
                    ];
                })
                ->values()
        );

        $all = Inventory::query()
            ->whereHas('variant');
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
                'search' => $search ?? '',
                'warehouse' => $request->integer('warehouse') ?: null,
                'lowStock' => $request->boolean('lowStock'),
            ],
        ]);
    }
}
