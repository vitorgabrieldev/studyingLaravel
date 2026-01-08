<?php

namespace Database\Factories;

use App\Models\Account;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Account>
 */
class AccountFactory extends Factory
{
    protected $model = Account::class;

    public function definition(): array
    {
        $accountNumber = (string) $this->faker->numberBetween(10000000, 99999999);
        $digit = (string) (array_sum(str_split($accountNumber)) % 10);

        return [
            'user_id' => User::factory(),
            'branch_number' => str_pad((string) $this->faker->numberBetween(1, 9999), 4, '0', STR_PAD_LEFT),
            'account_number' => $accountNumber,
            'account_digit' => $digit,
            'balance_cents' => $this->faker->numberBetween(10000, 500000),
        ];
    }

    public function withBalance(int $balanceCents): static
    {
        return $this->state(fn () => [
            'balance_cents' => $balanceCents,
        ]);
    }
}
