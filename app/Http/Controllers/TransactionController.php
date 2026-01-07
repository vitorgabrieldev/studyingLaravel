<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Services\Banking\AccountService;
use App\Services\Banking\ReceiptService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function index(Request $request, AccountService $accountService): Response
    {
        $account = $request->user()->account ?? $accountService->createForUser($request->user());

        $query = Transaction::query()
            ->where('account_id', $account->id)
            ->latest();

        if ($request->filled('q')) {
            $search = (string) $request->string('q');
            $query->where(function ($builder) use ($search) {
                $builder->where('description', 'like', "%{$search}%")
                    ->orWhere('type', 'like', "%{$search}%");
            });
        }

        if ($request->filled('tag')) {
            $tag = (string) $request->string('tag');
            $query->whereJsonContains('tags', $tag);
        }

        $transactions = $query->paginate(12)
            ->withQueryString()
            ->through(fn (Transaction $transaction) => [
                'id' => $transaction->id,
                'type' => $transaction->type,
                'direction' => $transaction->direction,
                'amount_cents' => $transaction->amount_cents,
                'description' => $transaction->description,
                'created_at' => $transaction->created_at?->toISOString(),
                'tags' => $transaction->tags ?? [],
            ]);

        return Inertia::render('transactions/index', [
            'account' => [
                'branch_number' => $account->branch_number,
                'account_number' => $account->account_number,
                'account_digit' => $account->account_digit,
                'balance_cents' => $account->balance_cents,
            ],
            'transactions' => $transactions,
            'filters' => [
                'q' => $request->string('q')->toString(),
                'tag' => $request->string('tag')->toString(),
            ],
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
                'tags' => $transactionModel->tags ?? [],
                'meta' => [
                    'barcode' => $meta['barcode'] ?? null,
                    'beneficiary_name' => $meta['beneficiary_name'] ?? null,
                    'counterparty' => $meta['counterparty'] ?? null,
                    'pix_key' => $meta['pix_key'] ?? null,
                ],
            ],
        ]);
    }

    public function download(
        Request $request,
        AccountService $accountService,
        ReceiptService $receiptService,
        int $transaction
    ) {
        $account = $request->user()->account ?? $accountService->createForUser($request->user());

        $transactionModel = Transaction::query()
            ->where('account_id', $account->id)
            ->whereKey($transaction)
            ->firstOrFail();

        if (! $transactionModel->receipt_path) {
            $receiptService->generate($transactionModel, $account);
        }

        $path = $transactionModel->receipt_path ?? $receiptService->buildPath($transactionModel);

        abort_if(! Storage::disk('public')->exists($path), 404);

        return Storage::disk('public')->download($path, "comprovante-{$transactionModel->id}.pdf");
    }
}
