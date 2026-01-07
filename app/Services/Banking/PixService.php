<?php

namespace App\Services\Banking;

use App\Models\Account;
use App\Models\PixKey;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class PixService
{
    public function __construct(private readonly TransferService $transferService)
    {
    }

    public function send(User $sender, string $key, int $amountCents, ?string $description = null): array
    {
        $pixKey = PixKey::query()->where('key', $key)->first();

        if (! $pixKey) {
            throw new ModelNotFoundException('Chave Pix nao encontrada.');
        }

        $fromAccount = $sender->account;
        $toAccount = $pixKey->account;

        $transfer = $this->transferService->transfer(
            $fromAccount,
            $toAccount,
            $amountCents,
            'pix',
            $description ?? 'Pix enviado',
            ['pix_key' => $pixKey->key],
            $pixKey
        );

        $fromAccount->refresh();

        return [
            'transfer_id' => $transfer->id,
            'balance_cents' => $fromAccount->balance_cents,
        ];
    }
}
