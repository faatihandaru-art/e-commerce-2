<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AdjustInventoryRequest extends FormRequest
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
            'quantity' => ['required', 'integer', 'not_in:0'],
            'reason' => ['required', 'string', 'max:255'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'quantity.required' => 'Jumlah penyesuaian wajib diisi.',
            'quantity.integer' => 'Jumlah penyesuaian harus berupa angka bulat.',
            'quantity.not_in' => 'Jumlah penyesuaian tidak boleh nol.',
            'reason.required' => 'Alasan penyesuaian wajib diisi.',
            'reason.max' => 'Alasan penyesuaian maksimal 255 karakter.',
        ];
    }
}
