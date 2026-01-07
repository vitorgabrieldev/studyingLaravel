<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\InsufficientFundsException;
use App\Exceptions\SelfTransferException;
use App\Http\Controllers\Controller;
use App\Http\Requests\TransferRequest;
use App\Models\Account;
use App\Models\User;
use App\Services\Banking\AccountService;
use App\Services\Banking\TransferService;
use Illuminate\Http\JsonResponse;

class TransferController extends Controller
{
    public function store(
        TransferRequest $request,
        TransferService $transferService,
        AccountService $accountService
    ): JsonResponse {
        $accountService->createForUser($request->user());

        $destinationType = $request->input('destination_type');
        $destination = $request->input('destination');

        $toAccount = $this->resolveDestinationAccount($destinationType, $destination, $request->input('account_digit'));

        if (! $toAccount) {
            return response()->json([
                'message' => 'Destino nao encontrado.',
            ], 404);
        }

        try {
            $transferService->transfer(
                $request->user()->account,
                $toAccount,
                $request->integer('amount_cents'),
                'transfer',
                $request->input('description'),
            );
        } catch (InsufficientFundsException | SelfTransferException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
            ], 422);
        }

        $request->user()->account->refresh();

        return response()->json([
            'message' => 'Transferencia realizada.',
            'balance_cents' => $request->user()->account->balance_cents,
        ]);
    }

    private function resolveDestinationAccount(string $type, string $destination, ?string $accountDigit): ?Account
    {
        if ($type === 'email') {
            return User::query()->where('email', $destination)->first()?->account;
        }

        $query = Account::query()->where('account_number', $destination);

        if ($accountDigit) {
            $query->where('account_digit', $accountDigit);
        }

        return $query->first();
    }
}
