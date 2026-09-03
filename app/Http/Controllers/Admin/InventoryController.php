<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Inventory\Actions\AdjustStockAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdjustInventoryRequest;
use App\Models\Inventory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class InventoryController extends Controller
{
    public function index(): Response
    {
        $inventories = Inventory::with([
            'warehouse',
            'variant' => fn ($q) => $q->with('product:id,name'),
        ])
            ->orderBy('variant_id')
            ->get()
            ->map(fn (Inventory $inventory) => [
                'id' => $inventory->id,
                'warehouse_id' => $inventory->warehouse_id,
                'warehouse_name' => $inventory->warehouse?->name,
                'variant_id' => $inventory->variant_id,
                'sku' => $inventory->variant?->sku,
                'product_name' => $inventory->variant?->product?->name,
                'quantity_on_hand' => (int) $inventory->quantity_on_hand,
                'quantity_reserved' => (int) $inventory->quantity_reserved,
                'available_quantity' => $inventory->availableQuantity(),
                'reorder_level' => (int) $inventory->reorder_level,
                'is_low' => $inventory->quantity_on_hand <= $inventory->reorder_level
                    && $inventory->quantity_on_hand > 0,
                'is_out_of_stock' => $inventory->quantity_on_hand <= 0,
            ])
            ->values();

        return Inertia::render('Admin/Inventory/Index', [
            'inventories' => $inventories,
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
