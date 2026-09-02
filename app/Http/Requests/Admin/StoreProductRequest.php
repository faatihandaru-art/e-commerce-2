<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:280', 'unique:products,slug'],
            'brand_id' => ['nullable', 'integer', 'exists:brands,id'],
            'category_ids' => ['required', 'array', 'min:1'],
            'category_ids.*' => ['integer', 'exists:categories,id'],
            'description' => ['nullable', 'string'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'status' => ['required', 'string', 'in:draft,published'],
            'images' => ['required', 'array', 'min:1'],
            'images.*' => ['required', 'image', 'mimes:jpeg,png,webp', 'max:2048'],
            'primary_index' => ['nullable', 'integer', 'min:0'],
            'variants' => ['required', 'array', 'min:1'],
            'variants.*.sku' => ['required', 'string', 'max:100', 'distinct', 'unique:product_variants,sku'],
            'variants.*.price' => ['required', 'numeric', 'min:0'],
            'variants.*.compare_at_price' => ['nullable', 'numeric', 'min:0'],
            'variants.*.stock' => ['nullable', 'integer', 'min:0'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama produk wajib diisi.',
            'category_ids.required' => 'Pilih minimal satu kategori untuk produk ini.',
            'category_ids.min' => 'Pilih minimal satu kategori untuk produk ini.',
            'images.required' => 'Minimal satu gambar produk wajib diupload.',
            'images.min' => 'Minimal satu gambar produk wajib diupload.',
            'images.*.image' => 'File harus berupa gambar.',
            'images.*.mimes' => 'Format gambar harus jpeg, png, atau webp.',
            'images.*.max' => 'Ukuran tiap gambar maksimal 2MB.',
            'variants.required' => 'Minimal satu varian produk wajib diisi.',
            'variants.min' => 'Minimal satu varian produk wajib diisi.',
            'variants.*.sku.required' => 'SKU wajib diisi.',
            'variants.*.sku.unique' => 'SKU sudah dipakai produk lain.',
            'variants.*.sku.distinct' => 'SKU tidak boleh sama antar baris varian dalam form yang sama.',
            'variants.*.price.required' => 'Harga wajib diisi.',
            'variants.*.price.numeric' => 'Harga harus berupa angka.',
            'variants.*.price.min' => 'Harga tidak boleh negatif.',
        ];
    }
}
