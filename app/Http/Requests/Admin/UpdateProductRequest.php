<?php

namespace App\Http\Requests\Admin;

use App\Models\ProductVariant;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $product = $this->route('product');
        $productId = is_object($product) ? $product->id : $product;

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('products', 'slug')->ignore($productId)],
            'type' => ['nullable', 'string', 'max:50'],
            'brand_id' => ['nullable', 'integer', 'exists:brands,id'],
            'category_ids' => ['required', 'array', 'min:1'],
            'category_ids.*' => ['required', 'integer', 'exists:categories,id'],
            'short_description' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'status' => ['required', 'string', 'in:draft,published'],
            'existing_image_ids' => ['nullable', 'array'],
            'existing_image_ids.*' => ['integer', 'exists:product_images,id'],
            'images' => ['nullable', 'array'],
            'images.*' => ['nullable'],
            'primary_image_id' => ['nullable', 'integer'],
            'variants' => ['required', 'array', 'min:1'],
            'variants.*.id' => ['nullable', 'integer', 'exists:product_variants,id'],
            'variants.*.sku' => [
                'required',
                'string',
                'max:100',
                function ($attribute, $value, $fail) {
                    preg_match('/variants\.(\d+)\.sku/', $attribute, $matches);
                    $index = $matches[1] ?? null;
                    $variantId = null;
                    if ($index !== null) {
                        $variantId = $this->input("variants.{$index}.id");
                    }
                    $exists = ProductVariant::where('sku', $value)
                        ->when($variantId, fn ($q) => $q->where('id', '!=', $variantId))
                        ->exists();
                    if ($exists) {
                        $fail("SKU '{$value}' sudah digunakan.");
                    }
                },
            ],
            'variants.*.barcode' => ['nullable', 'string', 'max:100'],
            'variants.*.price' => ['required', 'numeric', 'min:0'],
            'variants.*.compare_at_price' => ['nullable', 'numeric', 'min:0'],
            'variants.*.cost_price' => ['nullable', 'numeric', 'min:0'],
            'variants.*.weight_grams' => ['nullable', 'numeric', 'min:0'],
            'variants.*.length_mm' => ['nullable', 'numeric', 'min:0'],
            'variants.*.width_mm' => ['nullable', 'numeric', 'min:0'],
            'variants.*.height_mm' => ['nullable', 'numeric', 'min:0'],
            'variants.*.status' => ['nullable', 'string', 'in:active,inactive'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama produk wajib diisi.',
            'category_ids.required' => 'Minimal pilih 1 kategori.',
            'category_ids.min' => 'Minimal pilih 1 kategori.',
            'variants.required' => 'Minimal 1 varian produk wajib diisi.',
            'variants.min' => 'Minimal 1 varian produk wajib diisi.',
            'variants.*.sku.required' => 'SKU varian wajib diisi.',
            'variants.*.price.required' => 'Harga varian wajib diisi.',
        ];
    }
}
