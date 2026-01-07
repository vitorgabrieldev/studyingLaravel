<?php

namespace App\Actions\Fortify;

use App\Models\User;
use App\Services\Banking\AccountService;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    public function __construct(private readonly AccountService $accountService)
    {
    }

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'cpf' => ['required', 'string', 'max:20', Rule::unique(User::class)],
            'phone' => ['required', 'string', 'max:30'],
            'birth_date' => ['required', 'date'],
            'address_line' => ['required', 'string', 'max:255'],
            'address_number' => ['required', 'string', 'max:20'],
            'address_complement' => ['nullable', 'string', 'max:255'],
            'neighborhood' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'state' => ['required', 'string', 'size:2'],
            'postal_code' => ['required', 'string', 'max:20'],
            'password' => $this->passwordRules(),
        ])->validate();

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'cpf' => $input['cpf'],
            'phone' => $input['phone'],
            'birth_date' => $input['birth_date'],
            'address_line' => $input['address_line'],
            'address_number' => $input['address_number'],
            'address_complement' => $input['address_complement'] ?? null,
            'neighborhood' => $input['neighborhood'],
            'city' => $input['city'],
            'state' => strtoupper($input['state']),
            'postal_code' => $input['postal_code'],
            'password' => $input['password'],
        ]);

        $this->accountService->createForUser($user);

        return $user;
    }
}
