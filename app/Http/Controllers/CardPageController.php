<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Services\Banking\AccountService;
use App\Services\Banking\CardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CardPageController extends Controller
{
    public function index(
        Request $request,
        AccountService $accountService,
        CardService $cardService
    ): Response {
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

        return Inertia::render('cards/index', [
            'cards' => $cards,
        ]);
    }
}
