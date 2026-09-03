<?php

namespace App\Domain\Inventory\Actions;

use App\Models\Inventory;
use App\Models\InventoryMovement;
use Illuminate\Support\Facades\DB;

final class AdjustStockAction
{
    /**
     * Menyesuaikan stok fisik satu inventory (satu varian di satu gudang).
     *
     * @param  int  $quantity  Jumlah penyesuaian (positif = stok masuk, negatif = stok keluar/rusak/hilang).
     * @param  string  $reason  Alasan penyesuaian (contoh: "Stok masuk dari supplier").
     * @param  int|null  $createdBy  ID user yang melakukan (boleh null).
     */
    public function execute(Inventory $inventory, int $quantity, string $reason, ?int $createdBy = null): Inventory
    {
        return DB::transaction(function () use ($inventory, $quantity, $reason, $createdBy): Inventory {
            $locked = Inventory::query()
                ->whereKey($inventory->getKey())
                ->lockForUpdate()
                ->first();

            if (! $locked) {
                throw new \RuntimeException('Baris inventory tidak ditemukan.');
            }

            $newQuantity = $locked->quantity_on_hand + $quantity;

            if ($newQuantity < 0) {
                throw new \LogicException(
                    'Stok tidak boleh negatif. Stok saat ini '.$locked->quantity_on_hand.', penyesuaian '.$quantity.'.'
                );
            }

            $locked->update([
                'quantity_on_hand' => $newQuantity,
            ]);

            InventoryMovement::create([
                'warehouse_id' => $locked->warehouse_id,
                'variant_id' => $locked->variant_id,
                'type' => $this->resolveType($quantity),
                'quantity' => $quantity,
                'quantity_before' => $locked->quantity_on_hand - $quantity,
                'quantity_after' => $newQuantity,
                'reason' => $reason,
                'created_by' => $createdBy,
            ]);

            return $locked->refresh();
        });
    }

    private function resolveType(int $quantity): string
    {
        if ($quantity > 0) {
            return 'in';
        }

        if ($quantity < 0) {
            return 'out';
        }

        return 'adjustment';
    }
}
