<?php

namespace App\Domain\Catalog\Actions;

use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

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
        });
    }
}
