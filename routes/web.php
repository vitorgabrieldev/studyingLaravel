<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CardPageController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('sobre', function () {
    return Inertia::render('about');
})->name('about');

Route::get('contato', function () {
    return Inertia::render('contact');
})->name('contact');

Route::get('faq', function () {
    return Inertia::render('faq');
})->name('faq');

Route::get('politicas', function () {
    return Inertia::render('policies');
})->name('policies');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'show'])
        ->name('dashboard');

    Route::get('pix', function () {
        return Inertia::render('pix/index');
    })->name('pix.index');

    Route::get('pix/keys', function () {
        return Inertia::render('pix/keys');
    })->name('pix.keys');

    Route::get('cartoes', [CardPageController::class, 'index'])
        ->name('cards.index');

    Route::get('painel', [AnalyticsController::class, 'index'])
        ->name('analytics.index');

    Route::get('notificacoes', function () {
        return Inertia::render('notifications');
    })->name('notifications.index');

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

    Route::get('transacoes/{transaction}/comprovante', [TransactionController::class, 'download'])
        ->name('transactions.receipt');
});

require __DIR__.'/settings.php';
