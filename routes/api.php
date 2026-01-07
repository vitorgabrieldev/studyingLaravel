<?php

use App\Http\Controllers\Api\BoletoController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\PixController;
use App\Http\Controllers\Api\PixKeyController;
use App\Http\Controllers\Api\TransferController;
use App\Http\Controllers\Customers\IndexController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'show']);

    Route::get('pix/keys', [PixKeyController::class, 'index']);
    Route::post('pix/keys', [PixKeyController::class, 'store'])
        ->middleware('throttle:pix-keys');
    Route::delete('pix/keys/{pixKey}', [PixKeyController::class, 'destroy'])
        ->middleware('throttle:pix-keys');

    Route::middleware('throttle:banking-actions')->group(function () {
        Route::post('pix/send', [PixController::class, 'send']);
        Route::post('transfers', [TransferController::class, 'store']);
        Route::post('boletos/pay', [BoletoController::class, 'pay']);
    });
});

Route::post('service-layers', [IndexController::class, 'store']);
