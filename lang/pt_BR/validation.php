<?php

return [
    'required' => 'O campo :attribute é obrigatório.',
    'email' => 'O campo :attribute deve ser um email válido.',
    'unique' => 'O :attribute já está em uso.',
    'confirmed' => 'A confirmação de :attribute não confere.',
    'digits' => 'O campo :attribute deve ter exatamente :digits dígitos.',
    'date' => 'O campo :attribute não é uma data válida.',
    'string' => 'O campo :attribute deve ser um texto.',
    'min' => [
        'string' => 'O campo :attribute deve ter no mínimo :min caracteres.',
    ],
    'max' => [
        'string' => 'O campo :attribute deve ter no máximo :max caracteres.',
    ],
    'attributes' => [
        'name' => 'nome',
        'cpf' => 'CPF',
        'birth_date' => 'data de nascimento',
        'email' => 'email',
        'phone' => 'celular',
        'password' => 'senha',
        'password_confirmation' => 'confirmação de senha',
        'address_line' => 'rua',
        'address_number' => 'número',
        'address_complement' => 'complemento',
        'neighborhood' => 'bairro',
        'city' => 'cidade',
        'state' => 'UF',
        'postal_code' => 'CEP',
    ],
];
