<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Card extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'account_id',
        'type',
        'status',
        'nickname',
        'brand',
        'last4',
        'pan',
        'cvv',
        'exp_month',
        'exp_year',
        'limit_cents',
        'international_enabled',
        'online_enabled',
        'contactless_enabled',
        'replaced_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'pan' => 'encrypted',
            'cvv' => 'encrypted',
            'limit_cents' => 'integer',
            'international_enabled' => 'boolean',
            'online_enabled' => 'boolean',
            'contactless_enabled' => 'boolean',
            'replaced_at' => 'datetime',
        ];
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    public function isPhysical(): bool
    {
        return $this->type === 'physical';
    }

    public function isVirtual(): bool
    {
        return $this->type === 'virtual';
    }
}
