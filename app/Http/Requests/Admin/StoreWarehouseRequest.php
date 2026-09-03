<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreWarehouseRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:150'],
            'code' => ['required', 'string', 'max:50', 'unique:warehouses,code'],
            'address' => ['nullable', 'string'],
            'status' => ['required', 'string', 'in:active,inactive'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama gudang wajib diisi.',
            'code.required' => 'Kode gudang wajib diisi.',
            'code.unique' => 'Kode gudang sudah dipakai.',
            'status.in' => 'Status harus active atau inactive.',
        ];
    }
}
