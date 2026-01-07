<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Services\Banking\AccountService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransactionTagController extends Controller
{
    public function update(
        Request $request,
        AccountService $accountService,
        Transaction $transaction
    ): JsonResponse {
        $data = $request->validate([
            'tags' => ['array'],
            'tags.*' => ['string', 'max:24'],
        ]);

        $account = $request->user()->account ?? $accountService->createForUser($request->user());

        abort_if($transaction->account_id !== $account->id, 403);

        $tags = array_values(array_unique($data['tags'] ?? []));

        $transaction->update([
            'tags' => $tags,
        ]);

        return response()->json([
            'message' => 'Tags atualizadas.',
            'tags' => $tags,
        ]);
    }
}
