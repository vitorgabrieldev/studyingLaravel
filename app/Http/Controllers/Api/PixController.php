<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\InsufficientFundsException;
use App\Exceptions\SelfTransferException;
use App\Http\Controllers\Controller;
use App\Http\Requests\PixSendRequest;
use App\Services\Banking\AccountService;
use App\Services\Banking\PixService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;

class PixController extends Controller
{
    public function send(
        PixSendRequest $request,
        PixService $pixService,
        AccountService $accountService
    ): JsonResponse {
        $accountService->createForUser($request->user());
        try {
            $result = $pixService->send(
                $request->user(),
                $request->input('key'),
                $request->integer('amount_cents'),
                $request->input('description')
            );
        } catch (ModelNotFoundException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
            ], 404);
        } catch (InsufficientFundsException | SelfTransferException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
            ], 422);
        }

        return response()->json([
            'message' => 'Pix enviado com sucesso.',
            ...$result,
        ]);
    }
}
