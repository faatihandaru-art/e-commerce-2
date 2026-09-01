<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

<<<<<<< HEAD
    /**
     * @return array<string, mixed>
     */
=======
>>>>>>> 98c2ebd8d06ed9a1a4efbe10f036d25a05958aba
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
<<<<<<< HEAD
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
        ];
    }

    /**
     * @return array<string, string>
     */
=======
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

>>>>>>> 98c2ebd8d06ed9a1a4efbe10f036d25a05958aba
    public function messages(): array
    {
        return [
            'name.required' => 'Nama produk wajib diisi.',
<<<<<<< HEAD
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
=======
            'category_ids.required' => 'Minimal pilih 1 kategori.',
            'category_ids.min' => 'Minimal pilih 1 kategori.',
            'images.required' => 'Minimal 1 gambar produk wajib diunggah.',
            'images.min' => 'Minimal 1 gambar produk wajib diunggah.',
            'variants.required' => 'Minimal 1 varian produk wajib diisi.',
            'variants.min' => 'Minimal 1 varian produk wajib diisi.',
            'variants.*.sku.required' => 'SKU varian wajib diisi.',
            'variants.*.sku.unique' => 'SKU varian sudah digunakan.',
            'variants.*.price.required' => 'Harga varian wajib diisi.',
>>>>>>> 98c2ebd8d06ed9a1a4efbe10f036d25a05958aba
        ];
    }
}
