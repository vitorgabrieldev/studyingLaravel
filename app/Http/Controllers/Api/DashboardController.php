<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Services\Banking\AccountService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function show(Request $request, AccountService $accountService): JsonResponse
    {
        $account = $request->user()->account ?? $accountService->createForUser($request->user());

        $transactions = Transaction::query()
            ->where('account_id', $account->id)
            ->latest()
            ->limit(8)
            ->get()
            ->map(fn (Transaction $transaction) => [
                'id' => $transaction->id,
                'type' => $transaction->type,
                'direction' => $transaction->direction,
                'amount_cents' => $transaction->amount_cents,
                'description' => $transaction->description,
                'created_at' => $transaction->created_at?->toISOString(),
                'meta' => $transaction->meta,
            ]);

        return response()->json([
            'account' => [
                'branch_number' => $account->branch_number,
                'account_number' => $account->account_number,
                'account_digit' => $account->account_digit,
                'balance_cents' => $account->balance_cents,
            ],
            'transactions' => $transactions,
        ]);
    }
}
