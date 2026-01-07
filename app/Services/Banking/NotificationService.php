<?php

namespace App\Services\Banking;

use App\Models\Notification;
use App\Models\User;

class NotificationService
{
    /**
     * @param  array<string, mixed>  $meta
     */
    public function notify(
        User $user,
        string $title,
        ?string $body = null,
        string $type = 'info',
        array $meta = []
    ): Notification {
        return Notification::create([
            'user_id' => $user->id,
            'title' => $title,
            'body' => $body,
            'type' => $type,
            'meta' => $meta,
        ]);
    }
}
