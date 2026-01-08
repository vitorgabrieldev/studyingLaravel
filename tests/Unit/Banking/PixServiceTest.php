<?php

namespace Tests\Unit\Banking;

use App\Models\Account;
use App\Models\PixKey;
use App\Services\Banking\NotificationService;
use App\Services\Banking\PixService;
use App\Services\Banking\ReceiptService;
use App\Services\Banking\TransferService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
use Tests\TestCase;

class PixServiceTest extends TestCase
{
    use RefreshDatabase;
    use MockeryPHPUnitIntegration;

    public function test_send_pix_creates_transfer_and_updates_balance(): void
    {
        $senderAccount = Account::factory()->withBalance(100000)->create();
        $recipientAccount = Account::factory()->withBalance(2000)->create();

        $pixKey = PixKey::create([
            'user_id' => $recipientAccount->user_id,
            'account_id' => $recipientAccount->id,
            'type' => 'email',
            'key' => 'destino@fintech.test',
        ]);

        $receiptService = Mockery::mock(ReceiptService::class);
        $receiptService->shouldReceive('generate')->twice();

        $transferService = new TransferService($receiptService, new NotificationService());
        $pixService = new PixService($transferService);

        $result = $pixService->send(
            $senderAccount->user,
            $pixKey->key,
            25000,
            'Pix teste'
        );

        $this->assertArrayHasKey('transfer_id', $result);
        $this->assertDatabaseHas('transfers', [
            'id' => $result['transfer_id'],
            'pix_key_id' => $pixKey->id,
        ]);

        $senderAccount->refresh();
        $recipientAccount->refresh();

        $this->assertSame(75000, $senderAccount->balance_cents);
        $this->assertSame(27000, $recipientAccount->balance_cents);
    }

    public function test_send_pix_fails_for_unknown_key(): void
    {
        $senderAccount = Account::factory()->withBalance(10000)->create();

        $receiptService = Mockery::mock(ReceiptService::class);
        $receiptService->shouldReceive('generate')->never();

        $transferService = new TransferService($receiptService, new NotificationService());
        $pixService = new PixService($transferService);

        $this->expectException(ModelNotFoundException::class);

        $pixService->send($senderAccount->user, 'nao-existe', 1000);
    }
}
