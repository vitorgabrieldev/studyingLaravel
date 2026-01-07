<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\InsufficientFundsException;
use App\Http\Controllers\Controller;
use App\Http\Requests\BoletoPaymentRequest;
use App\Services\Banking\AccountService;
use App\Services\Banking\BoletoService;
use Illuminate\Http\JsonResponse;

class BoletoController extends Controller
{
    public function pay(
        BoletoPaymentRequest $request,
        BoletoService $boletoService,
        AccountService $accountService
    ): JsonResponse {
        $accountService->createForUser($request->user());

        try {
            $payment = $boletoService->pay(
                $request->user()->account,
                $request->input('barcode'),
                $request->input('beneficiary_name'),
                $request->integer('amount_cents')
            );
        } catch (InsufficientFundsException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
            ], 422);
        }

        $request->user()->account->refresh();

        return response()->json([
            'message' => 'Boleto pago com sucesso.',
            'payment_id' => $payment->id,
            'balance_cents' => $request->user()->account->balance_cents,
        ], 201);
    }
}
