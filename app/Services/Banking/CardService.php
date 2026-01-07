<?php

namespace App\Services\Banking;

use App\Models\Account;
use App\Models\Card;
use Illuminate\Support\Arr;

class CardService
{
    private const DEFAULT_LIMIT_CENTS = 300000;
    private const MAX_VIRTUAL_LIMIT_CENTS = 150000;

    public function ensurePhysicalCard(Account $account): Card
    {
        $physical = $account->cards()->where('type', 'physical')->latest()->first();

        if ($physical) {
            return $physical;
        }

        return $this->createPhysicalCard($account);
    }

    public function __construct(private readonly NotificationService $notificationService)
    {
    }

    public function createPhysicalCard(Account $account): Card
    {
        $card = $this->createCard($account, 'physical', [
            'nickname' => 'Cartao principal',
            'limit_cents' => self::DEFAULT_LIMIT_CENTS,
        ]);

        $this->notificationService->notify(
            $account->user,
            'Cartão físico ativo',
            'Seu cartão físico foi emitido e está disponível.',
            'info',
            ['card_id' => $card->id],
        );

        return $card;
    }

    public function createVirtualCard(Account $account, ?string $nickname, ?int $limitCents): Card
    {
        $limit = $limitCents ?? self::MAX_VIRTUAL_LIMIT_CENTS;
        $limit = max(1000, min($limit, self::MAX_VIRTUAL_LIMIT_CENTS));

        $card = $this->createCard($account, 'virtual', [
            'nickname' => $nickname ?: 'Cartao virtual',
            'limit_cents' => $limit,
        ]);

        $this->notificationService->notify(
            $account->user,
            'Cartão virtual criado',
            'Um novo cartão virtual foi criado.',
            'info',
            ['card_id' => $card->id],
        );

        return $card;
    }

    public function replacePhysicalCard(Account $account, Card $currentCard): Card
    {
        $currentCard->update([
            'status' => 'blocked',
            'replaced_at' => now(),
        ]);

        $card = $this->createPhysicalCard($account);

        $this->notificationService->notify(
            $account->user,
            'Novo cartão solicitado',
            'Seu novo cartão físico foi solicitado.',
            'info',
            ['card_id' => $card->id],
        );

        return $card;
    }

    /**
     * @return array<string, int>
     */
    public function invoiceSnapshot(Account $account): array
    {
        $physicalCard = $this->ensurePhysicalCard($account);

        $limit = $physicalCard->limit_cents ?? self::DEFAULT_LIMIT_CENTS;

        return [
            'current_invoice_cents' => 0,
            'available_limit_cents' => $limit,
            'limit_cents' => $limit,
        ];
    }

    /**
     * @param  array<string, mixed>  $overrides
     */
    private function createCard(Account $account, string $type, array $overrides = []): Card
    {
        $pan = $this->generatePan();
        $cvv = (string) random_int(100, 999);
        $expMonth = (int) now()->addYears(4)->format('m');
        $expYear = (int) now()->addYears(4)->format('Y');
        $last4 = substr($pan, -4);

        $defaults = [
            'account_id' => $account->id,
            'type' => $type,
            'status' => 'active',
            'nickname' => $type === 'virtual' ? 'Cartao virtual' : 'Cartao principal',
            'brand' => 'Visa',
            'last4' => $last4,
            'pan' => $pan,
            'cvv' => $cvv,
            'exp_month' => $expMonth,
            'exp_year' => $expYear,
            'limit_cents' => self::DEFAULT_LIMIT_CENTS,
            'international_enabled' => false,
            'online_enabled' => true,
            'contactless_enabled' => true,
        ];

        return Card::create(array_merge($defaults, $overrides));
    }

    private function generatePan(): string
    {
        $bin = '4539';
        $accountIdentifier = str_pad((string) random_int(0, 99999999999), 11, '0', STR_PAD_LEFT);
        $partial = $bin . $accountIdentifier;

        $checkDigit = $this->luhnCheckDigit($partial);

        return $partial . $checkDigit;
    }

    private function luhnCheckDigit(string $number): int
    {
        $sum = 0;
        $alternate = true;

        for ($i = strlen($number) - 1; $i >= 0; $i--) {
            $n = (int) $number[$i];
            if ($alternate) {
                $n *= 2;
                if ($n > 9) {
                    $n -= 9;
                }
            }
            $sum += $n;
            $alternate = ! $alternate;
        }

        return (10 - ($sum % 10)) % 10;
    }
}
