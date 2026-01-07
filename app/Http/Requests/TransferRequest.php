<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TransferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $destinationType = $this->input('destination_type');

        return [
            'destination_type' => ['required', Rule::in(['email', 'account'])],
            'destination' => ['required', 'string', 'max:255'],
            'account_digit' => [
                Rule::requiredIf($destinationType === 'account'),
                'nullable',
                'string',
                'max:2',
            ],
            'amount_cents' => ['required', 'integer', 'min:1'],
            'description' => ['nullable', 'string', 'max:140'],
        ];
    }
}
