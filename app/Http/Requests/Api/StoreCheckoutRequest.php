<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class StoreCheckoutRequest extends FormRequest
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
            'items' => ['required', 'array', 'min:1'],
            'items.*.variant_id' => ['required', 'integer', 'exists:product_variants,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:99'],

            'shipping' => ['required', 'array'],
            'shipping.recipient' => ['required', 'string', 'max:255'],
            'shipping.phone' => ['required', 'string', 'max:30'],
            'shipping.address_line1' => ['required', 'string', 'max:255'],
            'shipping.address_line2' => ['nullable', 'string', 'max:255'],
            'shipping.city' => ['required', 'string', 'max:100'],
            'shipping.province' => ['required', 'string', 'max:100'],
            'shipping.postal_code' => ['required', 'string', 'max:10'],
            'shipping.country' => ['nullable', 'string', 'max:100'],

            'shipping_method_id' => ['nullable', 'integer', 'exists:shipping_methods,id'],
            'shipping_cost' => ['nullable', 'integer', 'min:0'],
            'shipping_name' => ['nullable', 'string', 'max:100'],

            'payment' => ['required', 'array'],
            'payment.method' => ['required', 'string', 'max:50'],
            'payment.group' => ['required', 'string', 'max:50'],
            'payment.fee' => ['nullable', 'integer', 'min:0'],

            'coupon_code' => ['nullable', 'string', 'max:50'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'items.required' => 'Tidak ada produk yang dipilih untuk dibeli.',
            'shipping.recipient.required' => 'Nama penerima wajib diisi.',
            'shipping.phone.required' => 'Nomor telepon wajib diisi.',
            'shipping.address_line1.required' => 'Alamat pengiriman wajib diisi.',
            'shipping.city.required' => 'Kota/Kabupaten wajib diisi.',
            'shipping.province.required' => 'Provinsi wajib diisi.',
            'shipping.postal_code.required' => 'Kode pos wajib diisi.',
        ];
    }
}