<?php

namespace App\Domain\Catalog\Actions;

use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

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
        });
    }
}
