<?php

namespace App\Services\Banking;

use App\Models\Account;
use App\Models\Transaction;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class ReceiptService
{
    public function generate(Transaction $transaction, Account $account): void
    {
        $path = $this->buildPath($transaction);

        if (Storage::disk('public')->exists($path)) {
            return;
        }

        $reference = 'TX-' . str_pad((string) $transaction->id, 10, '0', STR_PAD_LEFT);
        $account->loadMissing('user');
        $meta = $transaction->meta ?? [];
        $counterparty = $meta['counterparty'] ?? [];

        $origin = $this->buildOrigin($transaction, $account, $counterparty);
        $destination = $this->buildDestination($transaction, $account, $counterparty, $meta);

        $pdf = Pdf::loadView('receipts.transaction', [
            'transaction' => $transaction,
            'account' => $account,
            'reference' => $reference,
            'origin' => $origin,
            'destination' => $destination,
            'support' => [
                'company' => 'Fintech.laravel S.A.',
                'cnpj' => '12.345.678/0001-90',
                'phone' => '0800 123 4567',
                'email' => 'atendimento@fintech.laravel',
                'site' => config('app.url'),
                'hours' => 'Atendimento das 8h as 18h em dias uteis',
                'message' => 'Estamos aqui para ajudar voce em qualquer duvida.',
            ],
        ])->setPaper('a4');

        Storage::disk('public')->put($path, $pdf->output());

        $transaction->update([
            'receipt_path' => $path,
        ]);
    }

    public function buildPath(Transaction $transaction): string
    {
        return "receipts/transaction-{$transaction->id}.pdf";
    }

    /**
     * @param  array<string, mixed>  $counterparty
     * @return array<string, string|null>
     */
    private function buildOrigin(
        Transaction $transaction,
        Account $account,
        array $counterparty
    ): array {
        if ($transaction->direction === 'debit') {
            return [
                'name' => $account->user?->name,
                'cpf' => $this->maskCpf($account->user?->cpf),
                'institution' => config('app.name'),
                'account_type' => 'Conta corrente',
                'account' => $this->formatAccount($account),
            ];
        }

        return [
            'name' => $counterparty['name'] ?? '---',
            'cpf' => $this->maskCpf($counterparty['cpf'] ?? null),
            'institution' => $counterparty['institution'] ?? 'Instituicao externa',
            'account_type' => $counterparty['account_type'] ?? 'Conta corrente',
            'account' => $this->formatCounterpartyAccount($counterparty),
        ];
    }

    /**
     * @param  array<string, mixed>  $counterparty
     * @param  array<string, mixed>  $meta
     * @return array<string, string|null>
     */
    private function buildDestination(
        Transaction $transaction,
        Account $account,
        array $counterparty,
        array $meta
    ): array {
        $pixKey = $meta['pix_key'] ?? null;
        $beneficiaryName = $meta['beneficiary_name'] ?? null;

        if ($transaction->direction === 'debit') {
            if ($beneficiaryName) {
                return [
                    'name' => $beneficiaryName,
                    'cpf' => $this->maskCpf($meta['beneficiary_cpf'] ?? null),
                    'institution' => $meta['beneficiary_institution'] ?? 'Instituicao externa',
                    'account_type' => $meta['beneficiary_account_type'] ?? 'Boleto',
                    'account' => null,
                    'pix_key' => null,
                ];
            }

            return [
                'name' => $counterparty['name'] ?? '---',
                'cpf' => $this->maskCpf($counterparty['cpf'] ?? null),
                'institution' => $counterparty['institution'] ?? 'Instituicao externa',
                'account_type' => $counterparty['account_type'] ?? 'Conta corrente',
                'account' => $this->formatCounterpartyAccount($counterparty),
                'pix_key' => $pixKey,
            ];
        }

        return [
            'name' => $account->user?->name,
            'cpf' => $this->maskCpf($account->user?->cpf),
            'institution' => config('app.name'),
            'account_type' => 'Conta corrente',
            'account' => $this->formatAccount($account),
            'pix_key' => $pixKey,
        ];
    }

    private function formatAccount(Account $account): string
    {
        return "{$account->branch_number}/{$account->account_number}-{$account->account_digit}";
    }

    /**
     * @param  array<string, mixed>  $counterparty
     */
    private function formatCounterpartyAccount(array $counterparty): ?string
    {
        if (empty($counterparty['branch_number']) || empty($counterparty['account_number'])) {
            return null;
        }

        $digit = $counterparty['account_digit'] ?? '--';

        return "{$counterparty['branch_number']}/{$counterparty['account_number']}-{$digit}";
    }

    private function maskCpf(?string $cpf): string
    {
        if (! $cpf) {
            return '---';
        }

        $digits = preg_replace('/\D/', '', $cpf);
        if (! $digits || strlen($digits) !== 11) {
            return '***.***.***-**';
        }

        return sprintf(
            '***.%s.%s-**',
            substr($digits, 3, 3),
            substr($digits, 6, 3)
        );
    }
}
