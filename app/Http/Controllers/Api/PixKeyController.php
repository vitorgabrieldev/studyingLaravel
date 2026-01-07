<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PixKeyStoreRequest;
use App\Models\PixKey;
use App\Services\Banking\AccountService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PixKeyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $keys = PixKey::query()
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get()
            ->map(fn (PixKey $key) => [
                'id' => $key->id,
                'type' => $key->type,
                'key' => $key->key,
                'created_at' => $key->created_at?->toISOString(),
            ]);

        return response()->json([
            'keys' => $keys,
        ]);
    }

    public function store(PixKeyStoreRequest $request, AccountService $accountService): JsonResponse
    {
        $user = $request->user();
        $account = $user->account ?? $accountService->createForUser($user);
        $type = $request->input('type');

        $keyValue = match ($type) {
            'email' => $user->email,
            'cpf' => $user->cpf,
            'phone' => $user->phone,
            'random' => (string) Str::uuid(),
            default => $request->input('key'),
        };

        $pixKey = PixKey::create([
            'user_id' => $user->id,
            'account_id' => $account->id,
            'type' => $request->input('type'),
            'key' => $keyValue,
        ]);

        return response()->json([
            'message' => 'Chave Pix registrada.',
            'key' => [
                'id' => $pixKey->id,
                'type' => $pixKey->type,
                'key' => $pixKey->key,
                'created_at' => $pixKey->created_at?->toISOString(),
            ],
        ], 201);
    }

    public function destroy(Request $request, PixKey $pixKey): JsonResponse
    {
        if ($pixKey->user_id !== $request->user()->id) {
            abort(404);
        }

        $pixKey->delete();

        return response()->json([
            'message' => 'Chave Pix removida.',
        ]);
    }
}
