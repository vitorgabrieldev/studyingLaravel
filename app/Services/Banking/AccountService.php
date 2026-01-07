<?php

namespace App\Services\Banking;

use App\Models\Account;
use App\Models\User;

class AccountService
{
    public function createForUser(User $user): Account
    {
        if ($user->account) {
            return $user->account;
        }

        [$accountNumber, $accountDigit] = $this->generateAccountNumber();

        return Account::create([
            'user_id' => $user->id,
            'branch_number' => '0001',
            'account_number' => $accountNumber,
            'account_digit' => $accountDigit,
            'balance_cents' => 0,
        ]);
    }

    /**
     * @return array{0: string, 1: string}
     */
    private function generateAccountNumber(): array
    {
        do {
            $accountNumber = (string) random_int(10000000, 99999999);
        } while (Account::where('account_number', $accountNumber)->exists());

        $digit = (string) (array_sum(str_split($accountNumber)) % 10);

        return [$accountNumber, $digit];
    }
}
