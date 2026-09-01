<?php

namespace App\Http\Requests\Admin;

<<<<<<< HEAD
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Product;
=======
use App\Models\ProductVariant;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
>>>>>>> 98c2ebd8d06ed9a1a4efbe10f036d25a05958aba

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

<<<<<<< HEAD
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
                Rule::unique('product_variants', 'sku')->ignore($existingVariantIds ?? []),
            ],
            'variants.*.price' => ['required', 'numeric', 'min:0'],
            'variants.*.compare_at_price' => ['nullable', 'numeric', 'min:0'],
            'delete_variant_ids' => ['nullable', 'array'],
            'delete_variant_ids.*' => ['integer'],
        ];
    }

    private function productId(): int
    {
        return (int) $this->route('product');
    }

    /**
     * @return array<string, string>
     */
=======
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

>>>>>>> 98c2ebd8d06ed9a1a4efbe10f036d25a05958aba
    public function messages(): array
    {
        return [
            'name.required' => 'Nama produk wajib diisi.',
<<<<<<< HEAD
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
=======
            'category_ids.required' => 'Minimal pilih 1 kategori.',
            'category_ids.min' => 'Minimal pilih 1 kategori.',
            'variants.required' => 'Minimal 1 varian produk wajib diisi.',
            'variants.min' => 'Minimal 1 varian produk wajib diisi.',
            'variants.*.sku.required' => 'SKU varian wajib diisi.',
            'variants.*.price.required' => 'Harga varian wajib diisi.',
>>>>>>> 98c2ebd8d06ed9a1a4efbe10f036d25a05958aba
        ];
    }
}
