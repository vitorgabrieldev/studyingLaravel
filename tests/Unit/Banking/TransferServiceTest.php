<?php

namespace Tests\Unit\Banking;

use App\Exceptions\InsufficientFundsException;
use App\Exceptions\SelfTransferException;
use App\Models\Account;
use App\Services\Banking\NotificationService;
use App\Services\Banking\ReceiptService;
use App\Services\Banking\TransferService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
use Tests\TestCase;

class TransferServiceTest extends TestCase
{
    use RefreshDatabase;
    use MockeryPHPUnitIntegration;

    public function test_transfer_moves_funds_and_creates_records(): void
    {
        $from = Account::factory()->withBalance(200000)->create();
        $to = Account::factory()->withBalance(100000)->create();

        $receiptService = Mockery::mock(ReceiptService::class);
        $receiptService->shouldReceive('generate')->twice();

        $service = new TransferService($receiptService, new NotificationService());

        $transfer = $service->transfer($from, $to, 50000, 'transfer', 'Teste');

        $this->assertDatabaseHas('transfers', [
            'id' => $transfer->id,
            'from_account_id' => $from->id,
            'to_account_id' => $to->id,
            'amount_cents' => 50000,
        ]);
        $this->assertDatabaseCount('transactions', 2);
        $this->assertDatabaseCount('notifications', 2);

        $from->refresh();
        $to->refresh();

        $this->assertSame(150000, $from->balance_cents);
        $this->assertSame(150000, $to->balance_cents);
    }

    public function test_transfer_rejects_insufficient_funds(): void
    {
        $from = Account::factory()->withBalance(1000)->create();
        $to = Account::factory()->withBalance(1000)->create();

        $receiptService = Mockery::mock(ReceiptService::class);
        $receiptService->shouldReceive('generate')->never();

        $service = new TransferService($receiptService, new NotificationService());

        try {
            $service->transfer($from, $to, 5000, 'transfer');
            $this->fail('Expected InsufficientFundsException.');
        } catch (InsufficientFundsException) {
            $from->refresh();
            $to->refresh();
        }

        $this->assertSame(1000, $from->balance_cents);
        $this->assertSame(1000, $to->balance_cents);
        $this->assertDatabaseCount('transfers', 0);
    }

    public function test_transfer_rejects_self_transfer(): void
    {
        $account = Account::factory()->withBalance(50000)->create();

        $receiptService = Mockery::mock(ReceiptService::class);
        $receiptService->shouldReceive('generate')->never();

        $service = new TransferService($receiptService, new NotificationService());

        $this->expectException(SelfTransferException::class);

        $service->transfer($account, $account, 1000, 'transfer');
    }
}
