<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'show'])
        ->name('dashboard');

    Route::get('pix', function () {
        return Inertia::render('pix/index');
    })->name('pix.index');

    Route::get('pix/keys', function () {
        return Inertia::render('pix/keys');
    })->name('pix.keys');

    Route::get('transferencias', function () {
        return Inertia::render('transfers');
    })->name('transfers.index');

    Route::get('boletos', function () {
        return Inertia::render('boletos');
    })->name('boletos.index');

    Route::get('transacoes', [TransactionController::class, 'index'])
        ->name('transactions.index');

    Route::get('transacoes/{transaction}', [TransactionController::class, 'show'])
        ->name('transactions.show');
});

require __DIR__.'/settings.php';
