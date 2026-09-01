<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:products,slug'],
            'type' => ['nullable', 'string', 'max:50'],
            'brand_id' => ['nullable', 'integer', 'exists:brands,id'],
            'category_ids' => ['required', 'array', 'min:1'],
            'category_ids.*' => ['required', 'integer', 'exists:categories,id'],
            'short_description' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'status' => ['required', 'string', 'in:draft,published'],
            'images' => ['required', 'array', 'min:1'],
            'images.*' => ['nullable'],
            'variants' => ['required', 'array', 'min:1'],
            'variants.*.sku' => ['required', 'string', 'max:100', 'unique:product_variants,sku'],
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
            'images.required' => 'Minimal 1 gambar produk wajib diunggah.',
            'images.min' => 'Minimal 1 gambar produk wajib diunggah.',
            'variants.required' => 'Minimal 1 varian produk wajib diisi.',
            'variants.min' => 'Minimal 1 varian produk wajib diisi.',
            'variants.*.sku.required' => 'SKU varian wajib diisi.',
            'variants.*.sku.unique' => 'SKU varian sudah digunakan.',
            'variants.*.price.required' => 'Harga varian wajib diisi.',
        ];
    }
}
