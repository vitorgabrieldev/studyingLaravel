<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Banking\AccountService;
use App\Services\Banking\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TravelModeController extends Controller
{
    public function toggle(
        Request $request,
        AccountService $accountService,
        NotificationService $notificationService
    ): JsonResponse {
        $data = $request->validate([
            'enabled' => ['required', 'boolean'],
        ]);

        $account = $request->user()->account ?? $accountService->createForUser($request->user());

        $account->update([
            'travel_mode_enabled' => $data['enabled'],
            'travel_mode_started_at' => $data['enabled'] ? now() : null,
        ]);

        $account->cards()->update([
            'international_enabled' => $data['enabled'],
        ]);

        $notificationService->notify(
            $request->user(),
            $data['enabled'] ? 'Modo viagem ativado' : 'Modo viagem desativado',
            $data['enabled']
                ? 'Compras internacionais foram liberadas.'
                : 'Compras internacionais foram bloqueadas.',
            'info',
        );

        return response()->json([
            'message' => $data['enabled']
                ? 'Modo viagem ativado.'
                : 'Modo viagem desativado.',
            'travel_mode_enabled' => $account->travel_mode_enabled,
        ]);
    }
}
