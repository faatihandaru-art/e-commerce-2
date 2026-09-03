<?php

namespace App\Http\Requests\Admin;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
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
        $existingVariantIds = Product::find($this->productId())?->variants()->pluck('id')->all() ?? [];

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:280', Rule::unique('products', 'slug')->ignore($this->productId())],
            'brand_id' => ['nullable', 'integer', 'exists:brands,id'],
            'category_ids' => ['required', 'array', 'min:1'],
            'category_ids.*' => ['integer', 'exists:categories,id'],
            'description' => ['nullable', 'string'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'status' => ['required', 'string', 'in:draft,published'],
            'kept_images' => ['nullable', 'array'],
            'kept_images.*.id' => ['required', 'integer'],
            'delete_image_ids' => ['nullable', 'array'],
            'delete_image_ids.*' => ['integer'],
            'new_images' => ['nullable', 'array'],
            'new_images.*' => ['image', 'mimes:jpeg,png,webp', 'max:2048'],
            'primary_ref' => ['nullable', 'string', 'max:50'],
            'variants' => ['required', 'array', 'min:1'],
            'variants.*.id' => ['nullable', 'integer'],
            'variants.*.sku' => [
                'required', 'string', 'max:100', 'distinct',
                Rule::unique('product_variants', 'sku')->whereNot('id', $existingVariantIds ?? []),
            ],
            'variants.*.price' => ['required', 'numeric', 'min:0'],
            'variants.*.compare_at_price' => ['nullable', 'numeric', 'min:0'],
            'delete_variant_ids' => ['nullable', 'array'],
            'delete_variant_ids.*' => ['integer'],
        ];
    }

    private function productId(): int
    {
        $routeParam = $this->route('product');

        return $routeParam instanceof Product ? (int) $routeParam->id : (int) $routeParam;
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
            'variants.required' => 'Minimal satu varian produk wajib diisi.',
            'variants.min' => 'Minimal satu varian produk wajib diisi.',
            'variants.*.sku.required' => 'SKU wajib diisi.',
            'variants.*.sku.unique' => 'SKU sudah dipakai varian lain.',
            'variants.*.sku.distinct' => 'SKU tidak boleh sama antar baris varian dalam form yang sama.',
            'variants.*.price.required' => 'Harga wajib diisi.',
            'variants.*.price.numeric' => 'Harga harus berupa angka.',
            'variants.*.price.min' => 'Harga tidak boleh negatif.',
            'new_images.*.image' => 'File harus berupa gambar.',
            'new_images.*.mimes' => 'Format gambar harus jpeg, png, atau webp.',
            'new_images.*.max' => 'Ukuran tiap gambar maksimal 2MB.',
        ];
    }
}
