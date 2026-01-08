<?php

namespace Tests\Unit\Banking;

use App\Exceptions\InsufficientFundsException;
use App\Models\Account;
use App\Services\Banking\BoletoService;
use App\Services\Banking\NotificationService;
use App\Services\Banking\ReceiptService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
use Tests\TestCase;

class BoletoServiceTest extends TestCase
{
    use RefreshDatabase;
    use MockeryPHPUnitIntegration;

    public function test_pay_boleto_creates_payment_and_transaction(): void
    {
        $account = Account::factory()->withBalance(90000)->create();

        $receiptService = Mockery::mock(ReceiptService::class);
        $receiptService->shouldReceive('generate')->once();

        $service = new BoletoService($receiptService, new NotificationService());

        $payment = $service->pay(
            $account,
            '34191790010104351004791020150008291070000010000',
            'Energy Co.',
            15000
        );

        $this->assertDatabaseHas('boleto_payments', [
            'id' => $payment->id,
            'amount_cents' => 15000,
        ]);
        $this->assertDatabaseHas('transactions', [
            'type' => 'boleto',
            'direction' => 'debit',
            'amount_cents' => 15000,
        ]);
        $this->assertDatabaseCount('notifications', 1);

        $account->refresh();
        $this->assertSame(75000, $account->balance_cents);
    }

    public function test_pay_boleto_rejects_insufficient_funds(): void
    {
        $account = Account::factory()->withBalance(1000)->create();

        $receiptService = Mockery::mock(ReceiptService::class);
        $receiptService->shouldReceive('generate')->never();

        $service = new BoletoService($receiptService, new NotificationService());

        $this->expectException(InsufficientFundsException::class);

        $service->pay($account, '123', 'Empresa', 5000);
    }
}
