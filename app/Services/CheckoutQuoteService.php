<?php

namespace App\Services;

use App\Exceptions\MinimumTotalException;

class CheckoutQuoteService
{
    public function execute(array $items, ?string $coupon): array
    {
        $subtotal = $this->calculateSubtotal($items);

        $this->ensureMinimumTotal($subtotal);

        $discountRate = $this->resolveDiscountRate($coupon);
        $discount = $this->capDiscount($subtotal * $discountRate);

        return $this->buildResult($subtotal, $discount);
    }

    private function calculateSubtotal(array $items): float
    {
        $subtotal = 0.0;

        foreach ($items as $item) {
            $subtotal += $item['price'] * $item['quantity'];
        }

        return $subtotal;
    }

    private function ensureMinimumTotal(float $subtotal): void
    {
        if ($subtotal < 50) {
            throw new MinimumTotalException('Total abaixo de R$50.');
        }
    }

    private function resolveDiscountRate(?string $coupon): float
    {
        return match ($coupon) {
            'PROMO10' => 0.10,
            'PROMO20' => 0.20,
            default => 0.0,
        };
    }

    private function capDiscount(float $discount): float
    {
        return min($discount, 100);
    }

    private function buildResult(float $subtotal, float $discount): array
    {
        return [
            'subtotal' => $subtotal,
            'desconto' => $discount,
            'total_final' => $subtotal - $discount,
        ];
    }
}
