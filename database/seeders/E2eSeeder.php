<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\PixKey;
use App\Models\User;
use Illuminate\Database\Seeder;

class E2eSeeder extends Seeder
{
    public function run(): void
    {
        $primaryUser = User::updateOrCreate(
            ['email' => 'e2e-user@fintech.test'],
            [
                'name' => 'E2E User',
                'password' => '12345678',
                'cpf' => '11122233344',
                'phone' => '(11) 98888-0000',
                'birth_date' => '1994-01-10',
                'address_line' => 'Rua das Palmeiras',
                'address_number' => '120',
                'address_complement' => 'Sala 12',
                'neighborhood' => 'Centro',
                'city' => 'Sao Paulo',
                'state' => 'SP',
                'postal_code' => '01000-000',
                'email_verified_at' => now(),
            ]
        );

        $targetUser = User::updateOrCreate(
            ['email' => 'e2e-target@fintech.test'],
            [
                'name' => 'E2E Target',
                'password' => '87654321',
                'cpf' => '55566677788',
                'phone' => '(21) 97777-1111',
                'birth_date' => '1992-05-20',
                'address_line' => 'Avenida Central',
                'address_number' => '450',
                'address_complement' => null,
                'neighborhood' => 'Jardins',
                'city' => 'Rio de Janeiro',
                'state' => 'RJ',
                'postal_code' => '20000-000',
                'email_verified_at' => now(),
            ]
        );

        $primaryAccount = Account::updateOrCreate(
            ['user_id' => $primaryUser->id],
            [
                'branch_number' => '0001',
                'account_number' => '12345678',
                'account_digit' => '6',
                'balance_cents' => 1500000,
            ]
        );

        $targetAccount = Account::updateOrCreate(
            ['user_id' => $targetUser->id],
            [
                'branch_number' => '0001',
                'account_number' => '87654321',
                'account_digit' => '4',
                'balance_cents' => 300000,
            ]
        );

        PixKey::updateOrCreate(
            ['key' => $targetUser->email],
            [
                'user_id' => $targetUser->id,
                'account_id' => $targetAccount->id,
                'type' => 'email',
            ]
        );

        PixKey::updateOrCreate(
            ['key' => $targetUser->cpf],
            [
                'user_id' => $targetUser->id,
                'account_id' => $targetAccount->id,
                'type' => 'cpf',
            ]
        );

        PixKey::updateOrCreate(
            ['key' => $targetUser->phone],
            [
                'user_id' => $targetUser->id,
                'account_id' => $targetAccount->id,
                'type' => 'phone',
            ]
        );
    }
}
