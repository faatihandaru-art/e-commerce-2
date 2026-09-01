<?php

namespace App\Domain\Catalog\Actions;

use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

<<<<<<< HEAD
final class DeleteProductAction
{
    public function execute(Product $product): void
    {
        DB::transaction(function () use ($product) {
            $paths = $product->images()->pluck('path')->filter()->values();

            $product->delete();

            foreach ($paths as $path) {
                Storage::disk('public')->delete($path);
            }
=======
class DeleteProductAction
{
    /**
     * Delete a product and remove its physical images from storage.
     *
     * @param Product $product
     * @return bool|null
     */
    public function execute(Product $product): ?bool
    {
        return DB::transaction(function () use ($product) {
            // Delete physical image files from public disk
            foreach ($product->images as $image) {
                if ($image->path && Storage::disk('public')->exists($image->path)) {
                    Storage::disk('public')->delete($image->path);
                }
                $image->delete();
            }

            // Soft-delete product
            return $product->delete();
>>>>>>> 98c2ebd8d06ed9a1a4efbe10f036d25a05958aba
        });
    }
}
