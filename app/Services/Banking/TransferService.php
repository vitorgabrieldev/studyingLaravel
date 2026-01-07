<?php

namespace App\Services\Banking;

use App\Exceptions\InsufficientFundsException;
use App\Exceptions\SelfTransferException;
use App\Models\Account;
use App\Models\PixKey;
use App\Models\Transaction;
use App\Models\Transfer;
use Illuminate\Support\Facades\DB;

class TransferService
{
    public function __construct(
        private readonly ReceiptService $receiptService,
        private readonly NotificationService $notificationService
    ) {
    }

    /**
     * @param  array<string, mixed>  $meta
     */
    public function transfer(
        Account $from,
        Account $to,
        int $amountCents,
        string $channel,
        ?string $description = null,
        array $meta = [],
        ?PixKey $pixKey = null
    ): Transfer {
        if ($from->id === $to->id) {
            throw new SelfTransferException();
        }

        return DB::transaction(function () use ($from, $to, $amountCents, $channel, $description, $meta, $pixKey) {
            $fromAccount = Account::whereKey($from->id)->lockForUpdate()->firstOrFail();
            $toAccount = Account::whereKey($to->id)->lockForUpdate()->firstOrFail();

            if ($fromAccount->balance_cents < $amountCents) {
                throw new InsufficientFundsException();
            }

            $fromAccount->balance_cents -= $amountCents;
            $toAccount->balance_cents += $amountCents;

            $fromAccount->save();
            $toAccount->save();

            $transfer = Transfer::create([
                'from_account_id' => $fromAccount->id,
                'to_account_id' => $toAccount->id,
                'pix_key_id' => $pixKey?->id,
                'channel' => $channel,
                'amount_cents' => $amountCents,
                'description' => $description,
            ]);

            $debitTransaction = Transaction::create([
                'account_id' => $fromAccount->id,
                'type' => $channel,
                'direction' => 'debit',
                'amount_cents' => $amountCents,
                'description' => $description ?? 'Transferencia enviada',
                'meta' => [
                    'transfer_id' => $transfer->id,
                    'counterparty' => [
                        'name' => $toAccount->user->name,
                        'cpf' => $toAccount->user->cpf,
                        'institution' => config('app.name'),
                        'account_type' => 'Conta corrente',
                        'branch_number' => $toAccount->branch_number,
                        'account_number' => $toAccount->account_number,
                        'account_digit' => $toAccount->account_digit,
                    ],
                    ...$meta,
                ],
            ]);

            $creditTransaction = Transaction::create([
                'account_id' => $toAccount->id,
                'type' => $channel,
                'direction' => 'credit',
                'amount_cents' => $amountCents,
                'description' => $description ?? 'Transferencia recebida',
                'meta' => [
                    'transfer_id' => $transfer->id,
                    'counterparty' => [
                        'name' => $fromAccount->user->name,
                        'cpf' => $fromAccount->user->cpf,
                        'institution' => config('app.name'),
                        'account_type' => 'Conta corrente',
                        'branch_number' => $fromAccount->branch_number,
                        'account_number' => $fromAccount->account_number,
                        'account_digit' => $fromAccount->account_digit,
                    ],
                    ...$meta,
                ],
            ]);

            $this->receiptService->generate($debitTransaction, $fromAccount);
            $this->receiptService->generate($creditTransaction, $toAccount);

            $this->notificationService->notify(
                $fromAccount->user,
                'Transferência enviada',
                $description ?? 'Sua transferência foi enviada com sucesso.',
                'debit',
                ['transaction_id' => $debitTransaction->id],
            );
            $this->notificationService->notify(
                $toAccount->user,
                'Transferência recebida',
                $description ?? 'Você recebeu uma transferência.',
                'credit',
                ['transaction_id' => $creditTransaction->id],
            );

            return $transfer;
        });
    }
}
