<?php

namespace App\Http\Requests\Customer;

use Illuminate\Foundation\Http\FormRequest;

class StoreAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'recipient'   => ['required', 'string', 'max:255'],
            'phone'       => ['required', 'string', 'max:20'],
            'street'      => ['required', 'string', 'max:255'],
            'village'     => ['nullable', 'string', 'max:100'],
            'district'    => ['nullable', 'string', 'max:100'],
            'city'        => ['required', 'string', 'max:100'],
            'province'    => ['required', 'string', 'max:100'],
            'postal_code' => ['required', 'string', 'max:10'],
            'country'     => ['nullable', 'string', 'max:100'],
            'latitude'    => ['nullable', 'numeric', 'between:-90,90'],
            'longitude'   => ['nullable', 'numeric', 'between:-180,180'],
            'is_default'  => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'recipient.required'   => 'Nama penerima wajib diisi.',
            'phone.required'       => 'Nomor telepon wajib diisi.',
            'street.required'      => 'Nama jalan wajib diisi.',
            'city.required'        => 'Kota/Kabupaten wajib diisi.',
            'province.required'    => 'Provinsi wajib diisi.',
            'postal_code.required' => 'Kode pos wajib diisi.',
            'postal_code.max'      => 'Kode pos maksimal 10 karakter.',
            'latitude.between'     => 'Lintang harus antara -90 dan 90.',
            'longitude.between'    => 'Bujur harus antara -180 dan 180.',
        ];
    }
}
