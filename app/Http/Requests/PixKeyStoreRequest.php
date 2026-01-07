<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PixKeyStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $type = $this->input('type');

        return [
            'type' => ['required', Rule::in(['cpf', 'email', 'phone', 'random'])],
            'key' => [
                Rule::requiredIf($type !== 'random'),
                'nullable',
                'string',
                'max:255',
                Rule::unique('pix_keys', 'key'),
            ],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $type = $this->input('type');

            if ($type === 'random') {
                return;
            }

            $user = $this->user();

            if (! $user) {
                return;
            }

            $key = trim((string) $this->input('key'));

            $expected = match ($type) {
                'email' => $user->email,
                'cpf' => $user->cpf,
                'phone' => $user->phone,
                default => null,
            };

            if (! $expected) {
                $validator->errors()->add('key', 'Atualize seu perfil antes de cadastrar esta chave.');
                return;
            }

            if ($type === 'email') {
                if (strtolower($key) !== strtolower(trim((string) $expected))) {
                    $validator->errors()->add('key', 'A chave precisa ser o email cadastrado.');
                }

                return;
            }

            if ($this->normalizeDigits($key) !== $this->normalizeDigits((string) $expected)) {
                $validator->errors()->add('key', 'A chave precisa ser igual aos dados do seu cadastro.');
            }
        });
    }

    private function normalizeDigits(?string $value): string
    {
        return preg_replace('/\D+/', '', (string) $value) ?? '';
    }
}
