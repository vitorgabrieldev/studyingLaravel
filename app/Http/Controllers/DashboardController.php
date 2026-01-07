<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Services\Banking\AccountService;
use App\Services\Banking\CardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function show(Request $request, AccountService $accountService, CardService $cardService): Response
    {
        $account = $request->user()->account ?? $accountService->createForUser($request->user());
        $cardSnapshot = $cardService->invoiceSnapshot($account);

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

        return Inertia::render('dashboard', [
            'dashboard' => [
                'account' => [
                    'branch_number' => $account->branch_number,
                    'account_number' => $account->account_number,
                    'account_digit' => $account->account_digit,
                    'balance_cents' => $account->balance_cents,
                ],
                'card' => $cardSnapshot,
                'transactions' => $transactions,
            ],
        ]);
    }
}
