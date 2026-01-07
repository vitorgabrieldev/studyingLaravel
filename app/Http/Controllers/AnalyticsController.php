<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Services\Banking\AccountService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function index(Request $request, AccountService $accountService): Response
    {
        $account = $request->user()->account ?? $accountService->createForUser($request->user());

        $start = now()->subMonths(5)->startOfMonth();
        $months = collect(range(0, 5))
            ->map(fn ($i) => $start->copy()->addMonths($i));

        $totals = Transaction::query()
            ->select([
                DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
                DB::raw('SUM(CASE WHEN direction = "credit" THEN amount_cents ELSE 0 END) as credits'),
                DB::raw('SUM(CASE WHEN direction = "debit" THEN amount_cents ELSE 0 END) as debits'),
            ])
            ->where('account_id', $account->id)
            ->where('created_at', '>=', $start)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->keyBy('month');

        $series = $months->map(function (Carbon $month) use ($totals) {
            $key = $month->format('Y-m');
            $row = $totals->get($key);

            return [
                'label' => $month->format('M'),
                'credits' => (int) ($row->credits ?? 0),
                'debits' => (int) ($row->debits ?? 0),
            ];
        });

        $insight = Transaction::query()
            ->where('account_id', $account->id)
            ->latest()
            ->first();

        return Inertia::render('analytics', [
            'series' => $series,
            'lastTransaction' => $insight ? [
                'description' => $insight->description,
                'amount_cents' => $insight->amount_cents,
                'direction' => $insight->direction,
            ] : null,
        ]);
    }
}
