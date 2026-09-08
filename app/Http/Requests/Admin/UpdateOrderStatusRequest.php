<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isStaff();
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'status' => [
                'required',
                'string',
                'in:pending_payment,confirmed,processing,packed,shipped,completed,cancelled,refunded',
            ],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }
}
