<?php

namespace App\Services\Banking;

use App\Exceptions\InsufficientFundsException;
use App\Models\Account;
use App\Models\BoletoPayment;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

class BoletoService
{
    public function __construct(
        private readonly ReceiptService $receiptService,
        private readonly NotificationService $notificationService
    ) {
    }

    public function pay(Account $account, string $barcode, string $beneficiary, int $amountCents): BoletoPayment
    {
        return DB::transaction(function () use ($account, $barcode, $beneficiary, $amountCents) {
            $lockedAccount = Account::whereKey($account->id)->lockForUpdate()->firstOrFail();

            if ($lockedAccount->balance_cents < $amountCents) {
                throw new InsufficientFundsException();
            }

            $lockedAccount->balance_cents -= $amountCents;
            $lockedAccount->save();

            $payment = BoletoPayment::create([
                'account_id' => $lockedAccount->id,
                'barcode' => $barcode,
                'beneficiary_name' => $beneficiary,
                'amount_cents' => $amountCents,
                'paid_at' => now(),
            ]);

            $transaction = Transaction::create([
                'account_id' => $lockedAccount->id,
                'type' => 'boleto',
                'direction' => 'debit',
                'amount_cents' => $amountCents,
                'description' => 'Pagamento de boleto',
                'meta' => [
                    'barcode' => $barcode,
                    'beneficiary_name' => $beneficiary,
                    'boleto_payment_id' => $payment->id,
                ],
            ]);

            $this->receiptService->generate($transaction, $lockedAccount);
            $this->notificationService->notify(
                $lockedAccount->user,
                'Boleto pago',
                'Seu pagamento foi confirmado.',
                'debit',
                ['transaction_id' => $transaction->id],
            );

            return $payment;
        });
    }
}
