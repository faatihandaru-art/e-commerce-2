<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreWarehouseRequest;
use App\Http\Requests\Admin\UpdateWarehouseRequest;
use App\Models\Warehouse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class WarehouseController extends Controller
{
    public function index(): Response
    {
        $warehouses = Warehouse::query()
            ->orderBy('id')
            ->get()
            ->map(fn (Warehouse $warehouse) => [
                'id' => $warehouse->id,
                'name' => $warehouse->name,
                'code' => $warehouse->code,
                'address' => $warehouse->address,
                'status' => $warehouse->status,
            ])
            ->values();

        return Inertia::render('Admin/Inventory/Warehouses', [
            'warehouses' => $warehouses,
        ]);
    }

    public function store(StoreWarehouseRequest $request): RedirectResponse
    {
        Warehouse::create($request->validated());

        return redirect()->route('admin.warehouses.index')
            ->with('success', 'Gudang berhasil ditambahkan.');
    }

    public function update(UpdateWarehouseRequest $request, Warehouse $warehouse): RedirectResponse
    {
        $warehouse->update($request->validated());

        return redirect()->route('admin.warehouses.index')
            ->with('success', 'Gudang berhasil diperbarui.');
    }

    public function destroy(Warehouse $warehouse): RedirectResponse
    {
        $warehouse->delete();

        return redirect()->route('admin.warehouses.index')
            ->with('success', 'Gudang berhasil dihapus.');
    }
}
