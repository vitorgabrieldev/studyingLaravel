<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Card;
use App\Services\Banking\AccountService;
use App\Services\Banking\CardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class CardController extends Controller
{
    public function index(
        Request $request,
        AccountService $accountService,
        CardService $cardService
    ): JsonResponse {
        $account = $request->user()->account ?? $accountService->createForUser($request->user());
        $cardService->ensurePhysicalCard($account);

        $cards = $account->cards()
            ->latest()
            ->get()
            ->map(fn (Card $card) => [
                'id' => $card->id,
                'type' => $card->type,
                'status' => $card->status,
                'nickname' => $card->nickname,
                'brand' => $card->brand,
                'last4' => $card->last4,
                'exp_month' => $card->exp_month,
                'exp_year' => $card->exp_year,
                'limit_cents' => $card->limit_cents,
                'international_enabled' => $card->international_enabled,
                'online_enabled' => $card->online_enabled,
                'contactless_enabled' => $card->contactless_enabled,
                'replaced_at' => $card->replaced_at?->toISOString(),
            ]);

        return response()->json([
            'cards' => $cards,
        ]);
    }

    public function store(Request $request, AccountService $accountService, CardService $cardService): JsonResponse
    {
        $data = $request->validate([
            'nickname' => ['nullable', 'string', 'max:40'],
            'limit_cents' => ['nullable', 'integer', 'min:1000'],
        ]);

        $account = $request->user()->account ?? $accountService->createForUser($request->user());

        $card = $cardService->createVirtualCard(
            $account,
            $data['nickname'] ?? null,
            $data['limit_cents'] ?? null
        );

        return response()->json([
            'message' => 'Cartao virtual criado.',
            'card' => [
                'id' => $card->id,
                'nickname' => $card->nickname,
                'last4' => $card->last4,
            ],
        ], 201);
    }

    public function reveal(Request $request, Card $card): JsonResponse
    {
        $request->validate([
            'password' => ['required', 'string'],
        ]);

        $this->authorizeCard($request, $card);

        if ($card->isPhysical()) {
            return response()->json([
                'message' => 'Os dados do cartao fisico nao podem ser exibidos.',
            ], 403);
        }

        if (! Hash::check($request->input('password'), $request->user()->password)) {
            return response()->json([
                'message' => 'Senha invalida.',
            ], 422);
        }

        return response()->json([
            'pan' => $card->pan,
            'cvv' => $card->cvv,
            'exp_month' => $card->exp_month,
            'exp_year' => $card->exp_year,
        ]);
    }

    public function block(Request $request, Card $card): JsonResponse
    {
        $this->authorizeCard($request, $card);

        $card->update(['status' => 'blocked']);

        return response()->json(['message' => 'Cartao bloqueado.']);
    }

    public function unblock(Request $request, Card $card): JsonResponse
    {
        $this->authorizeCard($request, $card);

        if ($card->replaced_at) {
            return response()->json([
                'message' => 'Este cartao foi substituido.',
            ], 422);
        }

        $card->update(['status' => 'active']);

        return response()->json(['message' => 'Cartao desbloqueado.']);
    }

    public function settings(Request $request, Card $card): JsonResponse
    {
        $this->authorizeCard($request, $card);

        $data = $request->validate([
            'international_enabled' => ['required', 'boolean'],
            'online_enabled' => ['required', 'boolean'],
            'contactless_enabled' => ['required', 'boolean'],
        ]);

        $card->update($data);

        return response()->json(['message' => 'Preferencias atualizadas.']);
    }

    public function replace(
        Request $request,
        Card $card,
        AccountService $accountService,
        CardService $cardService
    ): JsonResponse {
        $this->authorizeCard($request, $card);

        if (! $card->isPhysical()) {
            return response()->json([
                'message' => 'Somente cartoes fisicos podem ser substituidos.',
            ], 422);
        }

        $account = $request->user()->account ?? $accountService->createForUser($request->user());
        $newCard = $cardService->replacePhysicalCard($account, $card);

        return response()->json([
            'message' => 'Novo cartao fisico solicitado.',
            'card' => [
                'id' => $newCard->id,
                'last4' => $newCard->last4,
            ],
        ]);
    }

    private function authorizeCard(Request $request, Card $card): void
    {
        $account = $request->user()->account;

        abort_if(! $account || $card->account_id !== $account->id, 403);
    }
}
