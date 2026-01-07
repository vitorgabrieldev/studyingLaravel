<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BoletoPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'barcode' => ['required', 'string', 'max:255'],
            'beneficiary_name' => ['required', 'string', 'max:255'],
            'amount_cents' => ['required', 'integer', 'min:1'],
        ];
    }
}
