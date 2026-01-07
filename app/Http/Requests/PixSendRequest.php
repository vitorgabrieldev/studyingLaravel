<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PixSendRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'key' => ['required', 'string', 'max:255'],
            'amount_cents' => ['required', 'integer', 'min:1'],
            'description' => ['nullable', 'string', 'max:140'],
        ];
    }
}
