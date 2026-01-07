<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Services\Banking\AccountService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function index(Request $request, AccountService $accountService): Response
    {
        $account = $request->user()->account ?? $accountService->createForUser($request->user());

        $transactions = Transaction::query()
            ->where('account_id', $account->id)
            ->latest()
            ->paginate(12)
            ->withQueryString()
            ->through(fn (Transaction $transaction) => [
                'id' => $transaction->id,
                'type' => $transaction->type,
                'direction' => $transaction->direction,
                'amount_cents' => $transaction->amount_cents,
                'description' => $transaction->description,
                'created_at' => $transaction->created_at?->toISOString(),
            ]);

        return Inertia::render('transactions/index', [
            'account' => [
                'branch_number' => $account->branch_number,
                'account_number' => $account->account_number,
                'account_digit' => $account->account_digit,
                'balance_cents' => $account->balance_cents,
            ],
            'transactions' => $transactions,
        ]);
    }

    public function show(Request $request, AccountService $accountService, int $transaction): Response
    {
        $account = $request->user()->account ?? $accountService->createForUser($request->user());

        $transactionModel = Transaction::query()
            ->where('account_id', $account->id)
            ->whereKey($transaction)
            ->firstOrFail();

        $meta = $transactionModel->meta ?? [];

        return Inertia::render('transactions/show', [
            'account' => [
                'branch_number' => $account->branch_number,
                'account_number' => $account->account_number,
                'account_digit' => $account->account_digit,
            ],
            'transaction' => [
                'id' => $transactionModel->id,
                'type' => $transactionModel->type,
                'direction' => $transactionModel->direction,
                'amount_cents' => $transactionModel->amount_cents,
                'description' => $transactionModel->description,
                'created_at' => $transactionModel->created_at?->toISOString(),
                'reference' => 'TX-' . str_pad((string) $transactionModel->id, 10, '0', STR_PAD_LEFT),
                'meta' => [
                    'barcode' => $meta['barcode'] ?? null,
                    'beneficiary_name' => $meta['beneficiary_name'] ?? null,
                    'counterparty' => $meta['counterparty'] ?? null,
                    'pix_key' => $meta['pix_key'] ?? null,
                ],
            ],
        ]);
    }
}
