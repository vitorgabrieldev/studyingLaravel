<?php

namespace Tests\Unit\Banking;

use App\Models\Account;
use App\Services\Banking\CardService;
use App\Services\Banking\NotificationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CardServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_create_virtual_card_caps_limit(): void
    {
        $account = Account::factory()->create();
        $service = new CardService(new NotificationService());

        $card = $service->createVirtualCard($account, 'Streaming', 999999);

        $this->assertSame('virtual', $card->type);
        $this->assertSame(150000, $card->limit_cents);
        $this->assertDatabaseHas('cards', [
            'id' => $card->id,
            'nickname' => 'Streaming',
        ]);
    }

    public function test_ensure_physical_card_returns_existing(): void
    {
        $account = Account::factory()->create();
        $service = new CardService(new NotificationService());

        $first = $service->ensurePhysicalCard($account);
        $second = $service->ensurePhysicalCard($account);

        $this->assertSame($first->id, $second->id);
        $this->assertSame('physical', $second->type);
    }
}
