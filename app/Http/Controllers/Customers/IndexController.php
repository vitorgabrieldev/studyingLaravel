<?php

namespace App\Http\Controllers\Customers;

use App\Exceptions\MinimumTotalException;
use App\Http\Controllers\Controller;
use App\Http\Requests\CheckoutQuoteRequest;
use App\Services\CheckoutQuoteService;
use Illuminate\Http\JsonResponse;

class IndexController extends Controller
{
    public function store(CheckoutQuoteRequest $request, CheckoutQuoteService $service): JsonResponse
    {
        $validated = $request->validated();

        try {
            $result = $service->execute(
                $validated['items'],
                $validated['coupon'] ?? null
            );
        } catch (MinimumTotalException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
            ], 422);
        }

        return response()->json($result);
    }
}
